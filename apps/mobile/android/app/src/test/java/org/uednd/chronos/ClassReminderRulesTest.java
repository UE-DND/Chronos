package org.uednd.chronos;
import static org.junit.Assert.*;
import org.junit.Test;
import java.util.TimeZone;
public class ClassReminderRulesTest {
 @Test public void resolvesCivilTimeAgainAfterTimeZoneChange() throws Exception {
  long shanghai = ClassReminderRules.startAt("2026-03-02", "08:00", TimeZone.getTimeZone("Asia/Shanghai"));
  long utc = ClassReminderRules.startAt("2026-03-02", "08:00", TimeZone.getTimeZone("UTC"));
  assertEquals(8 * 3600_000L, utc - shanghai);
  assertEquals(shanghai - 30 * 60_000L, ClassReminderRules.notifyAt(shanghai, 30));
 }
 @Test public void skipsMissedRemindersAndClassesThatAlreadyStarted() {
  assertTrue(ClassReminderRules.canDeliver(100_000, 300_000, 150_000));
  assertFalse(ClassReminderRules.canDeliver(100_000, 300_000, 161_000));
  assertFalse(ClassReminderRules.canDeliver(100_000, 150_000, 150_000));
  assertFalse(ClassReminderRules.canDeliver(100_000, 300_000, 99_000));
 }
 @Test(expected = java.text.ParseException.class) public void rejectsInvalidClockTimes() throws Exception {
  ClassReminderRules.startAt("2026-03-02", "25:00", TimeZone.getTimeZone("UTC"));
 }
}
