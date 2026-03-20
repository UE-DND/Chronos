package com.chronos.mobile.data.remote

import com.chronos.mobile.core.model.Course
import com.chronos.mobile.core.model.OnlineScheduleEvent
import com.chronos.mobile.core.model.OnlineSchedulePayload
import com.chronos.mobile.core.model.OnlineScheduleWeekDay
import com.chronos.mobile.core.model.Timetable
import com.chronos.mobile.core.model.TimetableDetails
import com.chronos.mobile.core.model.TimetableImportSource
import com.chronos.mobile.domain.OnlineScheduleJsonCodec
import com.chronos.mobile.domain.result.AppError
import com.chronos.mobile.domain.result.AppResult
import com.chronos.mobile.domain.result.appResultOf
import com.chronos.mobile.domain.result.asFailure
import com.chronos.mobile.domain.result.asSuccess
import com.chronos.mobile.domain.usecase.CalculateAcademicWeekUseCase
import java.time.DayOfWeek
import java.time.LocalDate
import java.time.format.DateTimeFormatter
import java.time.temporal.TemporalAdjusters
import javax.inject.Inject
import kotlinx.serialization.json.Json

class DefaultOnlineScheduleJsonCodec @Inject constructor(
    private val calculateAcademicWeekUseCase: CalculateAcademicWeekUseCase,
) : OnlineScheduleJsonCodec {
    private val json = Json {
        encodeDefaults = true
        ignoreUnknownKeys = true
        prettyPrint = true
    }

    override fun decode(json: String): AppResult<OnlineSchedulePayload> = appResultOf(
        errorMapper = { AppError.DataFormat("在线课表 JSON 解析失败") },
    ) {
        this.json.decodeFromString(OnlineSchedulePayload.serializer(), json)
    }

    override fun encode(timetable: Timetable): AppResult<String> = appResultOf(
        errorMapper = { AppError.DataFormat("课表导出失败") },
    ) {
        json.encodeToString(OnlineSchedulePayload.serializer(), timetable.toOnlinePayload())
    }

    override fun toTimetable(payload: OnlineSchedulePayload): AppResult<Timetable> {
        val courses = payload.eventList.mapIndexedNotNull { index, event ->
            event.toCourseOrNull(index)
        }
        if (courses.isEmpty()) {
            return AppError.Validation("JSON 中未找到可导入的课程数据").asFailure()
        }
        val now = System.currentTimeMillis()
        val maxWeek = (payload.weekList.mapNotNull(String::toIntOrNull).maxOrNull()
            ?: courses.flatMap { it.weeks }.maxOrNull()
            ?: 20).coerceAtLeast(20)
        return Timetable(
            id = "online-import",
            name = payload.yearTerm.ifBlank { "在线课表" },
            courses = courses.sortedWith(compareBy<Course> { it.dayOfWeek }.thenBy { it.startPeriod }.thenBy { it.name }),
            createdAt = now,
            updatedAt = now,
            details = TimetableDetails(
                endWeek = maxWeek,
                showSaturday = courses.any { it.dayOfWeek == 6 },
                showSunday = courses.any { it.dayOfWeek == 7 },
                importSource = payload.importSource
                    .toTimetableImportSourceOrNull()
                    ?: TimetableImportSource.SHARED_JSON,
            ),
        ).asSuccess()
    }

    private fun Timetable.toOnlinePayload(): OnlineSchedulePayload {
        val details = details
        val today = LocalDate.now()
        val weekNum = calculateAcademicWeekUseCase(today, details).toString()
        val weekList = (details.startWeek..details.endWeek).map(Int::toString)
        return OnlineSchedulePayload(
            yearTerm = name,
            weekNum = weekNum,
            nowMonth = resolveWeekStart(today, details).monthValue.toString(),
            importSource = TimetableImportSource.SHARED_JSON.name,
            yearTermList = listOf(name),
            weekList = weekList,
            weekDayList = buildWeekDayList(today, details),
            eventList = courses.map { it.toOnlineEvent(weekNum) },
        )
    }

    private fun buildWeekDayList(
        referenceDate: LocalDate,
        details: TimetableDetails,
    ): List<OnlineScheduleWeekDay> {
        val weekStart = resolveWeekStart(referenceDate, details)
        val formatter = DateTimeFormatter.ofPattern("MM/dd")
        return (0..6).map { offset ->
            val date = weekStart.plusDays(offset.toLong())
            OnlineScheduleWeekDay(
                weekDay = when (offset) {
                    0 -> "一"
                    1 -> "二"
                    2 -> "三"
                    3 -> "四"
                    4 -> "五"
                    5 -> "六"
                    else -> "日"
                },
                weekDate = date.format(formatter),
                today = date == referenceDate,
            )
        }
    }

    private fun resolveWeekStart(
        referenceDate: LocalDate,
        details: TimetableDetails,
    ): LocalDate {
        val termStart = runCatching { LocalDate.parse(details.termStartDate) }.getOrElse {
            referenceDate.with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY))
        }
        val weekNum = calculateAcademicWeekUseCase(referenceDate, details)
        return termStart.plusWeeks((weekNum - details.startWeek).toLong())
    }

    private fun OnlineScheduleEvent.toCourseOrNull(index: Int): Course? {
        val normalizedName = eventName.normalizedCourseName()
        val dayOfWeekValue = weekDay.trim().toIntOrNull()
        val startPeriodValue = sessionStart.trim().toIntOrNull()
        val durationValue = sessionLast.trim().toIntOrNull()
        if (normalizedName.isEmpty() || dayOfWeekValue == null || startPeriodValue == null) {
            return null
        }
        val weeks = weekList.mapNotNull(String::toIntOrNull).distinct().sorted()
        val (background, foreground) = coursePalette(normalizedName)
        val endPeriodValue = sessionList
            .mapNotNull { it.trim().toIntOrNull() }
            .maxOrNull()
            ?: durationValue?.takeIf { it > 0 }?.let { startPeriodValue + it - 1 }
            ?: startPeriodValue
        return Course(
            id = eventID.ifBlank { "online-event-${index + 1}" },
            name = normalizedName,
            teacher = memberName.trim(),
            location = address.trim(),
            dayOfWeek = dayOfWeekValue,
            startPeriod = startPeriodValue,
            endPeriod = endPeriodValue.coerceAtLeast(startPeriodValue),
            color = background,
            textColor = foreground,
            weeks = weeks,
        )
    }

    private fun Course.toOnlineEvent(currentWeekNum: String): OnlineScheduleEvent {
        val resolvedWeeks = weeks.distinct().sorted().ifEmpty { listOf(currentWeekNum.toIntOrNull() ?: 1) }
        val resolvedSessions = (startPeriod..endPeriod).map(Int::toString)
        return OnlineScheduleEvent(
            weekNum = currentWeekNum,
            weekDay = dayOfWeek.toString(),
            weekList = resolvedWeeks.map(Int::toString),
            weekCover = compressWeeks(resolvedWeeks),
            sessionList = resolvedSessions,
            sessionStart = startPeriod.toString(),
            sessionLast = (endPeriod - startPeriod + 1).toString(),
            eventName = name,
            address = location,
            memberName = teacher,
            duplicateGroupType = "0",
            duplicateGroup = 0,
            eventType = "1",
            eventID = id,
        )
    }

    private fun compressWeeks(weeks: List<Int>): String {
        if (weeks.isEmpty()) return ""
        val ranges = mutableListOf<String>()
        var start = weeks.first()
        var end = start
        for (week in weeks.drop(1)) {
            if (week == end + 1) {
                end = week
            } else {
                ranges += if (start == end) "${start}周" else "${start}-${end}周"
                start = week
                end = week
            }
        }
        ranges += if (start == end) "${start}周" else "${start}-${end}周"
        return ranges.joinToString(",")
    }

    private fun coursePalette(name: String): Pair<String, String> {
        return COURSE_PALETTE[name.hashCode().mod(COURSE_PALETTE.size)]
    }

    private fun String.normalizedCourseName(): String =
        removePrefix("【调】")
            .removeSuffix("★")
            .removeSuffix("☆")
            .removeSuffix("〇")
            .removeSuffix("■")
            .removeSuffix("◆")
            .trim()

    private fun String.toTimetableImportSourceOrNull(): TimetableImportSource? =
        runCatching { TimetableImportSource.valueOf(trim()) }.getOrNull()

    private companion object {
        val COURSE_PALETTE = listOf(
            "#EADDFF" to "#21005D",
            "#FFDBC9" to "#311100",
            "#C4EED0" to "#072711",
            "#F9DEDC" to "#410E0B",
            "#D3E3FD" to "#041E49",
            "#FFD8E4" to "#31111D",
        )
    }
}
