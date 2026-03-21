package com.chronos.mobile.domain.usecase

import com.chronos.mobile.core.model.Timetable
import com.chronos.mobile.core.model.TimetableDetails
import com.chronos.mobile.domain.AcademicCalendarService
import java.time.LocalDate
import com.chronos.mobile.domain.TimetableRepository
import java.util.UUID
import javax.inject.Inject

class CreateTimetableUseCase @Inject constructor(
    private val repository: TimetableRepository,
    private val academicCalendarService: AcademicCalendarService,
) {
    constructor(repository: TimetableRepository) : this(repository, AcademicCalendarService())

    suspend operator fun invoke(name: String) {
        val now = System.currentTimeMillis()
        val timetable = Timetable(
            id = UUID.randomUUID().toString(),
            name = name.trim().ifBlank { "未命名课表" },
            courses = emptyList(),
            createdAt = now,
            updatedAt = now,
            details = TimetableDetails(
                termStartDate = academicCalendarService
                    .normalizeTermStartDate("", LocalDate.now())
                    .toString(),
            ),
        )
        repository.saveTimetable(timetable)
        repository.setCurrentTimetableId(timetable.id)
    }
}
