package org.uednd.chronos;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.util.Log;
public class ChronosClassReminderReceiver extends BroadcastReceiver {
 @Override public void onReceive(Context context, Intent intent) {
  try { ChronosClassReminderScheduler.receive(context, intent); }
  catch (Exception error) { Log.e("ChronosReminders", "Could not restore or deliver reminders", error); }
 }
}
