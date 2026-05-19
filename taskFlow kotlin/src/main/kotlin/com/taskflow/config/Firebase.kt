package com.taskflow.config

import com.google.auth.oauth2.GoogleCredentials
import com.google.firebase.FirebaseApp
import com.google.firebase.FirebaseOptions
import io.ktor.server.application.*
import org.slf4j.LoggerFactory
import java.io.File
import java.io.FileInputStream

private fun env(key: String, default: String? = null): String =
    System.getenv(key) ?: System.getProperty(key) ?: default ?: error("$key no definida en .env")

val FIREBASE_PROJECT_ID: String get() = env("FIREBASE_PROJECT_ID", "taskflow-app-e8606")
val FIREBASE_API_KEY: String    get() = env("FIREBASE_API_KEY")
val GEMINI_API_KEY: String      get() = env("GEMINI_API_KEY")

private val log = LoggerFactory.getLogger("Firebase")

fun Application.configureFirebase() {
    if (FirebaseApp.getApps().isNotEmpty()) return

    val options = buildFirebaseOptions()
    if (options != null) {
        FirebaseApp.initializeApp(options)
        log.info("Firebase inicializado correctamente (proyecto: $FIREBASE_PROJECT_ID)")
    } else {
        log.warn("Firebase no pudo inicializarse: define FIREBASE_SERVICE_ACCOUNT con la ruta al JSON de la cuenta de servicio.")
    }
}

private fun buildFirebaseOptions(): FirebaseOptions? {
    // Primero intenta la variable de entorno con la ruta al JSON
    val serviceAccountPath = System.getenv("FIREBASE_SERVICE_ACCOUNT") ?: System.getProperty("FIREBASE_SERVICE_ACCOUNT")
    if (serviceAccountPath != null) {
        val file = File(serviceAccountPath)
        if (file.exists()) {
            return FirebaseOptions.builder()
                .setCredentials(GoogleCredentials.fromStream(FileInputStream(file)))
                .setProjectId(FIREBASE_PROJECT_ID)
                .build()
        }
    }

    // Intenta las credenciales de aplicación por defecto (gcloud auth)
    return try {
        FirebaseOptions.builder()
            .setCredentials(GoogleCredentials.getApplicationDefault())
            .setProjectId(FIREBASE_PROJECT_ID)
            .build()
    } catch (e: Exception) {
        null
    }
}
