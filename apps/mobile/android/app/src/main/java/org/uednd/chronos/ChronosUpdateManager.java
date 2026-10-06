package org.uednd.chronos;

import android.app.DownloadManager;
import android.app.PendingIntent;
import android.app.job.JobInfo;
import android.app.job.JobScheduler;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageInfo;
import android.content.pm.PackageInstaller;
import android.content.pm.PackageManager;
import android.content.pm.Signature;
import android.database.Cursor;
import android.net.Uri;
import android.os.Build;
import android.os.PersistableBundle;
import android.os.ParcelFileDescriptor;
import android.util.AtomicFile;
import org.json.JSONArray;
import org.json.JSONObject;
import java.io.*;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicBoolean;
import java.util.zip.ZipEntry;
import java.util.zip.ZipFile;

/** Owns the one authorized update, independently of the WebView and activity. */
final class ChronosUpdateManager {
    private static final int JOB_ID = 0x434852;
    private static final String HOST_PATH = "assets/public/version.json";
    private static ChronosUpdateManager instance;
    private final Context context;
    private final AtomicFile store;
    private final DownloadManager downloads;
    private final JobScheduler jobs;
    private final PackageInstaller installer;
    private final AtomicBoolean processing = new AtomicBoolean(false);
    private JSONObject record;
    private Intent confirmation;

