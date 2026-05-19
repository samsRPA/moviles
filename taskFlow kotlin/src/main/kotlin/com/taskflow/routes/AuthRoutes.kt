package com.taskflow.routes

import com.taskflow.controllers.AuthController
import com.taskflow.models.LoginRequest
import com.taskflow.models.RegisterRequest
import com.taskflow.models.UpdateUserRequest
import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*

fun Application.configureAuthRoutes() {

    val controller = AuthController()

    routing {

        // POST /auth/register — Crear nueva cuenta
        post("/auth/register") {
            val req = call.receive<RegisterRequest>()
            val res = controller.registrar(req)
            val status = if (res.ok) HttpStatusCode.Created else HttpStatusCode.BadRequest
            call.respond(status, res)
        }

        // POST /auth/login — Iniciar sesión
        post("/auth/login") {
            val req = call.receive<LoginRequest>()
            val res = controller.login(req)
            val status = if (res.ok) HttpStatusCode.OK else HttpStatusCode.Unauthorized
            call.respond(status, res)
        }

        route("/users/{uid}") {

            // GET /users/{uid} — Obtener perfil
            get {
                val uid  = call.parameters["uid"] ?: return@get call.respond(HttpStatusCode.BadRequest, "uid requerido")
                val user = controller.obtenerPerfil(uid)
                if (user != null) call.respond(user)
                else call.respond(HttpStatusCode.NotFound, "Perfil no encontrado")
            }

            // PUT /users/{uid} — Actualizar perfil
            put {
                val uid = call.parameters["uid"] ?: return@put call.respond(HttpStatusCode.BadRequest, "uid requerido")
                val req = call.receive<UpdateUserRequest>()
                if (controller.actualizarPerfil(uid, req))
                    call.respond(HttpStatusCode.OK, mapOf("ok" to true))
                else
                    call.respond(HttpStatusCode.BadRequest, mapOf("ok" to false, "error" to "Sin campos para actualizar"))
            }
        }
    }
}
