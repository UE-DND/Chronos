package com.chronos.mobile.feature.timetable

import android.view.HapticFeedbackConstants
import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.gestures.detectTapGestures
import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.WindowInsets
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.statusBars
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.layout.windowInsetsPadding
import androidx.compose.foundation.pager.HorizontalPager
import androidx.compose.foundation.pager.rememberPagerState
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.EditNote
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Slider
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.material3.TopAppBar
import androidx.compose.material3.TopAppBarDefaults
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.produceState
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.runtime.snapshotFlow
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.alpha
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.lerp
import androidx.compose.ui.input.pointer.pointerInput
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.layout.onSizeChanged
import androidx.compose.ui.platform.LocalDensity
import androidx.compose.ui.platform.LocalView
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.onClick
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.IntSize
import androidx.compose.ui.unit.dp
import androidx.core.net.toUri
import coil.compose.AsyncImage
import com.chronos.mobile.core.model.Course
import com.chronos.mobile.core.model.PeriodTime
import com.chronos.mobile.core.model.Timetable
import com.chronos.mobile.core.model.TimetableDetails
import java.time.DayOfWeek
import java.time.LocalDate
import java.time.LocalTime
import java.time.format.DateTimeFormatter
import java.time.temporal.TemporalAdjusters
import java.util.Locale
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.distinctUntilChanged
import kotlin.math.roundToInt

@Composable
internal fun TimetableScreen(
    state: TimetableUiState,
    rootContentPadding: PaddingValues,
    onEditTimetableDetails: () -> Unit,
    onCourseClick: (Course) -> Unit,
    onDisplayedWeekChange: (Int) -> Unit,
) {
    val currentTimetable = state.appState.currentTimetable ?: return
    val isDarkTheme = isSystemInDarkTheme()
    val startWeek = currentTimetable.details.startWeek
    val weekCount = (currentTimetable.details.endWeek - startWeek + 1).coerceAtLeast(1)
    var suppressPagerWeekSync by remember(currentTimetable.id) { mutableStateOf(true) }
    val pagerState = rememberPagerState(
        initialPage = (state.displayedWeek - startWeek).coerceIn(0, weekCount - 1),
        pageCount = { weekCount },
    )

    LaunchedEffect(pagerState, startWeek) {
        snapshotFlow { pagerState.settledPage }
            .distinctUntilChanged()
            .collect { page ->
                if (suppressPagerWeekSync) {
                    return@collect
                }
                val settledWeek = startWeek + page
                if (settledWeek != state.displayedWeek) {
                    onDisplayedWeekChange(settledWeek)
                }
            }
    }

    LaunchedEffect(state.displayedWeek, startWeek, weekCount) {
        val targetPage = (state.displayedWeek - startWeek).coerceIn(0, weekCount - 1)
        if (pagerState.currentPage != targetPage || pagerState.settledPage != targetPage) {
            suppressPagerWeekSync = true
            pagerState.scrollToPage(targetPage)
        }
        suppressPagerWeekSync = false
    }

    Scaffold(
        modifier = Modifier.fillMaxSize(),
        contentWindowInsets = WindowInsets(0, 0, 0, 0),
        topBar = {
            ChronosTopBar(
                state = state,
                onEditTimetableDetails = onEditTimetableDetails,
                onJumpToToday = { onDisplayedWeekChange(state.academicWeek) },
                onDisplayedWeekChange = onDisplayedWeekChange,
            )
        },
    ) { paddingValues ->
        Box(
            modifier = Modifier
                .fillMaxSize()
                .padding(
                    PaddingValues(
                        top = paddingValues.calculateTopPadding(),
                    ),
                ),
        ) {
            val wallpaperUri = state.appState.wallpaperUri
            if (!wallpaperUri.isNullOrBlank()) {
                AsyncImage(
                    model = wallpaperUri.toUri(),
                    contentDescription = null,
                    modifier = Modifier.fillMaxSize(),
                    contentScale = ContentScale.Crop,
                    alpha = if (isDarkTheme) 0.72f else 0.88f,
                )
            }

            HorizontalPager(
                state = pagerState,
                modifier = Modifier.fillMaxSize(),
                userScrollEnabled = weekCount > 1,
                beyondViewportPageCount = 1,
            ) { page ->
                val displayedWeek = startWeek + page
                val gridModel = state.weekGridModels[displayedWeek]
                if (gridModel != null) {
                    TimetablePage(
                        timetable = currentTimetable,
                        displayedWeek = displayedWeek,
                        academicWeek = state.academicWeek,
                        today = state.today,
                        isCurrentWeek = displayedWeek == state.academicWeek,
                        bottomContentPadding = rootContentPadding.calculateBottomPadding(),
                        hasWallpaper = !wallpaperUri.isNullOrBlank(),
                        gridModel = gridModel,
                        onCourseClick = onCourseClick,
                    )
                }
            }
        }
    }
}

