import org.jetbrains.kotlin.gradle.dsl.JvmTarget
import org.gradle.api.provider.Provider
import java.io.File
import java.time.LocalDateTime
import java.time.format.DateTimeFormatter
import java.util.Locale
import java.util.Properties

plugins {
    alias(libs.plugins.android.application)
    alias(libs.plugins.kotlin.compose)
    alias(libs.plugins.hilt)
    alias(libs.plugins.ksp)
    alias(libs.plugins.google.oss.licenses)
}

val localSigningProperties: Properties = Properties().apply {
    val localSigningFile: File = rootProject.file(".signing/.env.release-signing")
    if (localSigningFile.isFile) {
        localSigningFile.inputStream().use(::load)
    }
}

fun resolveStoreFile(): String? {
    val localStoreFile: String? = localSigningProperties.getProperty("RELEASE_STORE_FILE")
    if (!localStoreFile.isNullOrBlank() && rootProject.file(localStoreFile).isFile) {
        return localStoreFile
    }

    val configuredPath: String? = providers.gradleProperty("RELEASE_STORE_FILE").orNull
    if (!configuredPath.isNullOrBlank() && rootProject.file(configuredPath).isFile) {
        return configuredPath
    }

    return null
}

fun resolveSigningProperty(name: String): String? {
    val localValue: String? = localSigningProperties.getProperty(name)
    return localValue?.takeIf { it.isNotBlank() }
        ?: providers.gradleProperty(name).orNull
}

val releaseStoreFile = resolveStoreFile()
val releaseStorePassword = resolveSigningProperty("RELEASE_STORE_PASSWORD")
val releaseKeyAlias = resolveSigningProperty("RELEASE_KEY_ALIAS")
val releaseKeyPassword = resolveSigningProperty("RELEASE_KEY_PASSWORD")
val appVersionName: Provider<String> =
    providers.gradleProperty("APP_VERSION").orElse("1.0.0")
val buildTimeValue = LocalDateTime.now().format(
    DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"),
)
val releaseAbiNames = mapOf(
    "arm64-v8a" to "v8a",
    "armeabi-v7a" to "v7a",
    "x86_64" to "x86_64",
)
val hasReleaseSigning = !releaseStoreFile.isNullOrBlank() &&
    !releaseStorePassword.isNullOrBlank() &&
    !releaseKeyAlias.isNullOrBlank() &&
    !releaseKeyPassword.isNullOrBlank()

android {
    namespace = "com.chronos.mobile"
    compileSdk = 36

    defaultConfig {
        applicationId = "com.chronos.mobile"
        minSdk = 26
        targetSdk = 36
        versionCode = 1
        versionName = appVersionName.get()
        buildConfigField("String", "BUILD_TIME", "\"$buildTimeValue\"")

        testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"
        vectorDrawables {
            useSupportLibrary = true
        }
    }

    signingConfigs {
        if (hasReleaseSigning) {
            create("release") {
                storeFile = rootProject.file(requireNotNull(releaseStoreFile))
                storePassword = requireNotNull(releaseStorePassword)
                keyAlias = requireNotNull(releaseKeyAlias)
                keyPassword = requireNotNull(releaseKeyPassword)
            }
        }
    }

    buildTypes {
        release {
            isMinifyEnabled = true
            isShrinkResources = true
            if (hasReleaseSigning) {
                signingConfig = signingConfigs.getByName("release")
            }
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
        }
    }

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_21
        targetCompatibility = JavaVersion.VERSION_21
    }

    buildFeatures {
        compose = true
        buildConfig = true
    }

    splits {
        abi {
            isEnable = true
            reset()
            include(*releaseAbiNames.keys.toTypedArray())
            isUniversalApk = false
        }
    }

    packaging {
        resources {
            excludes += "/META-INF/{AL2.0,LGPL2.1}"
        }
    }
}

kotlin {
    compilerOptions {
        jvmTarget.set(JvmTarget.JVM_21)
    }
}

dependencies {
    implementation(project(":data:repository"))
    implementation(project(":data:remote"))
    implementation(project(":data:secure"))
    implementation(project(":feature:root"))
    implementation(libs.androidx.core.ktx)
    implementation(libs.androidx.core.splashscreen)
    implementation(libs.androidx.lifecycle.runtime.ktx)
    implementation(libs.androidx.activity.compose)
    implementation(libs.google.material)
    implementation(platform(libs.androidx.compose.bom))
    implementation(libs.androidx.compose.ui)
    implementation(libs.google.play.services.oss.licenses)
    implementation(libs.hilt.android)
    ksp(libs.hilt.compiler)
    debugImplementation(libs.androidx.compose.ui.tooling)
}

val prepareReleaseArtifacts by tasks.registering {
    group = "distribution"
    description = "Builds split release APKs and copies them to stable GitHub Release names."
    dependsOn("assembleRelease")

    val sourceDir = layout.buildDirectory.dir("outputs/apk/release")
    val targetDir = layout.buildDirectory.dir("outputs/github-release")

    inputs.dir(sourceDir)
    outputs.dir(targetDir)

    doLast {
        val source: File = sourceDir.get().asFile
        val target: File = targetDir.get().asFile

        if (!source.exists()) {
            error("Release APK directory not found: ${source.absolutePath}")
        }

        target.mkdirs()
        val existingArtifacts: Array<File>? = target.listFiles()
        existingArtifacts?.forEach { existing: File ->
            if (existing.isFile) {
                existing.delete()
            }
        }

        releaseAbiNames.forEach { (abi, suffix) ->
            val sourceApks: Array<File>? = source.listFiles()
            val apk: File = sourceApks
                ?.firstOrNull { file: File ->
                    file.extension == "apk" &&
                        !file.name.contains("unsigned", ignoreCase = true) &&
                        file.name.lowercase(Locale.US).contains(abi.lowercase(Locale.US))
                }
                ?: error("Signed release APK for ABI $abi not found in ${source.absolutePath}")

            apk.copyTo(
                target.resolve("Chronos-${appVersionName.get()}-$suffix.apk"),
                overwrite = true,
            )
        }
    }
}
