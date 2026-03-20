package com.chronos.mobile.domain.result

import java.io.IOException
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
    is IOException -> AppError.Network(message ?: "网络请求失败")
    else -> AppError.Unknown(message ?: "发生未知错误", this)
}

class AppException(
    val error: AppError,
) : RuntimeException(error.message)