internal fun calculateWeekSliderSteps(
    startWeek: Int,
    endWeek: Int,
): Int = (endWeek - startWeek - 1).coerceAtLeast(0)

@OptIn(ExperimentalMaterial3Api::class)
@Composable
private fun ChronosTopBar(
    state: TimetableUiState,
    onEditTimetableDetails: () -> Unit,
    onJumpToToday: () -> Unit,
    onDisplayedWeekChange: (Int) -> Unit,
) {
    val isDarkTheme = isSystemInDarkTheme()
    val view = LocalView.current
    val dateFormatter = remember { DateTimeFormatter.ofPattern("M/d", Locale.CHINA) }
    val currentTimetable = state.appState.currentTimetable
    val startWeek = currentTimetable?.details?.startWeek ?: state.displayedWeek
    val endWeek = currentTimetable?.details?.endWeek ?: state.displayedWeek
    val sliderSteps = calculateWeekSliderSteps(startWeek, endWeek)
    val weekRangeText = remember(state.gridModel) {
        val weekDays = state.gridModel?.visibleDays.orEmpty()
        val firstDate = weekDays.firstOrNull()?.date
        val lastDate = weekDays.lastOrNull()?.date
        if (firstDate == null || lastDate == null) {
            state.today.format(DateTimeFormatter.ofPattern("yyyy/M/d", Locale.CHINA))
        } else {
            "${firstDate.format(dateFormatter)} - ${lastDate.format(dateFormatter)}"
        }
    }
    var weekSliderVisible by remember(state.displayedWeekTimetableId) { mutableStateOf(false) }
    var sliderWeek by remember(state.displayedWeekTimetableId) { mutableIntStateOf(state.displayedWeek) }
    var lastHapticSliderWeek by remember(state.displayedWeekTimetableId) { mutableIntStateOf(state.displayedWeek) }
    val jumpToTodayLabel = stringResource(R.string.timetable_jump_to_today)
    val headerGestureDescription = stringResource(R.string.timetable_header_gesture_description)

    LaunchedEffect(state.displayedWeek, weekSliderVisible) {
        if (!weekSliderVisible) {
            sliderWeek = state.displayedWeek
            lastHapticSliderWeek = state.displayedWeek
        }
    }

    TopAppBar(
        modifier = Modifier.windowInsetsPadding(WindowInsets.statusBars),
        colors = TopAppBarDefaults.topAppBarColors(
            containerColor = MaterialTheme.colorScheme.surface.copy(
                alpha = if (isDarkTheme) 0.78f else 0.60f,
            ),
        ),
        title = {
            Box(
                modifier = Modifier
                    .padding(end = 8.dp)
                    .fillMaxWidth()
                    .height(72.dp)
                    .semantics(mergeDescendants = true) {
                        contentDescription = headerGestureDescription
                        onClick(label = jumpToTodayLabel) {
                            onJumpToToday()
                            true
                        }
                    }
                    .pointerInput(onJumpToToday, startWeek, endWeek, state.displayedWeek, weekSliderVisible) {
                        detectTapGestures(
                            onTap = {
                                view.performHapticFeedback(HapticFeedbackConstants.KEYBOARD_TAP)
                                if (weekSliderVisible) {
                                    weekSliderVisible = false
                                } else {
                                    onJumpToToday()
                                }
                            },
                            onLongPress = {
                                if (startWeek < endWeek) {
                                    view.performHapticFeedback(HapticFeedbackConstants.LONG_PRESS)
                                    sliderWeek = state.displayedWeek
                                    lastHapticSliderWeek = state.displayedWeek
                                    weekSliderVisible = true
                                }
                            },
                        )
                    },
            ) {
                if (weekSliderVisible && startWeek < endWeek) {
                    Column(
                        modifier = Modifier.fillMaxSize(),
                        verticalArrangement = Arrangement.Center,
                    ) {
                        Slider(
                            value = sliderWeek.toFloat(),
                            onValueChange = { value ->
                                val targetWeek = value.roundToInt().coerceIn(startWeek, endWeek)
                                if (targetWeek != lastHapticSliderWeek) {
                                    view.performHapticFeedback(HapticFeedbackConstants.CLOCK_TICK)
                                    lastHapticSliderWeek = targetWeek
                                }
                                sliderWeek = targetWeek
                                onDisplayedWeekChange(targetWeek)
                            },
                            valueRange = startWeek.toFloat()..endWeek.toFloat(),
                            steps = sliderSteps,
                            onValueChangeFinished = {
                                weekSliderVisible = false
                            },
                            modifier = Modifier.fillMaxWidth(),
                        )
                        Text(
                            text = stringResource(R.string.timetable_header_displayed_week, sliderWeek),
                            style = MaterialTheme.typography.labelLarge,
                            fontWeight = FontWeight.Bold,
                        )
                    }
                } else {
                    Column(
                        modifier = Modifier.fillMaxSize(),
                        verticalArrangement = Arrangement.Center,
                    ) {
                        Text(
                            text = weekRangeText,
                            style = MaterialTheme.typography.headlineSmall,
                            fontWeight = FontWeight.Bold,
                        )
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Text(
                                text = stringResource(R.string.timetable_header_displayed_week, state.displayedWeek),
                                style = MaterialTheme.typography.bodySmall,
                                color = MaterialTheme.colorScheme.onSurfaceVariant,
                            )
                            if (state.displayedWeek == state.academicWeek) {
                                Text(
                                    text = " " + state.today.dayOfWeek.getDisplayName(
                                        java.time.format.TextStyle.SHORT,
                                        Locale.CHINA,
                                    ),
                                    style = MaterialTheme.typography.bodySmall,
                                    fontWeight = FontWeight.Bold,
                                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                                )
                            }
                        }
                    }
                }
            }
        },
        actions = {
            IconButton(onClick = onEditTimetableDetails) {
                Icon(
                    Icons.Default.EditNote,
                    contentDescription = stringResource(R.string.timetable_edit_current),
                )
            }
        },
    )
}

