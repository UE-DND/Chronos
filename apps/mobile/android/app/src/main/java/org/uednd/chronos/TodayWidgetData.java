package org.uednd.chronos;

import android.content.Context;
import android.content.Intent;
import android.graphics.Color;
import android.util.AtomicFile;
import android.widget.RemoteViews;
import android.view.View;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Collections;
import java.util.Date;
import java.util.List;
import java.util.Locale;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

final class TodayWidgetData {
	private static final int PREPARE_MINUTES = 30;
	private static final String SNAPSHOT_FILE = "today_widget_snapshot.json";

	private TodayWidgetData() {}

	static JSONObject readSnapshot(Context context) {
		AtomicFile file = new AtomicFile(new File(context.getFilesDir(), SNAPSHOT_FILE));
		try (FileInputStream input = file.openRead(); ByteArrayOutputStream bytes = new ByteArrayOutputStream()) {
			byte[] buffer = new byte[4096];
			int read;
			while ((read = input.read(buffer)) != -1) bytes.write(buffer, 0, read);
			JSONObject result = new JSONObject(bytes.toString(StandardCharsets.UTF_8.name()));
			return result.optInt("version", -1) == 1 ? result : null;
		} catch (IOException | JSONException error) {
			return null;
		}
	}

	static boolean isFresh(JSONObject snapshot, String todayIso) {
		if (snapshot == null) return false;
		String from = snapshot.optString("validFromIso", "");
		String until = snapshot.optString("validUntilIso", "");
		JSONObject days = snapshot.optJSONObject("days");
		return !from.isEmpty() && !until.isEmpty() && !todayIso.isEmpty()
			&& todayIso.compareTo(from) >= 0 && todayIso.compareTo(until) <= 0
			&& days != null && days.optJSONObject(todayIso) != null;
	}

	static List<CourseItem> buildCourses(JSONObject snapshot, String todayIso, Calendar now) {
		JSONObject days = snapshot.optJSONObject("days");
		JSONObject day = days == null ? null : days.optJSONObject(todayIso);
		if (day == null) return Collections.emptyList();
		JSONArray courses = day.optJSONArray("courses");
		if (courses == null) return Collections.emptyList();
		JSONArray periodTimes = snapshot.optJSONArray("periodTimes");
		List<CourseItem> items = new ArrayList<>();
		int nowMinutes = now.get(Calendar.HOUR_OF_DAY) * 60 + now.get(Calendar.MINUTE);
		int currentPeriod = findCurrentPeriod(periodTimes, nowMinutes);
		for (int index = 0; index < courses.length(); index += 1) {
			JSONObject course = courses.optJSONObject(index);
			if (course == null) continue;
			CourseItem item = new CourseItem(course, currentPeriod, nowMinutes);
			if (!item.name.isEmpty() && item.status != CourseStatus.PAST) items.add(item);
		}
		if (items.isEmpty()) return Collections.emptyList();

		int currentIndex = findIndex(items, CourseStatus.CURRENT);
		int preparingIndex = findIndex(items, CourseStatus.PREPARING);
		int upcomingIndex = findIndex(items, CourseStatus.UPCOMING);
		int focusIndex = currentIndex >= 0 ? currentIndex : preparingIndex >= 0 ? preparingIndex : upcomingIndex;
		if (focusIndex < 0) {
			Collections.reverse(items);
			if (!items.isEmpty()) items.get(0).showStatus = true;
			return items;
		}

		List<CourseItem> prioritized = new ArrayList<>(items.size());
		prioritized.addAll(items.subList(focusIndex, items.size()));
		for (int index = focusIndex - 1; index >= 0; index -= 1) prioritized.add(items.get(index));
		CourseItem focus = prioritized.get(0);
		focus.showStatus = true;
		return prioritized;
	}

	private static int findIndex(List<CourseItem> items, CourseStatus status) {
		for (int index = 0; index < items.size(); index += 1) {
			if (items.get(index).status == status) return index;
		}
		return -1;
	}

	private static int findCurrentPeriod(JSONArray periodTimes, int nowMinutes) {
		if (periodTimes == null) return -1;
		for (int index = 0; index < periodTimes.length(); index += 1) {
			JSONObject period = periodTimes.optJSONObject(index);
			if (period == null) continue;
			int start = parseMinutes(period.optString("startTime", null));
			int end = parseMinutes(period.optString("endTime", null));
			if (start >= 0 && end >= 0 && nowMinutes >= start && nowMinutes <= end) {
				return period.optInt("index", -1);
			}
		}
		return -1;
	}

