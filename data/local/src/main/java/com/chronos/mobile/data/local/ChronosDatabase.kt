package com.chronos.mobile.data.local

import androidx.room.Database
import androidx.room.RoomDatabase

@Database(
    entities = [TimetableEntity::class, CourseEntity::class],
    version = 1,
    exportSchema = true,
)
abstract class ChronosDatabase : RoomDatabase() {
    abstract fun chronosDao(): ChronosDao
}
