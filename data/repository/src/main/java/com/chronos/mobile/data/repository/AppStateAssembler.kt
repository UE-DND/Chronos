package com.chronos.mobile.data.repository

import com.chronos.mobile.core.model.AppState
import com.chronos.mobile.core.model.Course
import com.chronos.mobile.core.model.Timetable
import com.chronos.mobile.core.model.TimetableDetails
import com.chronos.mobile.core.model.TimetableSummary
import com.chronos.mobile.data.preferences.UserPreferenceState
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class AppStateAssembler @Inject constructor() {
    fun resolveCurrentTimetableId(
        timetables: List<TimetableSummary>,
        preferences: UserPreferenceState,
    ): String? = preferences.currentTimetableId
        ?.takeIf { id -> timetables.any { it.id == id } }
        ?: timetables.firstOrNull()?.id

    fun assemble(
        timetables: List<TimetableSummary>,
        preferences: UserPreferenceState,
        currentTimetableId: String?,
        currentTimetable: Timetable?,
    ): AppState = AppState(
        timetables = timetables.toList(),
        currentTimetableId = currentTimetableId,
        wallpaperUri = preferences.wallpaperUri,
        currentTimetable = currentTimetable?.copyForStateBoundary(),
        themeMode = preferences.themeMode,
        useDynamicColor = preferences.useDynamicColor,
    )
}

private fun Timetable.copyForStateBoundary(): Timetable = copy(
    courses = courses.map(Course::copyForStateBoundary).toList(),
    details = details.copyForStateBoundary(),
)

private fun Course.copyForStateBoundary(): Course = copy(
    weeks = weeks.toList(),
)

private fun TimetableDetails.copyForStateBoundary(): TimetableDetails = copy(
    periodTimes = periodTimes.toList(),
)
