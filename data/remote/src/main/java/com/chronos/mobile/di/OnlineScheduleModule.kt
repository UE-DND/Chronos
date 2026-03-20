package com.chronos.mobile.di

import com.chronos.mobile.data.remote.DefaultOnlineScheduleJsonCodec
import com.chronos.mobile.data.remote.RemoteGithubContributorRepository
import com.chronos.mobile.data.remote.RemoteGithubReleaseRepository
import com.chronos.mobile.data.remote.RemoteOnlineScheduleRepository
import com.chronos.mobile.domain.GithubContributorRepository
import com.chronos.mobile.domain.GithubReleaseRepository
import com.chronos.mobile.domain.OnlineScheduleJsonCodec
import com.chronos.mobile.domain.OnlineScheduleRepository
import dagger.Module
import dagger.Provides
import dagger.hilt.InstallIn
import dagger.hilt.components.SingletonComponent
import java.util.concurrent.TimeUnit
import javax.inject.Singleton
import okhttp3.Dns
import okhttp3.OkHttpClient

@Module
@InstallIn(SingletonComponent::class)
abstract class OnlineScheduleModule {

    companion object {
        @Provides
        @Singleton
        fun provideBaseOkHttpClient(): OkHttpClient = OkHttpClient.Builder()
            .dns(Dns.SYSTEM)
            .callTimeout(20, TimeUnit.SECONDS)
            .connectTimeout(15, TimeUnit.SECONDS)
            .readTimeout(30, TimeUnit.SECONDS)
            .writeTimeout(15, TimeUnit.SECONDS)
            .retryOnConnectionFailure(false)
            .followRedirects(true)
            .followSslRedirects(true)
            .build()

        @Provides
        @Singleton
        fun provideOnlineScheduleRepository(
            repository: RemoteOnlineScheduleRepository,
        ): OnlineScheduleRepository = repository

        @Provides
        @Singleton
        fun provideGithubContributorRepository(
            repository: RemoteGithubContributorRepository,
        ): GithubContributorRepository = repository

        @Provides
        @Singleton
        fun provideGithubReleaseRepository(
            repository: RemoteGithubReleaseRepository,
        ): GithubReleaseRepository = repository

        @Provides
        @Singleton
        fun provideOnlineScheduleJsonCodec(
            codec: DefaultOnlineScheduleJsonCodec,
        ): OnlineScheduleJsonCodec = codec
    }
}
