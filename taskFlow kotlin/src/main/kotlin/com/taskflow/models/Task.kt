package com.taskflow.models

import kotlinx.serialization.Serializable

@Serializable
data class Task(
    val id: String = "",
    val title: String = "",
    val time: String = "Sin hora",
    val date: String = "",
    val category: String = "Personal",
    val priority: String = "Media",
    val done: Boolean = false,
    val color: String = "#4F46E5",
    val desc: String = "",
    val createdAt: Long = System.currentTimeMillis()
)

@Serializable
data class CreateTaskRequest(
    val title: String,
    val date: String,
    val time: String = "",
    val category: String = "Personal",
    val priority: String = "Media",
    val desc: String = ""
)

@Serializable
data class UpdateTaskRequest(
    val done: Boolean? = null,
    val title: String? = null,
    val date: String? = null,
    val time: String? = null,
    val category: String? = null,
    val priority: String? = null,
    val desc: String? = null
)
