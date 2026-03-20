package com.chronos.mobile.domain.usecase

import com.chronos.mobile.core.model.Timetable
import com.chronos.mobile.domain.OnlineScheduleJsonCodec
import com.chronos.mobile.domain.result.AppResult
import com.chronos.mobile.domain.result.flatMap
import javax.inject.Inject

class PreviewImportedTimetableUseCase @Inject constructor(
    private val parseEducationalTimetableHtml: ParseEducationalTimetableHtmlUseCase,
    private val onlineScheduleJsonCodec: OnlineScheduleJsonCodec,
) {
    operator fun invoke(content: String): AppResult<Timetable> =
        parseEducationalTimetableHtml(content).flatMap { timetable ->
            timetable?.let { AppResult.Success(it) }
                ?: onlineScheduleJsonCodec.decode(content).flatMap(onlineScheduleJsonCodec::toTimetable)
        }
}
