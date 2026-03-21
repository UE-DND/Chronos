package com.chronos.mobile.feature.timetable

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.Immutable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.produceState
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.alpha
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.lerp
import androidx.compose.ui.graphics.luminance
import androidx.compose.ui.layout.onSizeChanged
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.IntSize
import androidx.compose.ui.unit.dp
import androidx.compose.ui.platform.LocalDensity
import com.chronos.mobile.core.model.Course
import com.chronos.mobile.core.model.PeriodTime
import com.chronos.mobile.domain.model.TimetableCourseDisplayModel
import com.chronos.mobile.domain.model.TimetableGridModel
import java.time.Duration
import java.time.LocalDateTime
import java.time.LocalTime
import kotlinx.coroutines.delay

private const val MIN_TIME_REFRESH_DELAY_MILLIS = 1_000L

@Immutable
internal data class ParsedPeriodRange(
    val index: Int,
    val startTime: LocalTime,
    val endTime: LocalTime,
)

@Composable
internal fun timetableDayLabel(dayOfWeek: Int): String = when (dayOfWeek) {
    1 -> stringResource(R.string.timetable_day_monday)
    2 -> stringResource(R.string.timetable_day_tuesday)
    3 -> stringResource(R.string.timetable_day_wednesday)
    4 -> stringResource(R.string.timetable_day_thursday)
    5 -> stringResource(R.string.timetable_day_friday)
    6 -> stringResource(R.string.timetable_day_saturday)
    7 -> stringResource(R.string.timetable_day_sunday)
    else -> stringResource(R.string.timetable_day_unknown)
}

@Composable
internal fun timetableDayShortLabel(dayOfWeek: Int): String = when (dayOfWeek) {
    1 -> stringResource(R.string.timetable_day_short_monday)
    2 -> stringResource(R.string.timetable_day_short_tuesday)
    3 -> stringResource(R.string.timetable_day_short_wednesday)
    4 -> stringResource(R.string.timetable_day_short_thursday)
    5 -> stringResource(R.string.timetable_day_short_friday)
    6 -> stringResource(R.string.timetable_day_short_saturday)
    7 -> stringResource(R.string.timetable_day_short_sunday)
    else -> stringResource(R.string.timetable_day_short_unknown)
}

