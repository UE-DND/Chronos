package com.chronos.mobile.data.secure

import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.runBlocking

internal fun <T> runBlockingIO(block: suspend () -> T): T = runBlocking(Dispatchers.IO) { block() }