    static synchronized ChronosUpdateManager get(Context context) {
        if (instance == null) instance = new ChronosUpdateManager(context.getApplicationContext());
        return instance;
    }
    private ChronosUpdateManager(Context context) {
        this.context = context;
        downloads = context.getSystemService(DownloadManager.class);
        jobs = context.getSystemService(JobScheduler.class);
        installer = context.getPackageManager().getPackageInstaller();
        store = new AtomicFile(new File(context.getNoBackupFilesDir(), "chronos-update.json"));
        try (InputStream input = store.openRead()) {
            record = new JSONObject(readText(input));
            AndroidUpdateRules.require(record.getInt("formatVersion") == 1, "invalid_descriptor");
        } catch (FileNotFoundException error) { record = emptyRecord(); }
        catch (Exception error) {
            record = emptyRecord();
            put("phase", "failed"); put("errorCode", "task_missing");
        }
    }
    private JSONObject emptyRecord() {
        JSONObject result = new JSONObject();
        try { result.put("formatVersion", 1).put("phase", "idle").put("events", new JSONArray()); }
        catch (Exception error) { throw new IllegalStateException(error); }
        return result;
    }
    private void put(String key, Object value) {
        try { record.put(key, value); } catch (Exception error) { throw new IllegalStateException(error); }
    }
    private void save() {
        FileOutputStream output = null;
        try {
            output = store.startWrite();
            output.write(record.toString().getBytes(StandardCharsets.UTF_8));
            store.finishWrite(output);
        } catch (IOException error) {
            if (output != null) store.failWrite(output);
            throw new IllegalStateException("Cannot persist update task", error);
        }
    }
    private String phase() { return record.optString("phase", "idle"); }
    private boolean active() { return !(phase().equals("idle") || phase().equals("failed") || phase().equals("canceled") || phase().equals("succeeded")); }
    private void event(String kind) {
        String marker = "event_" + kind;
        if (record.optBoolean(marker)) return;
        put(marker, true);
        JSONObject value = new JSONObject();
        try {
            value.put("kind", kind).put("taskId", record.optString("taskId")).put("phase", phase());
            record.getJSONArray("events").put(value);
        } catch (Exception error) { throw new IllegalStateException(error); }
    }
    private void transition(String phase, String error) {
        put("phase", phase); put("errorCode", error == null ? JSONObject.NULL : error);
        if (phase.equals("awaiting-confirmation")) event("confirmation");
        if (phase.equals("failed") || phase.equals("canceled") || phase.equals("succeeded")) event("result");
        save();
    }
    synchronized JSONArray takeEvents() {
        reconcile();
        JSONArray events = record.optJSONArray("events");
        if (events != null && events.length() > 0) { put("events", new JSONArray()); save(); }
        return events == null ? new JSONArray() : events;
    }
    synchronized JSONObject snapshot() {
        reconcile();
        JSONObject snapshot = new JSONObject();
        try {
            snapshot.put("phase", phase()).put("percent", (phase().equals("downloading") || phase().equals("waiting-network")) && record.has("percent") ? record.opt("percent") : JSONObject.NULL);
            snapshot.put("canCancel", active() && !record.optBoolean("committed"));
            if (record.has("taskId")) snapshot.put("taskId", record.getString("taskId"));
            JSONObject update = record.optJSONObject("update");
            if (update != null) snapshot.put("targetVersion", update.getJSONObject("host").getString("version")).put("sizeBytes", update.getLong("sizeBytes")).put("update", update);
            if (record.has("preparationToken")) snapshot.put("preparationToken", record.getString("preparationToken"));
            if (!record.isNull("errorCode")) snapshot.put("errorCode", record.optString("errorCode"));
        } catch (Exception error) { throw new IllegalStateException(error); }
        return snapshot;
    }
    static AndroidUpdateRules.Artifact artifact(JSONObject update) throws Exception {
        JSONObject host = update.getJSONObject("host");
        AndroidUpdateRules.require("mobile".equals(host.getString("target")), "invalid_descriptor");
        return new AndroidUpdateRules.Artifact(update.getString("packageId"), host.getString("version"),
            update.getLong("versionCode"), update.getString("signingCertificateSha256"), host.getString("profileId"),
            host.getString("buildId"), update.getString("sha256"), update.getLong("sizeBytes"), update.getString("apkUrl"));
    }
    private JSONObject installedHost() throws Exception {
        // Context assets may still refer to the old APK during a self-replacement callback.
        String path = context.getPackageManager().getApplicationInfo(context.getPackageName(), 0).sourceDir;
        try (ZipFile zip = new ZipFile(path)) {
            ZipEntry entry = zip.getEntry(HOST_PATH);
            AndroidUpdateRules.require(entry != null, "profile_mismatch");
            try (InputStream input = zip.getInputStream(entry)) { return new JSONObject(readText(input)).getJSONObject("host"); }
        }
    }
    @SuppressWarnings("deprecation")
    private PackageInfo installedInfo() throws Exception {
        return context.getPackageManager().getPackageInfo(context.getPackageName(),
            Build.VERSION.SDK_INT >= 28 ? PackageManager.GET_SIGNING_CERTIFICATES : PackageManager.GET_SIGNATURES);
    }
    @SuppressWarnings("deprecation")
    static long code(PackageInfo info) { return Build.VERSION.SDK_INT >= 28 ? info.getLongVersionCode() : info.versionCode; }
    @SuppressWarnings("deprecation")
    static String certificate(PackageInfo info) throws Exception {
        Signature[] signatures = Build.VERSION.SDK_INT >= 28
            ? (info.signingInfo == null ? null : info.signingInfo.getApkContentsSigners()) : info.signatures;
        AndroidUpdateRules.require(signatures != null && signatures.length == 1, "signature_mismatch");
        return hex(MessageDigest.getInstance("SHA-256").digest(signatures[0].toByteArray()));
    }
    private void validateInstalled(AndroidUpdateRules.Artifact artifact) throws Exception {
        PackageInfo installed = installedInfo();
        JSONObject host = installedHost();
        AndroidUpdateRules.require("mobile".equals(host.getString("target")) && installed.versionName.equals(host.getString("version")), "invalid_descriptor");
        AndroidUpdateRules.validate(artifact, context.getPackageName(), certificate(installed), host.getString("profileId"), code(installed));
    }
    synchronized JSONObject start(JSONObject update, String preparationToken) throws Exception {
        reconcile();
        if (active()) return snapshot(); // The already authorized target wins over a changing feed.
        AndroidUpdateRules.Artifact artifact = artifact(update);
        validateInstalled(artifact);
        AndroidUpdateRules.require(preparationToken != null && !preparationToken.isEmpty(), "invalid_descriptor");
        JSONArray events = record.optJSONArray("events");
        boolean reuse = record.optJSONObject("update") != null &&
            record.getJSONObject("update").optString("sha256").equals(artifact.sha256) && record.optBoolean("privateReady") && privateApk().isFile();
        File previous = privateApk();
        if (record.optBoolean("committed") && installer.getSessionInfo(record.optInt("sessionId", -1)) != null) {
            throw new AndroidUpdateRules.Rejected("install_blocked");
        }
        cleanup(reuse);
        record = emptyRecord();
        if (events != null) put("events", events);
        put("taskId", UUID.randomUUID().toString()); put("update", new JSONObject(update.toString()));
        put("preparationToken", preparationToken);
        put("downloadId", -1L); put("sessionId", -1); put("committed", false);
        if (reuse) {
            File destination = privateApk();
            if (!previous.renameTo(destination)) reuse = false;
            else put("privateReady", true);
        }
        put("phase", "awaiting-permission"); event("start"); save();
        if (hasInstallPermission()) prepare(reuse);
        return snapshot();
    }
    boolean hasInstallPermission() {
        return Build.VERSION.SDK_INT < 26 || context.getPackageManager().canRequestPackageInstalls();
    }
    synchronized void permissionReturned() {
        if (phase().equals("awaiting-permission") && hasInstallPermission()) {
            try { prepare(record.optBoolean("privateReady") && privateApk().isFile()); } catch (Exception error) { fail(error); }
        }
    }
    private void prepare(boolean cached) throws Exception {
        if (!hasInstallPermission()) { transition("awaiting-permission", "permission_denied"); return; }
        validateInstalled(artifact(record.getJSONObject("update")));
        if (cached) { transition("verifying", null); schedule(); }
        else {
            transition("downloading", null);
            enqueueDownload();
        }
    }
    private File externalApk() {
        File directory = context.getExternalFilesDir("updates");
        if (directory == null) throw new AndroidUpdateRules.Rejected("storage_full");
        return new File(directory, record.optString("taskId") + ".apk");
    }
    private File privateApk() { return new File(context.getNoBackupFilesDir(), "update-" + record.optString("taskId", "none") + ".apk"); }
    private void enqueueDownload() throws Exception {
        // Recover a crash between DownloadManager.enqueue() and persisting its ID.
        long recovered = -1;
        try (Cursor cursor = downloads.query(new DownloadManager.Query())) {
            if (cursor != null) while (cursor.moveToNext()) {
                String local = cursor.getString(cursor.getColumnIndexOrThrow(DownloadManager.COLUMN_LOCAL_URI));
                if (Uri.fromFile(externalApk()).toString().equals(local)) recovered = cursor.getLong(cursor.getColumnIndexOrThrow(DownloadManager.COLUMN_ID));
            }
        }
        if (recovered < 0) {
            JSONObject update = record.getJSONObject("update");
            DownloadManager.Request request = new DownloadManager.Request(Uri.parse(update.getString("apkUrl")))
                .setTitle("Chronos " + update.getJSONObject("host").getString("version"))
                .setMimeType("application/vnd.android.package-archive")
                .setAllowedOverRoaming(false).setNotificationVisibility(DownloadManager.Request.VISIBILITY_VISIBLE)
                .setDestinationInExternalFilesDir(context, "updates", record.getString("taskId") + ".apk");
            recovered = downloads.enqueue(request);
        }
        put("downloadId", recovered); save();
    }
    private void schedule() {
        if (processing.get() || jobs.getPendingJob(JOB_ID) != null) return;
        PersistableBundle extras = new PersistableBundle(); extras.putString("taskId", record.optString("taskId"));
        JobInfo job = new JobInfo.Builder(JOB_ID, new ComponentName(context, ChronosUpdateJob.class))
            .setPersisted(true).setMinimumLatency(0).setExtras(extras).build();
        if (jobs.schedule(job) != JobScheduler.RESULT_SUCCESS) transition("failed", "install_failed");
    }
    synchronized void downloadCompleted(long downloadId) {
        if (active() && downloadId == record.optLong("downloadId", -1)) reconcile();
    }
    synchronized void reconcile() {
        if (!active()) return;
        try {
            AndroidUpdateRules.require(!record.optString("preparationToken").isEmpty(), "invalid_descriptor");
            AndroidUpdateRules.Artifact target = artifact(record.getJSONObject("update"));
            PackageInfo installed = installedInfo();
            if (code(installed) >= target.versionCode) {
                JSONObject host = installedHost();
                if (code(installed) == target.versionCode && target.version.equals(installed.versionName) &&
                    target.certificate.equals(certificate(installed)) && target.buildId.equals(host.optString("buildId")) &&
                    target.profileId.equals(host.optString("profileId"))) {
                    transition("succeeded", null); cleanup(false);
                } else { transition("failed", "version_conflict"); cleanup(false); }
                return;
            }
            if (phase().equals("downloading") || phase().equals("waiting-network")) {
                long id = record.optLong("downloadId", -1);
                if (id < 0) { enqueueDownload(); id = record.getLong("downloadId"); }
                try (Cursor cursor = downloads.query(new DownloadManager.Query().setFilterById(id))) {
                    if (cursor == null || !cursor.moveToFirst()) { transition("failed", "task_missing"); return; }
                    int status = cursor.getInt(cursor.getColumnIndexOrThrow(DownloadManager.COLUMN_STATUS));
                    if (status == DownloadManager.STATUS_SUCCESSFUL) {
                        transition("verifying", null); schedule();
                    } else if (status == DownloadManager.STATUS_FAILED) {
                        int reason = cursor.getInt(cursor.getColumnIndexOrThrow(DownloadManager.COLUMN_REASON));
                        transition("failed", reason == DownloadManager.ERROR_INSUFFICIENT_SPACE ? "storage_full" : "download_failed");
                    } else {
                        long bytes = cursor.getLong(cursor.getColumnIndexOrThrow(DownloadManager.COLUMN_BYTES_DOWNLOADED_SO_FAR));
                        put("percent", Math.min(100, Math.max(0, bytes * 100.0 / target.size)));
                        String next = status == DownloadManager.STATUS_PAUSED ? "waiting-network" : "downloading";
                        if (!phase().equals(next)) transition(next, null);
                    }
                }
            } else if (phase().equals("verifying") && !processing.get()) {
                // An interrupted staging session contains no committed installation.
                int session = record.optInt("sessionId", -1);
                PackageInstaller.SessionInfo info = installer.getSessionInfo(session);
                if (info != null && info.isSealed()) {
                    put("committed", true); transition("installing", null);
                } else {
                    abandon(); schedule();
                }
            } else if (phase().equals("installing") && !processing.get()) {
                PackageInstaller.SessionInfo info = installer.getSessionInfo(record.optInt("sessionId", -1));
                if (info == null) transition("failed", "install_failed");
                else if (!info.isSealed()) { abandon(); transition("verifying", null); schedule(); }
            } else if (phase().equals("awaiting-permission") && hasInstallPermission()) {
                prepare(record.optBoolean("privateReady") && privateApk().isFile());
            } else if (phase().equals("awaiting-confirmation") && installer.getSessionInfo(record.optInt("sessionId", -1)) == null) {
                transition("failed", "user_canceled");
            }
        } catch (Exception error) { fail(error); }
    }
    synchronized JSONObject continueUpdate() throws Exception {
        reconcile();
        if (phase().equals("awaiting-permission")) { permissionReturned(); }
        else if (phase().equals("awaiting-confirmation") && confirmation == null) {
            abandon(); prepare(record.optBoolean("privateReady") && privateApk().isFile());
        } else if (phase().equals("failed")) {
            // A failed task must return to the WebView to prepare plugins before retrying.
            throw new AndroidUpdateRules.Rejected("plugin_prepare_failed");
        }
        return snapshot();
    }
    synchronized Intent pendingConfirmation() { return confirmation; }
    synchronized void confirmationLaunched() { confirmation = null; }
    synchronized JSONObject cancel() {
        if (active() && !record.optBoolean("committed")) {
            transition("canceled", null); cleanup(false);
        }
        return snapshot();
    }
    private void abandon() {
        int session = record.optInt("sessionId", -1);
        if (session >= 0) try { installer.abandonSession(session); } catch (RuntimeException ignored) { }
        put("sessionId", -1); put("committed", false); confirmation = null; save();
    }
    private void cleanup(boolean keepApk) {
        jobs.cancel(JOB_ID);
        long download = record.optLong("downloadId", -1);
        if (download >= 0) downloads.remove(download);
        if (!record.optBoolean("committed")) abandon();
        if (!keepApk) privateApk().delete();
        confirmation = null;
    }
    synchronized void installationResult(String taskId, int sessionId, int status, Intent intent) {
        if (!active() || !record.optString("taskId").equals(taskId) || record.optInt("sessionId", -1) != sessionId) return;
        if (status == PackageInstaller.STATUS_PENDING_USER_ACTION) {
            confirmation = intent;
            if (intent == null) { transition("failed", "install_failed"); return; }
            put("committed", false); transition("awaiting-confirmation", null);
        } else if (status == PackageInstaller.STATUS_SUCCESS) {
            // A callback is insufficient: reconcile the actual installed identity.
            reconcile();
        } else {
            String error = status == PackageInstaller.STATUS_FAILURE_STORAGE ? "storage_full" :
                status == PackageInstaller.STATUS_FAILURE_ABORTED ? "user_canceled" :
                status == PackageInstaller.STATUS_FAILURE_BLOCKED ? "install_blocked" :
                status == PackageInstaller.STATUS_FAILURE_CONFLICT ? "version_conflict" : "install_failed";
            put("committed", false); transition("failed", error);
        }
    }
    private synchronized boolean isPrivateReady(String taskId) { return owns(taskId) && record.optBoolean("privateReady"); }
    private boolean owns(String taskId) { return active() && record.optString("taskId").equals(taskId); }
    private synchronized void checkpoint(String taskId) throws InterruptedException {
        if (!owns(taskId) || Thread.currentThread().isInterrupted()) throw new InterruptedException();
    }
    private synchronized void fail(Exception error) {
        String code = error instanceof AndroidUpdateRules.Rejected ? ((AndroidUpdateRules.Rejected) error).code :
            error instanceof FileNotFoundException ? "task_missing" : "install_failed";
        if (error instanceof android.system.ErrnoException && ((android.system.ErrnoException) error).errno == android.system.OsConstants.ENOSPC) code = "storage_full";
        if (error.getCause() instanceof android.system.ErrnoException && ((android.system.ErrnoException) error.getCause()).errno == android.system.OsConstants.ENOSPC) code = "storage_full";
        if (active()) {
            transition("failed", code);
            if (!record.optBoolean("committed")) abandon();
            if (code.equals("integrity_mismatch") || code.equals("signature_mismatch") || code.equals("package_mismatch") || code.equals("profile_mismatch")) {
                privateApk().delete(); put("privateReady", false);
                long download = record.optLong("downloadId", -1);
                if (download >= 0) downloads.remove(download);
                put("downloadId", -1L); save();
            }
        }
    }
    void process(String taskId) {
        if (!processing.compareAndSet(false, true)) return;
        try {
            final JSONObject update;
            final File file;
            final long downloadId;
            synchronized (this) {
                if (!owns(taskId) || !phase().equals("verifying")) return;
                update = new JSONObject(record.getJSONObject("update").toString()); file = privateApk();
                downloadId = record.optLong("downloadId", -1);
            }
            AndroidUpdateRules.Artifact target = artifact(update);
            validateInstalled(target);
            if (!file.isFile() || !isPrivateReady(taskId)) {
                file.delete();
                AndroidUpdateRules.require(downloadId >= 0, "task_missing");
                try (ParcelFileDescriptor descriptor = downloads.openDownloadedFile(downloadId);
                     InputStream input = new ParcelFileDescriptor.AutoCloseInputStream(descriptor);
                     OutputStream output = new FileOutputStream(file)) {
                    copy(input, output, target, taskId);
                } catch (Exception error) { file.delete(); throw error; }
            } else {
                try (InputStream input = new FileInputStream(file)) { copy(input, null, target, taskId); }
            }
            synchronized (this) { checkpoint(taskId); put("privateReady", true); save(); }
            verifyApk(file, target);
            checkpoint(taskId);
            final int sessionId;
            synchronized (this) {
                checkpoint(taskId);
                if (!hasInstallPermission()) { transition("awaiting-permission", "permission_denied"); return; }
                validateInstalled(target);
                PackageInstaller.SessionParams params = new PackageInstaller.SessionParams(PackageInstaller.SessionParams.MODE_FULL_INSTALL);
                params.setAppPackageName(target.packageId); params.setSize(target.size);
                if (Build.VERSION.SDK_INT >= 31) params.setRequireUserAction(PackageInstaller.SessionParams.USER_ACTION_NOT_REQUIRED);
                sessionId = installer.createSession(params);
                put("sessionId", sessionId); save();
            }
            try (PackageInstaller.Session session = installer.openSession(sessionId);
                 InputStream input = new FileInputStream(file)) {
                try (OutputStream output = session.openWrite("base.apk", 0, target.size)) {
                    copy(input, output, target, taskId); session.fsync(output);
                }
                synchronized (this) {
                    checkpoint(taskId);
                    if (!hasInstallPermission()) { abandon(); transition("awaiting-permission", "permission_denied"); return; }
                    Intent callback = new Intent(context, ChronosUpdateReceiver.class).setAction("org.uednd.chronos.UPDATE_RESULT")
                        .setData(Uri.parse("chronos-update:" + taskId)).putExtra("taskId", taskId);
                    int flags = PendingIntent.FLAG_UPDATE_CURRENT;
                    if (Build.VERSION.SDK_INT >= 31) flags |= PendingIntent.FLAG_MUTABLE;
                    PendingIntent pending = PendingIntent.getBroadcast(context, sessionId, callback, flags);
                    put("committed", true); put("submittedAt", System.currentTimeMillis()); transition("installing", null);
                    try { session.commit(pending.getIntentSender()); }
                    catch (Exception error) {
                        PackageInstaller.SessionInfo info = installer.getSessionInfo(sessionId);
                        if (info == null || !info.isSealed()) put("committed", false);
                        throw error;
                    }
                }
            }
        } catch (InterruptedException error) {
            synchronized (this) { if (owns(taskId) && !record.optBoolean("committed")) abandon(); }
            Thread.currentThread().interrupt();
        } catch (Exception error) {
            synchronized (this) { if (owns(taskId)) fail(error); }
        } finally { processing.set(false); }
    }
    private void copy(InputStream input, OutputStream output, AndroidUpdateRules.Artifact target, String taskId) throws Exception {
        MessageDigest digest = MessageDigest.getInstance("SHA-256"); byte[] buffer = new byte[65536]; long count = 0; int read;
        while ((read = input.read(buffer)) != -1) {
            checkpoint(taskId); count += read;
            AndroidUpdateRules.require(count <= target.size, "integrity_mismatch");
            digest.update(buffer, 0, read); if (output != null) output.write(buffer, 0, read);
        }
        AndroidUpdateRules.verifyBytes(target, count, hex(digest.digest()));
    }
    @SuppressWarnings("deprecation")
    private void verifyApk(File file, AndroidUpdateRules.Artifact target) throws Exception {
        PackageInfo archive = context.getPackageManager().getPackageArchiveInfo(file.getPath(),
            Build.VERSION.SDK_INT >= 28 ? PackageManager.GET_SIGNING_CERTIFICATES : PackageManager.GET_SIGNATURES);
        AndroidUpdateRules.require(archive != null, "package_mismatch");
        AndroidUpdateRules.verifyPackage(target, archive.packageName, archive.versionName, code(archive), certificate(archive));
        try (ZipFile zip = new ZipFile(file)) {
            ZipEntry entry = zip.getEntry(HOST_PATH);
            AndroidUpdateRules.require(entry != null, "profile_mismatch");
            try (InputStream input = zip.getInputStream(entry)) {
                JSONObject host = new JSONObject(readText(input)).getJSONObject("host");
                AndroidUpdateRules.verifyHost(target, host.getString("target"), host.getString("profileId"), host.getString("buildId"), host.getString("version"));
            }
        }
    }
    static String readText(InputStream input) throws IOException {
        ByteArrayOutputStream output = new ByteArrayOutputStream(); byte[] buffer = new byte[8192]; int count;
        while ((count = input.read(buffer)) != -1) {
            if (output.size() + count > 2 * 1024 * 1024) throw new IOException("Update metadata too large");
            output.write(buffer, 0, count);
        }
        return output.toString(StandardCharsets.UTF_8.name());
    }
    static String hex(byte[] bytes) {
        StringBuilder result = new StringBuilder(bytes.length * 2);
        for (byte value : bytes) result.append(String.format(java.util.Locale.ROOT, "%02x", value & 255));
        return result.toString();
    }
}
