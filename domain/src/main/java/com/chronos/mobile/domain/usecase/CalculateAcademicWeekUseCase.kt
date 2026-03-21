package com.chronos.mobile.domain.usecase

import com.chronos.mobile.core.model.TimetableDetails
import com.chronos.mobile.core.model.parseTermStartDateOrCurrentWeekMonday
import java.time.LocalDate
import java.time.temporal.ChronoUnit
import javax.inject.Inject

class CalculateAcademicWeekUseCase @Inject constructor() {
    operator fun invoke(today: LocalDate, details: TimetableDetails?): Int {
        val configured = details ?: TimetableDetails()
        val termStart = parseTermStartDateOrCurrentWeekMonday(configured.termStartDate, today)
        if (today.isBefore(termStart)) {
            return configured.startWeek
        }
        val weeks = ChronoUnit.WEEKS.between(termStart, today).toInt()
        return (configured.startWeek + weeks).coerceIn(configured.startWeek, configured.endWeek)
    }
}
