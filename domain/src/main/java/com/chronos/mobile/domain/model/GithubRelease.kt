package com.chronos.mobile.domain.model

data class GithubRelease(
    val tagName: String,
    val name: String,
    val publishedAt: String,
    val body: String,
    val htmlUrl: String,
)
