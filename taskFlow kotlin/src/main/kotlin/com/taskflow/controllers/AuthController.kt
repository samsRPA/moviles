package com.taskflow.controllers

import com.taskflow.models.AuthResponse
import com.taskflow.models.LoginRequest
import com.taskflow.models.RegisterRequest
import com.taskflow.models.UpdateUserRequest
import com.taskflow.models.User
import com.taskflow.repository.UserRepository
import com.taskflow.service.AuthService

class AuthController {

    private val service  = AuthService()
    private val userRepo = UserRepository()

    suspend fun registrar(req: RegisterRequest): AuthResponse {
        if (req.name.isBlank() || req.email.isBlank() || req.password.isBlank() || req.password2.isBlank())
            return AuthResponse(ok = false, error = "Completa todos los campos.")
        if (req.password != req.password2)
            return AuthResponse(ok = false, error = "Las contraseñas no coinciden.")
        if (req.password.length < 6)
            return AuthResponse(ok = false, error = "Mínimo 6 caracteres en la contraseña.")
        return service.registrar(req.name.trim(), req.email.trim(), req.password)
    }

    suspend fun login(req: LoginRequest): AuthResponse {
        if (req.email.isBlank() || req.password.isBlank())
            return AuthResponse(ok = false, error = "Completa correo y contraseña.")
        return service.login(req.email.trim(), req.password)
    }

    suspend fun obtenerPerfil(uid: String): User? = userRepo.getById(uid)

    suspend fun actualizarPerfil(uid: String, req: UpdateUserRequest): Boolean {
        val updates = mutableMapOf<String, Any>()
        req.name?.let            { updates["name"]            = it.trim() }
        req.city?.let            { updates["city"]            = it }
        req.interests?.let       { updates["interests"]       = it }
        req.needsOnboarding?.let { updates["needsOnboarding"] = it }
        if (updates.isEmpty()) return false
        return userRepo.update(uid, updates)
    }
}
