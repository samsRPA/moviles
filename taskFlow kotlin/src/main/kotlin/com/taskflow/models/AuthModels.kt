package com.taskflow.models

import kotlinx.serialization.Serializable

@Serializable
data class RegisterRequest(
    val name: String,
    val email: String,
    val password: String,
    val password2: String
)

@Serializable
data class LoginRequest(
    val email: String,
    val password: String
)

@Serializable
data class AuthResponse(
    val ok: Boolean,
    val user: User? = null,
    val token: String? = null,
    val error: String? = null
)
