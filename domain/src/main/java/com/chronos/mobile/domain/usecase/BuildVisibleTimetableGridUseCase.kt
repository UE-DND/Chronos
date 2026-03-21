package com.chronos.mobile.domain.usecase

import com.chronos.mobile.core.model.PeriodTime
import com.chronos.mobile.core.model.Timetable
import com.chronos.mobile.core.model.TimetableDetails
import com.chronos.mobile.core.model.defaultPeriodTimes
import com.chronos.mobile.domain.AcademicCalendarService
import com.chronos.mobile.domain.model.TimetableDayModel
import com.chronos.mobile.domain.model.TimetableGridModel
import java.time.LocalDate
import javax.inject.Inject

class BuildVisibleTimetableGridUseCase @Inject constructor(
    private val academicCalendarService: AcademicCalendarService,
) {
    constructor() : this(AcademicCalendarService())

    operator fun invoke(today: LocalDate, displayedWeek: Int, timetable: Timetable): TimetableGridModel {
        val visibleDays = buildVisibleDayIndices(timetable.details)
        val startOfWeek = academicCalendarService.resolveWeekStart(timetable.details, displayedWeek, today)
        val weekDays = visibleDays.map { dayIndex ->
            val date = startOfWeek.plusDays((dayIndex - 1).toLong())
            TimetableDayModel(
                dayOfWeek = dayIndex,
                date = date,
                isToday = date == today,
            )
        }
        val displayedPeriodCount = maxOf(
            10,
            timetable.details.periodTimes.size,
            timetable.courses.maxOfOrNull { it.endPeriod } ?: 0,
        )
        return TimetableGridModel(
            monthLabel = weekMonthLabel(weekDays.map { it.date }),
            visibleDays = weekDays.toList(),
            periods = buildDisplayPeriods(timetable.details, displayedPeriodCount).toList(),
            displayedPeriodCount = displayedPeriodCount,
        )
    }

    private fun buildDisplayPeriods(details: TimetableDetails, count: Int): List<PeriodTime> {
        val configured = details.periodTimes
            .sortedBy { it.index }
            .associateBy { it.index }
        return (1..count).map { index ->
            configured[index]
                ?: defaultPeriodTimes().getOrNull(index - 1)
                ?: PeriodTime(index = index, startTime = "--:--", endTime = "--:--")
        }
    }

    private fun buildVisibleDayIndices(details: TimetableDetails): List<Int> = buildList {
        addAll(1..5)
        if (details.showSaturday) add(6)
        if (details.showSunday) add(7)
    }

    private fun weekMonthLabel(weekDates: List<LocalDate>): String {
        val firstMonth = weekDates.firstOrNull()?.monthValue ?: return ""
        val lastMonth = weekDates.lastOrNull()?.monthValue ?: return firstMonth.toString()
        return if (firstMonth == lastMonth) {
            firstMonth.toString()
        } else {
            "$firstMonth/$lastMonth"
        }
    }
}
