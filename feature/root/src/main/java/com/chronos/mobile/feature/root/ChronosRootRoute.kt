package com.chronos.mobile.feature.root

import android.content.Context
import android.net.Uri
import android.webkit.MimeTypeMap
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.AnimatedContentTransitionScope
import androidx.compose.animation.EnterTransition
import androidx.compose.animation.ExitTransition
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.animation.core.tween
import androidx.compose.animation.expandVertically
import androidx.compose.animation.shrinkVertically
import androidx.compose.animation.slideInVertically
import androidx.compose.animation.slideOutVertically
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.Scaffold
import androidx.compose.material3.SnackbarHost
import androidx.compose.material3.SnackbarHostState
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import androidx.navigation.NavBackStackEntry
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.currentBackStackEntryAsState
import androidx.navigation.compose.rememberNavController
import com.chronos.mobile.feature.mine.MineWallpaperScreen
import com.chronos.mobile.feature.mine.MineRoute
import com.chronos.mobile.feature.timetable.CourseEditorRoute
import com.chronos.mobile.feature.timetable.ManageTimetablesRoute
import com.chronos.mobile.feature.timetable.TimetableDetailsEditorRoute
import com.chronos.mobile.feature.timetable.TimetableRoute
import com.chronos.mobile.feature.transfer.TransferDialogMode
import com.chronos.mobile.feature.transfer.TransferImportConfirmRoute
import com.chronos.mobile.feature.transfer.TransferRoute
import java.io.File
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext

@Composable
fun ChronosRootRoute(
    viewModel: RootViewModel = hiltViewModel(),
) {
    val context = LocalContext.current
    val scope = rememberCoroutineScope()
    val state by viewModel.state.collectAsStateWithLifecycle()
    val appState by viewModel.appState.collectAsStateWithLifecycle()
    val snackbarHostState = remember { SnackbarHostState() }
    var snackbarMessage by remember { mutableStateOf<String?>(null) }
    val navController = rememberNavController()
    val navBackStackEntry by navController.currentBackStackEntryAsState()
    val currentRoute = navBackStackEntry?.destination?.route
    val bottomBarVisible = currentRoute !in secondaryRoutes
    val returnToTimetable: () -> Unit = {
        viewModel.switchTab(RootTab.TIMETABLE)
        val popped = navController.popBackStack(RootRoute.TIMETABLE, inclusive = false)
        if (!popped) {
            navController.navigate(RootRoute.TIMETABLE) {
                popUpTo(navController.graph.startDestinationId)
                launchSingleTop = true
            }
        }
    }

    LaunchedEffect(snackbarMessage) {
        snackbarMessage?.let {
            snackbarHostState.showSnackbar(it)
            snackbarMessage = null
        }
    }

    val wallpaperLauncher = rememberLauncherForActivityResult(
        contract = ActivityResultContracts.GetContent(),
    ) { uri ->
        if (uri != null) {
            scope.launch {
                val localUri = withContext(Dispatchers.IO) {
                    copyWallpaperToAppStorage(
                        context = context,
                        sourceUri = uri,
                        previousWallpaperUri = appState.wallpaperUri,
                    )
                }
                if (localUri != null) {
                    viewModel.setWallpaper(localUri)
                } else {
                    snackbarMessage = "壁纸设置失败"
                }
            }
        }
    }

    Scaffold(
        modifier = Modifier.fillMaxSize(),
        snackbarHost = { SnackbarHost(hostState = snackbarHostState) },
        bottomBar = {
            AnimatedVisibility(
                visible = bottomBarVisible,
                enter = slideInVertically(
                    animationSpec = tween(durationMillis = SecondaryPageExitDuration),
                    initialOffsetY = { it / 2 },
                ) + expandVertically(animationSpec = tween(durationMillis = SecondaryPageExitDuration)) +
                    fadeIn(animationSpec = tween(durationMillis = SecondaryPageExitDuration)),
                exit = slideOutVertically(
                    animationSpec = tween(durationMillis = SecondaryPageEnterDuration),
                    targetOffsetY = { it / 2 },
                ) + shrinkVertically(animationSpec = tween(durationMillis = SecondaryPageEnterDuration)) +
                    fadeOut(animationSpec = tween(durationMillis = SecondaryPageEnterDuration)),
            ) {
                ChronosBottomBar(
                    activeTab = state.activeTab,
                    onTabSelected = { tab ->
                        viewModel.switchTab(tab)
                        when (tab) {
                            RootTab.TIMETABLE -> navController.navigate(RootRoute.TIMETABLE) {
                                popUpTo(navController.graph.startDestinationId)
                                launchSingleTop = true
                            }

                            RootTab.MINE -> navController.navigate(RootRoute.MINE) {
                                popUpTo(navController.graph.startDestinationId) { saveState = true }
                                launchSingleTop = true
                                restoreState = true
                            }
                        }
                    },
                )
            }
        },
    ) { paddingValues ->
        NavHost(
            navController = navController,
            startDestination = RootRoute.TIMETABLE,
            modifier = Modifier.fillMaxSize(),
        ) {
            composable(
                route = RootRoute.TIMETABLE,
                enterTransition = { EnterTransition.None },
                exitTransition = { ExitTransition.None },
                popEnterTransition = { EnterTransition.None },
                popExitTransition = { ExitTransition.None },
            ) {
                TimetableRoute(
                    modifier = Modifier.fillMaxSize(),
                    contentPadding = paddingValues,
                    timetableCommands = viewModel.timetableCommands,
                    onImportTimetable = { navController.navigate(RootRoute.TRANSFER_IMPORT) },
                    onEditCourse = { navController.navigate(RootRoute.TIMETABLE_COURSE_EDITOR) },
                    onEditTimetableDetails = { navController.navigate(RootRoute.TIMETABLE_DETAILS) },
                )
            }

            composable(
                route = RootRoute.TIMETABLE_DETAILS,
                enterTransition = {
                    slideIntoContainer(
                        towards = AnimatedContentTransitionScope.SlideDirection.Start,
                        animationSpec = tween(durationMillis = SecondaryPageEnterDuration),
                    ) + fadeIn(animationSpec = tween(durationMillis = SecondaryPageEnterDuration))
                },
                exitTransition = {
                    slideOutOfContainer(
                        towards = AnimatedContentTransitionScope.SlideDirection.End,
                        animationSpec = tween(durationMillis = SecondaryPageExitDuration),
                    ) + fadeOut(animationSpec = tween(durationMillis = SecondaryPageExitDuration))
                },
                popEnterTransition = {
                    slideIntoContainer(
                        towards = AnimatedContentTransitionScope.SlideDirection.End,
                        animationSpec = tween(durationMillis = SecondaryPageExitDuration),
                    ) + fadeIn(animationSpec = tween(durationMillis = SecondaryPageExitDuration))
                },
                popExitTransition = {
                    slideOutOfContainer(
                        towards = AnimatedContentTransitionScope.SlideDirection.End,
                        animationSpec = tween(durationMillis = SecondaryPageEnterDuration),
                    ) + fadeOut(animationSpec = tween(durationMillis = SecondaryPageEnterDuration))
                },
            ) { backStackEntry ->
                val timetableEntry = remember(backStackEntry) {
                    navController.getBackStackEntry(RootRoute.TIMETABLE)
                }
                TimetableDetailsEditorRoute(
                    modifier = Modifier.fillMaxSize(),
                    parentEntry = timetableEntry,
                    onDismiss = { navController.popBackStack() },
                )
            }

            composable(
                route = RootRoute.TIMETABLE_COURSE_EDITOR,
                enterTransition = { secondaryPageEnterTransition() },
                exitTransition = { secondaryPageExitTransition() },
                popEnterTransition = { secondaryPagePopEnterTransition() },
                popExitTransition = { secondaryPagePopExitTransition() },
            ) { backStackEntry ->
                val timetableEntry = remember(backStackEntry) {
                    navController.getBackStackEntry(RootRoute.TIMETABLE)
                }
                CourseEditorRoute(
                    modifier = Modifier.fillMaxSize(),
                    parentEntry = timetableEntry,
                    onDismiss = { navController.popBackStack() },
                )
            }

            composable(
                route = RootRoute.MINE,
                enterTransition = { EnterTransition.None },
                exitTransition = { ExitTransition.None },
                popEnterTransition = { EnterTransition.None },
                popExitTransition = { ExitTransition.None },
            ) {
                MineRoute(
                    modifier = Modifier.fillMaxSize(),
                    contentPadding = paddingValues,
                    hasWallpaper = !appState.wallpaperUri.isNullOrBlank(),
                    onManageTimetables = {
                        navController.navigate(RootRoute.MANAGE_TIMETABLES)
                    },
                    onImport = { navController.navigate(RootRoute.TRANSFER_IMPORT) },
                    onExport = { navController.navigate(RootRoute.TRANSFER_EXPORT) },
                    onChangeWallpaper = { navController.navigate(RootRoute.WALLPAPER) },
                )
            }

            composable(
                route = RootRoute.MANAGE_TIMETABLES,
                enterTransition = { secondaryPageEnterTransition() },
                exitTransition = { secondaryPageExitTransition() },
                popEnterTransition = { secondaryPagePopEnterTransition() },
                popExitTransition = { secondaryPagePopExitTransition() },
            ) {
                ManageTimetablesRoute(
                    modifier = Modifier.fillMaxSize(),
                    onBack = { navController.popBackStack() },
                )
            }

            composable(
                route = RootRoute.TRANSFER_IMPORT,
                enterTransition = { secondaryPageEnterTransition() },
                exitTransition = { secondaryPageExitTransition() },
                popEnterTransition = { secondaryPagePopEnterTransition() },
                popExitTransition = { secondaryPagePopExitTransition() },
            ) {
                TransferRoute(
                    modifier = Modifier.fillMaxSize(),
                    mode = TransferDialogMode.IMPORT,
                    onBack = { navController.popBackStack() },
                    onNavigateToImportConfirm = {
                        navController.navigate(RootRoute.TRANSFER_IMPORT_CONFIRM)
                    },
                    onMessage = { snackbarMessage = it },
                )
            }

            composable(
                route = RootRoute.TRANSFER_IMPORT_CONFIRM,
                enterTransition = { secondaryPageEnterTransition() },
                exitTransition = { secondaryPageExitTransition() },
                popEnterTransition = { secondaryPagePopEnterTransition() },
                popExitTransition = { secondaryPagePopExitTransition() },
            ) { backStackEntry ->
                val transferImportEntry = remember(backStackEntry) {
                    navController.getBackStackEntry(RootRoute.TRANSFER_IMPORT)
                }
                TransferImportConfirmRoute(
                    modifier = Modifier.fillMaxSize(),
                    parentEntry = transferImportEntry,
                    onBack = { navController.popBackStack() },
                    onMessage = { snackbarMessage = it },
                    onImportSuccess = {
                        snackbarMessage = "课程表已导入"
                        returnToTimetable()
                    },
                )
            }

            composable(
                route = RootRoute.TRANSFER_EXPORT,
                enterTransition = { secondaryPageEnterTransition() },
                exitTransition = { secondaryPageExitTransition() },
                popEnterTransition = { secondaryPagePopEnterTransition() },
                popExitTransition = { secondaryPagePopExitTransition() },
            ) {
                TransferRoute(
                    modifier = Modifier.fillMaxSize(),
                    mode = TransferDialogMode.EXPORT,
                    onBack = { navController.popBackStack() },
                    onMessage = { snackbarMessage = it },
                )
            }

            composable(
                route = RootRoute.WALLPAPER,
                enterTransition = { secondaryPageEnterTransition() },
                exitTransition = { secondaryPageExitTransition() },
                popEnterTransition = { secondaryPagePopEnterTransition() },
                popExitTransition = { secondaryPagePopExitTransition() },
            ) {
                MineWallpaperScreen(
                    modifier = Modifier.fillMaxSize(),
                    hasWallpaper = !appState.wallpaperUri.isNullOrBlank(),
                    onBack = { navController.popBackStack() },
                    onChangeWallpaper = { wallpaperLauncher.launch("image/*") },
                    onClearWallpaper = {
                        scope.launch(Dispatchers.IO) {
                            deleteManagedWallpaperFile(context, appState.wallpaperUri)
                        }
                        viewModel.setWallpaper(null)
                    },
                )
            }
        }
    }
}

