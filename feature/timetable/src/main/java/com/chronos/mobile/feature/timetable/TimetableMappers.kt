package com.chronos.mobile.feature.timetable

import com.chronos.mobile.core.model.Course
import com.chronos.mobile.core.model.Timetable
import com.chronos.mobile.domain.AcademicCalendarService
import com.chronos.mobile.domain.model.CourseDraft
import com.chronos.mobile.domain.model.PeriodTimeDraft
import com.chronos.mobile.domain.model.TimetableDetailsDraft
import java.time.LocalDate

private val academicCalendarService = AcademicCalendarService()

internal fun Course.toDraft(): CourseDraft =
    CourseDraft(
        id = id,
        name = name,
        teacher = teacher,
        location = location,
        dayOfWeek = dayOfWeek,
        startPeriod = startPeriod,
        endPeriod = endPeriod,
        color = color,
        textColor = textColor,
        weeks = weeks,
    )

internal fun Timetable.toDetailsDraft(): TimetableDetailsDraft =
    TimetableDetailsDraft(
        name = name,
        termStartDate = academicCalendarService
            .normalizeTermStartDate(details.termStartDate, LocalDate.now())
            .toString(),
        startWeek = details.startWeek,
        endWeek = details.endWeek,
        showSaturday = details.showSaturday,
        showSunday = details.showSunday,
        showNonCurrentWeekCourses = details.showNonCurrentWeekCourses,
        importSource = details.importSource,
        periodTimes = details.periodTimes.map {
            PeriodTimeDraft(
                index = it.index,
                startTime = it.startTime,
                endTime = it.endTime,
            )
        },
    )

internal fun List<PeriodTimeDraft>.replaceAt(index: Int, item: PeriodTimeDraft): List<PeriodTimeDraft> =
    mapIndexed { currentIndex, currentItem ->
        if (currentIndex == index) item else currentItem
    }

internal fun List<PeriodTimeDraft>.removeAt(index: Int): List<PeriodTimeDraft> =
    filterIndexed { currentIndex, _ -> currentIndex != index }

internal fun List<PeriodTimeDraft>.reindexPeriodTimes(): List<PeriodTimeDraft> =
    mapIndexed { index, state -> state.copy(index = index + 1) }
