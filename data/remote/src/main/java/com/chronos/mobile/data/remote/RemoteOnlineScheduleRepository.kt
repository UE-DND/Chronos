package com.chronos.mobile.data.remote

import android.util.Log
import com.chronos.mobile.core.model.OnlineSchedulePayload
import com.chronos.mobile.domain.OnlineScheduleRepository
import com.chronos.mobile.domain.model.AuthSnapshot
import com.chronos.mobile.domain.result.AppError
import com.chronos.mobile.domain.result.AppResult
import com.chronos.mobile.domain.result.asFailure
import com.chronos.mobile.domain.result.asSuccess
import com.chronos.mobile.domain.result.toAppError
import javax.inject.Inject
import kotlinx.serialization.json.Json
import kotlinx.serialization.json.JsonElement
import kotlinx.serialization.json.JsonObject
import kotlinx.serialization.json.JsonPrimitive
import okhttp3.MediaType.Companion.toMediaType
import okhttp3.OkHttpClient
import okhttp3.Request
import okhttp3.RequestBody.Companion.toRequestBody
import okhttp3.JavaNetCookieJar

class RemoteOnlineScheduleRepository @Inject constructor(
    private val baseClient: OkHttpClient,
    private val casPasswordEncryptor: CasPasswordEncryptor,
) : OnlineScheduleRepository {
    private val json = Json {
        encodeDefaults = true
        ignoreUnknownKeys = true
    }

    override suspend fun fetchSchedule(
        authSnapshot: AuthSnapshot,
        weekNum: String?,
        yearTerm: String?,
    ): AppResult<OnlineSchedulePayload> {
        return try {
            Log.d("TransferImport", "fetchSchedule start, account=${authSnapshot.account}")
            val client = buildClient()
            val loginResult = login(client, authSnapshot)
            if (loginResult is AppResult.Failure) {
                Log.e("TransferImport", "fetchSchedule login failed: ${loginResult.error.message}")
                loginResult
            } else {
                Log.d("TransferImport", "fetchSchedule login success, fetching week events")
                fetchWeekEvents(
                    client = client,
                    authSnapshot = authSnapshot,
                    weekNum = weekNum,
                    yearTerm = yearTerm,
                    allowReloginRetry = true,
                )
            }
        } catch (throwable: Throwable) {
            Log.e("TransferImport", "fetchSchedule crashed", throwable)
            throwable.toAppError().asFailure()
        }
    }

    private fun fetchWeekEvents(
        client: OkHttpClient,
        authSnapshot: AuthSnapshot,
        weekNum: String?,
        yearTerm: String?,
        allowReloginRetry: Boolean,
    ): AppResult<OnlineSchedulePayload> {
        val body = buildJsonObject(
            "userID" to JsonPrimitive(authSnapshot.account),
            "weekNum" to weekNum?.takeIf { it.isNotBlank() }?.let(::JsonPrimitive),
            "yearTerm" to yearTerm?.takeIf { it.isNotBlank() }?.let(::JsonPrimitive),
        )
        val request = Request.Builder()
            .url(WEEK_EVENTS_URL)
            .post(body.toRequestBody(JSON_MEDIA_TYPE))
            .build()
        Log.d("TransferImport", "fetchWeekEvents request")
        val payload = client.newCall(request).execute().use { response ->
            if (!response.isSuccessful) {
                return AppError.Network("在线课表请求失败：HTTP ${response.code}").asFailure()
            }
            Log.d("TransferImport", "fetchWeekEvents http=${response.code}")
            response.body.string()
        }
        val jsonObject = when (val parsed = parsePayloadObject(payload)) {
            is AppResult.Success -> parsed.value
            is AppResult.Failure -> return parsed
        }
        if (looksLikeAuthError(jsonObject)) {
            Log.d("TransferImport", "fetchWeekEvents looks like auth error, retry=$allowReloginRetry")
            if (!allowReloginRetry) {
                return AppError.Auth(authErrorMessage(jsonObject)).asFailure()
            }
            val loginResult = login(client, authSnapshot)
            if (loginResult is AppResult.Failure) return loginResult
            return fetchWeekEvents(
                client = client,
                authSnapshot = authSnapshot,
                weekNum = weekNum,
                yearTerm = yearTerm,
                allowReloginRetry = false,
            )
        }
        return runCatching {
            json.decodeFromJsonElement(OnlineSchedulePayload.serializer(), jsonObject)
        }.fold(
            onSuccess = { it.asSuccess() },
            onFailure = { AppError.DataFormat("在线课表响应格式错误").asFailure() },
        )
    }

    private fun login(
        client: OkHttpClient,
        authSnapshot: AuthSnapshot,
    ): AppResult<Unit> {
        val loginPayload = buildJsonObject(
            "name" to JsonPrimitive(authSnapshot.account),
            "pwd" to JsonPrimitive(casPasswordEncryptor.encrypt(authSnapshot.password)),
            "verifyCode" to null,
            "universityId" to JsonPrimitive("100005"),
            "loginType" to JsonPrimitive("login"),
        )
        val loginRequest = Request.Builder()
            .url(CAS_LOGIN_URL)
            .post(loginPayload.toRequestBody(JSON_MEDIA_TYPE))
            .build()
        Log.d("TransferImport", "login request")
        val loginJson = client.newCall(loginRequest).execute().use { response ->
            if (!response.isSuccessful) {
                return AppError.Network("统一身份认证登录失败：HTTP ${response.code}").asFailure()
            }
            Log.d("TransferImport", "login http=${response.code}")
            when (val parsed = parsePayloadObject(response.body.string())) {
                is AppResult.Success -> parsed.value
                is AppResult.Failure -> return parsed
            }
        }
        val code = loginJson["code"].stringValue()
        val message = loginJson["msg"].stringValue().orEmpty()
        Log.d("TransferImport", "login response code=$code, msg=$message")
        if (code != "200" || message != "登录成功！") {
            return AppError.Auth(message.ifBlank { "统一身份认证登录失败" }).asFailure()
        }

        val ticketRequest = Request.Builder()
            .url(CAS_TICKET_URL)
            .get()
            .build()
        client.newCall(ticketRequest).execute().use { response ->
            if (!response.isSuccessful) {
                return AppError.Network("课表系统登录失败：HTTP ${response.code}").asFailure()
            }
            Log.d("TransferImport", "ticket http=${response.code}")
        }
        return Unit.asSuccess()
    }

    private fun buildClient(): OkHttpClient {
        val cookieManager = java.net.CookieManager().apply {
            setCookiePolicy(java.net.CookiePolicy.ACCEPT_ALL)
        }
        return baseClient.newBuilder()
            .cookieJar(JavaNetCookieJar(cookieManager))
            .build()
    }

    private fun parsePayloadObject(raw: String): AppResult<JsonObject> = runCatching {
        val element = json.parseToJsonElement(raw)
        element as? JsonObject
            ?: throw IllegalArgumentException("在线课表响应格式错误")
    }.fold(
        onSuccess = { it.asSuccess() },
        onFailure = { AppError.DataFormat("在线课表响应格式错误").asFailure() },
    )

    private fun looksLikeAuthError(jsonObject: JsonObject): Boolean {
        if (jsonObject.containsKey("yearTerm") || jsonObject.containsKey("weekDayList")) {
            return false
        }
        return jsonObject.containsKey("code") || jsonObject.containsKey("msg")
    }

    private fun authErrorMessage(jsonObject: JsonObject): String {
        return jsonObject["msg"].stringValue()
            ?.takeIf { it.isNotBlank() }
            ?: "课表鉴权失败，请重新输入密码"
    }

    private fun buildJsonObject(vararg entries: Pair<String, JsonPrimitive?>): String {
        val objectValue = JsonObject(
            buildMap {
                entries.forEach { (key, value) ->
                    if (value != null) {
                        put(key, value)
                    }
                }
            },
        )
        return json.encodeToString(JsonObject.serializer(), objectValue)
    }

    private fun JsonElement?.stringValue(): String? = (this as? JsonPrimitive)?.content

    private companion object {
        const val CAS_LOGIN_URL = "https://uis.cqut.edu.cn/center-auth-server/sso/doLogin"
        const val CAS_TICKET_URL =
            "https://uis.cqut.edu.cn/center-auth-server/YF8A4013/cas/login?service=https://timetable-cfc.cqut.edu.cn/api/auth/casLogin"
        const val WEEK_EVENTS_URL = "https://timetable-cfc.cqut.edu.cn/api/courseSchedule/listWeekEvents"

        val JSON_MEDIA_TYPE = "application/json; charset=utf-8".toMediaType()
    }
}