@Composable
fun TimetableGrid(
    displayedWeek: Int,
    isCurrentWeek: Boolean,
    gridModel: TimetableGridModel,
    courseDisplayModels: List<TimetableCourseDisplayModel>,
    hasWallpaper: Boolean,
    modifier: Modifier = Modifier,
    bottomContentPadding: Dp = 0.dp,
    rowHeight: Dp = 96.dp,
    sidebarWidth: Dp = 56.dp,
    enableAutoCenterCurrentPeriod: Boolean = true,
    enableVerticalScroll: Boolean = true,
    onCourseClick: ((Course) -> Unit)? = null,
) {
    MaterialTheme.colorScheme.surface.luminance() < 0.5f
    val verticalScrollState = rememberScrollState()
    val contentHeight = rowHeight * gridModel.displayedPeriodCount
    val visibleDayIndexMap = remember(gridModel.visibleDays) {
        gridModel.visibleDays.withIndex().associate { (index, day) -> day.dayOfWeek to index }
    }
    val parsedPeriods = remember(gridModel.periods) {
        parsePeriodRanges(gridModel.periods)
    }

    var viewportSize by remember { mutableStateOf(IntSize.Zero) }

    Box(
        modifier = modifier
            .fillMaxSize()
            .onSizeChanged { viewportSize = it }
            .background(if (hasWallpaper) Color.Transparent else MaterialTheme.colorScheme.surface),
    ) {
        val density = LocalDensity.current
        val currentTime by produceState(initialValue = LocalTime.now(), isCurrentWeek, parsedPeriods) {
            value = LocalTime.now()
            if (!isCurrentWeek) return@produceState
            while (true) {
                val now = LocalDateTime.now()
                delay(computeDelayUntilNextCurrentTimeRefreshMillis(now, parsedPeriods))
                value = LocalTime.now()
            }
        }
        val contentWidth = with(density) {
            (viewportSize.width.toDp() - sidebarWidth).coerceAtLeast(0.dp)
        }
        val columnWidth = if (gridModel.visibleDays.isEmpty()) 0.dp else contentWidth / gridModel.visibleDays.size
        var hasAutoCenteredCurrentWeek by remember(displayedWeek, isCurrentWeek) {
            mutableStateOf(false)
        }
        val currentPeriodIndex: Int? = remember(isCurrentWeek, parsedPeriods, currentTime) {
            if (!isCurrentWeek) return@remember null
            findCurrentPeriodIndex(parsedPeriods, currentTime)
        }

        LaunchedEffect(currentPeriodIndex, viewportSize.height, enableAutoCenterCurrentPeriod) {
            val target = currentPeriodIndex ?: return@LaunchedEffect
            if (!enableAutoCenterCurrentPeriod) return@LaunchedEffect
            if (viewportSize.height == 0) return@LaunchedEffect
            if (!isCurrentWeek || hasAutoCenteredCurrentWeek) return@LaunchedEffect
            val rowHeightPx = with(density) { rowHeight.toPx() }
            val viewportPx = viewportSize.height.toFloat()
            val targetOffset = ((target - 1) * rowHeightPx + rowHeightPx / 2 - viewportPx / 2)
                .toInt()
                .coerceAtLeast(0)
            verticalScrollState.scrollTo(targetOffset)
            hasAutoCenteredCurrentWeek = true
        }

        Column(modifier = Modifier.fillMaxSize()) {
            TimetableGridHeader(
                gridModel = gridModel,
                contentWidth = contentWidth,
                columnWidth = columnWidth,
                sidebarWidth = sidebarWidth,
                hasWallpaper = hasWallpaper,
            )

            val bodyModifier = Modifier
                .fillMaxWidth()
                .weight(1f)
                .padding(bottom = bottomContentPadding)
                .then(
                    if (enableVerticalScroll) {
                        Modifier.verticalScroll(verticalScrollState)
                    } else {
                        Modifier
                    },
                )

            Row(modifier = bodyModifier) {
                TimetablePeriodSidebar(
                    periods = gridModel.periods,
                    contentHeight = contentHeight,
                    rowHeight = rowHeight,
                    sidebarWidth = sidebarWidth,
                    hasWallpaper = hasWallpaper,
                    currentPeriodIndex = currentPeriodIndex,
                )

                Box(
                    modifier = Modifier
                        .height(contentHeight)
                        .width(contentWidth),
                ) {
                    TimetableGridBackground(hasWallpaper = hasWallpaper)

                    Box(modifier = Modifier.fillMaxSize()) {
                        courseDisplayModels.forEach { displayModel ->
                            val course = displayModel.course
                            val topOffset = rowHeight * (course.startPeriod - 1)
                            val leftOffset = columnWidth * visibleDayIndexMap.getValue(course.dayOfWeek)
                            val height = rowHeight * (course.endPeriod - course.startPeriod + 1)

                            TimetableCourseCard(
                                course = course,
                                isInDisplayedWeek = displayModel.isInDisplayedWeek,
                                height = height,
                                modifier = Modifier
                                    .padding(start = leftOffset, top = topOffset)
                                    .width(columnWidth)
                                    .height(height),
                                onClick = onCourseClick?.let { click -> { click(course) } },
                            )
                        }
                    }
                }
            }
        }
    }
}

internal fun parsePeriodRanges(periods: List<PeriodTime>): List<ParsedPeriodRange> =
    periods
        .map { period ->
            ParsedPeriodRange(
                index = period.index,
                startTime = runCatching { LocalTime.parse(period.startTime) }.getOrElse { LocalTime.MIDNIGHT },
                endTime = runCatching { LocalTime.parse(period.endTime) }.getOrElse { LocalTime.MIDNIGHT },
            )
        }
        .sortedBy { it.index }

internal fun findCurrentPeriodIndex(
    periods: List<ParsedPeriodRange>,
    now: LocalTime,
): Int? {
    periods.firstOrNull { period ->
        !now.isBefore(period.startTime) && !now.isAfter(period.endTime)
    }?.let { return it.index }

    periods.firstOrNull { period ->
        now.isBefore(period.startTime)
    }?.let { return it.index }

    return periods.lastOrNull()?.index
}

internal fun computeDelayUntilNextCurrentTimeRefreshMillis(
    now: LocalDateTime,
    periods: List<ParsedPeriodRange>,
    minimumDelayMillis: Long = MIN_TIME_REFRESH_DELAY_MILLIS,
): Long {
    val nowTime = now.toLocalTime()
    val nextBoundaryToday = periods.firstNotNullOfOrNull { period ->
        when {
            !nowTime.isBefore(period.startTime) && !nowTime.isAfter(period.endTime) ->
                period.endTime.plusNanos(1)
            nowTime.isBefore(period.startTime) ->
                period.startTime
            else -> null
        }
    }
    val nextBoundary = if (nextBoundaryToday != null) {
        var candidate = now.toLocalDate().atTime(nextBoundaryToday)
        if (!candidate.isAfter(now)) {
            candidate = candidate.plusDays(1)
        }
        candidate
    } else {
        now.toLocalDate().plusDays(1).atStartOfDay()
    }
    return Duration.between(now, nextBoundary).toMillis().coerceAtLeast(minimumDelayMillis)
}

