package com.chronos.mobile.data.repository

import com.chronos.mobile.core.model.PeriodTime
import com.chronos.mobile.core.model.TimetableDetails
import com.chronos.mobile.core.model.TimetableImportSource
import com.chronos.mobile.core.model.TimetableViewPrefs
import org.junit.Assert.assertEquals
import org.junit.Test

class TimetableConfigJsonCodecTest {
    private val codec = TimetableConfigJsonCodec()

    @Test
    fun `decode reads new config shape with details and view prefs`() {
        val details = TimetableDetails(
            termStartDate = "2026-02-23",
            startWeek = 2,
            endWeek = 18,
            showSaturday = false,
            showSunday = true,
            importSource = TimetableImportSource.FILE_HTML,
            periodTimes = listOf(
                PeriodTime(index = 1, startTime = "08:00", endTime = "08:45"),
            ),
        )
        val viewPrefs = TimetableViewPrefs(showNonCurrentWeekCourses = true)

        val encoded = codec.encode(details = details, viewPrefs = viewPrefs)
        val decoded = codec.decode(encoded)

        assertEquals(details, decoded.details)
        assertEquals(viewPrefs, decoded.viewPrefs)
    }

    @Test
    fun `decode falls back to defaults for legacy details only shape`() {
        val legacyDetails = TimetableDetails(
            termStartDate = "2026-03-02",
            startWeek = 1,
            endWeek = 20,
            showSaturday = true,
            showSunday = false,
            importSource = TimetableImportSource.SHARED_JSON,
        )
        val legacyJson = kotlinx.serialization.json.Json { encodeDefaults = true }
            .encodeToString(legacyDetails)

        val decoded = codec.decode(legacyJson)

        assertEquals(legacyDetails, decoded.details)
        assertEquals(TimetableViewPrefs(), decoded.viewPrefs)
    }
}
