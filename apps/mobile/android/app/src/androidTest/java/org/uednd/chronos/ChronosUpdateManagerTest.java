package org.uednd.chronos;

import static org.junit.Assert.*;
import android.app.DownloadManager;
import android.app.job.JobScheduler;
import android.content.Context;
import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;
import android.database.Cursor;
import android.os.Bundle;
import androidx.test.platform.app.InstrumentationRegistry;
import org.json.*;
import org.junit.*;
import org.junit.runners.MethodSorters;
import java.io.*;
import java.lang.reflect.Field;
import java.security.MessageDigest;
import java.util.UUID;
import java.util.zip.ZipFile;

/** Exercises Android services; the fixture test stages bytes without a production test bypass. */
@FixMethodOrder(MethodSorters.NAME_ASCENDING)
public class ChronosUpdateManagerTest {
    private static String repeat(String value, int count) { StringBuilder result = new StringBuilder(); for (int i = 0; i < count; i++) result.append(value); return result.toString(); }
    private Context context;
    private ChronosUpdateManager manager;
    @Before public void setup() throws Exception {
        context = InstrumentationRegistry.getInstrumentation().getTargetContext();
        manager = ChronosUpdateManager.get(context);
    }
    private JSONObject descriptor() throws Exception {
        JSONObject host;
        try (InputStream input = context.getAssets().open("public/version.json")) {
            host = new JSONObject(ChronosUpdateManager.readText(input)).getJSONObject("host");
        }
        String[] currentVersion = host.getString("version").split("\\.");
        String version = currentVersion[0] + "." + currentVersion[1] + "." + (Integer.parseInt(currentVersion[2]) + 1);
        host.put("version", version).put("buildId", repeat("b", 64));
        PackageInfo info = context.getPackageManager().getPackageInfo(context.getPackageName(), android.os.Build.VERSION.SDK_INT >= 28 ? PackageManager.GET_SIGNING_CERTIFICATES : PackageManager.GET_SIGNATURES);
        return new JSONObject().put("host", host).put("packageId", context.getPackageName())
            .put("versionCode", AndroidUpdateRules.versionCode(version)).put("signingCertificateSha256", ChronosUpdateManager.certificate(info))
            .put("sha256", repeat("a", 64)).put("sizeBytes", 100)
            .put("apkUrl", "https://github.com/UE-DND/Chronos/releases/download/v" + version + "/Chronos-" + host.getString("profileId").substring(8) + "-" + version + ".apk");
    }
    private void persist(JSONObject record) throws Exception {
        try (OutputStream output = new FileOutputStream(new File(context.getNoBackupFilesDir(), "chronos-update.json"))) {
            output.write(record.toString().getBytes(java.nio.charset.StandardCharsets.UTF_8));
        }
        Field instance = ChronosUpdateManager.class.getDeclaredField("instance"); instance.setAccessible(true); instance.set(null, null);
        manager = ChronosUpdateManager.get(context);
    }
    private JSONObject record(JSONObject update, String phase, String taskId) throws Exception {
        return new JSONObject().put("formatVersion", 1).put("update", update).put("phase", phase)
            .put("preparationToken", "prepared-fixture").put("taskId", taskId).put("downloadId", -1).put("sessionId", -1).put("committed", false).put("events", new JSONArray()).put("privateReady", true);
    }
    @Test public void a_rejectsInvalidIdentityBeforeCreatingDownload() throws Exception {
        persist(new JSONObject().put("formatVersion", 1).put("phase", "idle").put("events", new JSONArray()));
        JSONObject update = descriptor().put("signingCertificateSha256", repeat("f", 64));
        try { manager.start(update, "prepared-fixture"); fail("Expected signature rejection"); }
        catch (AndroidUpdateRules.Rejected rejected) { assertEquals("signature_mismatch", rejected.code); }
        assertEquals("idle", manager.snapshot().getString("phase"));
    }
    @Test public void a_rejectsMissingPreparationBeforeCreatingDownload() throws Exception {
        persist(new JSONObject().put("formatVersion", 1).put("phase", "idle").put("events", new JSONArray()));
        try { manager.start(descriptor(), null); fail("Expected preparation rejection"); }
        catch (AndroidUpdateRules.Rejected rejected) { assertEquals("invalid_descriptor", rejected.code); }
        assertEquals("idle", manager.snapshot().getString("phase"));
    }
    @Test public void a_failedRetryRequiresPluginPreparation() throws Exception {
        persist(record(descriptor(), "failed", UUID.randomUUID().toString()));
        try { manager.continueUpdate(); fail("Expected preparation requirement"); }
        catch (AndroidUpdateRules.Rejected rejected) { assertEquals("plugin_prepare_failed", rejected.code); }
        assertEquals("failed", manager.snapshot().getString("phase"));
    }
    @Test public void b_recoversSystemDownloadAndIgnoresForgedOrDuplicateBroadcasts() throws Exception {
        JSONObject update = descriptor(); String taskId = UUID.randomUUID().toString();
        DownloadManager downloads = context.getSystemService(DownloadManager.class);
        long id = downloads.enqueue(new DownloadManager.Request(android.net.Uri.parse(update.getString("apkUrl")))
            .setAllowedNetworkTypes(0).setDestinationInExternalFilesDir(context, "updates", taskId + ".apk"));
        try {
            persist(record(update, "downloading", taskId).put("downloadId", id));
            JSONObject restored = manager.snapshot();
            assertEquals(taskId, restored.getString("taskId"));
            assertEquals(update.getJSONObject("host").getString("version"), restored.getString("targetVersion"));
            assertEquals("prepared-fixture", restored.getString("preparationToken"));
            assertEquals(update.toString(), restored.getJSONObject("update").toString());
            manager.downloadCompleted(id + 1000000);
            manager.installationResult("forged-task", 123, android.content.pm.PackageInstaller.STATUS_SUCCESS, null);
            manager.downloadCompleted(id); manager.downloadCompleted(id);
            assertEquals(taskId, manager.snapshot().getString("taskId"));
            assertTrue(manager.snapshot().getBoolean("canCancel"));
            assertEquals("canceled", manager.cancel().getString("phase"));
            assertEquals(1, manager.takeEvents().length());
            assertEquals(0, manager.takeEvents().length());
            try (Cursor cursor = downloads.query(new DownloadManager.Query().setFilterById(id))) {
                assertFalse(cursor.moveToFirst());
            }
        } finally { downloads.remove(id); }
    }
    @Test public void c_corruptCachedApkNeverCreatesAnInstallSession() throws Exception {
        String taskId = UUID.randomUUID().toString();
        File apk = new File(context.getNoBackupFilesDir(), "update-" + taskId + ".apk");
        try {
            try (OutputStream output = new FileOutputStream(apk)) { output.write(new byte[] {1,2,3}); }
            persist(record(descriptor(), "verifying", taskId));
            manager.process(taskId);
            assertEquals("failed", manager.snapshot().getString("phase"));
            assertEquals("integrity_mismatch", manager.snapshot().getString("errorCode"));
            assertFalse(manager.snapshot().getBoolean("canCancel"));
        } finally { apk.delete(); }
    }
    @Test public void d_recoversUncommittedSessionAfterProcessRestart() throws Exception {
        String taskId = UUID.randomUUID().toString();
        android.content.pm.PackageInstaller installer = context.getPackageManager().getPackageInstaller();
        android.content.pm.PackageInstaller.SessionParams params = new android.content.pm.PackageInstaller.SessionParams(android.content.pm.PackageInstaller.SessionParams.MODE_FULL_INSTALL);
        params.setAppPackageName(context.getPackageName());
        int id = installer.createSession(params);
        File apk = new File(context.getNoBackupFilesDir(), "update-" + taskId + ".apk");
        try {
            try (OutputStream output = new FileOutputStream(apk)) { output.write(1); }
            persist(record(descriptor(), "installing", taskId).put("sessionId", id).put("committed", true));
            manager.snapshot();
            long deadline = android.os.SystemClock.elapsedRealtime() + 5000;
            while (!manager.snapshot().getString("phase").equals("failed") && android.os.SystemClock.elapsedRealtime() < deadline) android.os.SystemClock.sleep(50);
            assertEquals("failed", manager.snapshot().getString("phase"));
            assertEquals("integrity_mismatch", manager.snapshot().getString("errorCode"));
            assertNull(installer.getSessionInfo(id));
        } finally { apk.delete(); try { installer.abandonSession(id); } catch (RuntimeException ignored) {} }
    }
    @Test public void e_webViewStorageSurvivesReplacement() throws Exception {
        String mode = InstrumentationRegistry.getArguments().getString("dataFixture");
        Assume.assumeTrue("Supply dataFixture=write or read around a fixture upgrade", mode != null);
        android.app.Instrumentation instrumentation = InstrumentationRegistry.getInstrumentation();
        android.content.Intent intent = new android.content.Intent(context, MainActivity.class).addFlags(android.content.Intent.FLAG_ACTIVITY_NEW_TASK);
        MainActivity activity = (MainActivity) instrumentation.startActivitySync(intent);
        android.webkit.WebView web = activity.getBridge().getWebView();
        try {
            long deadline = android.os.SystemClock.elapsedRealtime() + 15000;
            String ready = "";
            while (android.os.SystemClock.elapsedRealtime() < deadline) {
                ready = evaluate(instrumentation, web, "location.origin + ':' + document.readyState");
                if (ready.contains("https://localhost:complete")) break;
                android.os.SystemClock.sleep(100);
            }
            assertTrue("WebView did not load its app origin: " + ready, ready.contains("https://localhost:complete"));
            String script = "window.__updateFixtureResult = ''; const r = indexedDB.open('chronos-update-fixture', 1); " +
                "r.onupgradeneeded = () => r.result.createObjectStore('records'); r.onerror = () => window.__updateFixtureResult='error'; " +
                "r.onsuccess = () => { const db = r.result; const t = db.transaction('records', '" + (mode.equals("write") ? "readwrite" : "readonly") + "'); const s = t.objectStore('records'); " +
                (mode.equals("write") ? "s.put('preserved', 'marker'); localStorage.setItem('chronos-update-fixture', 'preserved'); t.oncomplete = () => { window.__updateFixtureResult='ok'; db.close(); };" :
                "const q=s.get('marker'); q.onsuccess=() => { window.__updateFixtureResult=q.result==='preserved' && localStorage.getItem('chronos-update-fixture')==='preserved'?'ok':'idb='+q.result+';local='+localStorage.getItem('chronos-update-fixture'); db.close(); };") + " };";
            evaluate(instrumentation, web, script);
            String result = "";
            while (android.os.SystemClock.elapsedRealtime() < deadline) {
                result = evaluate(instrumentation, web, "window.__updateFixtureResult");
                if (result.equals("\"ok\"")) break;
                android.os.SystemClock.sleep(100);
            }
            assertEquals("\"ok\"", result);
            // Chromium commits localStorage asynchronously; do not kill the test process before its disk write.
            if (mode.equals("write")) android.os.SystemClock.sleep(6000);
        } finally { instrumentation.runOnMainSync(activity::finish); }
    }
    private static String evaluate(android.app.Instrumentation instrumentation, android.webkit.WebView web, String script) throws Exception {
        java.util.concurrent.CountDownLatch latch = new java.util.concurrent.CountDownLatch(1);
        java.util.concurrent.atomic.AtomicReference<String> result = new java.util.concurrent.atomic.AtomicReference<>();
        instrumentation.runOnMainSync(() -> web.evaluateJavascript(script, value -> { result.set(value); latch.countDown(); }));
        assertTrue(latch.await(5, java.util.concurrent.TimeUnit.SECONDS)); return result.get();
    }
    @Test public void z_stageSignedUpgradeFixture() throws Exception {
        Bundle args = InstrumentationRegistry.getArguments();
        String fixturePath = args.getString("fixtureApk");
        Assume.assumeTrue("Supply a same-signed higher-version APK to exercise actual installation", fixturePath != null);
        File source = new File(fixturePath); String taskId = UUID.randomUUID().toString();
        JSONObject update = descriptor();
        try (ZipFile zip = new ZipFile(source); InputStream input = zip.getInputStream(zip.getEntry("assets/public/version.json"))) {
            JSONObject host = new JSONObject(ChronosUpdateManager.readText(input)).getJSONObject("host");
            update.put("host", host);
        }
        MessageDigest digest = MessageDigest.getInstance("SHA-256");
        File apk = new File(context.getNoBackupFilesDir(), "update-" + taskId + ".apk");
        try (InputStream input = new FileInputStream(source); OutputStream output = new FileOutputStream(apk)) {
            byte[] buffer = new byte[65536]; int count;
            while ((count = input.read(buffer)) != -1) { output.write(buffer, 0, count); digest.update(buffer, 0, count); }
        }
        update.put("sizeBytes", apk.length()).put("sha256", ChronosUpdateManager.hex(digest.digest()));
        // The marker proves replacement preserves app-owned data.
        context.getSharedPreferences("update-fixture", Context.MODE_PRIVATE).edit().putString("retained", taskId).commit();
        persist(record(update, "verifying", taskId));
        manager.process(taskId);
        String phase = manager.snapshot().getString("phase");
        assertTrue("Expected committed installation, got " + phase, phase.equals("installing") || phase.equals("awaiting-confirmation") || phase.equals("succeeded"));
    }
}
