@file:OptIn(kotlinx.serialization.InternalSerializationApi::class)

package com.chronos.mobile.core.model

import kotlinx.serialization.Serializable

@Serializable
data class PeriodTime(
    val index: Int,
    val startTime: String,
    val endTime: String,
)

@Serializable
data class TimetableDetails(
    val termStartDate: String = DEFAULT_TERM_START_DATE,
    val startWeek: Int = 1,
    val endWeek: Int = 20,
    val showSaturday: Boolean = true,
    val showSunday: Boolean = true,
    val showNonCurrentWeekCourses: Boolean = false,
    val periodTimes: List<PeriodTime> = defaultPeriodTimes(),
)

@Serializable
data class Timetable(
    val id: String,
    val name: String,
    val courses: List<Course>,
    val createdAt: Long,
    val updatedAt: Long,
    val details: TimetableDetails = TimetableDetails(),
)

const val DEFAULT_TERM_START_DATE: String = "2026-03-02"

fun defaultPeriodTimes(): List<PeriodTime> = listOf(
    PeriodTime(index = 1, startTime = "08:30", endTime = "09:15"),
    PeriodTime(index = 2, startTime = "09:25", endTime = "10:10"),
    PeriodTime(index = 3, startTime = "10:30", endTime = "11:15"),
    PeriodTime(index = 4, startTime = "11:25", endTime = "12:10"),
    PeriodTime(index = 5, startTime = "14:20", endTime = "15:05"),
    PeriodTime(index = 6, startTime = "15:15", endTime = "16:00"),
    PeriodTime(index = 7, startTime = "16:20", endTime = "17:05"),
    PeriodTime(index = 8, startTime = "17:15", endTime = "18:00"),
    PeriodTime(index = 9, startTime = "19:00", endTime = "19:45"),
    PeriodTime(index = 10, startTime = "19:50", endTime = "20:35"),
)
