package com.taskflow

import io.ktor.client.request.*
import io.ktor.http.*
import io.ktor.server.testing.*
import kotlin.test.*

class TaskFlowTest {

    @Test
    fun `registro rechaza campos vacios`() = testApplication {
        application { module() }

        val response = client.post("/auth/register") {
            contentType(ContentType.Application.Json)
            setBody("""{"name":"","email":"","password":"","password2":""}""")
        }
        assertEquals(HttpStatusCode.BadRequest, response.status)
    }

    @Test
    fun `login rechaza credenciales en blanco`() = testApplication {
        application { module() }

        val response = client.post("/auth/login") {
            contentType(ContentType.Application.Json)
            setBody("""{"email":"","password":""}""")
        }
        assertEquals(HttpStatusCode.Unauthorized, response.status)
    }

    @Test
    fun `crear tarea rechaza titulo vacio`() = testApplication {
        application { module() }

        val response = client.post("/users/test-uid/tasks") {
            contentType(ContentType.Application.Json)
            setBody("""{"title":"","date":"2026-05-20"}""")
        }
        assertEquals(HttpStatusCode.BadRequest, response.status)
    }
}
