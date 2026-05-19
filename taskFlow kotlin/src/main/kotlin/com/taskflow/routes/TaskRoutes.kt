package com.taskflow.routes

import com.taskflow.controllers.TaskController
import com.taskflow.models.CreateTaskRequest
import com.taskflow.models.UpdateTaskRequest
import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*

fun Application.configureTaskRoutes() {

    val controller = TaskController()

    routing {

        route("/users/{uid}/tasks") {

            // GET /users/{uid}/tasks — Listar todas las tareas
            get {
                val uid   = call.parameters["uid"] ?: return@get call.respond(HttpStatusCode.BadRequest, "uid requerido")
                val tasks = controller.listar(uid)
                call.respond(tasks)
            }

            // POST /users/{uid}/tasks — Crear tarea
            post {
                val uid  = call.parameters["uid"] ?: return@post call.respond(HttpStatusCode.BadRequest, "uid requerido")
                val req  = call.receive<CreateTaskRequest>()
                if (req.title.isBlank())
                    return@post call.respond(HttpStatusCode.BadRequest, mapOf("error" to "El título es obligatorio"))
                val task = controller.crear(uid, req)
                call.respond(HttpStatusCode.Created, task)
            }

            route("/{taskId}") {

                // PUT /users/{uid}/tasks/{taskId} — Actualizar tarea (o sólo togglear done)
                put {
                    val uid    = call.parameters["uid"]    ?: return@put call.respond(HttpStatusCode.BadRequest, "uid requerido")
                    val taskId = call.parameters["taskId"] ?: return@put call.respond(HttpStatusCode.BadRequest, "taskId requerido")
                    val req    = call.receive<UpdateTaskRequest>()
                    if (controller.actualizar(uid, taskId, req))
                        call.respond(HttpStatusCode.OK, mapOf("ok" to true))
                    else
                        call.respond(HttpStatusCode.BadRequest, mapOf("ok" to false, "error" to "Sin cambios"))
                }

                // DELETE /users/{uid}/tasks/{taskId} — Eliminar tarea
                delete {
                    val uid    = call.parameters["uid"]    ?: return@delete call.respond(HttpStatusCode.BadRequest, "uid requerido")
                    val taskId = call.parameters["taskId"] ?: return@delete call.respond(HttpStatusCode.BadRequest, "taskId requerido")
                    controller.eliminar(uid, taskId)
                    call.respond(HttpStatusCode.OK, mapOf("ok" to true, "message" to "Tarea eliminada"))
                }
            }
        }

        // GET /users/{uid}/progress — Progreso del día
        get("/users/{uid}/progress") {
            val uid   = call.parameters["uid"] ?: return@get call.respond(HttpStatusCode.BadRequest, "uid requerido")
            val tasks = controller.listar(uid)
            call.respond(controller.progresoDia(uid, tasks))
        }
    }
}
