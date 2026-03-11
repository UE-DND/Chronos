package com.chronos.mobile.feature.timetable

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.chronos.mobile.core.model.AppState
import com.chronos.mobile.core.model.Course
import com.chronos.mobile.core.model.Timetable
import com.chronos.mobile.domain.model.CourseDraft
import com.chronos.mobile.domain.model.TimetableDetailsDraft
import com.chronos.mobile.domain.model.TimetableGridModel
import com.chronos.mobile.domain.usecase.BuildVisibleTimetableGridUseCase
import com.chronos.mobile.domain.usecase.CalculateAcademicWeekUseCase
import com.chronos.mobile.domain.usecase.CreateTimetableUseCase
import com.chronos.mobile.domain.usecase.DeleteCourseUseCase
import com.chronos.mobile.domain.usecase.DeleteTimetableUseCase
import com.chronos.mobile.domain.usecase.ObserveAppStateUseCase
import com.chronos.mobile.domain.usecase.SaveCourseUseCase
import com.chronos.mobile.domain.usecase.SaveTimetableDetailsUseCase
import com.chronos.mobile.domain.usecase.SwitchTimetableUseCase
import dagger.hilt.android.lifecycle.HiltViewModel
import java.time.LocalDate
import javax.inject.Inject
import kotlinx.coroutines.currentCoroutineContext
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.combine
import kotlinx.coroutines.flow.distinctUntilChanged
import kotlinx.coroutines.flow.flow
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.isActive
import kotlinx.coroutines.launch

private const val DATE_REFRESH_INTERVAL_MILLIS = 60_000L
private const val WEEK_GRID_CACHE_RADIUS = 1

data class TimetableUiState(
    val appState: AppState = AppState(),
    val hasLoadedAppState: Boolean = false,
    val today: LocalDate = LocalDate.now(),
    val academicWeek: Int = 1,
    val displayedWeek: Int = 1,
    val displayedWeekTimetableId: String? = null,
    val gridModel: TimetableGridModel? = null,
    val weekGridModels: Map<Int, TimetableGridModel> = emptyMap(),
    val manageDialogVisible: Boolean = false,
    val editingCourse: CourseDraft? = null,
)

