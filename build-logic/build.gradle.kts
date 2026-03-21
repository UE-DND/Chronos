plugins {
    `kotlin-dsl`
}

java {
    toolchain {
        languageVersion.set(JavaLanguageVersion.of(21))
    }
}

kotlin {
    jvmToolchain(21)
}

repositories {
    google()
    mavenCentral()
    gradlePluginPortal()
}

dependencies {
    implementation("com.android.tools.build:gradle:9.1.0")
    implementation("org.jetbrains.kotlin:kotlin-gradle-plugin:2.3.20")
    implementation("org.jetbrains.kotlin.plugin.compose:org.jetbrains.kotlin.plugin.compose.gradle.plugin:2.3.20")
    implementation("com.google.dagger:hilt-android-gradle-plugin:2.59.2")
    implementation("com.google.dagger.hilt.android:com.google.dagger.hilt.android.gradle.plugin:2.59.2")
    implementation("com.google.devtools.ksp:symbol-processing-gradle-plugin:2.3.6")
    implementation("com.google.devtools.ksp:com.google.devtools.ksp.gradle.plugin:2.3.6")
}
