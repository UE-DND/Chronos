package com.chronos.mobile.data.secure

import android.content.Context
import android.os.Build
import android.security.keystore.KeyGenParameterSpec
import android.security.keystore.KeyProperties
import androidx.biometric.BiometricManager
import androidx.datastore.preferences.core.PreferenceDataStoreFactory
import androidx.datastore.preferences.core.edit
import androidx.datastore.preferences.core.emptyPreferences
import androidx.datastore.preferences.core.stringPreferencesKey
import com.chronos.mobile.domain.SecureCredentialStore
import com.chronos.mobile.domain.model.AuthSnapshot
import com.chronos.mobile.domain.model.SavedCredentialState
import com.chronos.mobile.domain.result.AppError
import com.chronos.mobile.domain.result.AppResult
import com.chronos.mobile.domain.result.appResultOf
import com.chronos.mobile.domain.result.asFailure
import com.chronos.mobile.domain.result.asSuccess
import dagger.hilt.android.qualifiers.ApplicationContext
import java.io.File
import java.security.KeyStore
import java.util.Base64
import javax.crypto.Cipher
import javax.crypto.KeyGenerator
import javax.crypto.SecretKey
import javax.crypto.spec.GCMParameterSpec
import javax.inject.Inject
import javax.inject.Singleton
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.SupervisorJob
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.catch
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.flow.map

@Singleton
class KeystoreSecureCredentialStore @Inject constructor(
    @param:ApplicationContext private val context: Context,
) : SecureCredentialStore {
    private val scope = CoroutineScope(SupervisorJob() + Dispatchers.IO)
    private val dataStore = PreferenceDataStoreFactory.create(
        scope = scope,
        produceFile = { File(context.filesDir, "online_credentials.preferences_pb") },
    )

    override val savedCredentialState: Flow<SavedCredentialState> = dataStore.data
        .catch { emit(emptyPreferences()) }
        .map { preferences ->
            val account = preferences[ACCOUNT_KEY]
            val hasCiphertext = !preferences[CIPHERTEXT_KEY].isNullOrBlank()
            val hasIv = !preferences[IV_KEY].isNullOrBlank()
            SavedCredentialState(
                account = account,
                hasSavedCredential = !account.isNullOrBlank() && hasCiphertext && hasIv,
                protectionAvailable = isReusableCredentialProtectionAvailable(),
            )
        }

    override fun isReusableCredentialProtectionAvailable(): Boolean {
        val biometricManager = BiometricManager.from(context)
        return biometricManager.canAuthenticate(ALLOWED_AUTHENTICATORS) == BiometricManager.BIOMETRIC_SUCCESS
    }

    override fun createSaveCipher(): AppResult<Cipher> = appResultOf(
        errorMapper = { AppError.Security("当前设备无法创建受保护凭据") },
    ) {
        val cipher = Cipher.getInstance(TRANSFORMATION)
        cipher.init(Cipher.ENCRYPT_MODE, getOrCreateSecretKey())
        cipher
    }

    override suspend fun saveCredential(
        account: String,
        password: String,
        cipher: Cipher,
    ): AppResult<Unit> = appResultOf(
        errorMapper = { AppError.Security("保存在线凭据失败") },
    ) {
        val encryptedBytes = cipher.doFinal(password.toByteArray(Charsets.UTF_8))
        dataStore.edit { preferences ->
            preferences[ACCOUNT_KEY] = account.trim()
            preferences[CIPHERTEXT_KEY] = Base64.getEncoder().encodeToString(encryptedBytes)
            preferences[IV_KEY] = Base64.getEncoder().encodeToString(cipher.iv)
        }
    }

    override fun createUnlockCipher(): AppResult<Cipher> = appResultOf(
        errorMapper = { AppError.Security("当前没有可用的已保存凭据") },
    ) {
        val key = getOrCreateSecretKey()
        val ivString = dataStoreDataSnapshot()[IV_KEY]
            ?: throw IllegalStateException("未找到已保存的在线凭据")
        val cipher = Cipher.getInstance(TRANSFORMATION)
        cipher.init(
            Cipher.DECRYPT_MODE,
            key,
            GCMParameterSpec(GCM_TAG_LENGTH_BITS, Base64.getDecoder().decode(ivString)),
        )
        cipher
    }

    override suspend fun unlock(cipher: Cipher): AppResult<AuthSnapshot> {
        val preferences = dataStoreDataSnapshot()
        val account = preferences[ACCOUNT_KEY]?.trim().orEmpty()
        val ciphertext = preferences[CIPHERTEXT_KEY].orEmpty()
        if (account.isEmpty() || ciphertext.isBlank()) {
            return AppError.NotFound("未找到已保存的在线凭据").asFailure()
        }
        return appResultOf(
            errorMapper = { AppError.Security("读取已保存凭据失败") },
        ) {
            val password = cipher.doFinal(Base64.getDecoder().decode(ciphertext)).toString(Charsets.UTF_8)
            AuthSnapshot(account = account, password = password)
        }
    }

    override suspend fun clearCredential() {
        dataStore.edit { preferences ->
            preferences.remove(ACCOUNT_KEY)
            preferences.remove(CIPHERTEXT_KEY)
            preferences.remove(IV_KEY)
        }
    }

    private fun getOrCreateSecretKey(): SecretKey {
        val existing = keyStore.getKey(KEY_ALIAS, null) as? SecretKey
        if (existing != null) return existing
        val generator = KeyGenerator.getInstance(KeyProperties.KEY_ALGORITHM_AES, ANDROID_KEYSTORE)
        val builder = KeyGenParameterSpec.Builder(
            KEY_ALIAS,
            KeyProperties.PURPOSE_ENCRYPT or KeyProperties.PURPOSE_DECRYPT,
        )
            .setBlockModes(KeyProperties.BLOCK_MODE_GCM)
            .setEncryptionPaddings(KeyProperties.ENCRYPTION_PADDING_NONE)
            .setUserAuthenticationRequired(true)
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
            builder.setUserAuthenticationParameters(
                0,
                KeyProperties.AUTH_BIOMETRIC_STRONG or KeyProperties.AUTH_DEVICE_CREDENTIAL,
            )
        } else {
            @Suppress("DEPRECATION")
            builder.setUserAuthenticationValidityDurationSeconds(-1)
        }
        generator.init(builder.build())
        return generator.generateKey()
    }

    private fun dataStoreDataSnapshot() = runBlockingIO {
        dataStore.data.catch { emit(emptyPreferences()) }.first()
    }

    private val keyStore: KeyStore by lazy {
        KeyStore.getInstance(ANDROID_KEYSTORE).apply { load(null) }
    }

    private companion object {
        const val KEY_ALIAS = "chronos.online.credentials"
        const val ANDROID_KEYSTORE = "AndroidKeyStore"
        const val TRANSFORMATION = "AES/GCM/NoPadding"
        const val GCM_TAG_LENGTH_BITS = 128
        const val ALLOWED_AUTHENTICATORS =
            BiometricManager.Authenticators.BIOMETRIC_STRONG or
                BiometricManager.Authenticators.DEVICE_CREDENTIAL

        val ACCOUNT_KEY = stringPreferencesKey("saved_account")
        val CIPHERTEXT_KEY = stringPreferencesKey("saved_ciphertext")
        val IV_KEY = stringPreferencesKey("saved_iv")
    }
}
