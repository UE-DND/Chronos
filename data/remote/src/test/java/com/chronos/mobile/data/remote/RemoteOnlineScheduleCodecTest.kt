package com.chronos.mobile.data.remote

import com.chronos.mobile.core.model.Course
import com.chronos.mobile.core.model.OnlineSchedulePayload
import com.chronos.mobile.core.model.Timetable
import com.chronos.mobile.core.model.TimetableDetails
import com.chronos.mobile.domain.result.AppResult
import com.chronos.mobile.domain.usecase.CalculateAcademicWeekUseCase
import java.net.URLDecoder
import kotlinx.serialization.json.Json
import org.junit.Assert.assertEquals
import org.junit.Assert.assertTrue
import org.junit.Test

class RemoteOnlineScheduleCodecTest {
    private val codec = DefaultOnlineScheduleJsonCodec(CalculateAcademicWeekUseCase())

    @Test
    fun `codec exports online payload structure`() {
        val timetable = sampleTimetable()

        val encoded = codec.encode(timetable).requireSuccess()
        val payload = codec.decode(encoded).requireSuccess()

        assertEquals("2025-2026-2", payload.yearTerm)
        assertTrue(payload.weekList.isNotEmpty())
        assertTrue(payload.weekDayList.size == 7)
        assertEquals(1, payload.eventList.size)
        assertEquals("编译原理", payload.eventList.first().eventName)
        assertEquals(listOf("1", "2"), payload.eventList.first().sessionList)
        assertEquals("2", payload.eventList.first().sessionLast)
    }

    @Test
    fun `codec imports online payload into local timetable`() {
        val payload = codec.decode(codec.encode(sampleTimetable()).requireSuccess()).requireSuccess()

        val timetable = codec.toTimetable(payload).requireSuccess()

        assertEquals("2025-2026-2", timetable.name)
        assertEquals(1, timetable.courses.size)
        assertEquals("编译原理", timetable.courses.first().name)
        assertEquals(listOf(1, 2, 3, 4), timetable.courses.first().weeks)
    }

    @Test
    fun `codec interprets sessionLast as duration not ending period`() {
        val payload = OnlineSchedulePayload(
            yearTerm = "2025-2026-2",
            weekNum = "3",
            weekList = (1..20).map(Int::toString),
            eventList = listOf(
                com.chronos.mobile.core.model.OnlineScheduleEvent(
                    weekNum = "3",
                    weekDay = "2",
                    weekList = listOf("2", "3"),
                    weekCover = "2-3周",
                    sessionList = listOf("3", "4"),
                    sessionStart = "3",
                    sessionLast = "2",
                    eventName = "嵌入式系统及应用",
                    address = "两江校区 弘远楼D0334",
                    memberName = "刘政",
                ),
            ),
        )

        val timetable = codec.toTimetable(payload).requireSuccess()

        assertEquals(3, timetable.courses.single().startPeriod)
        assertEquals(4, timetable.courses.single().endPeriod)
    }

    @Test
    fun `codec keeps same color for same course name`() {
        val payload = OnlineSchedulePayload(
            yearTerm = "2025-2026-2",
            weekNum = "3",
            weekList = (1..20).map(Int::toString),
            eventList = listOf(
                com.chronos.mobile.core.model.OnlineScheduleEvent(
                    weekNum = "3",
                    weekDay = "2",
                    weekList = listOf("2", "3"),
                    sessionList = listOf("3", "4"),
                    sessionStart = "3",
                    sessionLast = "2",
                    eventName = "数据结构",
                    address = "两江校区 弘远楼D0426",
                    memberName = "陈媛",
                ),
                com.chronos.mobile.core.model.OnlineScheduleEvent(
                    weekNum = "3",
                    weekDay = "4",
                    weekList = listOf("2", "3"),
                    sessionList = listOf("5", "6"),
                    sessionStart = "5",
                    sessionLast = "2",
                    eventName = "数据结构",
                    address = "两江校区 弘远楼D0426",
                    memberName = "陈媛",
                ),
            ),
        )

        val timetable = codec.toTimetable(payload).requireSuccess()

        assertEquals(2, timetable.courses.size)
        assertEquals(timetable.courses[0].color, timetable.courses[1].color)
        assertEquals(timetable.courses[0].textColor, timetable.courses[1].textColor)
    }

    @Test
    fun `cas password encryptor emits url encoded json array`() {
        val encryptor = CasPasswordEncryptor()

        val encoded = encryptor.encrypt("31415926535Cwt")
        val decoded = URLDecoder.decode(encoded, Charsets.UTF_8.name())
        val chunks = Json.decodeFromString<List<String>>(decoded)

        assertEquals(1, chunks.size)
        assertTrue(chunks.first().isNotBlank())
    }

    @Test
    fun `cas password encryptor splits long password into chunks`() {
        val encryptor = CasPasswordEncryptor()

        val encoded = encryptor.encrypt("abcdefghijklmnopqrstuvwxyz1234567890")
        val decoded = URLDecoder.decode(encoded, Charsets.UTF_8.name())
        val chunks = Json.decodeFromString<List<String>>(decoded)

        assertEquals(2, chunks.size)
        assertTrue(chunks.all { it.isNotBlank() })
    }

    private fun sampleTimetable(): Timetable = Timetable(
        id = "t1",
        name = "2025-2026-2",
        createdAt = 1L,
        updatedAt = 1L,
        courses = listOf(
            Course(
                id = "c1",
                name = "编译原理",
                teacher = "张老师",
                location = "B201",
                dayOfWeek = 1,
                startPeriod = 1,
                endPeriod = 2,
                color = "#EADDFF",
                weeks = listOf(1, 2, 3, 4),
            ),
        ),
        details = TimetableDetails(
            termStartDate = "2026-03-02",
            startWeek = 1,
            endWeek = 20,
        ),
    )

    private fun <T> AppResult<T>.requireSuccess(): T = when (this) {
        is AppResult.Success -> value
        is AppResult.Failure -> throw AssertionError("Expected success but was failure: ${error.message}")
    }
}