@Composable
internal fun EmptyTimetableState(
    modifier: Modifier = Modifier,
    onImportTimetable: () -> Unit,
) {
    Column(
        modifier = modifier
            .fillMaxSize()
            .padding(horizontal = 24.dp, vertical = 32.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center,
    ) {
        Image(
            painter = painterResource(id = R.drawable.ic_empty_timetable_state),
            contentDescription = stringResource(R.string.timetable_empty_illustration),
            modifier = Modifier.size(220.dp),
        )
        Spacer(modifier = Modifier.height(12.dp))
        Text(
            text = stringResource(R.string.timetable_brand_name),
            style = MaterialTheme.typography.labelLarge,
            color = MaterialTheme.colorScheme.primary,
        )
        Spacer(modifier = Modifier.height(8.dp))
        Text(
            text = stringResource(R.string.timetable_empty_title),
            style = MaterialTheme.typography.headlineMedium,
            textAlign = TextAlign.Center,
        )
        Spacer(modifier = Modifier.height(10.dp))
        Text(
            text = stringResource(R.string.timetable_empty_subtitle),
            style = MaterialTheme.typography.titleMedium,
            textAlign = TextAlign.Center,
            color = MaterialTheme.colorScheme.tertiary,
        )
        Spacer(modifier = Modifier.height(28.dp))
        OutlinedButton(
            onClick = onImportTimetable,
            shape = MaterialTheme.shapes.large,
            border = BorderStroke(1.dp, MaterialTheme.colorScheme.primary.copy(alpha = 0.35f)),
        ) {
            Text(stringResource(R.string.timetable_import_action))
        }
    }
}

internal data class TimetableCourseDisplayModel(
    val course: Course,
    val isInDisplayedWeek: Boolean,
)

internal data class ParsedPeriodRange(
    val index: Int,
    val startTime: LocalTime,
    val endTime: LocalTime,
)

private data class CourseSlotKey(
    val dayOfWeek: Int,
    val startPeriod: Int,
    val endPeriod: Int,
)

private data class FutureCourseCandidate(
    val course: Course,
    val nextOccurrenceDate: LocalDate,
    val originalIndex: Int,
)

internal fun buildTimetableCourseDisplayModels(
    timetable: Timetable,
    visibleDayOfWeeks: Set<Int>,
    displayedWeek: Int,
    academicWeek: Int,
    today: LocalDate,
): List<TimetableCourseDisplayModel> {
    val visibleCourses = timetable.courses.withIndex().filter { (_, course) ->
        course.dayOfWeek in visibleDayOfWeeks
    }
    val currentEntries = visibleCourses
        .filter { (_, course) -> course.weeks.isEmpty() || displayedWeek in course.weeks }
        .map { (_, course) ->
            TimetableCourseDisplayModel(
                course = course,
                isInDisplayedWeek = true,
            )
        }
    if (!timetable.details.showNonCurrentWeekCourses) {
        return currentEntries
    }

    val occupiedSlots = currentEntries.mapTo(mutableSetOf()) { it.course.slotKey() }
    val futureCandidatesBySlot = linkedMapOf<CourseSlotKey, FutureCourseCandidate>()
    visibleCourses.forEach { (originalIndex, course) ->
        if (course.weeks.isEmpty() || displayedWeek in course.weeks) return@forEach
        val nextWeek = course.weeks
            .filter { it >= academicWeek }
            .minOrNull()
            ?: return@forEach
        val slotKey = course.slotKey()
        if (slotKey in occupiedSlots) return@forEach
        val candidate = FutureCourseCandidate(
            course = course,
            nextOccurrenceDate = resolveCourseDate(
                details = timetable.details,
                week = nextWeek,
                dayOfWeek = course.dayOfWeek,
                today = today,
            ),
            originalIndex = originalIndex,
        )
        val current = futureCandidatesBySlot[slotKey]
        if (current == null || candidate.isBetterFutureCandidateThan(current)) {
            futureCandidatesBySlot[slotKey] = candidate
        }
    }

    val futureEntries = futureCandidatesBySlot.values
        .sortedWith(
            compareBy<FutureCourseCandidate> { it.originalIndex }
                .thenBy { it.nextOccurrenceDate }
        )
        .map { candidate ->
            TimetableCourseDisplayModel(
                course = candidate.course,
                isInDisplayedWeek = false,
            )
        }
    return currentEntries + futureEntries
}

private fun Course.slotKey(): CourseSlotKey =
    CourseSlotKey(
        dayOfWeek = dayOfWeek,
        startPeriod = startPeriod,
        endPeriod = endPeriod,
    )

private fun FutureCourseCandidate.isBetterFutureCandidateThan(other: FutureCourseCandidate): Boolean =
    compareValuesBy(
        this,
        other,
        FutureCourseCandidate::nextOccurrenceDate,
        FutureCourseCandidate::originalIndex,
    ) < 0

private fun resolveCourseDate(
    details: TimetableDetails,
    week: Int,
    dayOfWeek: Int,
    today: LocalDate,
): LocalDate {
    val termStart = runCatching { LocalDate.parse(details.termStartDate) }.getOrElse {
        today.with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY))
    }
    return termStart
        .plusWeeks((week - details.startWeek).toLong())
        .with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY))
        .plusDays((dayOfWeek - 1).toLong())
}

