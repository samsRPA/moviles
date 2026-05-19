package com.taskflow.repository

import com.google.firebase.cloud.FirestoreClient
import com.taskflow.models.User
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext

class UserRepository {

    private fun usersRef() = FirestoreClient.getFirestore().collection("users")

    suspend fun getById(uid: String): User? = withContext(Dispatchers.IO) {
        val snap = usersRef().document(uid).get().get()
        if (!snap.exists()) return@withContext null
        @Suppress("UNCHECKED_CAST")
        User(
            uid             = uid,
            name            = snap.getString("name") ?: "",
            email           = snap.getString("email") ?: "",
            avatar          = snap.getString("avatar") ?: "",
            city            = snap.getString("city") ?: "Bogota",
            interests       = (snap.get("interests") as? List<String>) ?: emptyList(),
            needsOnboarding = snap.getBoolean("needsOnboarding") ?: true,
            createdAt       = snap.getTimestamp("createdAt")?.toDate()?.time
                ?: System.currentTimeMillis()
        )
    }

    suspend fun save(user: User): Unit = withContext(Dispatchers.IO) {
        val data = mapOf(
            "uid"             to user.uid,
            "name"            to user.name,
            "email"           to user.email,
            "avatar"          to user.avatar,
            "city"            to user.city,
            "interests"       to user.interests,
            "needsOnboarding" to user.needsOnboarding,
            "createdAt"       to com.google.cloud.Timestamp.now()
        )
        usersRef().document(user.uid).set(data).get()
    }

    suspend fun update(uid: String, updates: Map<String, Any>): Boolean =
        withContext(Dispatchers.IO) {
            usersRef().document(uid).update(updates).get()
            true
        }
}
