package com.chronos.mobile.feature.timetable

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.material3.AlertDialog
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.unit.dp
import com.chronos.mobile.domain.model.CourseDraft

@Composable
internal fun CourseEditorDialog(
    initialState: CourseDraft,
    maxPeriods: Int,
    onDismiss: () -> Unit,
    onSave: (CourseDraft) -> Unit,
    onDelete: (() -> Unit)?,
) {
    var editor by remember(initialState) { mutableStateOf(initialState) }
    val courseColors = listOf(
        "#EADDFF" to "#21005D",
        "#FFDBC9" to "#311100",
        "#C4EED0" to "#072711",
        "#F9DEDC" to "#410E0B",
        "#D3E3FD" to "#041E49",
        "#FFD8E4" to "#31111D",
    )

    AlertDialog(
        onDismissRequest = onDismiss,
        title = {
            Text(
                text = stringResource(R.string.timetable_course_edit_title),
                style = MaterialTheme.typography.titleLarge,
            )
        },
        text = {
            LazyColumn(verticalArrangement = Arrangement.spacedBy(10.dp)) {
                item {
                    OutlinedTextField(
                        value = editor.name,
                        onValueChange = { editor = editor.copy(name = it) },
                        label = { Text(stringResource(R.string.timetable_course_name_label)) },
                        modifier = Modifier.fillMaxWidth(),
                        singleLine = true,
                    )
                }
                item {
                    OutlinedTextField(
                        value = editor.teacher,
                        onValueChange = { editor = editor.copy(teacher = it) },
                        label = { Text(stringResource(R.string.timetable_course_teacher_label)) },
                        modifier = Modifier.fillMaxWidth(),
                        singleLine = true,
                    )
                }
                item {
                    OutlinedTextField(
                        value = editor.location,
                        onValueChange = { editor = editor.copy(location = it) },
                        label = { Text(stringResource(R.string.timetable_course_location_label)) },
                        modifier = Modifier.fillMaxWidth(),
                        singleLine = true,
                    )
                }
                item {
                    PeriodStepperRow(
                        title = stringResource(R.string.timetable_course_day_of_week_label),
                        value = editor.dayOfWeek,
                        range = 1..7,
                        onValueChange = { editor = editor.copy(dayOfWeek = it) },
                    )
                }
                item {
                    PeriodStepperRow(
                        title = stringResource(R.string.timetable_course_start_period_label),
                        value = editor.startPeriod,
                        range = 1..maxPeriods,
                        onValueChange = {
                            editor = editor.copy(
                                startPeriod = it,
                                endPeriod = maxOf(editor.endPeriod, it),
                            )
                        },
                    )
                }
                item {
                    PeriodStepperRow(
                        title = stringResource(R.string.timetable_course_end_period_label),
                        value = editor.endPeriod,
                        range = editor.startPeriod..maxPeriods,
                        onValueChange = { editor = editor.copy(endPeriod = it) },
                    )
                }
                item {
                    Text(
                        stringResource(R.string.timetable_course_color_label),
                        style = MaterialTheme.typography.labelLarge,
                    )
                    Spacer(modifier = Modifier.height(8.dp))
                    Row(horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                        courseColors.forEach { (background, foreground) ->
                            val selected = editor.color == background
                            Surface(
                                modifier = Modifier
                                    .size(36.dp)
                                    .clip(MaterialTheme.shapes.extraLarge)
                                    .clickable {
                                        editor = editor.copy(color = background, textColor = foreground)
                                    },
                                shape = MaterialTheme.shapes.extraLarge,
                                color = parseColor(background),
                                border = BorderStroke(
                                    width = if (selected) 2.dp else 0.dp,
                                    color = MaterialTheme.colorScheme.primary,
                                ),
                            ) {}
                        }
                    }
                }
            }
        },
        confirmButton = {
            TextButton(enabled = editor.name.isNotBlank(), onClick = { onSave(editor) }) {
                Text(stringResource(R.string.timetable_save))
            }
        },
        dismissButton = {
            Row {
                if (onDelete != null) {
                    TextButton(onClick = onDelete) {
                        Text(stringResource(R.string.timetable_delete))
                    }
                }
                TextButton(onClick = onDismiss) {
                    Text(stringResource(R.string.timetable_cancel))
                }
            }
        },
    )
}
