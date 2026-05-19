package com.taskflow.models

import kotlinx.serialization.Serializable

@Serializable
data class Event(
    val id: String = "",
    val name: String = "Evento",
    val date: String? = null,
    val time: String? = null,
    val venue: String = "Lugar por confirmar",
    val city: String = "",
    val genre: String? = null,
    val segment: String? = null,
    val priceMin: Double? = null,
    val priceMax: Double? = null,
    val currency: String = "COP",
    val url: String = ""
)

@Serializable
data class DiscoverRequest(
    val city: String,
    val interests: List<String>,
    val size: Int = 12
)
