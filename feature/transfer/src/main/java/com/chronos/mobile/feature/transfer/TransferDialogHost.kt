package com.chronos.mobile.feature.transfer

import android.content.ClipData
import android.content.ClipboardManager
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.IosShare
import androidx.compose.material.icons.filled.UploadFile
import androidx.compose.material3.AlertDialog
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.RadioButton
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.unit.dp
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.lifecycle.ViewModel
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import androidx.lifecycle.viewModelScope
import com.chronos.mobile.core.model.AppState
import com.chronos.mobile.domain.ImportMode
import com.chronos.mobile.domain.usecase.ExportCurrentTimetableUseCase
import com.chronos.mobile.domain.usecase.ImportTimetableResult
import com.chronos.mobile.domain.usecase.ImportTimetableUseCase
import com.chronos.mobile.domain.usecase.ObserveAppStateUseCase
import dagger.hilt.android.lifecycle.HiltViewModel
import javax.inject.Inject
import kotlinx.coroutines.Dispatchers
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

data class TransferUiState(
    val importMode: ImportMode = ImportMode.AS_NEW,
)

@HiltViewModel
class TransferViewModel @Inject constructor(
    observeAppState: ObserveAppStateUseCase,
    private val importTimetable: ImportTimetableUseCase,
    private val exportCurrentTimetable: ExportCurrentTimetableUseCase,
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

    fun reset() {
        uiState.update { it.copy(importMode = ImportMode.AS_NEW) }
    }

    fun setImportMode(mode: ImportMode) {
        uiState.update { it.copy(importMode = mode) }
    }

    suspend fun import(content: String): ImportTimetableResult = withContext(Dispatchers.Default) {
        importTimetable(content, state.value.importMode)
    }

    suspend fun export(): String? = withContext(Dispatchers.Default) {
        exportCurrentTimetable()
    }
}

@Composable
fun TransferDialogHost(
    mode: TransferDialogMode,
    onDismiss: () -> Unit,
    onMessage: (String) -> Unit,
    onImportSuccess: (ImportTimetableResult) -> Unit,
    viewModel: TransferViewModel = hiltViewModel(),
) {
    val state by viewModel.state.collectAsStateWithLifecycle()
    val appState by viewModel.appState.collectAsStateWithLifecycle()
    val context = LocalContext.current
    val scope = androidx.compose.runtime.rememberCoroutineScope()
    val clipboardManager = remember(context) {
        context.getSystemService(ClipboardManager::class.java)
    }

    LaunchedEffect(mode) {
        viewModel.reset()
    }

    val importFromFileLauncher = rememberLauncherForActivityResult(
        contract = ActivityResultContracts.OpenDocument(),
    ) { uri ->
        if (uri == null) return@rememberLauncherForActivityResult
        scope.launch {
            val content = context.contentResolver.openInputStream(uri)
                ?.bufferedReader()
                ?.use { it.readText() }
            importContent(
                content = content,
                viewModel = viewModel,
                onDismiss = onDismiss,
                onMessage = onMessage,
                onImportSuccess = onImportSuccess,
                emptyMessage = "导入失败，HTML 文件内容为空",
                failureMessage = "导入失败，请检查选择的 HTML 文件内容",
            )
        }
    }

    TransferDialog(
        mode = mode,
        currentTimetableName = appState.currentTimetable?.name,
        importMode = state.importMode,
        onImportModeChange = viewModel::setImportMode,
        onDismiss = onDismiss,
        onImportFromClipboardClick = {
            scope.launch {
                val content = clipboardManager.readPlainText(context)
                importContent(
                    content = content,
                    viewModel = viewModel,
                    onDismiss = onDismiss,
                    onMessage = onMessage,
                    onImportSuccess = onImportSuccess,
                    emptyMessage = "导入失败，剪贴板内容为空",
                    failureMessage = "导入失败，请检查剪贴板中的 JSON 或 HTML 内容",
                )
            }
        },
        onImportFromFileClick = {
            importFromFileLauncher.launch(arrayOf("text/html"))
        },
        onExportClick = {
            scope.launch {
                val exportedJson = viewModel.export()
                if (exportedJson == null) {
                    onMessage("当前没有可导出的课程表")
                } else {
                    clipboardManager?.setPrimaryClip(
                        ClipData.newPlainText("chronos_timetable_json", exportedJson),
                    )
                    onMessage("课程表 JSON 已复制到剪贴板")
                    onDismiss()
                }
            }
        },
    )
}

