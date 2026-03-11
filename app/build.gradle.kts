import org.jetbrains.kotlin.gradle.dsl.JvmTarget
import java.util.Locale

plugins {
    alias(libs.plugins.android.application)
    alias(libs.plugins.kotlin.compose)
    alias(libs.plugins.hilt)
    alias(libs.plugins.ksp)
}

val releaseStoreFile = providers.gradleProperty("RELEASE_STORE_FILE")
val releaseStorePassword = providers.gradleProperty("RELEASE_STORE_PASSWORD")
val releaseKeyAlias = providers.gradleProperty("RELEASE_KEY_ALIAS")
val releaseKeyPassword = providers.gradleProperty("RELEASE_KEY_PASSWORD")
val appVersionName = providers.gradleProperty("APP_VERSION").orElse("1.0.0")
val releaseAbiNames = mapOf(
    "arm64-v8a" to "v8a",
    "armeabi-v7a" to "v7a",
    "x86_64" to "x86_64",
)
val hasReleaseSigning = releaseStoreFile.isPresent &&
    releaseStorePassword.isPresent &&
    releaseKeyAlias.isPresent &&
    releaseKeyPassword.isPresent

android {
    namespace = "com.chronos.mobile"
    compileSdk = 35

    defaultConfig {
        applicationId = "com.chronos.mobile"
        minSdk = 26
        targetSdk = 35
        versionCode = 1
        versionName = appVersionName.get()

        testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"
        vectorDrawables {
            useSupportLibrary = true
        }
    }

    signingConfigs {
        if (hasReleaseSigning) {
            create("release") {
                storeFile = rootProject.file(releaseStoreFile.get())
                storePassword = releaseStorePassword.get()
                keyAlias = releaseKeyAlias.get()
                keyPassword = releaseKeyPassword.get()
            }
        }
    }

    buildTypes {
        release {
            isMinifyEnabled = false
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
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }

    buildFeatures {
        compose = true
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
        jvmTarget.set(JvmTarget.JVM_17)
    }
}

dependencies {
    implementation(project(":core:designsystem"))
    implementation(project(":data:repository"))
    implementation(project(":feature:root"))
    implementation(libs.androidx.core.ktx)
    implementation(libs.androidx.core.splashscreen)
    implementation(libs.androidx.lifecycle.runtime.ktx)
    implementation(libs.androidx.activity.compose)
    implementation(libs.google.material)
    implementation(platform(libs.androidx.compose.bom))
    implementation(libs.androidx.compose.ui)
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
        val source = sourceDir.get().asFile
        val target = targetDir.get().asFile

        if (!source.exists()) {
            error("Release APK directory not found: ${source.absolutePath}")
        }

        target.mkdirs()
        target.listFiles()?.forEach { existing ->
            if (existing.isFile) {
                existing.delete()
            }
        }

        releaseAbiNames.forEach { (abi, suffix) ->
            val apk = source.listFiles()
                ?.firstOrNull { file ->
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
