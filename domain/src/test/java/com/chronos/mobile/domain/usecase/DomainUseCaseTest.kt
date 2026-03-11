package com.chronos.mobile.domain.usecase

import com.chronos.mobile.core.model.AppState
import com.chronos.mobile.core.model.Course
import com.chronos.mobile.core.model.Timetable
import com.chronos.mobile.core.model.TimetableDetails
import com.chronos.mobile.core.model.TimetableSummary
import com.chronos.mobile.domain.ImportMode
import com.chronos.mobile.domain.TimetableRepository
import com.chronos.mobile.domain.model.CourseDraft
import com.chronos.mobile.domain.model.PeriodTimeDraft
import com.chronos.mobile.domain.model.TimetableDetailsDraft
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.runBlocking
import kotlinx.serialization.json.Json
import org.junit.Assume.assumeTrue
import org.junit.Assert.assertEquals
import org.junit.Assert.assertNotEquals
import org.junit.Assert.assertNotNull
import org.junit.Assert.assertTrue
import org.junit.Test
import java.io.File
import java.time.LocalDate

class DomainUseCaseTest {
    @Test
    fun `calculateAcademicWeek clamps before term start`() {
        val useCase = CalculateAcademicWeekUseCase()
        val details = TimetableDetails(
            termStartDate = "2026-03-09",
            startWeek = 3,
            endWeek = 18,
        )

        val result = useCase(LocalDate.parse("2026-03-01"), details)

        assertEquals(3, result)
    }

    @Test
    fun `calculateAcademicWeek falls back on invalid date`() {
        val useCase = CalculateAcademicWeekUseCase()
        val result = useCase(LocalDate.now(), TimetableDetails(termStartDate = "bad-date"))

        assertEquals(1, result)
    }

    @Test
    fun `saveTimetableDetails normalizes empty fields and period order`() = runBlocking {
        val repo = FakeTimetableRepository()
        val timetable = repo.seedCurrent()
        val useCase = SaveTimetableDetailsUseCase(repo)

        useCase(
            timetable.id,
            TimetableDetailsDraft(
                name = " ",
                termStartDate = " ",
                startWeek = 0,
                endWeek = 0,
                showSaturday = false,
                showSunday = true,
                showNonCurrentWeekCourses = true,
                periodTimes = listOf(
                    PeriodTimeDraft(index = 3, startTime = " ", endTime = "11:00"),
                    PeriodTimeDraft(index = 1, startTime = "08:00", endTime = " "),
                ),
            ),
        )

        val saved = repo.getTimetable(timetable.id)
        assertNotNull(saved)
        assertEquals("未命名课表", saved?.name)
        assertEquals(1, saved?.details?.startWeek)
        assertEquals(1, saved?.details?.endWeek)
        assertEquals(false, saved?.details?.showSaturday)
        assertEquals(true, saved?.details?.showNonCurrentWeekCourses)
        assertEquals(2, saved?.details?.periodTimes?.size)
        assertEquals(1, saved?.details?.periodTimes?.first()?.index)
        assertEquals("08:00", saved?.details?.periodTimes?.first()?.startTime)
    }

    @Test
    fun `saveCourse assigns id trims text and fixes endPeriod`() = runBlocking {
        val repo = FakeTimetableRepository()
        val timetable = repo.seedCurrent()
        val useCase = SaveCourseUseCase(repo)

        useCase(
            timetable.id,
            CourseDraft(
                name = "  数据结构  ",
                teacher = "  老师  ",
                location = "  A101  ",
                startPeriod = 4,
                endPeriod = 2,
            ),
        )

        val savedCourse = repo.lastSavedCourse
        assertNotNull(savedCourse)
        assertNotNull(savedCourse?.id)
        assertEquals("数据结构", savedCourse?.name)
        assertEquals("老师", savedCourse?.teacher)
        assertEquals("A101", savedCourse?.location)
        assertEquals(4, savedCourse?.startPeriod)
        assertEquals(4, savedCourse?.endPeriod)
    }

    @Test
    fun `importTimetable as new replaces timetable and course ids`() = runBlocking {
        val repo = FakeTimetableRepository()
        repo.seedCurrent()
        val imported = repo.sampleImportedTimetable()
        val useCase = ImportTimetableUseCase(repo, ParseEducationalTimetableHtmlUseCase())

        useCase(repo.encodeTimetable(imported), ImportMode.AS_NEW)

        val current = repo.getAppStateSnapshot().currentTimetable
        assertNotNull(current)
        assertNotEquals(imported.id, current?.id)
        assertNotEquals(imported.courses.first().id, current?.courses?.first()?.id)
    }

