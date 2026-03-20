package com.chronos.mobile.feature.timetable

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.WindowInsets
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.statusBars
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.layout.windowInsetsPadding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.filled.Add
import androidx.compose.material3.DatePicker
import androidx.compose.material3.DatePickerState
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Scaffold
import androidx.compose.material3.SelectableDates
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.material3.TopAppBar
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.unit.dp
import com.chronos.mobile.core.model.TimetableImportSource
import com.chronos.mobile.core.model.TimetableDetails
import com.chronos.mobile.core.model.defaultPeriodTimes
import com.chronos.mobile.domain.model.PeriodTimeDraft
import com.chronos.mobile.domain.model.TimetableDetailsDraft
import java.time.LocalDate
import java.time.ZoneId
import java.time.format.DateTimeParseException

@OptIn(ExperimentalMaterial3Api::class)
@Composable
internal fun TimetableDetailsEditorScreen(
    modifier: Modifier = Modifier,
    initialState: TimetableDetailsDraft,
    onDismiss: () -> Unit,
    onSave: (TimetableDetailsDraft) -> Unit,
) {
    var editor by remember(initialState) { mutableStateOf(initialState) }
    var datePickerExpanded by remember { mutableStateOf(false) }
    val datePickerState = rememberTermStartDatePickerState(editor.termStartDate)

    Surface(
        modifier = modifier.fillMaxSize(),
        color = MaterialTheme.colorScheme.surface,
    ) {
        Scaffold(
            topBar = {
                TopAppBar(
                    modifier = Modifier.windowInsetsPadding(WindowInsets.statusBars),
                    title = { Text(stringResource(R.string.timetable_edit_current)) },
                    navigationIcon = {
                        IconButton(onClick = onDismiss) {
                            Icon(
                                Icons.AutoMirrored.Filled.ArrowBack,
                                contentDescription = stringResource(R.string.timetable_back),
                            )
                        }
                    },
                    actions = {
                        TextButton(
                            enabled = editor.name.isNotBlank(),
                            onClick = { onSave(editor) },
                        ) {
                            Text(stringResource(R.string.timetable_save))
                        }
                    },
                )
            },
        ) { paddingValues ->
            LazyColumn(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(paddingValues)
                    .padding(horizontal = 20.dp, vertical = 16.dp),
                verticalArrangement = Arrangement.spacedBy(12.dp),
            ) {
                item {
                    OutlinedTextField(
                        value = editor.name,
                        onValueChange = { editor = editor.copy(name = it) },
                        label = { Text(stringResource(R.string.timetable_name_label)) },
                        modifier = Modifier.fillMaxWidth(),
                        singleLine = true,
                    )
                }
                item {
                    OutlinedTextField(
                        value = editor.termStartDate,
                        onValueChange = {},
                        label = { Text(stringResource(R.string.timetable_term_start_date_label)) },
                        modifier = Modifier.fillMaxWidth(),
                        singleLine = true,
                        readOnly = true,
                        placeholder = { Text(stringResource(R.string.timetable_term_start_date_placeholder)) },
                    )
                }
                item {
                    OutlinedButton(
                        onClick = { datePickerExpanded = !datePickerExpanded },
                        modifier = Modifier.fillMaxWidth(),
                    ) {
                        Text(
                            if (datePickerExpanded) {
                                stringResource(R.string.timetable_cancel)
                            } else {
                                stringResource(R.string.timetable_term_start_date_pick)
                            },
                        )
                    }
                }
                if (datePickerExpanded) {
                    item {
                        Surface(
                            shape = MaterialTheme.shapes.extraLarge,
                            color = MaterialTheme.colorScheme.surfaceContainerLowest,
                            border = BorderStroke(1.dp, MaterialTheme.colorScheme.outlineVariant),
                        ) {
                            androidx.compose.foundation.layout.Column(
                                modifier = Modifier.padding(vertical = 8.dp),
                            ) {
                                DatePicker(state = datePickerState)
                                androidx.compose.foundation.layout.Row(
                                    modifier = Modifier
                                        .fillMaxWidth()
                                        .padding(horizontal = 16.dp),
                                    horizontalArrangement = Arrangement.End,
                                ) {
                                    TextButton(onClick = { datePickerExpanded = false }) {
                                        Text(stringResource(R.string.timetable_cancel))
                                    }
                                    TextButton(
                                        onClick = {
                                            datePickerState.selectedDateMillis
                                                ?.let(::millisToLocalDate)
                                                ?.let { selectedDate ->
                                                    editor = editor.copy(termStartDate = selectedDate.toString())
                                                }
                                            datePickerExpanded = false
                                        },
                                        enabled = datePickerState.selectedDateMillis != null,
                                    ) {
                                        Text(stringResource(R.string.timetable_confirm))
                                    }
                                }
                            }
                        }
                    }
                }
                item {
                    PeriodStepperRow(
                        title = stringResource(R.string.timetable_start_week_label),
                        value = editor.startWeek,
                        range = 1..30,
                        onValueChange = {
                            editor = editor.copy(
                                startWeek = it,
                                endWeek = maxOf(editor.endWeek, it),
                            )
                        },
                    )
                }
                item {
                    PeriodStepperRow(
                        title = stringResource(R.string.timetable_end_week_label),
                        value = editor.endWeek,
                        range = editor.startWeek..30,
                        onValueChange = { editor = editor.copy(endWeek = it) },
                    )
                }
                item {
                    SwitchRow(
                        title = stringResource(R.string.timetable_show_saturday),
                        checked = editor.showSaturday,
                        onCheckedChange = { editor = editor.copy(showSaturday = it) },
                    )
                }
                item {
                    SwitchRow(
                        title = stringResource(R.string.timetable_show_sunday),
                        checked = editor.showSunday,
                        onCheckedChange = { editor = editor.copy(showSunday = it) },
                    )
                }
                if (shouldShowNonCurrentWeekCourseSetting(editor.importSource)) {
                    item {
                        SwitchRow(
                            title = stringResource(R.string.timetable_show_non_current_week_courses),
                            checked = editor.showNonCurrentWeekCourses,
                            onCheckedChange = {
                                editor = editor.copy(showNonCurrentWeekCourses = it)
                            },
                        )
                    }
                }
                item {
                    HorizontalDivider()
                }
                item {
                    Text(
                        stringResource(R.string.timetable_period_times_title),
                        style = MaterialTheme.typography.titleMedium,
                    )
                }
                items(editor.periodTimes, key = { it.index }) { period ->
                    PeriodTimeEditorRow(
                        state = period,
                        canRemove = editor.periodTimes.size > 1,
                        onStartTimeChange = { value ->
                            val index = editor.periodTimes.indexOfFirst { it.index == period.index }
                            if (index >= 0) {
                                editor = editor.copy(
                                    periodTimes = editor.periodTimes.replaceAt(
                                        index = index,
                                        item = period.copy(startTime = value),
                                    ),
                                )
                            }
                        },
                        onEndTimeChange = { value ->
                            val index = editor.periodTimes.indexOfFirst { it.index == period.index }
                            if (index >= 0) {
                                editor = editor.copy(
                                    periodTimes = editor.periodTimes.replaceAt(
                                        index = index,
                                        item = period.copy(endTime = value),
                                    ),
                                )
                            }
                        },
                        onRemove = {
                            val index = editor.periodTimes.indexOfFirst { it.index == period.index }
                            if (index >= 0) {
                                editor = editor.copy(
                                    periodTimes = editor.periodTimes.removeAt(index).reindexPeriodTimes(),
                                )
                            }
                        },
                    )
                }
                item {
                    OutlinedButton(
                        onClick = {
                            val nextIndex = editor.periodTimes.size + 1
                            val fallback = defaultPeriodTimes().getOrNull(nextIndex - 1)
                            editor = editor.copy(
                                periodTimes = editor.periodTimes + PeriodTimeDraft(
                                    index = nextIndex,
                                    startTime = fallback?.startTime ?: "21:00",
                                    endTime = fallback?.endTime ?: "21:45",
                                ),
                            )
                        },
                        modifier = Modifier.fillMaxWidth(),
                    ) {
                        Icon(Icons.Default.Add, contentDescription = null)
                        Spacer(modifier = Modifier.width(8.dp))
                        Text(stringResource(R.string.timetable_add_period))
                    }
                }
                item {
                    OutlinedButton(
                        onClick = {
                            editor = editor.resetToDefaultSettings()
                        },
                        modifier = Modifier.fillMaxWidth(),
                    ) {
                        Text(stringResource(R.string.timetable_reset_all_settings))
                    }
                }
                item {
                    Spacer(modifier = Modifier.height(12.dp))
                }
            }
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
private fun rememberTermStartDatePickerState(termStartDate: String): DatePickerState {
    val initialSelectedDateMillis = remember(termStartDate) {
        termStartDate.toLocalDateOrNull()?.let(::localDateToMillis)
    }
    return androidx.compose.material3.rememberDatePickerState(
        initialSelectedDateMillis = initialSelectedDateMillis,
        selectableDates = object : SelectableDates {
            override fun isSelectableYear(year: Int): Boolean = year in 2000..2100
        },
    )
}

private fun String.toLocalDateOrNull(): LocalDate? =
    try {
        LocalDate.parse(this)
    } catch (_: DateTimeParseException) {
        null
    }

private fun localDateToMillis(date: LocalDate): Long =
    date.atStartOfDay(ZoneId.systemDefault()).toInstant().toEpochMilli()

private fun millisToLocalDate(millis: Long): LocalDate =
    java.time.Instant.ofEpochMilli(millis).atZone(ZoneId.systemDefault()).toLocalDate()

internal fun shouldShowNonCurrentWeekCourseSetting(importSource: TimetableImportSource): Boolean =
    importSource != TimetableImportSource.ONLINE_EDU

private fun TimetableDetailsDraft.resetToDefaultSettings(): TimetableDetailsDraft {
    val defaults = TimetableDetails()
    return copy(
        termStartDate = defaults.termStartDate,
        startWeek = defaults.startWeek,
        endWeek = defaults.endWeek,
        showSaturday = defaults.showSaturday,
        showSunday = defaults.showSunday,
        showNonCurrentWeekCourses = defaults.showNonCurrentWeekCourses,
        periodTimes = defaults.periodTimes.map { period ->
            PeriodTimeDraft(
                index = period.index,
                startTime = period.startTime,
                endTime = period.endTime,
            )
        },
    )
}
