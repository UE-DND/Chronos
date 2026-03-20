package com.chronos.mobile.feature.transfer

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.chronos.mobile.core.model.AppState
import com.chronos.mobile.core.model.Timetable
import com.chronos.mobile.domain.ImportMode
import com.chronos.mobile.domain.model.AuthSnapshot
import com.chronos.mobile.domain.model.SavedCredentialState
import com.chronos.mobile.domain.result.AppError
import com.chronos.mobile.domain.result.AppResult
import com.chronos.mobile.domain.result.asFailure
import com.chronos.mobile.domain.result.onSuccess
import com.chronos.mobile.domain.usecase.ClearOnlineCredentialUseCase
import com.chronos.mobile.domain.usecase.ExportCurrentTimetableUseCase
import com.chronos.mobile.domain.usecase.ImportTimetableResult
import com.chronos.mobile.domain.usecase.ImportTimetableUseCase
import com.chronos.mobile.domain.usecase.ObserveAppStateUseCase
import com.chronos.mobile.domain.usecase.ObserveSavedCredentialStateUseCase
import com.chronos.mobile.domain.usecase.PrepareCredentialSaveUseCase
import com.chronos.mobile.domain.usecase.PrepareCredentialUnlockUseCase
import com.chronos.mobile.domain.usecase.PreviewImportedTimetableUseCase
import com.chronos.mobile.domain.usecase.PreviewOnlineTimetableUseCase
import com.chronos.mobile.domain.usecase.SaveOnlineCredentialUseCase
import com.chronos.mobile.domain.usecase.UnlockOnlineCredentialUseCase
import dagger.hilt.android.lifecycle.HiltViewModel
import javax.crypto.Cipher
import javax.inject.Inject
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext

enum class TransferDialogMode {
    IMPORT,
    EXPORT,
}

enum class ImportSource {
    ONLINE,
    JSON,
    HTML,
}

data class TransferUiState(
    val importMode: ImportMode = ImportMode.AS_NEW,
    val selectedSource: ImportSource = ImportSource.ONLINE,
    val account: String = "",
    val password: String = "",
    val saveCredentials: Boolean = false,
    val savedCredentialState: SavedCredentialState = SavedCredentialState(),
    val preview: Timetable? = null,
    val previewSource: ImportSource? = null,
)