@Composable
private fun TransferDialog(
    mode: TransferDialogMode,
    currentTimetableName: String?,
    importMode: ImportMode,
    onImportModeChange: (ImportMode) -> Unit,
    onDismiss: () -> Unit,
    onImportFromClipboardClick: () -> Unit,
    onImportFromFileClick: () -> Unit,
    onExportClick: () -> Unit,
) {
    AlertDialog(
        onDismissRequest = onDismiss,
        confirmButton = {},
        title = {
            Column(verticalArrangement = Arrangement.spacedBy(4.dp)) {
                Text(
                    text = if (mode == TransferDialogMode.IMPORT) "导入课程表" else "分享课程表",
                    style = MaterialTheme.typography.titleLarge,
                )
                Text(
                    text = if (mode == TransferDialogMode.IMPORT) {
                        "支持从分享内容或 HTML 文件恢复或合并你的课程数据"
                    } else {
                        "导出当前课表，便于备份与分享"
                    },
                    style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                )
            }
        },
        text = {
            if (mode == TransferDialogMode.EXPORT) {
                Column(horizontalAlignment = Alignment.CenterHorizontally) {
                    Text(
                        text = "将“${currentTimetableName ?: "未命名"}”复制到剪贴板，复制后包含完整课表设置信息。",
                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                    )
                    Spacer(modifier = Modifier.size(16.dp))
                    OutlinedButton(onClick = onExportClick, modifier = Modifier.fillMaxWidth()) {
                        Icon(Icons.Default.IosShare, contentDescription = null)
                        Spacer(modifier = Modifier.size(8.dp))
                        Text("复制 JSON 到剪贴板")
                    }
                }
            } else {
                Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
                    ImportModeRow(
                        selected = importMode == ImportMode.AS_NEW,
                        enabled = true,
                        title = "作为新课程表导入",
                        onClick = { onImportModeChange(ImportMode.AS_NEW) },
                    )
                    ImportModeRow(
                        selected = importMode == ImportMode.OVERWRITE_CURRENT,
                        enabled = currentTimetableName != null,
                        title = buildString {
                            append("覆盖当前课程表")
                            if (currentTimetableName != null) {
                                append("（$currentTimetableName）")
                            }
                        },
                        onClick = { onImportModeChange(ImportMode.OVERWRITE_CURRENT) },
                    )
                    OutlinedButton(
                        onClick = onImportFromClipboardClick,
                        modifier = Modifier.fillMaxWidth(),
                    ) {
                        Icon(Icons.Default.IosShare, contentDescription = null)
                        Spacer(modifier = Modifier.size(8.dp))
                        Text("从分享导入（剪切板）")
                    }
                    OutlinedButton(
                        onClick = onImportFromFileClick,
                        modifier = Modifier.fillMaxWidth(),
                    ) {
                        Icon(Icons.Default.UploadFile, contentDescription = null)
                        Spacer(modifier = Modifier.size(8.dp))
                        Text("从文件导入（HTML）")
                    }
                }
            }
        },
        dismissButton = {
            TextButton(onClick = onDismiss) {
                Text("关闭")
            }
        },
    )
}

private fun ClipboardManager?.readPlainText(context: android.content.Context): String? {
    val item = this?.primaryClip?.getItemAt(0) ?: return null
    return item.text?.toString() ?: item.coerceToText(context)?.toString()
}

private suspend fun importContent(
    content: String?,
    viewModel: TransferViewModel,
    onDismiss: () -> Unit,
    onMessage: (String) -> Unit,
    onImportSuccess: (ImportTimetableResult) -> Unit,
    emptyMessage: String,
    failureMessage: String,
) {
    if (content.isNullOrBlank()) {
        onMessage(emptyMessage)
    } else {
        runCatching { viewModel.import(content) }
            .onSuccess { result ->
                onImportSuccess(result)
                onDismiss()
            }
            .onFailure {
                onMessage(failureMessage)
            }
    }
}

@Composable
private fun ImportModeRow(
    selected: Boolean,
    enabled: Boolean,
    title: String,
    onClick: () -> Unit,
) {
    Surface(
        modifier = Modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(18.dp))
            .clickable(enabled = enabled, onClick = onClick),
        shape = RoundedCornerShape(18.dp),
        border = BorderStroke(1.dp, MaterialTheme.colorScheme.outlineVariant),
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 24.dp, vertical = 16.dp),
            verticalAlignment = Alignment.CenterVertically,
        ) {
            RadioButton(selected = selected, onClick = null, enabled = enabled)
            Spacer(modifier = Modifier.size(8.dp))
            Text(
                text = title,
                color = if (enabled) MaterialTheme.colorScheme.onSurface else MaterialTheme.colorScheme.onSurfaceVariant,
            )
        }
    }
}
