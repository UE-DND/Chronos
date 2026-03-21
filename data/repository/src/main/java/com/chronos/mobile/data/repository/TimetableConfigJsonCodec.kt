package com.chronos.mobile.data.repository

import com.chronos.mobile.core.model.TimetableDetails
import com.chronos.mobile.core.model.TimetableViewPrefs
import javax.inject.Inject
import kotlinx.serialization.Serializable
import kotlinx.serialization.json.Json
import kotlinx.serialization.json.JsonObject

class TimetableConfigJsonCodec @Inject constructor() {
    private val json = Json {
        encodeDefaults = true
        ignoreUnknownKeys = true
    }

    internal fun encode(
        details: TimetableDetails,
        viewPrefs: TimetableViewPrefs,
    ): String = json.encodeToString(
        TimetableConfig(details = details, viewPrefs = viewPrefs),
    )

    internal fun decode(configJson: String): TimetableConfig = runCatching {
        val parsed = json.parseToJsonElement(configJson)
        if (parsed is JsonObject && "details" in parsed) {
            json.decodeFromJsonElement(TimetableConfig.serializer(), parsed)
        } else {
            val legacyDetails = json.decodeFromJsonElement(TimetableDetails.serializer(), parsed)
            TimetableConfig(details = legacyDetails)
        }
    }.getOrDefault(TimetableConfig())
}

@Serializable
internal data class TimetableConfig(
    val details: TimetableDetails = TimetableDetails(),
    val viewPrefs: TimetableViewPrefs = TimetableViewPrefs(),
)
