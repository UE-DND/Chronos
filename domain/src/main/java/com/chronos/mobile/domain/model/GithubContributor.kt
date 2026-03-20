package com.chronos.mobile.domain.model

data class GithubContributor(
    val login: String,
    val avatarUrl: String,
    val profileUrl: String,
    val contributions: Int,
    val type: String,
)
