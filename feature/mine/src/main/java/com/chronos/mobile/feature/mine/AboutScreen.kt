package com.chronos.mobile.feature.mine

import android.graphics.drawable.Drawable
import android.widget.ImageView
import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
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
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.automirrored.filled.Chat
import androidx.compose.material.icons.automirrored.filled.OpenInNew
import androidx.compose.material.icons.filled.ChevronRight
import androidx.compose.material.icons.filled.Code
import androidx.compose.material.icons.filled.Gavel
import androidx.compose.material.icons.filled.Info
import androidx.compose.material.icons.filled.SpaceDashboard
import androidx.compose.material3.Button
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.material3.TopAppBar
import androidx.compose.runtime.Composable
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.platform.LocalUriHandler
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.viewinterop.AndroidView
import coil3.compose.SubcomposeAsyncImage
import coil3.compose.SubcomposeAsyncImageContent
import coil3.request.ImageRequest
import coil3.size.Size
import com.chronos.mobile.domain.model.GithubContributor

private const val ProjectIntro = "一个简单的 Android 课程表应用"
private const val SourceCodeUrl = "https://github.com/UE-DND/Chronos"
private const val QqFeedbackUrl = "https://qm.qq.com/q/N5xwt87jmQ"
private const val GithubIssuesUrl = "https://github.com/UE-DND/Chronos/issues"

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun AboutScreen(
    appVersionName: String,
    buildTime: String,
    contributors: List<GithubContributor>,
    isLoading: Boolean,
    errorMessage: String?,
    onOpenCurrentVersionRelease: () -> Unit,
    onOpenOpenSourceLicenses: () -> Unit,
    onBack: () -> Unit,
    onRetryLoadContributors: () -> Unit,
    modifier: Modifier = Modifier,
) {
    val uriHandler = LocalUriHandler.current
    val context = LocalContext.current
    val appIcon = remember(context) {
        runCatching { context.packageManager.getApplicationIcon(context.packageName) }.getOrNull()
    }

    Scaffold(
        modifier = modifier.fillMaxSize(),
        topBar = {
            TopAppBar(
                modifier = Modifier.windowInsetsPadding(WindowInsets.statusBars),
                title = { Text("关于") },
                navigationIcon = {
                    IconButton(onClick = onBack) {
                        Icon(
                            imageVector = Icons.AutoMirrored.Filled.ArrowBack,
                            contentDescription = "返回",
                        )
                    }
                },
            )
        },
    ) { paddingValues ->
        LazyColumn(
            modifier = Modifier
                .fillMaxSize()
                .background(MaterialTheme.colorScheme.surface)
                .padding(horizontal = 16.dp),
            contentPadding = PaddingValues(
                top = paddingValues.calculateTopPadding() + 8.dp,
                bottom = paddingValues.calculateBottomPadding() + 24.dp,
            ),
            verticalArrangement = Arrangement.spacedBy(20.dp),
        ) {
            item {
                AppHeader(appIcon = appIcon)
            }

            item {
                AboutSection(
                    title = "版本信息",
                    accentColor = MaterialTheme.colorScheme.primary,
                ) {
                    Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                        InfoRow(
                            icon = Icons.Default.SpaceDashboard,
                            title = "当前版本",
                            subtitle = appVersionName,
                            onClick = onOpenCurrentVersionRelease,
                        )
                        InfoRow(
                            icon = Icons.Default.Info,
                            title = "构建时间",
                            subtitle = buildTime,
                        )
                    }
                }
            }

            item {
                AboutSection(
                    title = "作者信息",
                    accentColor = MaterialTheme.colorScheme.secondary,
                ) {
                    when {
                        isLoading && contributors.isEmpty() -> {
                            Row(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .padding(vertical = 8.dp),
                                horizontalArrangement = Arrangement.Center,
                            ) {
                                CircularProgressIndicator()
                            }
                        }

                        errorMessage != null && contributors.isEmpty() -> {
                            Column(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalAlignment = Alignment.CenterHorizontally,
                                verticalArrangement = Arrangement.spacedBy(10.dp),
                            ) {
                                Text(
                                    text = errorMessage,
                                    style = MaterialTheme.typography.bodyMedium,
                                    color = MaterialTheme.colorScheme.error,
                                )
                                Button(onClick = onRetryLoadContributors) {
                                    Text("重试")
                                }
                            }
                        }

                        else -> {
                            Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                                if (contributors.isEmpty()) {
                                    Text(
                                        text = "暂无贡献者信息",
                                        style = MaterialTheme.typography.bodySmall,
                                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                                    )
                                }
                                contributors.forEach { contributor ->
                                    ContributorRow(
                                        contributor = contributor,
                                        onClick = { uriHandler.openUri(contributor.profileUrl) },
                                    )
                                }
                                if (isLoading && contributors.isNotEmpty()) {
                                    Row(
                                        modifier = Modifier.fillMaxWidth(),
                                        horizontalArrangement = Arrangement.Center,
                                    ) {
                                        CircularProgressIndicator(modifier = Modifier.size(24.dp))
                                    }
                                }
                                if (errorMessage != null && contributors.isNotEmpty()) {
                                    Text(
                                        text = errorMessage,
                                        style = MaterialTheme.typography.bodySmall,
                                        color = MaterialTheme.colorScheme.error,
                                    )
                                }
                            }
                        }
                    }
                }
            }

            item {
                AboutSection(
                    title = "项目与反馈",
                    accentColor = MaterialTheme.colorScheme.tertiary,
                ) {
                    Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
                        LinkRow(
                            icon = Icons.Default.Gavel,
                            title = "开源许可",
                            onClick = onOpenOpenSourceLicenses,
                            trailingIcon = Icons.Default.ChevronRight,
                        )
                        LinkRow(
                            icon = Icons.Default.Code,
                            title = "项目源代码",
                            onClick = { uriHandler.openUri(SourceCodeUrl) },
                        )
                        LinkRow(
                            icon = Icons.AutoMirrored.Filled.Chat,
                            title = "问题反馈（QQ）",
                            onClick = { uriHandler.openUri(QqFeedbackUrl) },
                        )
                        LinkRow(
                            icon = Icons.AutoMirrored.Filled.Chat,
                            title = "问题反馈（GitHub Issue）",
                            onClick = { uriHandler.openUri(GithubIssuesUrl) },
                        )
                    }
                }
            }
        }
    }
}

