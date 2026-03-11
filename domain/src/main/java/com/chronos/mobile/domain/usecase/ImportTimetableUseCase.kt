package com.chronos.mobile.domain.usecase

import com.chronos.mobile.domain.ImportMode
import com.chronos.mobile.domain.TimetableRepository
import java.util.UUID
import javax.inject.Inject

data class ImportTimetableResult(
    val timetableId: String,
    val mode: ImportMode,
)

class ImportTimetableUseCase @Inject constructor(
    private val repository: TimetableRepository,
    private val parseEducationalTimetableHtml: ParseEducationalTimetableHtmlUseCase,
) {
    suspend operator fun invoke(content: String, mode: ImportMode): ImportTimetableResult {
        val imported = parseEducationalTimetableHtml(content)
            ?: repository.decodeTimetable(content)
        return when (mode) {
            ImportMode.AS_NEW -> {
                val now = System.currentTimeMillis()
                val newTimetableId = UUID.randomUUID().toString()
                val newTimetable = imported.copy(
                    id = newTimetableId,
                    createdAt = now,
                    updatedAt = now,
                    courses = imported.withAssignedCourseIds(newTimetableId),
                )
                repository.saveTimetable(newTimetable)
                repository.setCurrentTimetableId(newTimetable.id)
                ImportTimetableResult(
                    timetableId = newTimetable.id,
                    mode = mode,
                )
            }

            ImportMode.OVERWRITE_CURRENT -> {
                val currentTimetable = repository.getAppStateSnapshot().currentTimetable
                    ?: throw IllegalStateException("当前没有可覆盖的课程表")
                val overwritten = imported.copy(
                    id = currentTimetable.id,
                    name = currentTimetable.name,
                    createdAt = currentTimetable.createdAt,
                    updatedAt = System.currentTimeMillis(),
                    courses = imported.withAssignedCourseIds(currentTimetable.id),
                )
                repository.saveTimetable(overwritten)
                ImportTimetableResult(
                    timetableId = overwritten.id,
                    mode = mode,
                )
            }
        }
    }

    private fun com.chronos.mobile.core.model.Timetable.withAssignedCourseIds(
        timetableId: String,
    ) = courses.mapIndexed { index, course ->
        course.copy(id = "$timetableId:${index + 1}")
    }
}
