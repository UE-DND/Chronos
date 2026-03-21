package com.chronos.mobile.data.remote

import com.chronos.mobile.core.model.Course
import com.chronos.mobile.core.model.OnlineScheduleEvent
import com.chronos.mobile.core.model.OnlineSchedulePayload
import com.chronos.mobile.core.model.OnlineScheduleWeekDay
import com.chronos.mobile.core.model.Timetable
import com.chronos.mobile.core.model.TimetableDetails
import com.chronos.mobile.core.model.TimetableImportSource
import com.chronos.mobile.core.model.currentWeekMonday
import com.chronos.mobile.core.model.parseTermStartDateOrCurrentWeekMonday
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
import java.time.temporal.ChronoUnit
import java.time.temporal.TemporalAdjusters
import javax.inject.Inject
import kotlinx.serialization.json.Json
import kotlin.math.abs

class DefaultOnlineScheduleJsonCodec @Inject constructor(
    private val calculateAcademicWeekUseCase: CalculateAcademicWeekUseCase,
) : OnlineScheduleJsonCodec {
    private val json = Json {
        encodeDefaults = true
        explicitNulls = false
        ignoreUnknownKeys = true
        prettyPrint = false
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
        val today = LocalDate.now()
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
                termStartDate = resolveImportedTermStartDate(payload, today),
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
        val importSource = details.importSource
        return OnlineSchedulePayload(
            yearTerm = name,
            weekNum = weekNum,
            nowMonth = resolveWeekStart(today, details).monthValue.toString(),
            importSource = importSource.name,
            termStartDate = exportTermStartDate(importSource, details),
            yearTermList = listOf(name),
            weekList = weekList,
            weekDayList = buildWeekDayList(today, details),
            eventList = courses.map { it.toOnlineEvent(weekNum) },
        )
    }

    private fun exportTermStartDate(
        importSource: TimetableImportSource,
        details: TimetableDetails,
    ): String? = when (importSource) {
        TimetableImportSource.ONLINE_EDU -> null
        TimetableImportSource.FILE_HTML,
        TimetableImportSource.SHARED_JSON,
        TimetableImportSource.UNKNOWN
        -> details.termStartDate.trim().ifBlank { null }
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
        val termStart = parseTermStartDateOrCurrentWeekMonday(details.termStartDate, referenceDate)
        val weekNum = calculateAcademicWeekUseCase(referenceDate, details)
        return termStart.plusWeeks((weekNum - details.startWeek).toLong())
    }

    private fun resolveImportedTermStartDate(
        payload: OnlineSchedulePayload,
        referenceDate: LocalDate,
    ): String {
        val inferred = when (payload.importSource.toTimetableImportSourceOrNull()) {
            TimetableImportSource.ONLINE_EDU -> inferImportedTermStartDate(payload, referenceDate)
            else -> payload.termStartDate
                ?.trim()
                ?.takeIf(String::isNotBlank)
                ?.let(::parseImportedTermStartDate)
                ?: inferImportedTermStartDate(payload, referenceDate)
        }
        return (inferred ?: currentWeekMonday(referenceDate)).toString()
    }

    private fun parseImportedTermStartDate(value: String): LocalDate? =
        runCatching { LocalDate.parse(value) }.getOrNull()

    private fun inferImportedTermStartDate(
        payload: OnlineSchedulePayload,
        referenceDate: LocalDate,
    ): LocalDate? {
        val currentWeek = payload.weekNum.trim().toIntOrNull()?.takeIf { it > 0 } ?: return null
        val weekDays = payload.weekDayList.mapNotNull { it.toImportWeekDayInfo() }
        val anchor = weekDays.firstOrNull { it.dayOfWeek == 1 } ?: weekDays.firstOrNull() ?: return null
        val anchorYear = inferImportWeekDateYear(
            month = anchor.month,
            day = anchor.day,
            yearTerm = payload.yearTerm,
            referenceDate = referenceDate,
        ) ?: return null
        val anchorDate = runCatching { LocalDate.of(anchorYear, anchor.month, anchor.day) }.getOrNull() ?: return null
        val weekStart = anchorDate.minusDays((anchor.dayOfWeek - 1).toLong())
        return weekStart
            .minusWeeks((currentWeek - 1).toLong())
            .with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY))
    }

    private fun OnlineScheduleWeekDay.toImportWeekDayInfo(): ImportWeekDayInfo? {
        val dayOfWeek = weekDay.toImportDayOfWeekOrNull() ?: return null
        val (month, day) = weekDate.toImportMonthDayOrNull() ?: return null
        return ImportWeekDayInfo(dayOfWeek = dayOfWeek, month = month, day = day)
    }

    private fun inferImportWeekDateYear(
        month: Int,
        day: Int,
        yearTerm: String,
        referenceDate: LocalDate,
    ): Int? {
        parseAcademicYears(yearTerm)?.let { (firstYear, secondYear) ->
            val primaryYear = if (month in 8..12) firstYear else secondYear
            if (isValidDate(primaryYear, month, day)) return primaryYear

            val secondaryYear = if (primaryYear == firstYear) secondYear else firstYear
            if (isValidDate(secondaryYear, month, day)) return secondaryYear
        }

        return listOf(
            referenceDate.year - 1,
            referenceDate.year,
            referenceDate.year + 1,
        ).mapNotNull { year ->
            runCatching { LocalDate.of(year, month, day) }.getOrNull()
        }.minByOrNull { candidate ->
            abs(ChronoUnit.DAYS.between(referenceDate, candidate))
        }?.year
    }

    private fun parseAcademicYears(yearTerm: String): Pair<Int, Int>? {
        val match = ACADEMIC_YEAR_PATTERN.find(yearTerm) ?: return null
        val firstYear = match.groupValues.getOrNull(1)?.toIntOrNull() ?: return null
        val secondYear = match.groupValues.getOrNull(2)?.toIntOrNull() ?: return null
        return firstYear to secondYear
    }

    private fun isValidDate(year: Int, month: Int, day: Int): Boolean = runCatching {
        LocalDate.of(year, month, day)
    }.isSuccess

    private fun String.toImportDayOfWeekOrNull(): Int? = when (trim().lowercase()) {
        "1", "一", "周一", "星期一", "mon", "monday" -> 1
        "2", "二", "周二", "星期二", "tue", "tuesday" -> 2
        "3", "三", "周三", "星期三", "wed", "wednesday" -> 3
        "4", "四", "周四", "星期四", "thu", "thursday" -> 4
        "5", "五", "周五", "星期五", "fri", "friday" -> 5
        "6", "六", "周六", "星期六", "sat", "saturday" -> 6
        "7", "日", "天", "周日", "星期日", "sun", "sunday" -> 7
        else -> null
    }

    private fun String.toImportMonthDayOrNull(): Pair<Int, Int>? {
        val parts = trim().split("/")
        if (parts.size != 2) return null
        val month = parts[0].toIntOrNull() ?: return null
        val day = parts[1].toIntOrNull() ?: return null
        if (month !in 1..12 || day !in 1..31) return null
        return month to day
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

    private data class ImportWeekDayInfo(
        val dayOfWeek: Int,
        val month: Int,
        val day: Int,
    )

    private companion object {
        val ACADEMIC_YEAR_PATTERN = Regex("""(20\d{2})\D+(20\d{2})""")
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