    @Test
    fun `importTimetable overwrite preserves current timetable identity`() = runBlocking {
        val repo = FakeTimetableRepository()
        val existing = repo.seedCurrent()
        val imported = repo.sampleImportedTimetable()
        val useCase = ImportTimetableUseCase(repo, ParseEducationalTimetableHtmlUseCase())

        useCase(repo.encodeTimetable(imported), ImportMode.OVERWRITE_CURRENT)

        val current = repo.getAppStateSnapshot().currentTimetable
        assertEquals(existing.id, current?.id)
        assertEquals(existing.name, current?.name)
        assertEquals(imported.courses.size, current?.courses?.size)
    }

    @Test
    fun `importTimetable scopes generated course ids to destination timetable`() = runBlocking {
        val repo = FakeTimetableRepository()
        val existing = repo.seedCurrent()
        val imported = repo.sampleImportedTimetable()
        val useCase = ImportTimetableUseCase(repo, ParseEducationalTimetableHtmlUseCase())

        useCase(repo.encodeTimetable(imported), ImportMode.OVERWRITE_CURRENT)

        val current = repo.getAppStateSnapshot().currentTimetable
        assertNotNull(current)
        assertEquals("${existing.id}:1", current?.courses?.single()?.id)
    }

    @Test
    fun `exportCurrentTimetable includes timetable details fields`() = runBlocking {
        val repo = FakeTimetableRepository()
        repo.seedCurrent()
        val useCase = ExportCurrentTimetableUseCase(repo)

        val exported = useCase()

        assertNotNull(exported)
        assertTrue(exported!!.contains("\"details\""))
        assertTrue(exported.contains("\"showNonCurrentWeekCourses\""))
        assertTrue(exported.contains("\"periodTimes\""))
    }

    @Test
    fun `buildVisibleTimetableGrid expands periods and applies weekend visibility`() {
        val useCase = BuildVisibleTimetableGridUseCase()
        val timetable = Timetable(
            id = "t1",
            name = "课表",
            createdAt = 1L,
            updatedAt = 1L,
            courses = listOf(
                Course(
                    id = "c1",
                    name = "课程",
                    teacher = "老师",
                    location = "教室",
                    dayOfWeek = 6,
                    startPeriod = 11,
                    endPeriod = 12,
                    color = "#EADDFF",
                    textColor = "#21005D",
                ),
            ),
            details = TimetableDetails(showSaturday = true, showSunday = false),
        )

        val grid = useCase(LocalDate.parse("2026-03-10"), 1, timetable)

        assertEquals(6, grid.visibleDays.size)
        assertEquals(12, grid.displayedPeriodCount)
        assertEquals("六", grid.visibleDays.last().shortLabel)
    }

    @Test
    fun `importTimetable parses educational html and ignores other courses`() = runBlocking {
        val repo = FakeTimetableRepository()
        val useCase = ImportTimetableUseCase(repo, ParseEducationalTimetableHtmlUseCase())

        useCase(
            """
            <table id="kbgrid_table_0">
              <tbody>
                <tr>
                  <td colspan="9">
                    <div class="timetable_title">
                      <h6 class="pull-left">2025-2026学年第2学期</h6>
                      陈炜堂的课表
                      <h6 class="pull-right">学号：12403010122</h6>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td rowspan="2" id="1-1" class="td_wrap">
                    <div class="timetable_con text-left">
                      <span class="title"><font color="blue">马克思主义基本原理★</font></span>
                      <p><span title="节/周"></span><font color="blue">(1-2节)2-10周,12-15周</font></p>
                      <p><span title="上课地点"></span><font color="blue">两江校区 弘远楼B0216</font></p>
                      <p><span title="教师"></span><font color="blue">陈凯</font></p>
                    </div>
                  </td>
                </tr>
                <tr></tr>
                <tr>
                  <td colspan="9">
                    <div class="timetable_title">
                      <span>其它课程：</span>
                      <span>综合课程设计I☆刘政(共1周)/1周/无;</span>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
            """.trimIndent(),
            ImportMode.AS_NEW,
        )

        val current = repo.getAppStateSnapshot().currentTimetable

        assertEquals("陈炜堂的课表", current?.name)
        assertEquals(1, current?.courses?.size)
        assertEquals(
            listOf(2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 13, 14, 15),
            current?.courses?.first()?.weeks,
        )
    }

