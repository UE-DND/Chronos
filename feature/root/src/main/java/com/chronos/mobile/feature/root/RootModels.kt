package com.chronos.mobile.feature.root

import com.chronos.mobile.feature.transfer.TransferDialogMode

enum class RootTab {
    TIMETABLE,
    MINE,
}

internal object RootRoute {
    const val TIMETABLE = "timetable"
    const val TIMETABLE_DETAILS = "timetable/details"
    const val MINE = "mine"
}

internal const val SecondaryPageEnterDuration = 320
internal const val SecondaryPageExitDuration = 260

data class RootUiState(
    val activeTab: RootTab = RootTab.TIMETABLE,
    val transferDialogMode: TransferDialogMode? = null,
)
