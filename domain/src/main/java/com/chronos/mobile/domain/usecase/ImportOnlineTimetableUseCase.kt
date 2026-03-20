package com.chronos.mobile.domain.usecase

import com.chronos.mobile.domain.ImportMode
import com.chronos.mobile.domain.OnlineScheduleRepository
import com.chronos.mobile.domain.model.AuthSnapshot
import com.chronos.mobile.domain.result.AppResult
import com.chronos.mobile.domain.result.flatMap
import javax.inject.Inject

class ImportOnlineTimetableUseCase @Inject constructor(
    private val onlineScheduleRepository: OnlineScheduleRepository,
    private val importTimetableUseCase: ImportTimetableUseCase,
) {
    suspend operator fun invoke(
        authSnapshot: AuthSnapshot,
        mode: ImportMode,
    ): AppResult<ImportTimetableResult> =
        onlineScheduleRepository.fetchSchedule(authSnapshot)
            .flatMap { payload -> importTimetableUseCase.importOnlinePayload(payload, mode) }
}
