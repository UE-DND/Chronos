package com.chronos.mobile.core.model

data class TimetableSummary(
    val id: String,
    val name: String,
    val courseCount: Int,
    val createdAt: Long,
    val updatedAt: Long,
)

data class AppState(
    val timetables: List<TimetableSummary> = emptyList(),
    val currentTimetableId: String? = null,
    val wallpaperUri: String? = null,
    val currentTimetable: Timetable? = null,
)
