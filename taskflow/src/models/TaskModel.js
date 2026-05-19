import { api } from "../api";

export async function fetchTasksFromDB(uid) {
  const data = await api.get(`/users/${uid}/tasks`);
  return Array.isArray(data) ? data : [];
}

export async function addTaskToDB(uid, data) {
  const task = await api.post(`/users/${uid}/tasks`, {
    title:    data.title,
    date:     data.date,
    time:     data.time ?? "",
    category: data.category,
    priority: data.priority,
    desc:     data.desc ?? "",
  });
  return task;
}

export async function toggleTaskInDB(uid, taskId, currentDone) {
  await api.put(`/users/${uid}/tasks/${taskId}`, { done: !currentDone });
}

export async function deleteTaskFromDB(uid, taskId) {
  await api.delete(`/users/${uid}/tasks/${taskId}`);
}
