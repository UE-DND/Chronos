package com.chronos.mobile.data.local

import androidx.room.Database
import androidx.room.RoomDatabase
import androidx.room.migration.Migration
import androidx.sqlite.db.SupportSQLiteDatabase
import com.chronos.mobile.core.model.TimetableDetails
import kotlinx.serialization.json.Json

@Database(
    entities = [TimetableEntity::class, CourseEntity::class],
    version = 3,
    exportSchema = false,
)
abstract class ChronosDatabase : RoomDatabase() {
    abstract fun chronosDao(): ChronosDao
}

private val migrationJson = Json { encodeDefaults = true }

val MIGRATION_1_2 = object : Migration(1, 2) {
    override fun migrate(database: SupportSQLiteDatabase) {
        val defaultConfig = migrationJson.encodeToString(TimetableDetails())
            .replace("'", "''")
        database.execSQL(
            "ALTER TABLE timetables ADD COLUMN configJson TEXT NOT NULL DEFAULT '$defaultConfig'"
        )
    }
}

val MIGRATION_2_3 = object : Migration(2, 3) {
    override fun migrate(database: SupportSQLiteDatabase) {
        database.execSQL(
            "ALTER TABLE courses ADD COLUMN weeksCsv TEXT NOT NULL DEFAULT ''"
        )
    }
}
