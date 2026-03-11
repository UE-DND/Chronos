package com.chronos.mobile.domain.model

import com.chronos.mobile.core.model.PeriodTime
import java.time.LocalDate

data class TimetableDayModel(
    val dayOfWeek: Int,
    val shortLabel: String,
    val date: LocalDate,
    val isToday: Boolean,
)

data class TimetableGridModel(
    val monthLabel: String,
    val visibleDays: List<TimetableDayModel>,
    val periods: List<PeriodTime>,
    val displayedPeriodCount: Int,
)
