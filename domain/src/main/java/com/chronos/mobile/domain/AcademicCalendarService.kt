package com.chronos.mobile.domain

import com.chronos.mobile.core.model.TimetableDetails
import com.chronos.mobile.core.model.currentWeekMonday
import java.time.DayOfWeek
import java.time.LocalDate
import java.time.temporal.ChronoUnit
import java.time.temporal.TemporalAdjusters
import javax.inject.Inject

class AcademicCalendarService @Inject constructor() {
    fun normalizeTermStartDate(raw: String, referenceDate: LocalDate): LocalDate = runCatching {
        LocalDate.parse(raw.trim())
    }.getOrElse {
        currentWeekMonday(referenceDate)
    }.with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY))

    fun calculateAcademicWeek(today: LocalDate, details: TimetableDetails?): Int {
        val configured = details ?: TimetableDetails()
        val termStart = normalizeTermStartDate(configured.termStartDate, today)
        if (today.isBefore(termStart)) {
            return configured.startWeek
        }
        val weeks = ChronoUnit.WEEKS.between(termStart, today).toInt()
        return (configured.startWeek + weeks).coerceIn(configured.startWeek, configured.endWeek)
    }

    fun resolveWeekStart(
        details: TimetableDetails,
        week: Int,
        referenceDate: LocalDate,
    ): LocalDate {
        val termStart = normalizeTermStartDate(details.termStartDate, referenceDate)
        return termStart.plusWeeks((week - details.startWeek).toLong())
    }

    fun resolveCourseDate(
        details: TimetableDetails,
        week: Int,
        dayOfWeek: Int,
        referenceDate: LocalDate,
    ): LocalDate = resolveWeekStart(details, week, referenceDate)
        .plusDays((dayOfWeek - 1).toLong())
}
