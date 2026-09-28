package org.uednd.chronos;

import android.app.PendingIntent;
import android.appwidget.AppWidgetManager;
import android.appwidget.AppWidgetProvider;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.view.View;
import android.widget.RemoteViews;
import java.util.Calendar;
import java.util.List;
import org.json.JSONArray;
import org.json.JSONObject;

public class TodayAppWidgetProvider extends AppWidgetProvider {
	private static final int WEEK_LABEL_MIN_HEIGHT_DP = 150;

	@Override
	public void onUpdate(Context context, AppWidgetManager manager, int[] appWidgetIds) {
		for (int appWidgetId : appWidgetIds) {
			renderWidget(context, manager, appWidgetId, manager.getAppWidgetOptions(appWidgetId));
		}
	}

	@Override
	public void onAppWidgetOptionsChanged(
		Context context,
		AppWidgetManager manager,
		int appWidgetId,
		Bundle newOptions
	) {
		renderWidget(context, manager, appWidgetId, newOptions);
	}

	@Override
	public void onReceive(Context context, Intent intent) {
		super.onReceive(context, intent);
		String action = intent.getAction();
		if (Intent.ACTION_TIME_CHANGED.equals(action) || Intent.ACTION_TIMEZONE_CHANGED.equals(action)) {
			updateAllWidgets(context);
		}
	}

	static void updateAllWidgets(Context context) {
		AppWidgetManager manager = AppWidgetManager.getInstance(context);
		ComponentName component = new ComponentName(context, TodayAppWidgetProvider.class);
		int[] ids = manager.getAppWidgetIds(component);
		for (int appWidgetId : ids) {
			renderWidget(context, manager, appWidgetId, manager.getAppWidgetOptions(appWidgetId));
		}
	}

	private static void renderWidget(
		Context context,
		AppWidgetManager manager,
		int appWidgetId,
		Bundle options
	) {
		if (options == null) options = manager.getAppWidgetOptions(appWidgetId);
		int heightDp = options == null
			? 110
			: options.getInt(AppWidgetManager.OPTION_APPWIDGET_MIN_HEIGHT, 110);
		boolean showWeek = heightDp >= WEEK_LABEL_MIN_HEIGHT_DP;
		JSONObject snapshot = TodayWidgetData.readSnapshot(context);
		String todayIso = TodayWidgetData.formatTodayIso();
		RemoteViews views = createBaseViews(context, todayIso);
		Object activeValue = snapshot == null ? null : snapshot.opt("activeTimetable");

		if (!TodayWidgetData.isFresh(snapshot, todayIso)) {
			showEmpty(views, context, R.string.widget_sync_needed);
		} else if (activeValue == JSONObject.NULL) {
			TodayWidgetData.setHeader(views, context, todayIso, 0, 0, false);
			showEmpty(views, context, R.string.widget_no_timetable);
		} else if (!(activeValue instanceof JSONObject)) {
			showEmpty(views, context, R.string.widget_sync_needed);
		} else {
			JSONObject day = snapshot.optJSONObject("days").optJSONObject(todayIso);
			JSONArray courses = day.optJSONArray("courses");
			int totalCourses = courses == null ? 0 : courses.length();
			List<TodayWidgetData.CourseItem> items = TodayWidgetData.buildCourses(snapshot, todayIso, Calendar.getInstance());
			TodayWidgetData.setHeader(
				views,
				context,
				todayIso,
				totalCourses,
				day.optInt("academicWeek", 0),
				showWeek
			);
			if (courses == null || courses.length() == 0 || items.isEmpty()) {
				showEmpty(
					views,
					context,
					courses != null && courses.length() > 0 && items.isEmpty()
						? R.string.widget_all_done
						: R.string.widget_no_classes
				);
			} else {
				views.setViewVisibility(R.id.widget_empty, View.GONE);
				views.setViewVisibility(R.id.widget_course_list, View.VISIBLE);

				if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
					RemoteViews.RemoteCollectionItems.Builder collection =
						new RemoteViews.RemoteCollectionItems.Builder().setHasStableIds(true).setViewTypeCount(1);
					for (TodayWidgetData.CourseItem course : items) {
						collection.addItem(
							course.id.hashCode(),
							TodayWidgetData.createCourseRow(context, course)
						);
					}
					views.setRemoteAdapter(R.id.widget_course_list, collection.build());
				} else {
					Intent serviceIntent = new Intent(context, TodayWidgetRemoteViewsService.class);
					serviceIntent.putExtra(AppWidgetManager.EXTRA_APPWIDGET_ID, appWidgetId);
					serviceIntent.setData(Uri.parse("chronos-widget://today/" + appWidgetId));
					views.setRemoteAdapter(R.id.widget_course_list, serviceIntent);
				}
				views.setPendingIntentTemplate(R.id.widget_course_list, createOpenTodayIntent(context));
			}
		}

		views.setOnClickPendingIntent(R.id.widget_root, createOpenTodayIntent(context));
		manager.updateAppWidget(appWidgetId, views);
		if (Build.VERSION.SDK_INT < Build.VERSION_CODES.S) {
			manager.notifyAppWidgetViewDataChanged(appWidgetId, R.id.widget_course_list);
		}
	}

	private static RemoteViews createBaseViews(Context context, String todayIso) {
		RemoteViews views = new RemoteViews(context.getPackageName(), R.layout.widget_today_expanded);
		views.setTextViewText(R.id.widget_title, TodayWidgetData.formatHeaderDate(todayIso));
		views.setTextViewText(R.id.widget_empty, context.getString(R.string.widget_no_classes));
		views.setEmptyView(R.id.widget_course_list, R.id.widget_empty);
		views.setViewVisibility(R.id.widget_course_list, View.GONE);
		views.setViewVisibility(R.id.widget_empty, View.GONE);
		views.setViewVisibility(R.id.widget_subtitle, View.GONE);
		return views;
	}

	private static void showEmpty(RemoteViews views, Context context, int messageId) {
		views.setViewVisibility(R.id.widget_course_list, View.GONE);
		views.setViewVisibility(R.id.widget_empty, View.VISIBLE);
		views.setTextViewText(R.id.widget_empty, context.getString(messageId));
	}

	private static PendingIntent createOpenTodayIntent(Context context) {
		Intent intent = new Intent(context, MainActivity.class)
			.setAction(Intent.ACTION_VIEW)
			.setData(Uri.parse("chronos://today"))
			.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP | Intent.FLAG_ACTIVITY_SINGLE_TOP);
		return PendingIntent.getActivity(
			context,
			0x434852,
			intent,
			PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE
		);
	}
}
