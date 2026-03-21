package com.chronos.mobile.domain.usecase

import com.chronos.mobile.core.model.AppState
import com.chronos.mobile.core.model.Course
import com.chronos.mobile.core.model.OnlineScheduleEvent
import com.chronos.mobile.core.model.OnlineSchedulePayload
import com.chronos.mobile.core.model.OnlineScheduleWeekDay
import com.chronos.mobile.core.model.Timetable
import com.chronos.mobile.core.model.TimetableDetails
import com.chronos.mobile.core.model.TimetableImportSource
import com.chronos.mobile.core.model.TimetableSummary
import com.chronos.mobile.core.model.ThemeMode
import com.chronos.mobile.core.model.currentWeekMonday
import com.chronos.mobile.domain.ImportMode
import com.chronos.mobile.domain.OnlineScheduleJsonCodec
import com.chronos.mobile.domain.TimetableRepository
import com.chronos.mobile.domain.model.CourseDraft
import com.chronos.mobile.domain.model.PeriodTimeDraft
import com.chronos.mobile.domain.model.TimetableDetailsDraft
import com.chronos.mobile.domain.result.AppResult
import com.chronos.mobile.domain.result.asSuccess
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
    private val codec = FakeOnlineScheduleJsonCodec()

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
        assertEquals(currentWeekMonday().toString(), saved?.details?.termStartDate)
    }

    @Test
    fun `createTimetable writes current week monday as default term start date`() = runBlocking {
        val repo = FakeTimetableRepository()
        val useCase = CreateTimetableUseCase(repo)

        useCase(" ")

        val current = repo.getAppStateSnapshot().currentTimetable
        assertNotNull(current)
        assertEquals("未命名课表", current?.name)
        assertEquals(currentWeekMonday().toString(), current?.details?.termStartDate)
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
        val useCase = ImportTimetableUseCase(repo, ParseEducationalTimetableHtmlUseCase(), codec)

        useCase((codec.encode(imported) as AppResult.Success).value, ImportMode.AS_NEW)

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
        val useCase = ImportTimetableUseCase(repo, ParseEducationalTimetableHtmlUseCase(), codec)

        useCase((codec.encode(imported) as AppResult.Success).value, ImportMode.OVERWRITE_CURRENT)

        val current = repo.getAppStateSnapshot().currentTimetable
        assertEquals(existing.id, current?.id)
        assertEquals(existing.name, current?.name)
        assertEquals(imported.courses.size, current?.courses?.size)
        assertEquals(existing.details, current?.details)
    }

    @Test
    fun `importTimetable scopes generated course ids to destination timetable`() = runBlocking {
        val repo = FakeTimetableRepository()
        val existing = repo.seedCurrent()
        val imported = repo.sampleImportedTimetable()
        val useCase = ImportTimetableUseCase(repo, ParseEducationalTimetableHtmlUseCase(), codec)

        useCase((codec.encode(imported) as AppResult.Success).value, ImportMode.OVERWRITE_CURRENT)

        val current = repo.getAppStateSnapshot().currentTimetable
        assertNotNull(current)
        assertEquals("${existing.id}:1", current?.courses?.single()?.id)
    }

    @Test
    fun `importTimetable as new keeps imported source`() = runBlocking {
        val repo = FakeTimetableRepository()
        repo.seedCurrent()
        val imported = repo.sampleImportedTimetable().copy(
            details = TimetableDetails(importSource = TimetableImportSource.ONLINE_EDU),
        )
        val useCase = ImportTimetableUseCase(repo, ParseEducationalTimetableHtmlUseCase(), codec)

        useCase.import(imported, ImportMode.AS_NEW)

        val current = repo.getAppStateSnapshot().currentTimetable
        assertEquals(TimetableImportSource.ONLINE_EDU, current?.details?.importSource)
    }

    @Test
    fun `importTimetable overwrite updates source to latest import source`() = runBlocking {
        val repo = FakeTimetableRepository()
        repo.seedCurrent()
        val imported = repo.sampleImportedTimetable().copy(
            details = TimetableDetails(importSource = TimetableImportSource.FILE_HTML),
        )
        val useCase = ImportTimetableUseCase(repo, ParseEducationalTimetableHtmlUseCase(), codec)

        useCase.import(imported, ImportMode.OVERWRITE_CURRENT)

        val current = repo.getAppStateSnapshot().currentTimetable
        assertEquals(TimetableImportSource.FILE_HTML, current?.details?.importSource)
    }

    @Test
    fun `timetable details defaults source to unknown`() {
        assertEquals(TimetableImportSource.UNKNOWN, TimetableDetails().importSource)
    }

    @Test
    fun `timetable details defaults term start date to empty`() {
        assertEquals("", TimetableDetails().termStartDate)
    }

    @Test
    fun `exportCurrentTimetable outputs online schedule json`() = runBlocking {
        val repo = FakeTimetableRepository()
        repo.seedCurrent()
        val useCase = ExportCurrentTimetableUseCase(repo, codec)

        val exported = useCase()

        assertTrue(exported is AppResult.Success)
        val value = (exported as AppResult.Success).value
        assertNotNull(value)
        val payload = codec.decode(value!!)
        assertTrue(payload is AppResult.Success)
        val decoded = (payload as AppResult.Success).value
        assertTrue(decoded.yearTerm.isNotBlank())
        assertTrue(decoded.weekDayList.isNotEmpty())
        assertTrue(decoded.eventList.isNotEmpty())
    }

    @Test
    fun `setThemeMode updates app state`() = runBlocking {
        val repo = FakeTimetableRepository()
        val useCase = SetThemeModeUseCase(repo)

        useCase(ThemeMode.DARK)

        assertEquals(ThemeMode.DARK, repo.getAppStateSnapshot().themeMode)
    }

    @Test
    fun `setDynamicColorEnabled updates app state`() = runBlocking {
        val repo = FakeTimetableRepository()
        val useCase = SetDynamicColorEnabledUseCase(repo)

        useCase(true)

        assertEquals(true, repo.getAppStateSnapshot().useDynamicColor)
    }

    @Test
    fun `themeMode falls back to system for unknown storage values`() {
        assertEquals(ThemeMode.SYSTEM, ThemeMode.fromStorageValue("unexpected"))
        assertEquals(ThemeMode.SYSTEM, ThemeMode.fromStorageValue(null))
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
        assertEquals(6, grid.visibleDays.last().dayOfWeek)
    }

    @Test
    fun `importTimetable parses educational html and ignores other courses`() = runBlocking {
        val repo = FakeTimetableRepository()
        val useCase = ImportTimetableUseCase(repo, ParseEducationalTimetableHtmlUseCase(), codec)

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
        assertEquals(TimetableImportSource.FILE_HTML, current?.details?.importSource)
        assertEquals(currentWeekMonday().toString(), current?.details?.termStartDate)
    }

    @Test
    fun `parse external educational html sample when path provided`() {
        val samplePath = System.getProperty("chronos.sampleHtmlPath")
            ?.takeIf { it.isNotBlank() }
            ?: System.getenv("CHRONOS_SAMPLE_HTML_PATH").orEmpty()
        assumeTrue(samplePath.isNotBlank())

        val parsed = ParseEducationalTimetableHtmlUseCase()(File(samplePath).readText())
        assertTrue(parsed is AppResult.Success)

        val timetable = (parsed as AppResult.Success).value
        assertNotNull(timetable)
        println("TERM=${timetable!!.name}")
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

    override suspend fun setThemeMode(mode: ThemeMode) {
        rebuildState(themeMode = mode)
    }

    override suspend fun setUseDynamicColor(enabled: Boolean) {
        rebuildState(useDynamicColor = enabled)
    }

    fun seedCurrent(): Timetable {
        val timetable = sampleImportedTimetable().copy(id = "current-id", name = "当前课表")
        timetables = listOf(timetable)
        rebuildState(currentTimetableId = timetable.id, wallpaperUri = null)
        return timetable
    }

    private fun rebuildState(
        currentTimetableId: String? = state.value.currentTimetableId,
        wallpaperUri: String? = state.value.wallpaperUri,
        themeMode: ThemeMode = state.value.themeMode,
        useDynamicColor: Boolean = state.value.useDynamicColor,
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
            themeMode = themeMode,
            useDynamicColor = useDynamicColor,
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

private class FakeOnlineScheduleJsonCodec : OnlineScheduleJsonCodec {
    private val json = Json {
        encodeDefaults = true
        ignoreUnknownKeys = true
    }

    override fun decode(json: String): AppResult<OnlineSchedulePayload> =
        this.json.decodeFromString(OnlineSchedulePayload.serializer(), json).asSuccess()

    override fun encode(timetable: Timetable): AppResult<String> = json.encodeToString(
        OnlineSchedulePayload.serializer(),
        OnlineSchedulePayload(
            yearTerm = timetable.name,
            weekNum = "1",
            nowMonth = "3",
            importSource = "SHARED_JSON",
            yearTermList = listOf(timetable.name),
            weekList = (timetable.details.startWeek..timetable.details.endWeek).map(Int::toString),
            weekDayList = listOf(
                OnlineScheduleWeekDay(weekDay = "一", weekDate = "03/02", today = false),
                OnlineScheduleWeekDay(weekDay = "二", weekDate = "03/03", today = false),
            ),
            eventList = timetable.courses.map { course ->
                OnlineScheduleEvent(
                    weekNum = "1",
                    weekDay = course.dayOfWeek.toString(),
                    weekList = course.weeks.map(Int::toString),
                    weekCover = "",
                    sessionList = (course.startPeriod..course.endPeriod).map(Int::toString),
                    sessionStart = course.startPeriod.toString(),
                    sessionLast = course.endPeriod.toString(),
                    eventName = course.name,
                    address = course.location,
                    memberName = course.teacher,
                    duplicateGroupType = "0",
                    duplicateGroup = 0,
                    eventType = "1",
                    eventID = course.id,
                )
            },
        ),
    ).asSuccess()

    override fun toTimetable(payload: OnlineSchedulePayload): AppResult<Timetable> = Timetable(
        id = "decoded-online",
        name = payload.yearTerm.ifBlank { "在线课表" },
        createdAt = 1L,
        updatedAt = 1L,
        courses = payload.eventList.mapIndexed { index, event ->
            Course(
                id = event.eventID.ifBlank { "decoded-$index" },
                name = event.eventName,
                teacher = event.memberName,
                location = event.address,
                dayOfWeek = event.weekDay.toInt(),
                startPeriod = event.sessionStart.toInt(),
                endPeriod = event.sessionLast.toInt(),
                color = "#EADDFF",
                weeks = event.weekList.map(String::toInt),
            )
        },
        details = TimetableDetails(),
    ).asSuccess()
}
