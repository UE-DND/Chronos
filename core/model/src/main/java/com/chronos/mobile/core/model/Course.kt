package com.chronos.mobile.core.model

import kotlinx.serialization.Serializable

@Serializable
data class Course(
    val id: String,
    val name: String,
    val teacher: String,
    val location: String,
    val dayOfWeek: Int,
    val startPeriod: Int,
    val endPeriod: Int,
    val color: String,
    val textColor: String = "#21005D",
    val weeks: List<Int> = emptyList(),
)
