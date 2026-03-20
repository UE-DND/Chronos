package com.chronos.mobile.domain.model

data class SavedCredentialState(
    val account: String? = null,
    val hasSavedCredential: Boolean = false,
    val protectionAvailable: Boolean = false,
)
