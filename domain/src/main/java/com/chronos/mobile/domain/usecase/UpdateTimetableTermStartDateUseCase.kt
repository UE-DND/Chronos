package com.chronos.mobile.domain.usecase

import com.chronos.mobile.domain.TimetableRepository
import java.time.LocalDate
import javax.inject.Inject

class UpdateTimetableTermStartDateUseCase @Inject constructor(
    private val repository: TimetableRepository,
) {
    suspend operator fun invoke(timetableId: String, termStartDate: LocalDate) {
        val timetable = repository.getTimetable(timetableId) ?: return
        repository.saveTimetable(
            timetable.copy(
                updatedAt = System.currentTimeMillis(),
                details = timetable.details.copy(termStartDate = termStartDate.toString()),
            )
        )
    }
}