@Composable
private fun AppHeader(
    appIcon: Drawable?,
    modifier: Modifier = Modifier,
) {
    Column(
        modifier = modifier
            .fillMaxWidth()
            .padding(top = 8.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.spacedBy(12.dp),
    ) {
        if (appIcon != null) {
            AndroidView(
                factory = { context ->
                    ImageView(context).apply {
                        scaleType = ImageView.ScaleType.CENTER_CROP
                        setImageDrawable(appIcon)
                    }
                },
                modifier = Modifier
                    .size(92.dp)
                    .clip(CircleShape),
                update = { imageView -> imageView.setImageDrawable(appIcon) },
            )
        } else {
            Surface(
                modifier = Modifier.size(92.dp),
                shape = CircleShape,
                color = MaterialTheme.colorScheme.primaryContainer,
            ) {
                Box(contentAlignment = Alignment.Center) {
                    Icon(
                        imageVector = Icons.Default.SpaceDashboard,
                        contentDescription = null,
                        tint = MaterialTheme.colorScheme.onPrimaryContainer,
                        modifier = Modifier.size(42.dp),
                    )
                }
            }
        }

        Text(
            text = "Chronos",
            style = MaterialTheme.typography.headlineSmall,
            fontWeight = FontWeight.SemiBold,
        )
        Text(
            text = ProjectIntro,
            style = MaterialTheme.typography.bodyMedium,
            color = MaterialTheme.colorScheme.onSurfaceVariant,
        )
    }
}

@Composable
private fun AboutSection(
    title: String,
    accentColor: Color,
    content: @Composable () -> Unit,
) {
    Column {
        Row(
            modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp),
        ) {
            Text(text = title, style = MaterialTheme.typography.titleMedium)
        }
        Spacer(modifier = Modifier.height(8.dp))
        Surface(
            shape = RoundedCornerShape(28.dp),
            color = MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.3f),
            border = BorderStroke(1.dp, accentColor.copy(alpha = 0.14f)),
        ) {
            Column(modifier = Modifier.padding(12.dp)) {
                content()
            }
        }
    }
}

