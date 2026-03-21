package com.chronos.mobile.core.timetableui

import androidx.compose.ui.graphics.Color
import androidx.core.graphics.toColorInt

internal fun parseColor(hex: String): Color = Color(hex.toColorInt())
