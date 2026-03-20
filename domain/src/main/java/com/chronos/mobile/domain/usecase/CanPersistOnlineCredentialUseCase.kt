package com.chronos.mobile.domain.usecase

import com.chronos.mobile.domain.SecureCredentialStore
import javax.inject.Inject

class CanPersistOnlineCredentialUseCase @Inject constructor(
    private val secureCredentialStore: SecureCredentialStore,
) {
    operator fun invoke(): Boolean = secureCredentialStore.isReusableCredentialProtectionAvailable()
}