private fun copyWallpaperToAppStorage(
    context: Context,
    sourceUri: Uri,
    previousWallpaperUri: String?,
): String? {
    val wallpaperDir = File(context.filesDir, "wallpapers").apply { mkdirs() }
    val extension = context.contentResolver.getType(sourceUri)
        ?.let { MimeTypeMap.getSingleton().getExtensionFromMimeType(it) }
        ?.ifBlank { null }
        ?: "img"
    val destination = File(wallpaperDir, "wallpaper-${System.currentTimeMillis()}.$extension")
    return runCatching {
        context.contentResolver.openInputStream(sourceUri)?.use { input ->
            destination.outputStream().use { output ->
                input.copyTo(output)
            }
        } ?: return null
        deleteManagedWallpaperFile(context, previousWallpaperUri)
        Uri.fromFile(destination).toString()
    }.getOrNull()
}

private fun deleteManagedWallpaperFile(
    context: Context,
    wallpaperUri: String?,
) {
    val managedDir = File(context.filesDir, "wallpapers")
    val file = wallpaperUri
        ?.takeIf { it.startsWith("file://") }
        ?.let(Uri::parse)
        ?.path
        ?.let(::File)
        ?: return
    if (file.parentFile == managedDir && file.exists()) {
        file.delete()
    }
}

