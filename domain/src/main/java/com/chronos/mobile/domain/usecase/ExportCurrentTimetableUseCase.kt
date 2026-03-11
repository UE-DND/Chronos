package com.chronos.mobile.domain.usecase

import com.chronos.mobile.domain.TimetableRepository
import javax.inject.Inject

class ExportCurrentTimetableUseCase @Inject constructor(
    private val repository: TimetableRepository,
) {
    suspend operator fun invoke(): String? {
        val timetable = repository.getAppStateSnapshot().currentTimetable ?: return null
        return repository.encodeTimetable(timetable)
    }
}
