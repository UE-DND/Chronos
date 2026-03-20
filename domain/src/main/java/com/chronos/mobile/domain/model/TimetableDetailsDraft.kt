package com.chronos.mobile.domain.model

import com.chronos.mobile.core.model.TimetableImportSource

data class PeriodTimeDraft(
    val index: Int,
    val startTime: String,
    val endTime: String,
)

data class TimetableDetailsDraft(
    val name: String = "",
    val termStartDate: String = "",
    val startWeek: Int = 1,
    val endWeek: Int = 20,
    val showSaturday: Boolean = true,
    val showSunday: Boolean = true,
    val showNonCurrentWeekCourses: Boolean = false,
    val importSource: TimetableImportSource = TimetableImportSource.UNKNOWN,
    val periodTimes: List<PeriodTimeDraft> = emptyList(),
)
