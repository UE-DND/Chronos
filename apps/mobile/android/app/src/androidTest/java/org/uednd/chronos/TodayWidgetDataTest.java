package org.uednd.chronos;

import static org.junit.Assert.*;

import java.util.Calendar;
import java.util.List;
import org.json.JSONArray;
import org.json.JSONObject;
import org.junit.Test;

public class TodayWidgetDataTest {
	private JSONObject snapshot(int minutes) throws Exception {
		JSONObject course = new JSONObject()
			.put("id", "class").put("name", "Class").put("startPeriod", 1).put("endPeriod", 1)
			.put("startTime", "08:00").put("endTime", "08:45");
		return new JSONObject().put("version", 1).put("prepareReminderMinutes", minutes)
			.put("validFromIso", "2026-03-02").put("validUntilIso", "2026-03-15")
			.put("days", new JSONObject().put("2026-03-02", new JSONObject().put("courses", new JSONArray().put(course))));
	}

	private TodayWidgetData.CourseStatus status(JSONObject snapshot, int nowMinutes) {
		Calendar now = Calendar.getInstance();
		now.set(Calendar.HOUR_OF_DAY, nowMinutes / 60);
		now.set(Calendar.MINUTE, nowMinutes % 60);
		List<TodayWidgetData.CourseItem> courses = TodayWidgetData.buildCourses(snapshot, "2026-03-02", now);
		return courses.get(0).status;
	}

	@Test public void usesSnapshotThresholdIncludingExactBoundary() throws Exception {
		for (int minutes = 5; minutes <= 60; minutes += 5) {
			JSONObject data = snapshot(minutes);
			assertEquals(TodayWidgetData.CourseStatus.UPCOMING, status(data, 480 - minutes - 1));
			assertEquals(TodayWidgetData.CourseStatus.PREPARING, status(data, 480 - minutes));
			assertEquals(TodayWidgetData.CourseStatus.CURRENT, status(data, 480));
			assertEquals(TodayWidgetData.CourseStatus.CURRENT, status(data, 525));
			Calendar afterClass = Calendar.getInstance();
			afterClass.set(Calendar.HOUR_OF_DAY, 8);
			afterClass.set(Calendar.MINUTE, 46);
			assertTrue(TodayWidgetData.buildCourses(data, "2026-03-02", afterClass).isEmpty());
		}
	}

	@Test public void rejectsMissingAndInvalidPreparationValues() throws Exception {
		assertFalse(TodayWidgetData.isValidSnapshot(null));
		JSONObject missing = snapshot(30);
		missing.remove("prepareReminderMinutes");
		assertFalse(TodayWidgetData.isValidSnapshot(missing));
		for (Object value : new Object[] { 0, -5, 6, 65, 10.5, "15", JSONObject.NULL }) {
			JSONObject data = snapshot(30).put("prepareReminderMinutes", value);
			assertFalse(TodayWidgetData.isValidSnapshot(data));
			assertFalse(TodayWidgetData.isFresh(data, "2026-03-02"));
			assertTrue(TodayWidgetData.buildCourses(data, "2026-03-02", Calendar.getInstance()).isEmpty());
		}
	}
}