	private static int parseMinutes(String value) {
		if (value == null) return -1;
		String[] parts = value.split(":");
		if (parts.length != 2) return -1;
		try {
			int hours = Integer.parseInt(parts[0]);
			int minutes = Integer.parseInt(parts[1]);
			if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) return -1;
			return hours * 60 + minutes;
		} catch (NumberFormatException error) {
			return -1;
		}
	}

	static String formatTodayIso() {
		return new SimpleDateFormat("yyyy-MM-dd", Locale.US).format(new Date());
	}

	static String formatHeaderDate(String iso) {
		try {
			Date date = new SimpleDateFormat("yyyy-MM-dd", Locale.US).parse(iso);
			return new SimpleDateFormat("EEE M.d", Locale.getDefault()).format(date);
		} catch (Exception error) {
			return iso;
		}
	}

	static void setHeader(
		RemoteViews views,
		Context context,
		String todayIso,
		int totalCourses,
		int academicWeek,
		boolean showWeek
	) {
		views.setTextViewText(R.id.widget_title, formatHeaderDate(todayIso));
		views.setTextViewText(
			R.id.widget_subtitle,
			context.getResources().getQuantityString(R.plurals.widget_total_classes, totalCourses, totalCourses)
		);
		views.setViewVisibility(R.id.widget_subtitle, View.VISIBLE);
		if (!showWeek || academicWeek < 1) {
			views.setViewVisibility(R.id.widget_week_label, View.GONE);
		} else {
			views.setViewVisibility(R.id.widget_week_label, View.VISIBLE);
			views.setTextViewText(
				R.id.widget_week_label,
				context.getString(R.string.widget_week, academicWeek)
			);
		}
	}

	static String statusLabel(Context context, CourseStatus status) {
		switch (status) {
			case CURRENT: return context.getString(R.string.widget_status_current);
			case PREPARING: return context.getString(R.string.widget_status_preparing);
			default: return context.getString(R.string.widget_status_upcoming);
		}
	}

	static RemoteViews createCourseRow(Context context, CourseItem course) {
		RemoteViews row = new RemoteViews(context.getPackageName(), R.layout.widget_today_course);
		row.setInt(R.id.widget_course_color, "setBackgroundColor", course.color);
		row.setTextViewText(R.id.widget_course_time, course.timeLabel(context));
		row.setTextViewText(R.id.widget_course_name, course.name);
		row.setTextViewText(R.id.widget_course_location, course.location);
		if (course.showStatus) {
			row.setViewVisibility(R.id.widget_course_status, View.VISIBLE);
			row.setTextViewText(R.id.widget_course_status, statusLabel(context, course.status));
		}
		row.setOnClickFillInIntent(R.id.widget_course_row, new Intent());
		return row;
	}

	enum CourseStatus { PAST, CURRENT, PREPARING, UPCOMING }

	static final class CourseItem {
		final String id;
		final String name;
		final String location;
		final String startTime;
		final String endTime;
		final int startPeriod;
		final int endPeriod;
		final int color;
		final CourseStatus status;
		boolean showStatus;

		CourseItem(JSONObject data, int currentPeriod, int nowMinutes) {
			id = data.optString("id", "");
			name = data.optString("name", "");
			location = data.optString("location", "");
			startTime = data.optString("startTime", null);
			endTime = data.optString("endTime", null);
			startPeriod = data.optInt("startPeriod", 0);
			endPeriod = data.optInt("endPeriod", 0);
			int parsedColor = contextColor(data.optString("colorHex", ""));
			color = parsedColor == 0 ? Color.rgb(187, 222, 255) : parsedColor;
			status = resolveStatus(this, currentPeriod, nowMinutes);
		}

		private static CourseStatus resolveStatus(CourseItem course, int currentPeriod, int nowMinutes) {
			if (course.startTime != null && course.endTime != null) {
				int start = parseMinutes(course.startTime);
				int end = parseMinutes(course.endTime);
				if (start >= 0 && end >= 0) {
					if (nowMinutes > end) return CourseStatus.PAST;
					if (nowMinutes >= start && nowMinutes <= end) return CourseStatus.CURRENT;
					if (nowMinutes < start && start - nowMinutes <= PREPARE_MINUTES) return CourseStatus.PREPARING;
					return CourseStatus.UPCOMING;
				}
			}
			if (currentPeriod < 0) return CourseStatus.UPCOMING;
			if (course.endPeriod < currentPeriod) return CourseStatus.PAST;
			if (course.startPeriod <= currentPeriod && course.endPeriod >= currentPeriod) return CourseStatus.CURRENT;
			return CourseStatus.UPCOMING;
		}

		String timeLabel(Context context) {
			if (startTime != null && endTime != null) return startTime + "–" + endTime;
			return context.getString(R.string.widget_period, startPeriod, endPeriod);
		}

		private static int contextColor(String colorHex) {
			if (colorHex == null || colorHex.isEmpty()) return 0;
			try {
				return Color.parseColor(colorHex);
			} catch (IllegalArgumentException error) {
				return 0;
			}
		}
	}
}
