package com.chronos.mobile.core.model

import kotlinx.serialization.Serializable

@Serializable
data class OnlineSchedulePayload(
    val yearTerm: String = "",
    val weekNum: String = "",
    val nowMonth: String = "",
    val yearTermList: List<String> = emptyList(),
    val weekList: List<String> = emptyList(),
    val weekDayList: List<OnlineScheduleWeekDay> = emptyList(),
    val eventList: List<OnlineScheduleEvent> = emptyList(),
)

@Serializable
data class OnlineScheduleWeekDay(
    val weekDay: String = "",
    val weekDate: String = "",
    val today: Boolean = false,
)

@Serializable
data class OnlineScheduleEvent(
    val weekNum: String = "",
    val weekDay: String = "",
    val weekList: List<String> = emptyList(),
    val weekCover: String = "",
    val sessionList: List<String> = emptyList(),
    val sessionStart: String = "",
    val sessionLast: String = "",
    val eventName: String = "",
    val address: String = "",
    val memberName: String = "",
    val duplicateGroupType: String = "",
    val duplicateGroup: Int = 0,
    val eventType: String = "",
    val eventID: String = "",
)