@Composable
private fun TimetableGridHeader(
    gridModel: TimetableGridModel,
    contentWidth: Dp,
    columnWidth: Dp,
    sidebarWidth: Dp,
    hasWallpaper: Boolean,
) {
    val isDarkTheme = MaterialTheme.colorScheme.surface.luminance() < 0.5f

    Row(
        modifier = Modifier
            .fillMaxWidth()
            .background(
                MaterialTheme.colorScheme.surface.copy(
                    alpha = if (hasWallpaper) {
                        if (isDarkTheme) 0.72f else 0.54f
                    } else {
                        1f
                    },
                ),
            )
            .padding(vertical = 8.dp),
        verticalAlignment = Alignment.CenterVertically,
    ) {
        Column(
            modifier = Modifier.width(sidebarWidth),
            horizontalAlignment = Alignment.CenterHorizontally,
        ) {
            Text(
                text = gridModel.monthLabel,
                style = MaterialTheme.typography.bodySmall,
                color = MaterialTheme.colorScheme.onSurfaceVariant,
            )
            Text(
                text = stringResource(R.string.timetable_month_suffix),
                style = MaterialTheme.typography.bodySmall,
                color = MaterialTheme.colorScheme.onSurfaceVariant,
            )
        }
        Row(modifier = Modifier.width(contentWidth)) {
            gridModel.visibleDays.forEach { day ->
                Column(
                    modifier = Modifier.width(columnWidth),
                    horizontalAlignment = Alignment.CenterHorizontally,
                ) {
                    Text(
                        text = timetableDayShortLabel(day.dayOfWeek),
                        style = MaterialTheme.typography.bodySmall,
                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                    )
                    Spacer(modifier = Modifier.height(4.dp))
                    Surface(
                        modifier = Modifier.size(26.dp),
                        shape = CircleShape,
                        color = if (day.isToday) MaterialTheme.colorScheme.primary else Color.Transparent,
                    ) {
                        Box(contentAlignment = Alignment.Center) {
                            Text(
                                text = day.date.dayOfMonth.toString(),
                                color = if (day.isToday) {
                                    MaterialTheme.colorScheme.onPrimary
                                } else {
                                    MaterialTheme.colorScheme.onSurface
                                },
                                style = MaterialTheme.typography.bodyMedium,
                            )
                        }
                    }
                }
            }
        }
    }
}

@Composable
private fun TimetablePeriodSidebar(
    periods: List<com.chronos.mobile.core.model.PeriodTime>,
    contentHeight: Dp,
    rowHeight: Dp,
    sidebarWidth: Dp,
    hasWallpaper: Boolean,
    currentPeriodIndex: Int?,
) {
    val isDarkTheme = MaterialTheme.colorScheme.surface.luminance() < 0.5f

    Column(
        modifier = Modifier
            .width(sidebarWidth)
            .height(contentHeight)
            .background(
                MaterialTheme.colorScheme.surface.copy(
                    alpha = if (hasWallpaper) {
                        if (isDarkTheme) 0.72f else 0.54f
                    } else {
                        1f
                    },
                ),
            ),
    ) {
        periods.forEach { period ->
            val isActive = period.index == currentPeriodIndex
            Column(
                modifier = Modifier
                    .height(rowHeight)
                    .fillMaxWidth()
                    .padding(horizontal = 4.dp, vertical = 3.dp)
                    .clip(MaterialTheme.shapes.large)
                    .background(
                        if (isActive) MaterialTheme.colorScheme.primaryContainer
                        else Color.Transparent,
                    ),
                horizontalAlignment = Alignment.CenterHorizontally,
                verticalArrangement = Arrangement.Center,
            ) {
                Text(
                    period.index.toString(),
                    fontWeight = FontWeight.Bold,
                    color = if (isActive) MaterialTheme.colorScheme.onPrimaryContainer
                    else Color.Unspecified,
                )
                Spacer(modifier = Modifier.height(4.dp))
                Text(
                    text = "${period.startTime}\n${period.endTime}",
                    style = MaterialTheme.typography.labelSmall,
                    textAlign = TextAlign.Center,
                    color = if (isActive) MaterialTheme.colorScheme.onPrimaryContainer
                    else MaterialTheme.colorScheme.onSurfaceVariant,
                )
            }
        }
    }
}

