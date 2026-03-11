package com.chronos.mobile.data.preferences

import android.content.Context
import androidx.datastore.preferences.core.Preferences
import androidx.datastore.preferences.core.edit
import androidx.datastore.preferences.core.emptyPreferences
import androidx.datastore.preferences.core.stringPreferencesKey
import androidx.datastore.preferences.preferencesDataStore
import dagger.hilt.android.qualifiers.ApplicationContext
import javax.inject.Inject
import javax.inject.Singleton
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.catch
import kotlinx.coroutines.flow.map
import java.io.IOException

private val Context.userPreferencesDataStore by preferencesDataStore(name = "chronos_preferences")

data class UserPreferenceState(
    val currentTimetableId: String? = null,
    val wallpaperUri: String? = null,
)

@Singleton
class UserPreferences @Inject constructor(
    @ApplicationContext private val context: Context,
) {
    private object Keys {
        val currentTimetableId = stringPreferencesKey("current_timetable_id")
        val wallpaperUri = stringPreferencesKey("wallpaper_uri")
    }

    val preferences: Flow<UserPreferenceState> = context.userPreferencesDataStore.data
        .catch { throwable ->
            if (throwable is IOException) {
                emit(emptyPreferences())
            } else {
                throw throwable
            }
        }
        .map { preferences ->
            UserPreferenceState(
                currentTimetableId = preferences[Keys.currentTimetableId],
                wallpaperUri = preferences[Keys.wallpaperUri],
            )
        }

    suspend fun setCurrentTimetableId(id: String?) {
        updateString(Keys.currentTimetableId, id)
    }

    suspend fun setWallpaperUri(uri: String?) {
        updateString(Keys.wallpaperUri, uri)
    }

    private suspend fun updateString(key: Preferences.Key<String>, value: String?) {
        context.userPreferencesDataStore.edit { preferences ->
            if (value == null) {
                preferences.remove(key)
            } else {
                preferences[key] = value
            }
        }
    }
}
