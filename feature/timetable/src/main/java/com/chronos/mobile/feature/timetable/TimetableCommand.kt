package com.chronos.mobile.feature.timetable

sealed interface TimetableCommand {
    data object OpenManageTimetables : TimetableCommand
    data object JumpToCurrentWeek : TimetableCommand
}
