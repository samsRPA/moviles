package com.taskflow.routes

import com.taskflow.controllers.DiscoverController
import com.taskflow.models.DiscoverRequest
import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*

fun Application.configureDiscoverRoutes() {

    val controller = DiscoverController()

    routing {

        route("/discover") {

            // POST /discover — Obtener eventos recomendados por Gemini
            post {
                val req = call.receive<DiscoverRequest>()
                if (req.city.isBlank())
                    return@post call.respond(HttpStatusCode.BadRequest, mapOf("error" to "La ciudad es obligatoria"))
                val events = controller.obtenerEventos(
                    city         = req.city,
                    interests    = req.interests,
                    size         = req.size.coerceIn(1, 20),
                    forceRefresh = call.request.queryParameters["refresh"] == "true"
                )
                call.respond(events)
            }

            // DELETE /discover/cache — Invalidar caché
            delete("/cache") {
                val req = call.receive<DiscoverRequest>()
                controller.invalidarCache(req.city, req.interests)
                call.respond(HttpStatusCode.OK, mapOf("ok" to true, "message" to "Caché invalidado"))
            }
        }
    }
}
