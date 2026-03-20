pluginManagement {
    repositories {
        google()
        mavenCentral()
        gradlePluginPortal()
    }
}
plugins {
    id("org.gradle.toolchains.foojay-resolver-convention") version "0.10.0"
}

rootProject.name = "Chronos"
include(":app")
include(":core:model")
include(":core:designsystem")
include(":domain")
include(":data:local")
include(":data:preferences")
include(":data:repository")
include(":data:remote")
include(":data:secure")
include(":feature:root")
include(":feature:timetable")
include(":feature:mine")
include(":feature:transfer")
