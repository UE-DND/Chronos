package com.chronos.mobile.domain.usecase

import com.chronos.mobile.domain.OnlineScheduleJsonCodec
import com.chronos.mobile.domain.TimetableRepository
import com.chronos.mobile.domain.result.AppResult
import com.chronos.mobile.domain.result.asSuccess
import javax.inject.Inject

class ExportCurrentTimetableUseCase @Inject constructor(
    private val repository: TimetableRepository,
    private val onlineScheduleJsonCodec: OnlineScheduleJsonCodec,
) {
    suspend operator fun invoke(): AppResult<String?> {
        val timetable = repository.getAppStateSnapshot().currentTimetable ?: return null.asSuccess()
        return onlineScheduleJsonCodec.encode(timetable)
    }
}
