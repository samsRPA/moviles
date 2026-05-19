package com.taskflow.controllers

import com.taskflow.models.CreateTaskRequest
import com.taskflow.models.Task
import com.taskflow.models.UpdateTaskRequest
import com.taskflow.service.TaskService

class TaskController {

    private val service = TaskService()

    suspend fun listar(uid: String): List<Task> = service.listar(uid)

    suspend fun crear(uid: String, req: CreateTaskRequest): Task = service.crear(uid, req)

    suspend fun toggleDone(uid: String, taskId: String, currentDone: Boolean): Boolean =
        service.toggleDone(uid, taskId, currentDone)

    suspend fun actualizar(uid: String, taskId: String, req: UpdateTaskRequest): Boolean =
        service.actualizar(uid, taskId, req)

    suspend fun eliminar(uid: String, taskId: String): Boolean = service.eliminar(uid, taskId)

    fun progresoDia(uid: String, tasks: List<Task>): Map<String, Any> =
        service.progresoDia(tasks)
}