@HiltViewModel
class TimetableViewModel @Inject constructor(
    observeAppState: ObserveAppStateUseCase,
    private val createTimetableUseCase: CreateTimetableUseCase,
    private val switchTimetableUseCase: SwitchTimetableUseCase,
    private val deleteTimetableUseCase: DeleteTimetableUseCase,
    private val saveTimetableDetailsUseCase: SaveTimetableDetailsUseCase,
    private val saveCourseUseCase: SaveCourseUseCase,
    private val deleteCourseUseCase: DeleteCourseUseCase,
    private val calculateAcademicWeek: CalculateAcademicWeekUseCase,
    private val buildVisibleTimetableGrid: BuildVisibleTimetableGridUseCase,
) : ViewModel() {
    private val uiState = MutableStateFlow(TimetableUiState())

    val state: StateFlow<TimetableUiState> = combine(
        observeAppState(),
        uiState,
        observeToday(),
    ) { appState, currentState, today ->
        val timetable = appState.currentTimetable
        val academicWeek = calculateAcademicWeek(today, timetable?.details)
        val displayedWeek = resolveDisplayedWeek(
            timetable = timetable,
            displayedWeek = currentState.displayedWeek,
            displayedWeekTimetableId = currentState.displayedWeekTimetableId,
            academicWeek = academicWeek,
        )
        val weekGridModels = buildWeekGridModels(
            timetable = timetable,
            today = today,
            displayedWeek = displayedWeek,
            existingWeekGridModels = currentState.weekGridModels.takeIf {
                timetable != null &&
                    timetable == currentState.appState.currentTimetable &&
                    currentState.today == today
            }.orEmpty(),
            buildGrid = buildVisibleTimetableGrid::invoke,
        )

        currentState.copy(
            appState = appState,
            hasLoadedAppState = true,
            today = today,
            academicWeek = academicWeek,
            displayedWeek = displayedWeek,
            displayedWeekTimetableId = timetable?.id,
            gridModel = weekGridModels[displayedWeek],
            weekGridModels = weekGridModels,
        )
    }.stateIn(
        scope = viewModelScope,
        started = SharingStarted.WhileSubscribed(5_000),
        initialValue = TimetableUiState(),
    )

    fun showManageDialog(show: Boolean) {
        uiState.update { it.copy(manageDialogVisible = show) }
    }

    fun createTimetable(name: String) {
        viewModelScope.launch {
            createTimetableUseCase(name)
        }
    }

    fun switchTimetable(id: String) {
        viewModelScope.launch {
            switchTimetableUseCase(id)
        }
    }

    fun deleteTimetable(id: String) {
        viewModelScope.launch {
            deleteTimetableUseCase(id)
        }
    }

    fun setDisplayedWeek(week: Int) {
        val timetable = state.value.appState.currentTimetable ?: return
        uiState.update {
            it.copy(
                displayedWeek = week.coerceIn(timetable.details.startWeek, timetable.details.endWeek),
                displayedWeekTimetableId = timetable.id,
            )
        }
    }

    fun jumpToCurrentWeek() {
        val timetable = state.value.appState.currentTimetable ?: return
        uiState.update {
            it.copy(
                displayedWeek = state.value.academicWeek.coerceIn(
                    timetable.details.startWeek,
                    timetable.details.endWeek,
                ),
                displayedWeekTimetableId = timetable.id,
            )
        }
    }

    fun saveTimetableDetails(
        editor: TimetableDetailsDraft,
        onSaved: () -> Unit = {},
    ) {
        val timetableId = state.value.appState.currentTimetable?.id ?: return
        viewModelScope.launch {
            saveTimetableDetailsUseCase(timetableId, editor)
            onSaved()
        }
    }

    fun requestEditCourse(course: Course) {
        uiState.update { it.copy(editingCourse = course.toDraft()) }
    }

    fun dismissCourseEditor() {
        uiState.update { it.copy(editingCourse = null) }
    }

    fun saveCourse(editor: CourseDraft) {
        val timetableId = state.value.appState.currentTimetable?.id ?: return
        viewModelScope.launch {
            saveCourseUseCase(timetableId, editor)
            dismissCourseEditor()
        }
    }

    fun deleteCourse(courseId: String) {
        viewModelScope.launch {
            deleteCourseUseCase(courseId)
            dismissCourseEditor()
        }
    }

    private fun observeToday(): Flow<LocalDate> = flow {
        var emittedDate: LocalDate? = null
        while (currentCoroutineContext().isActive) {
            val today = LocalDate.now()
            if (today != emittedDate) {
                emit(today)
                emittedDate = today
            }
            delay(DATE_REFRESH_INTERVAL_MILLIS)
        }
    }.distinctUntilChanged()
}

internal fun resolveDisplayedWeek(
    timetable: Timetable?,
    displayedWeek: Int,
    displayedWeekTimetableId: String?,
    academicWeek: Int,
): Int = when {
    timetable == null -> 1
    displayedWeekTimetableId != timetable.id -> academicWeek
    else -> displayedWeek.coerceIn(timetable.details.startWeek, timetable.details.endWeek)
}

internal fun buildWeekGridModels(
    timetable: Timetable?,
    today: LocalDate,
    displayedWeek: Int,
    existingWeekGridModels: Map<Int, TimetableGridModel>,
    buildGrid: (LocalDate, Int, Timetable) -> TimetableGridModel,
): Map<Int, TimetableGridModel> {
    timetable ?: return emptyMap()

    val weekRange = timetable.details.startWeek..timetable.details.endWeek
    val requiredWeeks = ((displayedWeek - WEEK_GRID_CACHE_RADIUS)..(displayedWeek + WEEK_GRID_CACHE_RADIUS))
        .filter { it in weekRange }

    return requiredWeeks.associateWith { week ->
        existingWeekGridModels[week] ?: buildGrid(today, week, timetable)
    }
}
