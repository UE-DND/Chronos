package org.uednd.chronos;

import android.content.Intent;
import android.net.Uri;
import android.os.Build;
import android.os.Handler;
import android.os.Looper;
import android.provider.Settings;
import com.getcapacitor.*;
import com.getcapacitor.annotation.CapacitorPlugin;
import java.lang.ref.WeakReference;
import org.json.JSONObject;

@CapacitorPlugin(name = "ChronosUpdater")
public class ChronosUpdaterPlugin extends Plugin {
    private static WeakReference<ChronosUpdaterPlugin> current = new WeakReference<>(null);
    private final Handler handler = new Handler(Looper.getMainLooper());
    private volatile boolean foreground;
    private String lastState;
    private final Runnable poll = new Runnable() {
        @Override public void run() {
            if (!foreground) return;
            publish(); handler.postDelayed(this, 1000);
        }
    };
    private ChronosUpdateManager manager() { return ChronosUpdateManager.get(getContext()); }
    @Override public void load() {
        current = new WeakReference<>(this);
        foreground = getActivity().hasWindowFocus();
        if (foreground) handler.post(poll);
    }
    static void changed() {
        ChronosUpdaterPlugin plugin = current.get();
        if (plugin != null) plugin.handler.post(plugin::publish);
    }
    private void publish() {
        try {
            JSONObject snapshot = manager().snapshot();
            if (!snapshot.toString().equals(lastState)) {
                lastState = snapshot.toString(); notifyListeners("stateChanged", new JSObject(lastState));
            }
        } catch (Exception error) { android.util.Log.e("ChronosUpdater", "Cannot read update state", error); }
    }
    private void resolve(PluginCall call, JSONObject snapshot) throws Exception {
        call.resolve(new JSObject(snapshot.toString())); handler.post(this::publish);
    }
    private void reject(PluginCall call, Exception error) {
        String code = error instanceof AndroidUpdateRules.Rejected ? ((AndroidUpdateRules.Rejected) error).code : "install_failed";
        call.reject(code, code, error);
    }
    private void openPermission() {
        if (Build.VERSION.SDK_INT >= 26 && !manager().hasInstallPermission()) {
            getActivity().startActivity(new Intent(Settings.ACTION_MANAGE_UNKNOWN_APP_SOURCES,
                Uri.parse("package:" + getContext().getPackageName())));
        }
    }
    private void launchConfirmation() {
        Intent confirmation = manager().pendingConfirmation();
        if (foreground && confirmation != null) {
            getActivity().startActivity(confirmation);
            manager().confirmationLaunched();
        }
    }
    @PluginMethod public void startUpdate(PluginCall call) {
        try {
            JSObject update = call.getObject("update");
            if (update == null) throw new AndroidUpdateRules.Rejected("invalid_descriptor");
            JSONObject snapshot = manager().start(update, call.getString("preparationToken"));
            if (snapshot.optString("phase").equals("awaiting-permission")) openPermission();
            resolve(call, snapshot);
        } catch (Exception error) { reject(call, error); }
    }
    @PluginMethod public void getState(PluginCall call) {
        try { resolve(call, manager().snapshot()); } catch (Exception error) { reject(call, error); }
    }
    @PluginMethod public void continueUpdate(PluginCall call) {
        try {
            JSONObject snapshot = manager().continueUpdate();
            if (snapshot.optString("phase").equals("awaiting-permission")) openPermission();
            launchConfirmation(); resolve(call, snapshot);
        } catch (Exception error) { reject(call, error); }
    }
    @PluginMethod public void cancelUpdate(PluginCall call) {
        try { resolve(call, manager().cancel()); } catch (Exception error) { reject(call, error); }
    }
    @PluginMethod public void takeEvents(PluginCall call) {
        try { JSObject value = new JSObject(); value.put("events", manager().takeEvents()); call.resolve(value); }
        catch (Exception error) { reject(call, error); }
    }
    @Override protected void handleOnResume() {
        foreground = true; manager().permissionReturned(); handler.removeCallbacks(poll); handler.post(poll);
        // Background confirmation waits for the user's Continue action on the update page.
    }
    @Override protected void handleOnPause() { foreground = false; handler.removeCallbacks(poll); }
    @Override protected void handleOnDestroy() {
        handler.removeCallbacksAndMessages(null);
        if (current.get() == this) current.clear();
    }
    static void installationChanged() {
        ChronosUpdaterPlugin plugin = current.get();
        if (plugin != null) plugin.handler.post(() -> {
            try { plugin.launchConfirmation(); } catch (RuntimeException error) {
                android.util.Log.w("ChronosUpdater", "System confirmation unavailable", error);
            }
            plugin.publish();
        });
    }
}
