package com.chronos.mobile.data.repository

import com.chronos.mobile.data.preferences.UserPreferenceState
import com.chronos.mobile.data.preferences.UserPreferences
import javax.inject.Inject
import javax.inject.Singleton
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.distinctUntilChanged
import kotlinx.coroutines.flow.first

@Singleton
class PreferenceDataSource @Inject constructor(
    private val userPreferences: UserPreferences,
) {
    val preferences: Flow<UserPreferenceState> = userPreferences.preferences.distinctUntilChanged()

    suspend fun getSnapshot(): UserPreferenceState = preferences.first()

    suspend fun setCurrentTimetableId(id: String?) {
        userPreferences.setCurrentTimetableId(id)
    }

    suspend fun setWallpaper(uri: String?) {
        userPreferences.setWallpaperUri(uri)
    }
}
