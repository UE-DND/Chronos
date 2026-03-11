package com.chronos.mobile.feature.timetable

import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.ui.Modifier
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import androidx.navigation.NavBackStackEntry
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.collect

@Composable
fun TimetableRoute(
    modifier: Modifier = Modifier,
    contentPadding: PaddingValues = PaddingValues(),
    timetableCommands: Flow<TimetableCommand>,
    onImportTimetable: () -> Unit,
    onEditTimetableDetails: () -> Unit,
    viewModel: TimetableViewModel = hiltViewModel(),
) {
    val state by viewModel.state.collectAsStateWithLifecycle()
    val currentTimetable = state.appState.currentTimetable

    LaunchedEffect(timetableCommands) {
        timetableCommands.collect { command ->
            when (command) {
                TimetableCommand.OpenManageTimetables -> viewModel.showManageDialog(true)
                TimetableCommand.JumpToCurrentWeek -> viewModel.jumpToCurrentWeek()
            }
        }
    }

    Box(
        modifier = modifier.fillMaxSize(),
    ) {
        if (state.hasLoadedAppState && currentTimetable == null) {
            EmptyTimetableState(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(contentPadding),
                onImportTimetable = onImportTimetable,
            )
        } else if (state.hasLoadedAppState) {
            TimetableScreen(
                state = state,
                rootContentPadding = contentPadding,
                onEditTimetableDetails = {
                    onEditTimetableDetails()
                },
                onCourseClick = viewModel::requestEditCourse,
                onDisplayedWeekChange = viewModel::setDisplayedWeek,
            )
        }
    }

    if (state.manageDialogVisible) {
        ManageTimetablesDialog(
            timetables = state.appState.timetables,
            currentTimetableId = state.appState.currentTimetableId,
            onDismiss = { viewModel.showManageDialog(false) },
            onCreateTimetable = viewModel::createTimetable,
            onSwitchTimetable = viewModel::switchTimetable,
            onDeleteTimetable = viewModel::deleteTimetable,
        )
    }

    state.editingCourse?.let { editor ->
        CourseEditorDialog(
            initialState = editor,
            maxPeriods = state.gridModel?.displayedPeriodCount ?: 10,
            onDismiss = viewModel::dismissCourseEditor,
            onSave = viewModel::saveCourse,
            onDelete = editor.id?.let { id -> { viewModel.deleteCourse(id) } },
        )
    }
}

@Composable
fun TimetableDetailsEditorRoute(
    modifier: Modifier = Modifier,
    parentEntry: NavBackStackEntry,
    viewModel: TimetableViewModel = hiltViewModel(parentEntry),
    onDismiss: () -> Unit,
) {
    val state by viewModel.state.collectAsStateWithLifecycle()
    val currentTimetable = state.appState.currentTimetable

    LaunchedEffect(
        state.hasLoadedAppState,
        state.appState.currentTimetableId,
        state.appState.timetables.size,
    ) {
        if (state.hasLoadedAppState &&
            (state.appState.currentTimetableId == null ||
            (state.appState.timetables.isNotEmpty() && currentTimetable == null)
            )
        ) {
            onDismiss()
        }
    }

    if (state.hasLoadedAppState) {
        currentTimetable?.let {
            TimetableDetailsEditorScreen(
                modifier = modifier,
                initialState = it.toDetailsDraft(),
                onDismiss = onDismiss,
                onSave = { editor -> viewModel.saveTimetableDetails(editor, onSaved = onDismiss) },
            )
        }
    }
}
