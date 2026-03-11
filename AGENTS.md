# Repository Guidelines

## Project Structure & Module Organization

Chronos is a multi-module Android app built with Gradle Kotlin DSL. `app/` contains the application entry points and dependency wiring. Shared models live in `core/model`, and reusable Compose theme code lives in `core/designsystem`. Business logic and use cases are in `domain/`. Persistence is split across `data/local` (Room), `data/preferences` (DataStore), and `data/repository` (repository implementations). UI features are organized by screen under `feature/root`, `feature/timetable`, `feature/mine`, and `feature/transfer`. Source files are under each module’s `src/main/java`; current unit tests live in `domain/src/test/java`.

## Build, Test, and Development Commands

Use the Gradle wrapper from the repository root:

- `./gradlew assembleDebug` builds a debug APK for the app.
- `./gradlew testDebugUnitTest` runs JVM unit tests across debug variants.
- `./gradlew :domain:testDebugUnitTest` runs the existing domain-layer tests only.
- `./gradlew lintDebug` runs Android lint for debug builds.

Run commands from the repo root so inter-module dependencies resolve correctly.

The Java runtime can directly reuse the JBR that comes with Android Studio:

```bash
export JAVA_HOME="/Applications/Android Studio.app/Contents/jbr/Contents/Home"
export PATH="$JAVA_HOME/bin:$PATH"
```

## Coding Style & Naming Conventions

Follow Kotlin defaults: 4-space indentation, trailing commas where they improve diffs, and one top-level type or closely related set of composables per file. Keep package names under `com.chronos.mobile...` and mirror the module path. Use `UpperCamelCase` for classes, `lowerCamelCase` for functions and properties, and suffix Compose entry points with `Route`, `Screen`, or `Dialog` when that matches existing code such as `TimetableRoute` or `CourseEditorDialog`. Keep ViewModels in feature modules and use cases in `domain/usecase`.

## Testing Guidelines

JUnit 4 is configured today, with active tests in the `domain` module. Name test files `*Test.kt` and keep test methods descriptive, focused, and deterministic. Prefer fast unit coverage for use cases and parsing logic before adding Android-dependent tests. Run `./gradlew testDebugUnitTest` before opening a PR; add targeted module commands while iterating.

## Commit & Pull Request Guidelines

Local Git history is not available in this workspace snapshot, so no repository-specific commit convention could be verified. Use short, imperative commit subjects such as `Add timetable export validation`. Keep each commit scoped to one concern. PRs should include a brief summary, affected modules, test results, and screenshots or recordings for UI changes in `feature/*` or `core/designsystem`.

## Configuration Notes

The project targets Android SDK 35, min SDK 26, and Java/Kotlin 17. Manage dependency versions through `gradle/libs.versions.toml`; prefer updating the catalog instead of hardcoding versions in module build files.