@HiltViewModel
class TransferViewModel @Inject constructor(
    observeAppState: ObserveAppStateUseCase,
    observeSavedCredentialStateUseCase: ObserveSavedCredentialStateUseCase,
    private val previewImportedTimetableUseCase: PreviewImportedTimetableUseCase,
    private val previewOnlineTimetableUseCase: PreviewOnlineTimetableUseCase,
    private val importTimetableUseCase: ImportTimetableUseCase,
    private val exportCurrentTimetableUseCase: ExportCurrentTimetableUseCase,
    private val prepareCredentialSaveUseCase: PrepareCredentialSaveUseCase,
    private val saveOnlineCredentialUseCase: SaveOnlineCredentialUseCase,
    private val prepareCredentialUnlockUseCase: PrepareCredentialUnlockUseCase,
    private val unlockOnlineCredentialUseCase: UnlockOnlineCredentialUseCase,
    private val clearOnlineCredentialUseCase: ClearOnlineCredentialUseCase,
) : ViewModel() {
    private val uiState = MutableStateFlow(TransferUiState())

    val appState: StateFlow<AppState> = observeAppState().stateIn(
        scope = viewModelScope,
        started = SharingStarted.WhileSubscribed(5_000),
        initialValue = AppState(),
    )

    val state: StateFlow<TransferUiState> = uiState.stateIn(
        scope = viewModelScope,
        started = SharingStarted.WhileSubscribed(5_000),
        initialValue = TransferUiState(),
    )

    init {
        viewModelScope.launch {
            observeSavedCredentialStateUseCase().collect { savedState ->
                uiState.update { current ->
                    current.copy(
                        savedCredentialState = savedState,
                        account = current.account.ifBlank { savedState.account.orEmpty() },
                    )
                }
            }
        }
    }

    fun reset() {
        uiState.update { current ->
            current.copy(
                importMode = ImportMode.AS_NEW,
                selectedSource = ImportSource.ONLINE,
                account = current.savedCredentialState.account.orEmpty(),
                password = "",
                saveCredentials = false,
                preview = null,
                previewSource = null,
            )
        }
    }

    fun setImportMode(mode: ImportMode) {
        uiState.update { it.copy(importMode = mode) }
    }

    fun selectSource(source: ImportSource) {
        uiState.update {
            it.copy(
                selectedSource = source,
                preview = null,
                previewSource = null,
            )
        }
    }

    fun setAccount(account: String) {
        uiState.update {
            it.copy(
                account = account,
                preview = if (it.previewSource == ImportSource.ONLINE) null else it.preview,
                previewSource = if (it.previewSource == ImportSource.ONLINE) null else it.previewSource,
            )
        }
    }

    fun setPassword(password: String) {
        uiState.update {
            it.copy(
                password = password,
                preview = if (it.previewSource == ImportSource.ONLINE) null else it.preview,
                previewSource = if (it.previewSource == ImportSource.ONLINE) null else it.previewSource,
            )
        }
    }

    fun setSaveCredentials(saveCredentials: Boolean) {
        uiState.update { it.copy(saveCredentials = saveCredentials) }
    }

    fun clearPreview() {
        uiState.update { it.copy(preview = null, previewSource = null) }
    }

    suspend fun prepareSaveCipher(): AppResult<Cipher> = withContext(Dispatchers.IO) {
        prepareCredentialSaveUseCase()
    }

    suspend fun saveCredentials(
        account: String,
        password: String,
        cipher: Cipher,
    ): AppResult<Unit> = saveOnlineCredentialUseCase(account = account, password = password, cipher = cipher)

    suspend fun prepareUnlockCipher(): AppResult<Cipher> = withContext(Dispatchers.IO) {
        prepareCredentialUnlockUseCase()
    }

    suspend fun unlockSavedCredentials(cipher: Cipher): AppResult<AuthSnapshot> =
        unlockOnlineCredentialUseCase(cipher)

    suspend fun clearSavedCredentials() {
        clearOnlineCredentialUseCase()
        uiState.update { current ->
            current.copy(
                savedCredentialState = SavedCredentialState(protectionAvailable = current.savedCredentialState.protectionAvailable),
                saveCredentials = false,
                preview = if (current.previewSource == ImportSource.ONLINE) null else current.preview,
                previewSource = if (current.previewSource == ImportSource.ONLINE) null else current.previewSource,
            )
        }
    }

    suspend fun previewImported(content: String, source: ImportSource): AppResult<Timetable> = withContext(Dispatchers.IO) {
        previewImportedTimetableUseCase(content).onSuccess { timetable ->
            uiState.update { it.copy(preview = timetable, previewSource = source) }
        }
    }

    suspend fun previewOnline(authSnapshot: AuthSnapshot): AppResult<Timetable> = withContext(Dispatchers.IO) {
        previewOnlineTimetableUseCase(authSnapshot).onSuccess { timetable ->
            uiState.update { it.copy(preview = timetable, previewSource = ImportSource.ONLINE) }
        }
    }

    suspend fun importPreview(): AppResult<ImportTimetableResult> = withContext(Dispatchers.IO) {
        val currentState = state.value
        val preview = currentState.preview
            ?: return@withContext AppError.NotFound("请先获取课表预览").asFailure()
        importTimetableUseCase.import(preview, currentState.importMode)
    }

    suspend fun export(): AppResult<String?> = withContext(Dispatchers.IO) {
        exportCurrentTimetableUseCase()
    }
}
