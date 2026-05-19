package com.taskflow.service

import com.taskflow.models.CreateTaskRequest
import com.taskflow.models.Task
import com.taskflow.models.UpdateTaskRequest
import com.taskflow.repository.TaskRepository
import java.time.LocalDate
import java.time.format.DateTimeFormatter
import java.util.Locale
@Suppress("DEPRECATION")

class TaskService {

    private val repo = TaskRepository()

    // Categorías y sus colores (espejo de categories.js)
    private val categoryColors = mapOf(
        "Trabajo"   to "#4F46E5",
        "Hogar"     to "#F59E0B",
        "Ejercicio" to "#10B981",
        "Personal"  to "#7C3AED"
    )

    suspend fun listar(uid: String): List<Task> = repo.getAll(uid)

    suspend fun crear(uid: String, req: CreateTaskRequest): Task {
        val color   = categoryColors[req.category] ?: "#4F46E5"
        val timeFmt = formatTime(req.time)
        val dateFmt = formatDate(req.date)
        val task = Task(
            title    = req.title.trim(),
            time     = timeFmt,
            date     = dateFmt,
            category = req.category,
            priority = req.priority,
            done     = false,
            color    = color,
            desc     = req.desc
        )
        return repo.save(uid, task)
    }

    suspend fun toggleDone(uid: String, taskId: String, currentDone: Boolean): Boolean {
        return repo.update(uid, taskId, mapOf("done" to !currentDone))
    }

    suspend fun actualizar(uid: String, taskId: String, req: UpdateTaskRequest): Boolean {
        val updates = mutableMapOf<String, Any>()
        req.done?.let     { updates["done"]     = it }
        req.title?.let    { updates["title"]    = it.trim() }
        req.date?.let     { updates["date"]     = formatDate(it) }
        req.time?.let     { updates["time"]     = formatTime(it) }
        req.category?.let { updates["category"] = it; updates["color"] = categoryColors[it] ?: "#4F46E5" }
        req.priority?.let { updates["priority"] = it }
        req.desc?.let     { updates["desc"]     = it }
        if (updates.isEmpty()) return false
        return repo.update(uid, taskId, updates)
    }

    suspend fun eliminar(uid: String, taskId: String): Boolean = repo.delete(uid, taskId)

    // Progreso del día: tareas de hoy completadas vs total
    fun progresoDia(tasks: List<Task>): Map<String, Any> {
        val hoy = LocalDate.now()
            .format(DateTimeFormatter.ofPattern("d 'de' MMMM", Locale("es", "CO")))
        val tareasDia = tasks.filter { it.date.equals(hoy, ignoreCase = true) }
        val done  = tareasDia.count { it.done }
        val total = tareasDia.size
        return mapOf(
            "done"  to done,
            "total" to total,
            "pct"   to if (total == 0) 0 else (done * 100 / total)
        )
    }

    private fun formatTime(raw: String): String {
        if (raw.isBlank()) return "Sin hora"
        return try {
            val parts = raw.split(":").map { it.toInt() }
            val h = parts[0]; val m = parts[1]
            val suffix = if (h < 12) "a. m." else "p. m."
            val h12 = if (h % 12 == 0) 12 else h % 12
            "%d:%02d %s".format(h12, m, suffix)
        } catch (e: Exception) { raw }
    }

    private fun formatDate(raw: String): String {
        if (raw.isBlank()) return ""
        return try {
            val date = LocalDate.parse(raw, DateTimeFormatter.ISO_LOCAL_DATE)
            date.format(DateTimeFormatter.ofPattern("d 'de' MMMM", Locale("es", "CO")))
        } catch (e: Exception) { raw }
    }
}
