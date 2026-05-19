package com.taskflow.controllers

import com.taskflow.models.Event
import com.taskflow.service.DiscoverService
import java.text.NumberFormat
import java.time.LocalDate
import java.time.LocalTime
import java.time.format.DateTimeFormatter
import java.util.Locale
@Suppress("DEPRECATION")

class DiscoverController {

    private val service = DiscoverService()

    suspend fun obtenerEventos(
        city: String,
        interests: List<String>,
        size: Int = 12,
        forceRefresh: Boolean = false
    ): List<Event> = service.obtenerEventos(city, interests, size, forceRefresh)

    fun invalidarCache(city: String, interests: List<String>) =
        service.invalidarCache(city, interests)

    // Espejo de formatEventDate en DiscoverController.js
    fun formatearFecha(dateStr: String?, timeStr: String?): String {
        if (dateStr == null) return "Fecha por confirmar"
        return try {
            val date = LocalDate.parse(dateStr, DateTimeFormatter.ISO_LOCAL_DATE)
            val datePart = date.format(
                DateTimeFormatter.ofPattern("EEE d MMM", Locale("es", "CO"))
            )
            if (timeStr != null) {
                val time = LocalTime.parse(timeStr.take(8), DateTimeFormatter.ofPattern("HH:mm:ss"))
                val timePart = time.format(DateTimeFormatter.ofPattern("hh:mm a", Locale("es", "CO")))
                "$datePart · $timePart"
            } else datePart
        } catch (e: Exception) { dateStr }
    }

    // Espejo de formatEventPrice en DiscoverController.js
    fun formatearPrecio(min: Double?, max: Double?, currency: String = "COP"): String {
        if (min == null) return "Precio por confirmar"
        if (min == 0.0)  return "Entrada gratuita"
        val fmt = NumberFormat.getCurrencyInstance(Locale("es", "CO"))
        fmt.maximumFractionDigits = 0
        return if (max != null && max != min) "${fmt.format(min)} – ${fmt.format(max)}" else fmt.format(min)
    }

    // Espejo de segmentEmoji en DiscoverController.js
    fun emojiSegmento(segment: String?): String = when (segment) {
        "Música", "Music"         -> "🎵"
        "Deportes", "Sports"      -> "⚽"
        "Artes", "Arts"           -> "🎭"
        "Tecnología", "Technology"-> "💻"
        "Familia", "Family"       -> "👨‍👩‍👧"
        "Ciencia", "Science"      -> "🔭"
        else                      -> "📅"
    }
}
