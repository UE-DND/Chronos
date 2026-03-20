package com.chronos.mobile.di

import com.chronos.mobile.data.secure.KeystoreSecureCredentialStore
import com.chronos.mobile.domain.SecureCredentialStore
import dagger.Binds
import dagger.Module
import dagger.hilt.InstallIn
import dagger.hilt.components.SingletonComponent
import javax.inject.Singleton

@Module
@InstallIn(SingletonComponent::class)
abstract class SecureCredentialModule {
    @Binds
    @Singleton
    abstract fun bindSecureCredentialStore(
        secureCredentialStore: KeystoreSecureCredentialStore,
    ): SecureCredentialStore
}