internal fun parsePeriodRanges(periods: List<PeriodTime>): List<ParsedPeriodRange> =
    periods.map { period ->
        ParsedPeriodRange(
            index = period.index,
            startTime = LocalTime.parse(period.startTime),
            endTime = LocalTime.parse(period.endTime),
        )
    }

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

@Composable
private fun TimetablePage(
    timetable: Timetable,
    displayedWeek: Int,
    academicWeek: Int,
    today: LocalDate,
    isCurrentWeek: Boolean,
    bottomContentPadding: Dp,
    gridModel: com.chronos.mobile.domain.model.TimetableGridModel,
    hasWallpaper: Boolean,
    onCourseClick: (Course) -> Unit,
) {
    val isDarkTheme = isSystemInDarkTheme()
    val rowHeight = 96.dp
    val sidebarWidth = 56.dp
    val verticalScrollState = rememberScrollState()
    val contentHeight = rowHeight * gridModel.displayedPeriodCount
    val visibleDayIndexMap = remember(gridModel.visibleDays) {
        gridModel.visibleDays.withIndex().associate { (index, day) -> day.dayOfWeek to index }
    }
    val courseDisplayModels = remember(
        timetable,
        visibleDayIndexMap,
        displayedWeek,
        academicWeek,
        today,
    ) {
        buildTimetableCourseDisplayModels(
            timetable = timetable,
            visibleDayOfWeeks = visibleDayIndexMap.keys,
            displayedWeek = displayedWeek,
            academicWeek = academicWeek,
            today = today,
        )
    }
    val parsedPeriods = remember(gridModel.periods) {
        parsePeriodRanges(gridModel.periods)
    }

    var viewportSize by remember { mutableStateOf(IntSize.Zero) }

    Box(
        modifier = Modifier
            .fillMaxSize()
            .onSizeChanged { viewportSize = it }
            .background(if (hasWallpaper) Color.Transparent else MaterialTheme.colorScheme.surface),
    ) {
        val density = LocalDensity.current
        val currentTime by produceState(initialValue = LocalTime.now(), isCurrentWeek) {
            value = LocalTime.now()
            if (!isCurrentWeek) return@produceState
            while (true) {
                delay(30_000)
                value = LocalTime.now()
            }
        }
        val contentWidth = with(density) {
            (viewportSize.width.toDp() - sidebarWidth).coerceAtLeast(0.dp)
        }
        val columnWidth = if (gridModel.visibleDays.isEmpty()) 0.dp else contentWidth / gridModel.visibleDays.size
        var hasAutoCenteredCurrentWeek by remember(timetable.id, displayedWeek, isCurrentWeek) {
            mutableStateOf(false)
        }
        val currentPeriodIndex: Int? = remember(isCurrentWeek, parsedPeriods, currentTime) {
            if (!isCurrentWeek) return@remember null
            findCurrentPeriodIndex(parsedPeriods, currentTime)
        }

        LaunchedEffect(currentPeriodIndex, viewportSize.height) {
            val target = currentPeriodIndex ?: return@LaunchedEffect
            if (viewportSize.height == 0) return@LaunchedEffect
            if (!isCurrentWeek || hasAutoCenteredCurrentWeek) return@LaunchedEffect
            val rowHeightPx = with(density) { rowHeight.toPx() }
            val viewportPx = viewportSize.height.toFloat()
            val targetOffset = ((target - 1) * rowHeightPx + rowHeightPx / 2 - viewportPx / 2)
                .toInt().coerceAtLeast(0)
            verticalScrollState.scrollTo(targetOffset)
            hasAutoCenteredCurrentWeek = true
        }

        Column(modifier = Modifier.fillMaxSize()) {
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
                                text = day.shortLabel,
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

            Row(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(bottom = bottomContentPadding)
                    .verticalScroll(verticalScrollState),
            ) {
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
                    gridModel.periods.forEach { period ->
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

                Box(
                    modifier = Modifier
                        .height(contentHeight)
                        .width(contentWidth),
                ) {
                    TimetableGridBackground(
                        hasWallpaper = hasWallpaper,
                    )

                    Box(modifier = Modifier.fillMaxSize()) {
                        courseDisplayModels.forEach { displayModel ->
                            val course = displayModel.course
                            val topOffset = rowHeight * (course.startPeriod - 1)
                            val leftOffset = columnWidth * visibleDayIndexMap.getValue(course.dayOfWeek)
                            val height = rowHeight * (course.endPeriod - course.startPeriod + 1)

                            CourseCard(
                                course = course,
                                isInDisplayedWeek = displayModel.isInDisplayedWeek,
                                height = height,
                                modifier = Modifier
                                    .padding(start = leftOffset, top = topOffset)
                                    .width(columnWidth)
                                    .height(height),
                                onClick = { onCourseClick(course) },
                            )
                        }
                    }
                }
            }
        }
    }
}

@Composable
private fun TimetableGridBackground(
    hasWallpaper: Boolean,
) {
    val isDarkTheme = isSystemInDarkTheme()
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
private fun CourseCard(
    course: Course,
    isInDisplayedWeek: Boolean,
    height: Dp,
    modifier: Modifier = Modifier,
    onClick: () -> Unit,
) {
    val alpha = if (isInDisplayedWeek) 1f else 0.45f
    val isDarkTheme = isSystemInDarkTheme()
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

    Card(
        modifier = modifier
            .padding(vertical = 3.dp)
            .alpha(alpha),
        shape = MaterialTheme.shapes.medium,
        colors = CardDefaults.cardColors(containerColor = cardBackground),
        border = BorderStroke(1.dp, baseTextColor.copy(alpha = 0.12f)),
        elevation = CardDefaults.cardElevation(defaultElevation = 2.dp),
        onClick = onClick,
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
}
