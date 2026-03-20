package com.chronos.mobile.domain.result

import java.io.IOException
import java.io.InterruptedIOException
import java.net.SocketTimeoutException
import java.net.UnknownHostException
import kotlinx.serialization.SerializationException

inline fun <T> appResultOf(
    errorMapper: (Throwable) -> AppError = Throwable::toAppError,
    block: () -> T,
): AppResult<T> = try {
    AppResult.Success(block())
} catch (throwable: Throwable) {
    AppResult.Failure(errorMapper(throwable))
}

fun Throwable.toAppError(): AppError = when (this) {
    is AppException -> error
    is IllegalArgumentException -> AppError.Validation(message ?: "输入内容无效")
    is IllegalStateException -> AppError.Unknown(message ?: "当前操作无法完成", this)
    is SerializationException -> AppError.DataFormat(message ?: "数据格式错误")
    is UnknownHostException -> AppError.Network("无法连接教务系统，请检查网络或 DNS 设置")
    is SocketTimeoutException, is InterruptedIOException -> AppError.Network("连接教务系统超时，请稍后重试")
    is IOException -> AppError.Network(message ?: "网络请求失败")
    else -> AppError.Unknown(message ?: "发生未知错误", this)
}

class AppException(
    val error: AppError,
) : RuntimeException(error.message)
