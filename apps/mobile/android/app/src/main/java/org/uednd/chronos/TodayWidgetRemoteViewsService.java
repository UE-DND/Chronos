package org.uednd.chronos;

import android.content.Context;
import android.content.Intent;
import android.widget.RemoteViews;
import android.widget.RemoteViewsService;
import java.util.Calendar;
import java.util.Collections;
import java.util.List;
import org.json.JSONObject;

public class TodayWidgetRemoteViewsService extends RemoteViewsService {
	@Override
	public RemoteViewsFactory onGetViewFactory(Intent intent) {
		return new TodayWidgetViewsFactory(getApplicationContext());
	}

	private static final class TodayWidgetViewsFactory implements RemoteViewsFactory {
		private final Context context;
		private List<TodayWidgetData.CourseItem> courses = Collections.emptyList();

		TodayWidgetViewsFactory(Context context) {
			this.context = context;
		}

		@Override
		public void onCreate() {
			loadCourses();
		}

		@Override
		public void onDataSetChanged() {
			loadCourses();
		}

		private void loadCourses() {
			String todayIso = TodayWidgetData.formatTodayIso();
			JSONObject snapshot = TodayWidgetData.readSnapshot(context);
			courses = TodayWidgetData.isFresh(snapshot, todayIso)
				? TodayWidgetData.buildCourses(snapshot, todayIso, Calendar.getInstance())
				: Collections.emptyList();
		}

		@Override
		public void onDestroy() {
			courses = Collections.emptyList();
		}

		@Override
		public int getCount() {
			return courses.size();
		}

		@Override
		public RemoteViews getViewAt(int position) {
			if (position < 0 || position >= courses.size()) return null;
			TodayWidgetData.CourseItem course = courses.get(position);
			return TodayWidgetData.createCourseRow(context, course);
		}

		@Override
		public RemoteViews getLoadingView() {
			return null;
		}

		@Override
		public int getViewTypeCount() {
			return 1;
		}

		@Override
		public long getItemId(int position) {
			return courses.get(position).id.hashCode();
		}

		@Override
		public boolean hasStableIds() {
			return true;
		}
	}
}
