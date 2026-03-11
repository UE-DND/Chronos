package com.chronos.mobile.domain.usecase

import com.chronos.mobile.core.model.PeriodTime
import com.chronos.mobile.core.model.TimetableDetails
import com.chronos.mobile.core.model.defaultPeriodTimes
import com.chronos.mobile.domain.TimetableRepository
import com.chronos.mobile.domain.model.TimetableDetailsDraft
import java.time.DayOfWeek
import java.time.LocalDate
import java.time.temporal.TemporalAdjusters
import javax.inject.Inject

class SaveTimetableDetailsUseCase @Inject constructor(
    private val repository: TimetableRepository,
) {
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
                    showNonCurrentWeekCourses = draft.showNonCurrentWeekCourses,
                    periodTimes = normalizedPeriods,
                ),
            )
        )
    }

    private fun parseTermStartDate(raw: String): String = raw.trim().ifBlank {
        LocalDate.now().with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY)).toString()
    }
}
