package com.chronos.mobile.feature.root

enum class RootTab {
    TIMETABLE,
    MINE,
}

internal object RootRoute {
    const val TIMETABLE = "timetable"
    const val TIMETABLE_DETAILS = "timetable/details"
    const val TIMETABLE_COURSE_EDITOR = "timetable/course-editor"
    const val MINE = "mine"
    const val MANAGE_TIMETABLES = "secondary/manage-timetables"
    const val TRANSFER_IMPORT = "secondary/transfer/import"
    const val TRANSFER_IMPORT_CONFIRM = "secondary/transfer/import/confirm"
    const val TRANSFER_EXPORT = "secondary/transfer/export"
    const val WALLPAPER = "secondary/wallpaper"
}

internal const val SecondaryPageEnterDuration = 320
internal const val SecondaryPageExitDuration = 260

data class RootUiState(
    val activeTab: RootTab = RootTab.TIMETABLE,
)
