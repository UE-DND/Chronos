package com.chronos.mobile.di

import android.content.Context
import androidx.room.Room
import com.chronos.mobile.data.local.ChronosDao
import com.chronos.mobile.data.local.ChronosDatabase
import com.chronos.mobile.data.local.MIGRATION_1_2
import com.chronos.mobile.data.local.MIGRATION_2_3
import com.chronos.mobile.data.repository.OfflineTimetableRepository
import com.chronos.mobile.domain.TimetableRepository
import dagger.Module
import dagger.Provides
import dagger.hilt.InstallIn
import dagger.hilt.android.qualifiers.ApplicationContext
import dagger.hilt.components.SingletonComponent
import javax.inject.Singleton

@Module
@InstallIn(SingletonComponent::class)
object DatabaseModule {
    @Provides
    @Singleton
    fun provideChronosDatabase(
        @ApplicationContext context: Context,
    ): ChronosDatabase = Room.databaseBuilder(
        context,
        ChronosDatabase::class.java,
        "chronos.db",
    ).addMigrations(MIGRATION_1_2, MIGRATION_2_3).build()

    @Provides
    fun provideChronosDao(database: ChronosDatabase): ChronosDao = database.chronosDao()

    @Provides
    @Singleton
    fun provideTimetableRepository(
        repository: OfflineTimetableRepository,
    ): TimetableRepository = repository
}

