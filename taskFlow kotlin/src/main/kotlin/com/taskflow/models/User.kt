package com.taskflow.models

import kotlinx.serialization.Serializable

@Serializable
data class User(
    val uid: String = "",
    val name: String = "",
    val email: String = "",
    val avatar: String = "",
    val city: String = "Bogota",
    val interests: List<String> = emptyList(),
    val needsOnboarding: Boolean = true,
    val createdAt: Long = System.currentTimeMillis()
)

@Serializable
data class UpdateUserRequest(
    val name: String? = null,
    val city: String? = null,
    val interests: List<String>? = null,
    val needsOnboarding: Boolean? = null
)
