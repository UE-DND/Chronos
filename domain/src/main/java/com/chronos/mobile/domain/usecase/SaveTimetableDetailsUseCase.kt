package com.chronos.mobile.domain.usecase

import com.chronos.mobile.core.model.PeriodTime
import com.chronos.mobile.core.model.TimetableDetails
import com.chronos.mobile.core.model.TimetableViewPrefs
import com.chronos.mobile.core.model.defaultPeriodTimes
import com.chronos.mobile.domain.AcademicCalendarService
import com.chronos.mobile.domain.TimetableRepository
import com.chronos.mobile.domain.model.TimetableDetailsDraft
import java.time.LocalDate
import javax.inject.Inject

class SaveTimetableDetailsUseCase @Inject constructor(
    private val repository: TimetableRepository,
    private val academicCalendarService: AcademicCalendarService,
) {
    constructor(repository: TimetableRepository) : this(repository, AcademicCalendarService())

    suspend operator fun invoke(timetableId: String, draft: TimetableDetailsDraft) {
        val timetable = repository.getTimetable(timetableId) ?: return
        val safeStartWeek = draft.startWeek.coerceAtLeast(1)
        val normalizedPeriods = draft.periodTimes
            .sortedBy { it.index }
            .mapIndexed { index, period ->
                PeriodTime(
                    index = index + 1,
                    startTime = period.startTime.trim().ifBlank {
                        defaultPeriodTimes().getOrNull(index)?.startTime ?: "--:--"
                    },
                    endTime = period.endTime.trim().ifBlank {
                        defaultPeriodTimes().getOrNull(index)?.endTime ?: "--:--"
                    },
                )
            }
            .ifEmpty { defaultPeriodTimes() }

        repository.saveTimetable(
            timetable.copy(
                name = draft.name.trim().ifBlank { "未命名课表" },
                updatedAt = System.currentTimeMillis(),
                details = TimetableDetails(
                    termStartDate = parseTermStartDate(draft.termStartDate),
                    startWeek = safeStartWeek,
                    endWeek = draft.endWeek.coerceAtLeast(safeStartWeek),
                    showSaturday = draft.showSaturday,
                    showSunday = draft.showSunday,
                    importSource = draft.importSource,
                    periodTimes = normalizedPeriods,
                ),
                viewPrefs = TimetableViewPrefs(
                    showNonCurrentWeekCourses = draft.showNonCurrentWeekCourses,
                ),
            )
        )
    }

    private fun parseTermStartDate(raw: String): String =
        academicCalendarService.normalizeTermStartDate(raw, LocalDate.now()).toString()
}
