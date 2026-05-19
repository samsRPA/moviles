package com.taskflow.service

import com.taskflow.config.FIREBASE_API_KEY
import com.taskflow.models.AuthResponse
import com.taskflow.models.User
import com.taskflow.repository.UserRepository
import io.ktor.client.*
import io.ktor.client.call.*
import io.ktor.client.engine.cio.*
import io.ktor.client.plugins.contentnegotiation.*
import io.ktor.client.request.*
import io.ktor.http.*
import io.ktor.serialization.kotlinx.json.*
import kotlinx.serialization.Serializable
import kotlinx.serialization.json.Json
import kotlinx.serialization.json.buildJsonObject
import kotlinx.serialization.json.put

// Respuestas de la REST API de Firebase Auth
@Serializable
private data class FirebaseSignUpResponse(
    val idToken: String = "",
    val email: String = "",
    val localId: String = "",
    val error: FirebaseError? = null
)

@Serializable
private data class FirebaseSignInResponse(
    val idToken: String = "",
    val email: String = "",
    val localId: String = "",
    val error: FirebaseError? = null
)

@Serializable
private data class FirebaseError(
    val message: String = "",
    val code: Int = 0
)

class AuthService {

    private val userRepo = UserRepository()
    private val httpClient = HttpClient(CIO) {
        install(ContentNegotiation) {
            json(Json { ignoreUnknownKeys = true })
        }
    }

    private val AUTH_BASE = "https://identitytoolkit.googleapis.com/v1/accounts"

    suspend fun registrar(name: String, email: String, password: String): AuthResponse {
        // 1. Crear usuario en Firebase Auth
        val signUpRes: FirebaseSignUpResponse = httpClient.post("$AUTH_BASE:signUp?key=$FIREBASE_API_KEY") {
            contentType(ContentType.Application.Json)
            setBody(buildJsonObject {
                put("email", email)
                put("password", password)
                put("returnSecureToken", true)
            })
        }.body()

        if (signUpRes.localId.isBlank()) {
            return AuthResponse(ok = false, error = firebaseErrorMessage(signUpRes.error?.message ?: ""))
        }

        // 2. Guardar perfil en Firestore
        val avatar = name.split(" ").map { it.firstOrNull()?.uppercaseChar() ?: ' ' }
            .joinToString("").take(2)
        val user = User(
            uid             = signUpRes.localId,
            name            = name.trim(),
            email           = email.trim(),
            avatar          = avatar,
            city            = "Bogota",
            interests       = emptyList(),
            needsOnboarding = true
        )
        userRepo.save(user)

        return AuthResponse(ok = true, user = user, token = signUpRes.idToken)
    }

    suspend fun login(email: String, password: String): AuthResponse {
        val signInRes: FirebaseSignInResponse =
            httpClient.post("$AUTH_BASE:signInWithPassword?key=$FIREBASE_API_KEY") {
                contentType(ContentType.Application.Json)
                setBody(buildJsonObject {
                    put("email", email)
                    put("password", password)
                    put("returnSecureToken", true)
                })
            }.body()

        if (signInRes.localId.isBlank()) {
            return AuthResponse(ok = false, error = firebaseErrorMessage(signInRes.error?.message ?: ""))
        }

        val user = userRepo.getById(signInRes.localId)
            ?: return AuthResponse(ok = false, error = "Perfil no encontrado.")

        return AuthResponse(ok = true, user = user, token = signInRes.idToken)
    }

    private fun firebaseErrorMessage(code: String): String = when {
        "EMAIL_EXISTS"         in code -> "Este correo ya está registrado."
        "INVALID_EMAIL"        in code -> "El correo no es válido."
        "WEAK_PASSWORD"        in code -> "La contraseña es muy débil."
        "EMAIL_NOT_FOUND"      in code -> "No existe una cuenta con este correo."
        "INVALID_PASSWORD"     in code -> "Contraseña incorrecta."
        "INVALID_LOGIN_CREDENTIALS" in code -> "Correo o contraseña incorrectos."
        "TOO_MANY_ATTEMPTS"    in code -> "Demasiados intentos. Intenta más tarde."
        else                           -> "Ocurrió un error. Intenta de nuevo."
    }
}
