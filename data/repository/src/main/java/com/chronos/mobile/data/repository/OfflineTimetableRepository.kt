package com.chronos.mobile.data.repository

import com.chronos.mobile.core.model.AppState
import com.chronos.mobile.core.model.Course
import com.chronos.mobile.core.model.Timetable
import com.chronos.mobile.core.model.TimetableSummary
import com.chronos.mobile.data.local.ChronosDao
import com.chronos.mobile.data.local.CourseEntity
import com.chronos.mobile.data.local.TimetableEntity
import com.chronos.mobile.data.local.TimetableSummaryRow
import com.chronos.mobile.data.local.TimetableWithCourses
import com.chronos.mobile.data.preferences.UserPreferences
import com.chronos.mobile.domain.TimetableRepository
import javax.inject.Inject
import javax.inject.Singleton
import kotlinx.coroutines.ExperimentalCoroutinesApi
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.combine
import kotlinx.coroutines.flow.distinctUntilChanged
import kotlinx.coroutines.flow.flatMapLatest
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.flow.flowOf
import kotlinx.coroutines.flow.map
import kotlinx.serialization.json.Json

@Singleton
@OptIn(ExperimentalCoroutinesApi::class)
class OfflineTimetableRepository @Inject constructor(
    private val chronosDao: ChronosDao,
    private val userPreferences: UserPreferences,
) : TimetableRepository {
    private val storageJson = Json {
        encodeDefaults = true
        ignoreUnknownKeys = true
    }
    private val exportJson = Json(storageJson) {
        prettyPrint = true
    }
    private val preferencesFlow = userPreferences.preferences.distinctUntilChanged()
    private val timetableSummariesFlow = chronosDao.observeTimetableSummaries()
        .map { summaries -> summaries.map { summary -> summary.toDomain() } }
        .distinctUntilChanged()
    private val resolvedCurrentTimetableIdFlow = combine(
        timetableSummariesFlow,
        preferencesFlow,
    ) { timetables, preferences ->
        preferences.currentTimetableId
            ?.takeIf { id -> timetables.any { it.id == id } }
            ?: timetables.firstOrNull()?.id
    }.distinctUntilChanged()
    private val currentTimetableFlow = resolvedCurrentTimetableIdFlow
        .flatMapLatest { timetableId ->
            timetableId?.let { id ->
                chronosDao.observeTimetableById(id)
                    .map { timetable -> timetable?.toDomain() }
            } ?: flowOf(null)
        }
        .distinctUntilChanged()

    override val appState: Flow<AppState> = combine(
        timetableSummariesFlow,
        preferencesFlow,
        resolvedCurrentTimetableIdFlow,
        currentTimetableFlow,
    ) { timetables, preferences, resolvedCurrentId, currentTimetable ->
        AppState(
            timetables = timetables,
            currentTimetableId = resolvedCurrentId,
            wallpaperUri = preferences.wallpaperUri,
            currentTimetable = currentTimetable,
        )
    }.distinctUntilChanged()

    override suspend fun getAppStateSnapshot(): AppState {
        val timetables = chronosDao.getTimetableSummariesSnapshot().map { summary -> summary.toDomain() }
        val preferences = preferencesFlow.first()
        val currentTimetableId = preferences.currentTimetableId
            ?.takeIf { id -> timetables.any { it.id == id } }
            ?: timetables.firstOrNull()?.id
        return AppState(
            timetables = timetables,
            currentTimetableId = currentTimetableId,
            wallpaperUri = preferences.wallpaperUri,
            currentTimetable = if (currentTimetableId != null) getTimetable(currentTimetableId) else null,
        )
    }

    override suspend fun getTimetable(id: String): Timetable? =
        chronosDao.getTimetableById(id)?.toDomain()

    override suspend fun saveTimetable(timetable: Timetable) {
        chronosDao.upsertTimetableGraph(
            timetable = timetable.toEntity(),
            courses = timetable.courses.map { it.toEntity(timetable.id) },
        )
    }

    override suspend fun saveCourse(timetableId: String, course: Course) {
        chronosDao.upsertCourseForTimetable(
            timetableId = timetableId,
            course = course.toEntity(timetableId),
            updatedAt = System.currentTimeMillis(),
        )
    }

    override suspend fun deleteCourse(courseId: String) {
        chronosDao.deleteCourseAndTouchTimetable(
            courseId = courseId,
            updatedAt = System.currentTimeMillis(),
        )
    }

    override suspend fun deleteTimetable(id: String) {
        chronosDao.deleteTimetable(id)
    }

    override suspend fun setCurrentTimetableId(id: String?) {
        userPreferences.setCurrentTimetableId(id)
    }

    override suspend fun setWallpaper(uri: String?) {
        userPreferences.setWallpaperUri(uri)
    }

    override suspend fun decodeTimetable(json: String): Timetable =
        storageJson.decodeFromString<Timetable>(json)

    override suspend fun encodeTimetable(timetable: Timetable): String =
        exportJson.encodeToString(timetable)

    private fun TimetableWithCourses.toDomain(): Timetable = Timetable(
        id = timetable.id,
        name = timetable.name,
        createdAt = timetable.createdAt,
        updatedAt = timetable.updatedAt,
        courses = courses.map { it.toDomain() },
        details = timetable.detailsOrDefault(),
    )

    private fun TimetableSummaryRow.toDomain(): TimetableSummary = TimetableSummary(
        id = id,
        name = name,
        courseCount = courseCount,
        createdAt = createdAt,
        updatedAt = updatedAt,
    )

    private fun Timetable.toEntity(): TimetableEntity = TimetableEntity(
        id = id,
        name = name,
        createdAt = createdAt,
        updatedAt = updatedAt,
        configJson = storageJson.encodeToString(details),
    )

    private fun Course.toEntity(timetableId: String): CourseEntity = CourseEntity(
        id = id,
        timetableId = timetableId,
        name = name,
        teacher = teacher,
        location = location,
        dayOfWeek = dayOfWeek,
        startPeriod = startPeriod,
        endPeriod = endPeriod,
        color = color,
        textColor = textColor,
        weeksCsv = weeks.joinToString(","),
    )

    private fun CourseEntity.toDomain(): Course = Course(
        id = id,
        name = name,
        teacher = teacher,
        location = location,
        dayOfWeek = dayOfWeek,
        startPeriod = startPeriod,
        endPeriod = endPeriod,
        color = color,
        textColor = textColor,
        weeks = weeksCsv.split(",")
            .mapNotNull { it.toIntOrNull() }
            .sorted(),
    )

    private fun TimetableEntity.detailsOrDefault(): com.chronos.mobile.core.model.TimetableDetails = runCatching {
        storageJson.decodeFromString<com.chronos.mobile.core.model.TimetableDetails>(configJson)
    }.getOrDefault(com.chronos.mobile.core.model.TimetableDetails())
}
