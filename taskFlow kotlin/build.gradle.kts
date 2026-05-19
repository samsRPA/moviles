plugins {
    alias(libs.plugins.kotlin.jvm)
    alias(ktorLibs.plugins.ktor)
    kotlin("plugin.serialization") version "2.3.20"
}

group = "com.taskflow"
version = "1.0.0"

application {
    mainClass = "io.ktor.server.netty.EngineMain"
}

kotlin {
    jvmToolchain(21)
}

dependencies {
    // Ktor server
    implementation(ktorLibs.server.config.yaml)
    implementation(ktorLibs.server.core)
    implementation(ktorLibs.server.netty)
    implementation(libs.logback.classic)

    // Ktor content negotiation + JSON
    implementation("io.ktor:ktor-server-content-negotiation:3.4.1")
    implementation("io.ktor:ktor-serialization-kotlinx-json:3.4.1")

    // Ktor CORS
    implementation("io.ktor:ktor-server-cors:3.4.1")

    // Ktor HTTP client (para Firebase Auth REST y Gemini)
    implementation("io.ktor:ktor-client-core:3.4.1")
    implementation("io.ktor:ktor-client-cio:3.4.1")
    implementation("io.ktor:ktor-client-content-negotiation:3.4.1")

    // Firebase Admin SDK (Firestore + Auth)
    implementation("com.google.firebase:firebase-admin:9.2.0")

    // Coroutines
    implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core:1.8.1")

    // Tests
    testImplementation(kotlin("test"))
    testImplementation("io.ktor:ktor-server-test-host:3.4.1")
}