@Composable
private fun TimetableGridBackground(
    hasWallpaper: Boolean,
) {
    val isDarkTheme = MaterialTheme.colorScheme.surface.luminance() < 0.5f
    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(
                MaterialTheme.colorScheme.surface.copy(
                    alpha = if (hasWallpaper) {
                        if (isDarkTheme) 0.62f else 0.38f
                    } else {
                        1f
                    },
                ),
            ),
    )
}

@Composable
private fun TimetableCourseCard(
    course: Course,
    isInDisplayedWeek: Boolean,
    height: Dp,
    modifier: Modifier = Modifier,
    onClick: (() -> Unit)? = null,
) {
    val alpha = if (isInDisplayedWeek) 1f else 0.45f
    val isDarkTheme = MaterialTheme.colorScheme.surface.luminance() < 0.5f
    val rawCardBackground = parseColor(course.color)
    val surfaceColor = MaterialTheme.colorScheme.surface
    val baseTextColor = if (isDarkTheme) {
        lerp(MaterialTheme.colorScheme.onSurface, rawCardBackground, 0.18f)
    } else {
        parseColor(course.textColor)
    }
    val cardBackground = if (isDarkTheme) {
        lerp(rawCardBackground, surfaceColor, 0.58f)
    } else {
        rawCardBackground
    }
    val secondaryTextColor = baseTextColor.copy(alpha = 0.8f)
    val locationText = remember(course.location) {
        course.location
            .trim()
            .split(Regex("\\s+"))
            .filter { it.isNotBlank() }
            .joinToString(separator = "\n")
    }

    val cardModifier = modifier
        .padding(vertical = 3.dp)
        .alpha(alpha)

    if (onClick != null) {
        Card(
            modifier = cardModifier,
            shape = MaterialTheme.shapes.medium,
            colors = CardDefaults.cardColors(containerColor = cardBackground),
            border = BorderStroke(1.dp, baseTextColor.copy(alpha = 0.12f)),
            elevation = CardDefaults.cardElevation(defaultElevation = 2.dp),
            onClick = onClick,
        ) {
            TimetableCourseCardContent(
                course = course,
                isInDisplayedWeek = isInDisplayedWeek,
                height = height,
                baseTextColor = baseTextColor,
                secondaryTextColor = secondaryTextColor,
                locationText = locationText,
            )
        }
    } else {
        Card(
            modifier = cardModifier,
            shape = MaterialTheme.shapes.medium,
            colors = CardDefaults.cardColors(containerColor = cardBackground),
            border = BorderStroke(1.dp, baseTextColor.copy(alpha = 0.12f)),
            elevation = CardDefaults.cardElevation(defaultElevation = 2.dp),
        ) {
            TimetableCourseCardContent(
                course = course,
                isInDisplayedWeek = isInDisplayedWeek,
                height = height,
                baseTextColor = baseTextColor,
                secondaryTextColor = secondaryTextColor,
                locationText = locationText,
            )
        }
    }
}

@Composable
private fun TimetableCourseCardContent(
    course: Course,
    isInDisplayedWeek: Boolean,
    height: Dp,
    baseTextColor: Color,
    secondaryTextColor: Color,
    locationText: String,
) {
    Column(
        modifier = Modifier
            .fillMaxWidth()
            .height(height)
            .padding(8.dp),
    ) {
        if (isInDisplayedWeek) {
            Text(
                text = course.name,
                color = baseTextColor,
                style = MaterialTheme.typography.labelLarge,
            )
        } else {
            Surface(
                shape = MaterialTheme.shapes.small,
                color = baseTextColor.copy(alpha = 0.12f),
            ) {
                Text(
                    text = stringResource(R.string.timetable_course_non_current_week_prefix),
                    color = secondaryTextColor,
                    style = MaterialTheme.typography.labelSmall,
                    modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp),
                )
            }
            Spacer(modifier = Modifier.height(2.dp))
            Text(
                text = course.name,
                color = baseTextColor,
                style = MaterialTheme.typography.labelLarge,
            )
        }
        Spacer(modifier = Modifier.height(6.dp))
        Text(
            text = locationText,
            color = secondaryTextColor,
            style = MaterialTheme.typography.labelSmall,
        )
        Spacer(modifier = Modifier.weight(1f))
        Text(
            text = course.teacher,
            color = secondaryTextColor,
            style = MaterialTheme.typography.labelSmall,
        )
    }
}