@Composable
private fun InfoRow(
    icon: ImageVector,
    title: String,
    subtitle: String,
    onClick: (() -> Unit)? = null,
) {
    val rowModifier = if (onClick == null) {
        Modifier
    } else {
        Modifier
            .clip(RoundedCornerShape(22.dp))
            .clickable(onClick = onClick)
    }
    Row(
        modifier = rowModifier
            .fillMaxWidth()
            .padding(horizontal = 4.dp, vertical = 8.dp),
        verticalAlignment = Alignment.CenterVertically,
    ) {
        Icon(
            imageVector = icon,
            contentDescription = null,
            tint = MaterialTheme.colorScheme.onSurfaceVariant,
        )
        Spacer(modifier = Modifier.width(12.dp))
        Column(modifier = Modifier.weight(1f)) {
            Text(text = title, style = MaterialTheme.typography.bodyLarge)
            Text(
                text = subtitle,
                style = MaterialTheme.typography.bodySmall,
                color = MaterialTheme.colorScheme.onSurfaceVariant,
            )
        }
        if (onClick != null) {
            Icon(
                imageVector = Icons.Default.ChevronRight,
                contentDescription = null,
                tint = MaterialTheme.colorScheme.onSurfaceVariant,
            )
        }
    }
}

@Composable
private fun ContributorRow(
    contributor: GithubContributor,
    onClick: () -> Unit,
) {
    val context = LocalContext.current
    val roleLabel = if (contributor.login.equals("UE-DND", ignoreCase = true)) "项目作者" else "项目献者"
    val avatarRequest = remember(context, contributor.avatarUrl) {
        ImageRequest.Builder(context)
            .data(contributor.avatarUrl)
            .size(Size(176, 176))
            .build()
    }

    Row(
        modifier = Modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(22.dp))
            .clickable(onClick = onClick)
            .padding(horizontal = 4.dp, vertical = 8.dp),
        verticalAlignment = Alignment.CenterVertically,
    ) {
        SubcomposeAsyncImage(
            model = avatarRequest,
            contentDescription = null,
            modifier = Modifier
                .size(44.dp)
                .clip(CircleShape),
            contentScale = ContentScale.Crop,
            loading = { ContributorAvatarPlaceholder(contributor.login) },
            error = { ContributorAvatarPlaceholder(contributor.login) },
            success = {
                SubcomposeAsyncImageContent()
            },
        )
        Spacer(modifier = Modifier.width(12.dp))
        Column(modifier = Modifier.weight(1f)) {
            Text(
                text = contributor.login,
                style = MaterialTheme.typography.bodyLarge,
            )
            Text(
                text = "$roleLabel · 贡献 ${contributor.contributions}",
                style = MaterialTheme.typography.bodySmall,
                color = MaterialTheme.colorScheme.onSurfaceVariant,
            )
        }
        Icon(
            imageVector = Icons.Default.ChevronRight,
            contentDescription = null,
            tint = MaterialTheme.colorScheme.onSurfaceVariant,
        )
    }
}

@Composable
private fun ContributorAvatarPlaceholder(
    login: String,
    modifier: Modifier = Modifier,
) {
    val initial = remember(login) {
        login.trim().firstOrNull()?.uppercaseChar()?.toString() ?: "?"
    }

    Surface(
        modifier = modifier
            .size(44.dp)
            .clip(CircleShape),
        shape = CircleShape,
        color = MaterialTheme.colorScheme.secondaryContainer,
    ) {
        Box(contentAlignment = Alignment.Center) {
            Text(
                text = initial,
                style = MaterialTheme.typography.titleMedium,
                fontWeight = FontWeight.Bold,
                color = MaterialTheme.colorScheme.onSecondaryContainer,
            )
        }
    }
}

@Composable
private fun LinkRow(
    icon: ImageVector,
    title: String,
    onClick: () -> Unit,
    trailingIcon: ImageVector = Icons.AutoMirrored.Filled.OpenInNew,
) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(22.dp))
            .clickable(onClick = onClick)
            .padding(horizontal = 4.dp, vertical = 8.dp),
        verticalAlignment = Alignment.CenterVertically,
    ) {
        Icon(
            imageVector = icon,
            contentDescription = null,
            tint = MaterialTheme.colorScheme.onSurfaceVariant,
        )
        Spacer(modifier = Modifier.width(12.dp))
        Text(
            text = title,
            style = MaterialTheme.typography.bodyLarge,
            modifier = Modifier.weight(1f),
        )
        Icon(
            imageVector = trailingIcon,
            contentDescription = null,
            tint = MaterialTheme.colorScheme.onSurfaceVariant,
        )
    }
}
