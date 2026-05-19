package com.taskflow.repository

import com.google.cloud.firestore.Query
import com.google.firebase.cloud.FirestoreClient
import com.taskflow.models.Task
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext

class TaskRepository {

    private fun tasksRef(uid: String) =
        FirestoreClient.getFirestore()
            .collection("users").document(uid).collection("tasks")

    suspend fun getAll(uid: String): List<Task> = withContext(Dispatchers.IO) {
        val snapshot = tasksRef(uid)
            .orderBy("createdAt", Query.Direction.DESCENDING)
            .get().get()
        snapshot.documents.map { doc ->
            Task(
                id       = doc.id,
                title    = doc.getString("title") ?: "",
                time     = doc.getString("time") ?: "Sin hora",
                date     = doc.getString("date") ?: "",
                category = doc.getString("category") ?: "Personal",
                priority = doc.getString("priority") ?: "Media",
                done     = doc.getBoolean("done") ?: false,
                color    = doc.getString("color") ?: "#4F46E5",
                desc     = doc.getString("desc") ?: "",
                createdAt = doc.getTimestamp("createdAt")?.toDate()?.time
                    ?: System.currentTimeMillis()
            )
        }
    }

    suspend fun save(uid: String, task: Task): Task = withContext(Dispatchers.IO) {
        val data = mapOf(
            "title"     to task.title,
            "time"      to task.time,
            "date"      to task.date,
            "category"  to task.category,
            "priority"  to task.priority,
            "done"      to task.done,
            "color"     to task.color,
            "desc"      to task.desc,
            "createdAt" to com.google.cloud.Timestamp.now()
        )
        val ref = tasksRef(uid).add(data).get()
        task.copy(id = ref.id)
    }

    suspend fun update(uid: String, taskId: String, updates: Map<String, Any>): Boolean =
        withContext(Dispatchers.IO) {
            tasksRef(uid).document(taskId).update(updates).get()
            true
        }

    suspend fun delete(uid: String, taskId: String): Boolean = withContext(Dispatchers.IO) {
        tasksRef(uid).document(taskId).delete().get()
        true
    }
}