private val secondaryRoutes = setOf(
    RootRoute.TIMETABLE_DETAILS,
    RootRoute.TIMETABLE_COURSE_EDITOR,
    RootRoute.MANAGE_TIMETABLES,
    RootRoute.TRANSFER_IMPORT,
    RootRoute.TRANSFER_IMPORT_CONFIRM,
    RootRoute.TRANSFER_EXPORT,
    RootRoute.WALLPAPER,
)

private fun AnimatedContentTransitionScope<NavBackStackEntry>.secondaryPageEnterTransition() =
    slideIntoContainer(
        towards = AnimatedContentTransitionScope.SlideDirection.Start,
        animationSpec = tween(durationMillis = SecondaryPageEnterDuration),
    ) + fadeIn(animationSpec = tween(durationMillis = SecondaryPageEnterDuration))

private fun AnimatedContentTransitionScope<NavBackStackEntry>.secondaryPageExitTransition() =
    slideOutOfContainer(
        towards = AnimatedContentTransitionScope.SlideDirection.End,
        animationSpec = tween(durationMillis = SecondaryPageExitDuration),
    ) + fadeOut(animationSpec = tween(durationMillis = SecondaryPageExitDuration))

private fun AnimatedContentTransitionScope<NavBackStackEntry>.secondaryPagePopEnterTransition() =
    slideIntoContainer(
        towards = AnimatedContentTransitionScope.SlideDirection.End,
        animationSpec = tween(durationMillis = SecondaryPageExitDuration),
    ) + fadeIn(animationSpec = tween(durationMillis = SecondaryPageExitDuration))

private fun AnimatedContentTransitionScope<NavBackStackEntry>.secondaryPagePopExitTransition() =
    slideOutOfContainer(
        towards = AnimatedContentTransitionScope.SlideDirection.End,
        animationSpec = tween(durationMillis = SecondaryPageEnterDuration),
    ) + fadeOut(animationSpec = tween(durationMillis = SecondaryPageEnterDuration))
