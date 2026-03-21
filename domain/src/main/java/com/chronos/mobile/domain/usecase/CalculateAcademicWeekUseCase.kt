package com.chronos.mobile.domain.usecase

import com.chronos.mobile.domain.AcademicCalendarService
import com.chronos.mobile.core.model.TimetableDetails
import java.time.LocalDate
import javax.inject.Inject

class CalculateAcademicWeekUseCase @Inject constructor(
    private val academicCalendarService: AcademicCalendarService,
) {
    constructor() : this(AcademicCalendarService())

    operator fun invoke(today: LocalDate, details: TimetableDetails?): Int =
        academicCalendarService.calculateAcademicWeek(today, details)
}
