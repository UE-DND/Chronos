plugins {
    id("chronos.android.library")
    alias(libs.plugins.kotlin.serialization)
}

android {
    namespace = "com.chronos.mobile.core.model"
}

dependencies {
    implementation(libs.kotlinx.serialization.json)
}
