package org.uednd.chronos;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Locale;
import java.util.TimeZone;

/** Calendar calculation independent of the WebView and its preview clock. */
final class ClassReminderRules {
 static long startAt(String date, String time, TimeZone zone) throws ParseException {
  SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd HH:mm", Locale.ROOT);
  format.setLenient(false);
  format.setTimeZone(zone);
  return format.parse(date + " " + time).getTime();
 }
 static long notifyAt(long startAt, int minutes) { return startAt - minutes * 60_000L; }
 static boolean canDeliver(long notifyAt, long startAt, long now) {
  return notifyAt <= now && now - notifyAt <= 60_000L && now < startAt;
 }
}