    @Test
    fun `parse external educational html sample when path provided`() {
        val samplePath = System.getProperty("chronos.sampleHtmlPath")
            ?.takeIf { it.isNotBlank() }
            ?: System.getenv("CHRONOS_SAMPLE_HTML_PATH").orEmpty()
        assumeTrue(samplePath.isNotBlank())

        val parsed = ParseEducationalTimetableHtmlUseCase()(File(samplePath).readText())
        assertNotNull(parsed)

        val timetable = parsed!!
        println("TERM=${timetable.name}")
        println("COURSE_COUNT=${timetable.courses.size}")
        timetable.courses
            .sortedWith(compareBy<Course> { it.dayOfWeek }.thenBy { it.startPeriod }.thenBy { it.name })
            .forEach { course ->
                println(
                    listOf(
                        course.name,
                        "day=${course.dayOfWeek}",
                        "period=${course.startPeriod}-${course.endPeriod}",
                        "teacher=${course.teacher}",
                        "location=${course.location}",
                        "weeks=${course.weeks.joinToString(",")}",
                    ).joinToString(" | "),
                )
            }
    }
}

private class FakeTimetableRepository : TimetableRepository {
    private val json = Json {
        encodeDefaults = true
        ignoreUnknownKeys = true
    }
    private val state = MutableStateFlow(AppState())
    private var timetables: List<Timetable> = emptyList()

    var lastSavedCourse: Course? = null

    override val appState: Flow<AppState> = state

    override suspend fun getAppStateSnapshot(): AppState = state.value

    override suspend fun getTimetable(id: String): Timetable? =
        timetables.firstOrNull { it.id == id }

    override suspend fun saveTimetable(timetable: Timetable) {
        val others = timetables.filterNot { it.id == timetable.id }
        timetables = listOf(timetable) + others
        rebuildState(currentTimetableId = state.value.currentTimetableId ?: timetable.id)
    }

    override suspend fun saveCourse(timetableId: String, course: Course) {
        lastSavedCourse = course
        timetables = timetables.map { timetable ->
            if (timetable.id != timetableId) {
                timetable
            } else {
                timetable.copy(
                    courses = timetable.courses.filterNot { it.id == course.id } + course,
                )
            }
        }
        rebuildState()
    }

    override suspend fun deleteCourse(courseId: String) {
        timetables = timetables.map { timetable ->
            timetable.copy(courses = timetable.courses.filterNot { it.id == courseId })
        }
        rebuildState()
    }

    override suspend fun deleteTimetable(id: String) {
        timetables = timetables.filterNot { it.id == id }
        rebuildState(currentTimetableId = state.value.currentTimetableId.takeUnless { it == id })
    }

    override suspend fun setCurrentTimetableId(id: String?) {
        rebuildState(currentTimetableId = id)
    }

    override suspend fun setWallpaper(uri: String?) {
        rebuildState(wallpaperUri = uri)
    }

    override suspend fun decodeTimetable(json: String): Timetable =
        this.json.decodeFromString<Timetable>(json)

    override suspend fun encodeTimetable(timetable: Timetable): String =
        json.encodeToString(timetable)

    fun seedCurrent(): Timetable {
        val timetable = sampleImportedTimetable().copy(id = "current-id", name = "当前课表")
        timetables = listOf(timetable)
        rebuildState(currentTimetableId = timetable.id, wallpaperUri = null)
        return timetable
    }

    private fun rebuildState(
        currentTimetableId: String? = state.value.currentTimetableId,
        wallpaperUri: String? = state.value.wallpaperUri,
    ) {
        val resolvedCurrentTimetableId = currentTimetableId?.takeIf { id ->
            timetables.any { it.id == id }
        } ?: timetables.firstOrNull()?.id
        state.value = AppState(
            timetables = timetables.map { timetable ->
                TimetableSummary(
                    id = timetable.id,
                    name = timetable.name,
                    courseCount = timetable.courses.size,
                    createdAt = timetable.createdAt,
                    updatedAt = timetable.updatedAt,
                )
            },
            currentTimetableId = resolvedCurrentTimetableId,
            wallpaperUri = wallpaperUri,
            currentTimetable = timetables.firstOrNull { it.id == resolvedCurrentTimetableId },
        )
    }

    fun sampleImportedTimetable(): Timetable = Timetable(
        id = "imported-id",
        name = "导入课表",
        createdAt = 1L,
        updatedAt = 1L,
        courses = listOf(
            Course(
                id = "imported-course",
                name = "编译原理",
                teacher = "张老师",
                location = "B201",
                dayOfWeek = 1,
                startPeriod = 1,
                endPeriod = 2,
                color = "#EADDFF",
                textColor = "#21005D",
            ),
        ),
        details = TimetableDetails(),
    )
}
