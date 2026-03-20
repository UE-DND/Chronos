package com.chronos.mobile.feature.root

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.chronos.mobile.core.model.AppState
import com.chronos.mobile.domain.usecase.ObserveAppStateUseCase
import com.chronos.mobile.domain.usecase.SetWallpaperUseCase
import com.chronos.mobile.feature.timetable.TimetableCommand
import dagger.hilt.android.lifecycle.HiltViewModel
import javax.inject.Inject
import kotlinx.coroutines.channels.Channel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.receiveAsFlow
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch

@HiltViewModel
class RootViewModel @Inject constructor(
    observeAppState: ObserveAppStateUseCase,
    private val setWallpaperUseCase: SetWallpaperUseCase,
) : ViewModel() {
    private val uiState = MutableStateFlow(RootUiState())
    private val eventChannel = Channel<TimetableCommand>(capacity = Channel.BUFFERED)

    val appState: StateFlow<AppState> = observeAppState().stateIn(
        scope = viewModelScope,
        started = SharingStarted.WhileSubscribed(5_000),
        initialValue = AppState(),
    )

    val timetableCommands = eventChannel.receiveAsFlow()

    val state: StateFlow<RootUiState> = uiState.stateIn(
        scope = viewModelScope,
        started = SharingStarted.WhileSubscribed(5_000),
        initialValue = RootUiState(),
    )

    fun switchTab(tab: RootTab) {
        uiState.update { it.copy(activeTab = tab) }
        if (tab == RootTab.TIMETABLE) {
            eventChannel.trySend(TimetableCommand.JumpToCurrentWeek)
        }
    }

    fun setWallpaper(uri: String?) {
        viewModelScope.launch {
            setWallpaperUseCase(uri)
        }
    }
}
