package org.uednd.chronos;
import android.content.Intent;
import android.os.Build;
import android.provider.Settings;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import org.json.JSONArray;

@CapacitorPlugin(name = "ChronosClassNotifications")
public class ChronosClassNotificationsPlugin extends Plugin {
 @PluginMethod public void getStatus(PluginCall call) {
  JSObject status = new JSObject();
  status.put("enabled", ChronosClassReminderScheduler.enabled(getContext()));
  status.put("channelEnabled", ChronosClassReminderScheduler.channelEnabled(getContext()));
  call.resolve(status);
 }
 @PluginMethod public void replacePlan(PluginCall call) {
  try {
   JSONArray plan = call.getArray("plan");
   if (plan == null) throw new IllegalArgumentException("Missing reminder plan");
   ChronosClassReminderScheduler.replacePlan(getContext(), plan);
   call.resolve();
  } catch (Exception error) { call.reject("Could not schedule class reminders", error); }
 }
 @PluginMethod public void clearData(PluginCall call) {
  try { ChronosClassReminderScheduler.clear(getContext()); call.resolve(); }
  catch (Exception error) { call.reject("Could not clear class reminders", error); }
 }
 @PluginMethod public void sendTest(PluginCall call) {
  try {
   ChronosClassReminderScheduler.sendTest(getContext(), call.getString("title", ""), call.getString("body", ""));
   call.resolve();
  } catch (Exception error) { call.reject("Could not display test notification", error); }
 }
 @PluginMethod public void openNotificationSettings(PluginCall call) {
  Intent intent;
  if (Build.VERSION.SDK_INT >= 26) {
   boolean channel = ChronosClassReminderScheduler.enabled(getContext());
   intent = new Intent(channel ? Settings.ACTION_CHANNEL_NOTIFICATION_SETTINGS : Settings.ACTION_APP_NOTIFICATION_SETTINGS)
    .putExtra(Settings.EXTRA_APP_PACKAGE, getContext().getPackageName());
   if (channel) intent.putExtra(Settings.EXTRA_CHANNEL_ID, ChronosClassReminderScheduler.CHANNEL);
  } else {
   intent = new Intent(Settings.ACTION_APPLICATION_DETAILS_SETTINGS,
    android.net.Uri.parse("package:" + getContext().getPackageName()));
  }
  getActivity().startActivity(intent);
  call.resolve();
 }
}
