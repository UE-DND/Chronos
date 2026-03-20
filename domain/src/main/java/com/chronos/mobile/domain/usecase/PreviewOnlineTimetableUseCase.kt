package com.chronos.mobile.domain.usecase

import com.chronos.mobile.core.model.Timetable
import com.chronos.mobile.domain.OnlineScheduleJsonCodec
import com.chronos.mobile.domain.OnlineScheduleRepository
import com.chronos.mobile.domain.model.AuthSnapshot
import com.chronos.mobile.domain.result.AppResult
import com.chronos.mobile.domain.result.flatMap
import javax.inject.Inject

class PreviewOnlineTimetableUseCase @Inject constructor(
    private val onlineScheduleRepository: OnlineScheduleRepository,
    private val onlineScheduleJsonCodec: OnlineScheduleJsonCodec,
) {
    suspend operator fun invoke(authSnapshot: AuthSnapshot): AppResult<Timetable> =
        onlineScheduleRepository.fetchSchedule(authSnapshot).flatMap(onlineScheduleJsonCodec::toTimetable)
}
