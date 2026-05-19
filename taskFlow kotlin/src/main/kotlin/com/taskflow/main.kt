package com.taskflow

import com.taskflow.config.configureFirebase
import com.taskflow.config.configureSerialization
import com.taskflow.routes.configureAuthRoutes
import com.taskflow.routes.configureDiscoverRoutes
import com.taskflow.routes.configureTaskRoutes
import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.engine.*
import io.ktor.server.netty.*
import io.ktor.server.plugins.cors.routing.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import kotlinx.serialization.json.*

fun main() {
    loadDotEnv()
    embeddedServer(
        Netty,
        port = 9090,
        host = "0.0.0.0"
    ) {
        module()
    }.start(wait = true)
}

// Carga el archivo .env del directorio raíz del proyecto en System properties
fun loadDotEnv() {
    val envFile = java.io.File(".env")
    if (!envFile.exists()) return
    envFile.forEachLine { line ->
        val trimmed = line.trim()
        if (trimmed.isBlank() || trimmed.startsWith("#")) return@forEachLine
        val idx = trimmed.indexOf('=')
        if (idx < 0) return@forEachLine
        val key   = trimmed.substring(0, idx).trim()
        val value = trimmed.substring(idx + 1).trim()
        // Solo aplica si la variable no fue definida a nivel de sistema
        if (System.getenv(key) == null) System.setProperty(key, value)
    }
}

fun Application.module() {
    loadDotEnv()   // debe correr antes que configureFirebase()
    install(CORS) {
        anyHost()
        allowMethod(HttpMethod.Get)
        allowMethod(HttpMethod.Post)
        allowMethod(HttpMethod.Put)
        allowMethod(HttpMethod.Delete)
        allowHeader(HttpHeaders.ContentType)
        allowHeader(HttpHeaders.Authorization)
    }

    configureSerialization()
    configureFirebase()

    configureAuthRoutes()
    configureTaskRoutes()
    configureDiscoverRoutes()

    routing {
        get("/") {
            call.respond(buildJsonObject {
                put("app",     "TaskFlow API")
                put("version", "1.0.0")
                put("status",  "running")
                putJsonArray("endpoints") {
                    add("POST   /auth/register")
                    add("POST   /auth/login")
                    add("GET    /users/{uid}")
                    add("PUT    /users/{uid}")
                    add("GET    /users/{uid}/tasks")
                    add("POST   /users/{uid}/tasks")
                    add("PUT    /users/{uid}/tasks/{taskId}")
                    add("DELETE /users/{uid}/tasks/{taskId}")
                    add("GET    /users/{uid}/progress")
                    add("POST   /discover")
                }
            })
        }
    }
}
