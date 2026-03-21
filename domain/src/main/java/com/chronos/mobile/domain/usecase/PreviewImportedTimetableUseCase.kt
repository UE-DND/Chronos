package com.chronos.mobile.domain.usecase

import com.chronos.mobile.core.model.Timetable
import com.chronos.mobile.domain.OnlineScheduleJsonCodec
import com.chronos.mobile.domain.result.AppError
import com.chronos.mobile.domain.result.AppResult
import com.chronos.mobile.domain.result.asFailure
import com.chronos.mobile.domain.result.flatMap
import javax.inject.Inject

class PreviewImportedTimetableUseCase @Inject constructor(
    private val parseEducationalTimetableHtml: ParseEducationalTimetableHtmlUseCase,
    private val onlineScheduleJsonCodec: OnlineScheduleJsonCodec,
) {
    fun previewHtml(contentBytes: ByteArray): AppResult<Timetable> =
        parseEducationalTimetableHtml(contentBytes).flatMap { timetable ->
            timetable?.let { AppResult.Success(it) }
                ?: AppError.Validation("导入失败，未识别到可用的教务课表 HTML 内容").asFailure()
        }

    operator fun invoke(content: String): AppResult<Timetable> =
        parseEducationalTimetableHtml(content).flatMap { timetable ->
            timetable?.let { AppResult.Success(it) }
                ?: onlineScheduleJsonCodec.decode(content).flatMap(onlineScheduleJsonCodec::toTimetable)
        }
}
