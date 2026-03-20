package com.chronos.mobile.di

import com.chronos.mobile.data.remote.DefaultOnlineScheduleJsonCodec
import com.chronos.mobile.data.remote.RemoteOnlineScheduleRepository
import com.chronos.mobile.domain.OnlineScheduleJsonCodec
import com.chronos.mobile.domain.OnlineScheduleRepository
import dagger.Binds
import dagger.Module
import dagger.hilt.InstallIn
import dagger.hilt.components.SingletonComponent
import javax.inject.Singleton

@Module
@InstallIn(SingletonComponent::class)
abstract class OnlineScheduleModule {
    @Binds
    @Singleton
    abstract fun bindOnlineScheduleRepository(
        repository: RemoteOnlineScheduleRepository,
    ): OnlineScheduleRepository

    @Binds
    @Singleton
    abstract fun bindOnlineScheduleJsonCodec(
        codec: DefaultOnlineScheduleJsonCodec,
    ): OnlineScheduleJsonCodec
}
