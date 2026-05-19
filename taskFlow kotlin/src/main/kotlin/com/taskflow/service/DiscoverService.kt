package com.taskflow.service

import com.taskflow.config.GEMINI_API_KEY
import com.taskflow.models.Event
import io.ktor.client.*
import io.ktor.client.call.*
import io.ktor.client.engine.cio.*
import io.ktor.client.plugins.contentnegotiation.*
import io.ktor.client.request.*
import io.ktor.http.*
import io.ktor.serialization.kotlinx.json.*
import kotlinx.serialization.json.*

private val cache      = mutableMapOf<String, List<Event>>()
private val jsonParser = Json { ignoreUnknownKeys = true }

class DiscoverService {

    private val httpClient = HttpClient(CIO) {
        install(ContentNegotiation) { json(Json { ignoreUnknownKeys = true }) }
    }

    private val GEMINI_URL =
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent"

    // Intereses (espejo de interests.js)
    private val interestLabels = mapOf(
        "futbol" to "Fútbol", "basketball" to "Baloncesto", "beisbol" to "Béisbol",
        "tenis" to "Tenis", "ciclismo" to "Ciclismo", "natacion" to "Natación",
        "rock" to "Rock", "pop" to "Pop", "electronica" to "Electrónica",
        "reggaeton" to "Reggaetón", "clasica" to "Clásica", "jazz" to "Jazz & Blues",
        "latina" to "Música Latina", "teatro" to "Teatro", "danza" to "Danza",
        "comedia" to "Comedia", "arte" to "Arte y Exposiciones",
        "tech" to "Tecnología", "gaming" to "Gaming & Esports",
        "astronomia" to "Astronomía", "naturaleza" to "Naturaleza",
        "familia" to "Familia", "gastronomia" to "Gastronomía", "moda" to "Moda & Lifestyle"
    )

    // Ciudades (espejo de cities.js)
    private val cityLabels = mapOf(
        "Bogota" to "Bogotá", "Medellin" to "Medellín", "Cali" to "Cali",
        "Barranquilla" to "Barranquilla", "Cartagena" to "Cartagena",
        "Bucaramanga" to "Bucaramanga", "Pereira" to "Pereira",
        "Manizales" to "Manizales", "Santa Marta" to "Santa Marta",
        "Ibague" to "Ibagué", "Cucuta" to "Cúcuta", "Villavicencio" to "Villavicencio"
    )

    suspend fun obtenerEventos(city: String, interests: List<String>, size: Int = 12, forceRefresh: Boolean = false): List<Event> {
        val key = "$city::${interests.sorted().joinToString(",")}"
        if (!forceRefresh && cache.containsKey(key)) return cache[key]!!

        val cityLabel      = cityLabels[city] ?: city
        val interestLabels = interests.mapNotNull { interestLabels[it] }
            .ifEmpty { listOf("música", "deportes", "cultura") }
            .joinToString(", ")

        val prompt = buildPrompt(cityLabel, interestLabels, size)
        val events = callGemini(prompt, city)

        cache[key] = events
        return events
    }

    fun invalidarCache(city: String, interests: List<String>) {
        val key = "$city::${interests.sorted().joinToString(",")}"
        cache.remove(key)
    }

    private fun buildPrompt(city: String, interests: String, size: Int): String = """
Eres un asistente de recomendación de eventos en Colombia.

Genera exactamente $size eventos recomendados para alguien en $city, Colombia,
con estos intereses: $interests.

Reglas:
- Eventos realistas y verosímiles para Colombia en los próximos 90 días
- Fechas variadas (no todas el mismo día)
- Venues reales o verosímiles de Colombia
- Precios en COP entre 0 y 350000

Responde ÚNICAMENTE con un array JSON puro. Sin markdown, sin texto extra.

Estructura de cada objeto:
{
  "id": "cod único ej bog001",
  "name": "Nombre del evento",
  "date": "YYYY-MM-DD",
  "time": "HH:MM:SS",
  "venue": "Nombre del lugar",
  "city": "Ciudad",
  "genre": "Género del evento",
  "segment": "Categoría: Música | Deportes | Artes | Tecnología | Familia | Ciencia",
  "priceMin": 0,
  "priceMax": 0,
  "currency": "COP",
  "url": "https://www.google.com/search?q=eventos+${city.replace(" ", "+")}+colombia"
}
    """.trimIndent()

    private suspend fun callGemini(prompt: String, city: String): List<Event> {
        val response = httpClient.post("$GEMINI_URL?key=$GEMINI_API_KEY") {
            contentType(ContentType.Application.Json)
            setBody(buildJsonObject {
                putJsonArray("contents") {
                    addJsonObject {
                        putJsonArray("parts") {
                            addJsonObject { put("text", prompt) }
                        }
                    }
                }
                putJsonObject("generationConfig") {
                    put("temperature", 0.7)
                    put("topP", 0.9)
                    put("maxOutputTokens", 4096)
                }
            })
        }

        val body: JsonObject = response.body()
        val rawText = body["candidates"]
            ?.jsonArray?.firstOrNull()
            ?.jsonObject?.get("content")
            ?.jsonObject?.get("parts")
            ?.jsonArray?.firstOrNull()
            ?.jsonObject?.get("text")
            ?.jsonPrimitive?.content ?: ""

        val cleaned = rawText
            .replace(Regex("```json\\s*", RegexOption.IGNORE_CASE), "")
            .replace(Regex("```\\s*"), "")
            .trim()

        val arr = jsonParser.parseToJsonElement(cleaned).jsonArray
        return arr.mapIndexed { i, el ->
            val obj = el.jsonObject
            Event(
                id       = obj["id"]?.jsonPrimitive?.contentOrNull ?: "ev-$i",
                name     = obj["name"]?.jsonPrimitive?.contentOrNull ?: "Evento",
                date     = obj["date"]?.jsonPrimitive?.contentOrNull,
                time     = obj["time"]?.jsonPrimitive?.contentOrNull,
                venue    = obj["venue"]?.jsonPrimitive?.contentOrNull ?: "Lugar por confirmar",
                city     = obj["city"]?.jsonPrimitive?.contentOrNull ?: city,
                genre    = obj["genre"]?.jsonPrimitive?.contentOrNull,
                segment  = obj["segment"]?.jsonPrimitive?.contentOrNull,
                priceMin = obj["priceMin"]?.jsonPrimitive?.doubleOrNull,
                priceMax = obj["priceMax"]?.jsonPrimitive?.doubleOrNull,
                currency = obj["currency"]?.jsonPrimitive?.contentOrNull ?: "COP",
                url      = obj["url"]?.jsonPrimitive?.contentOrNull
                    ?: "https://www.google.com/search?q=eventos+${city.replace(" ", "+")}+colombia"
            )
        }
    }
}
