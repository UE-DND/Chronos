package org.uednd.chronos;

import android.app.AlarmManager;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.net.Uri;
import android.os.Build;
import android.util.AtomicFile;
import androidx.core.app.NotificationCompat;
import androidx.core.app.NotificationManagerCompat;
import java.io.File;
import java.io.FileOutputStream;
import java.nio.charset.StandardCharsets;
import java.util.TimeZone;
import org.json.JSONArray;
import org.json.JSONObject;

/** One OS alarm at a time, with the rest of the semester durably queued. */
final class ChronosClassReminderScheduler {
 static final Object LOCK = new Object();
 static final String ALARM_ACTION = "org.uednd.chronos.CLASS_REMINDER";
 static final String CHANNEL = "chronos-class-reminders";
 private static final String TAG = "chronos-class-reminders";
 private static final int ALARM_ID = 23001;
 private static final int TEST_ID = 23002;

 static void ensureChannel(Context context) {
  if (Build.VERSION.SDK_INT >= 26) {
   NotificationChannel channel = new NotificationChannel(CHANNEL,
    context.getString(R.string.class_reminder_channel), NotificationManager.IMPORTANCE_HIGH);
   channel.setDescription(context.getString(R.string.class_reminder_channel_description));
   context.getSystemService(NotificationManager.class).createNotificationChannel(channel);
  }
 }
 static boolean enabled(Context context) { return NotificationManagerCompat.from(context).areNotificationsEnabled(); }
 static boolean channelEnabled(Context context) {
  ensureChannel(context);
  if (Build.VERSION.SDK_INT < 26) return true;
  return context.getSystemService(NotificationManager.class).getNotificationChannel(CHANNEL).getImportance() != NotificationManager.IMPORTANCE_NONE;
 }
 static boolean allowed(Context context) {
  return enabled(context) && channelEnabled(context) &&
   (Build.VERSION.SDK_INT < 31 || context.getSystemService(AlarmManager.class).canScheduleExactAlarms());
 }
 private static AtomicFile file(Context context) {
  return new AtomicFile(new File(context.getFilesDir(), "class_reminders.json"));
 }
 private static JSONObject read(Context context) throws Exception {
  AtomicFile storage = file(context);
  if (!storage.getBaseFile().exists()) return new JSONObject().put("version", 1).put("plan", new JSONArray()).put("delivered", new JSONObject()).put("generation", 0);
  JSONObject state = new JSONObject(new String(storage.readFully(), StandardCharsets.UTF_8));
  if (state.optInt("version") != 1) throw new IllegalStateException("Invalid reminder snapshot");
  return state;
 }
 private static void write(Context context, JSONObject state) throws Exception {
  AtomicFile storage = file(context);
  FileOutputStream output = null;
  try {
   output = storage.startWrite();
   output.write(state.toString().getBytes(StandardCharsets.UTF_8));
   storage.finishWrite(output);
  } catch (Exception error) { if (output != null) storage.failWrite(output); throw error; }
 }
 static void replacePlan(Context context, JSONArray plan) throws Exception {
  synchronized (LOCK) {
   if (plan.length() > 0 && !allowed(context)) throw new SecurityException("Notification and exact alarm permissions are required");
   JSONObject state = read(context);
   state.put("plan", plan).put("generation", state.optLong("generation") + 1);
   write(context, state);
   cancelAlarm(context);
   if (plan.length() == 0) clearVisible(context);
   else armNext(context, state);
  }
 }
 static void clear(Context context) throws Exception {
  synchronized (LOCK) {
   cancelAlarm(context);
   write(context, new JSONObject().put("version", 1).put("plan", new JSONArray()).put("delivered", new JSONObject()).put("generation", 0));
   clearVisible(context);
  }
 }
 private static PendingIntent alarmIntent(Context context, long generation, int flags) {
  Intent intent = new Intent(context, ChronosClassReminderReceiver.class).setAction(ALARM_ACTION).putExtra("generation", generation);
  return PendingIntent.getBroadcast(context, ALARM_ID, intent, flags | PendingIntent.FLAG_IMMUTABLE);
 }
 private static void cancelAlarm(Context context) {
  PendingIntent pending = alarmIntent(context, 0, PendingIntent.FLAG_NO_CREATE);
  if (pending != null) { context.getSystemService(AlarmManager.class).cancel(pending); pending.cancel(); }
 }
 private static long startAt(JSONObject batch) throws Exception {
  return ClassReminderRules.startAt(batch.getString("dateIso"), batch.getString("startTime"), TimeZone.getDefault());
 }
 private static long notifyAt(JSONObject batch) throws Exception {
  return ClassReminderRules.notifyAt(startAt(batch), batch.getInt("prepareReminderMinutes"));
 }
 private static boolean undelivered(JSONObject batch, JSONObject delivered) throws Exception {
  JSONArray courses = batch.getJSONArray("courses");
  for (int i = 0; i < courses.length(); i++) if (!delivered.has(courses.getJSONObject(i).getString("key"))) return true;
  return false;
 }
 private static void armNext(Context context, JSONObject state) throws Exception {
  if (!allowed(context)) { cancelAlarm(context); return; }
  long now = System.currentTimeMillis();
  long next = Long.MAX_VALUE;
  JSONArray plan = state.getJSONArray("plan");
  JSONObject delivered = state.getJSONObject("delivered");
  for (int i = 0; i < plan.length(); i++) {
   JSONObject batch = plan.getJSONObject(i);
   long fireAt = notifyAt(batch);
   if (fireAt > now && undelivered(batch, delivered)) next = Math.min(next, fireAt);
  }
  if (next != Long.MAX_VALUE) context.getSystemService(AlarmManager.class).setExactAndAllowWhileIdle(
   AlarmManager.RTC_WAKEUP, next, alarmIntent(context, state.optLong("generation"), PendingIntent.FLAG_UPDATE_CURRENT));
 }
 static void receive(Context context, Intent intent) throws Exception {
  synchronized (LOCK) {
   JSONObject state = read(context);
   boolean alarm = ALARM_ACTION.equals(intent.getAction());
   if (alarm && intent.getLongExtra("generation", -1) != state.optLong("generation")) return;
   cancelAlarm(context);
   if (!allowed(context)) return;
   if (alarm) {
    long now = System.currentTimeMillis();
    JSONArray plan = state.getJSONArray("plan");
    JSONObject delivered = state.getJSONObject("delivered");
    for (int i = 0; i < plan.length(); i++) {
     JSONObject batch = plan.getJSONObject(i);
     if (!ClassReminderRules.canDeliver(notifyAt(batch), startAt(batch), now) || !undelivered(batch, delivered)) continue;
     // Persist the claim before displaying so a restart never replays it.
     JSONArray courses = batch.getJSONArray("courses");
     StringBuilder body = new StringBuilder();
     for (int j = 0; j < courses.length(); j++) {
      JSONObject course = courses.getJSONObject(j);
      if (delivered.has(course.getString("key"))) continue;
      if (body.length() > 0) body.append("\n");
      body.append(course.getString("body"));
      delivered.put(course.getString("key"), true);
     }
     write(context, state);
     display(context, ALARM_ID, batch.getString("title"), body.toString());
    }
   }
   // Boot and time-change recovery only arm future reminders; no catch-up burst.
   armNext(context, state);
  }
 }
 static void sendTest(Context context, String title, String body) {
  if (!allowed(context)) throw new SecurityException("Reminder permissions are required");
  display(context, TEST_ID, title, body);
 }
 private static void display(Context context, int id, String title, String body) {
  ensureChannel(context);
  Intent launch = new Intent(context, MainActivity.class).setAction(Intent.ACTION_VIEW)
   .setData(Uri.parse("chronos://today?class-reminder=1"))
   .addFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TOP);
  PendingIntent click = PendingIntent.getActivity(context, id, launch, PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE);
  NotificationCompat.Builder builder = new NotificationCompat.Builder(context, CHANNEL)
   .setSmallIcon(R.drawable.ic_stat_class_reminder).setContentTitle(title).setContentText(body)
   .setStyle(new NotificationCompat.BigTextStyle().bigText(body)).setCategory(NotificationCompat.CATEGORY_REMINDER)
   .setPriority(NotificationCompat.PRIORITY_HIGH).setDefaults(android.app.Notification.DEFAULT_ALL)
   .setContentIntent(click).setAutoCancel(true);
  NotificationManagerCompat.from(context).notify(TAG, id, builder.build());
 }
 private static void clearVisible(Context context) {
  NotificationManagerCompat.from(context).cancel(TAG, ALARM_ID);
  NotificationManagerCompat.from(context).cancel(TAG, TEST_ID);
 }
}
