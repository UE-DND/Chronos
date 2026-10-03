package org.uednd.chronos;

import static org.junit.Assert.*;
import android.app.AlarmManager;
import android.app.NotificationManager;
import android.content.Context;
import android.content.Intent;
import android.os.ParcelFileDescriptor;
import android.service.notification.StatusBarNotification;
import androidx.test.ext.junit.runners.AndroidJUnit4;
import androidx.test.platform.app.InstrumentationRegistry;
import java.io.FileInputStream;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Locale;
import org.json.JSONArray;
import org.json.JSONObject;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;

@RunWith(AndroidJUnit4.class)
public class ClassReminderSchedulerTest {
 private Context context;
 private boolean retainQueue;
 private void shell(String command) throws Exception {
  try (ParcelFileDescriptor result = InstrumentationRegistry.getInstrumentation().getUiAutomation().executeShellCommand(command);
    FileInputStream input = new FileInputStream(result.getFileDescriptor())) {
   byte[] buffer = new byte[1024]; while (input.read(buffer) != -1) { /* Drain command output. */ }
  }
 }
 @Before public void setup() throws Exception {
  context = InstrumentationRegistry.getInstrumentation().getTargetContext();
  shell("pm grant " + context.getPackageName() + " android.permission.POST_NOTIFICATIONS");
  shell("appops set " + context.getPackageName() + " SCHEDULE_EXACT_ALARM allow");
  ChronosClassReminderScheduler.clear(context);
  assertTrue(ChronosClassReminderScheduler.allowed(context));
 }
 @After public void cleanup() throws Exception {
  shell("svc wifi enable"); shell("svc data enable");
  if (!retainQueue) ChronosClassReminderScheduler.clear(context);
 }
 private JSONArray plan(int fireInMinutes) throws Exception {
  Calendar start = Calendar.getInstance(); start.set(Calendar.SECOND, 0); start.set(Calendar.MILLISECOND, 0);
  start.add(Calendar.MINUTE, fireInMinutes + 5);
  JSONObject course = new JSONObject().put("key", "smoke-" + start.getTimeInMillis()).put("body", "Math · Room 1");
  return new JSONArray().put(new JSONObject()
   .put("dateIso", new SimpleDateFormat("yyyy-MM-dd", Locale.ROOT).format(start.getTime()))
   .put("startTime", new SimpleDateFormat("HH:mm", Locale.ROOT).format(start.getTime()))
   .put("prepareReminderMinutes", 5).put("title", "Chronos notification smoke").put("body", "Math · Room 1")
   .put("courses", new JSONArray().put(course)));
 }
 private boolean visible() {
  for (StatusBarNotification notification : context.getSystemService(NotificationManager.class).getActiveNotifications())
   if ("chronos-class-reminders".equals(notification.getTag())) return true;
  return false;
 }
 private void awaitVisible(boolean expected) throws Exception {
  long deadline = System.currentTimeMillis() + 5_000;
  while (visible() != expected && System.currentTimeMillis() < deadline) Thread.sleep(50);
  assertEquals(expected, visible());
 }
 @Test public void deliversInBackgroundOfflineAndClearsEverything() throws Exception {
  shell("svc wifi disable"); shell("svc data disable");
  ChronosClassReminderScheduler.replacePlan(context, plan(1));
  long deadline = System.currentTimeMillis() + 75_000;
  while (!visible() && System.currentTimeMillis() < deadline) Thread.sleep(250);
  assertTrue("Native alarm must deliver without WebView or network", visible());
  ChronosClassReminderScheduler.clear(context);
  awaitVisible(false);
 }
 @Test public void restoresFutureQueueWithoutShowingMissedReminders() throws Exception {
  ChronosClassReminderScheduler.replacePlan(context, plan(-2));
  ChronosClassReminderScheduler.receive(context, new Intent(Intent.ACTION_BOOT_COMPLETED));
  assertFalse("Reboot must not replay expired reminders", visible());
  ChronosClassReminderScheduler.replacePlan(context, plan(10));
  ChronosClassReminderScheduler.receive(context, new Intent(Intent.ACTION_TIMEZONE_CHANGED));
  assertTrue(context.getSystemService(AlarmManager.class).canScheduleExactAlarms());
  ChronosClassReminderScheduler.sendTest(context, "Test", "Test body"); awaitVisible(true);
  ChronosClassReminderScheduler.replacePlan(context, new JSONArray()); awaitVisible(false);
 }
 /** Run separately before reboot, then inspect dumpsys alarm after the device boots. */
 @Test public void persistsQueueForRebootSmoke() throws Exception {
  ChronosClassReminderScheduler.replacePlan(context, plan(10));
  retainQueue = "true".equals(InstrumentationRegistry.getArguments().getString("retainQueue"));
  assertTrue(new java.io.File(context.getFilesDir(), "class_reminders.json").isFile());
 }
}
