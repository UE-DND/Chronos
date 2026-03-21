package com.chronos.mobile.domain.usecase

import com.chronos.mobile.core.model.Timetable
import com.chronos.mobile.core.model.TimetableDetails
import com.chronos.mobile.core.model.currentWeekMonday
import com.chronos.mobile.domain.TimetableRepository
import java.util.UUID
import javax.inject.Inject

class CreateTimetableUseCase @Inject constructor(
    private val repository: TimetableRepository,
) {
    suspend operator fun invoke(name: String) {
        val now = System.currentTimeMillis()
        val timetable = Timetable(
            id = UUID.randomUUID().toString(),
            name = name.trim().ifBlank { "未命名课表" },
            courses = emptyList(),
            createdAt = now,
            updatedAt = now,
            details = TimetableDetails(
                termStartDate = currentWeekMonday().toString(),
            ),
        )
        repository.saveTimetable(timetable)
        repository.setCurrentTimetableId(timetable.id)
    }
}
