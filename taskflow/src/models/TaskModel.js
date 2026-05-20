import { api } from "../api";

const VALID_CATS = ["Trabajo", "Hogar", "Ejercicio", "Personal"];

function normalizeCategory(cat) {
  if (!cat || typeof cat !== "string") return "Trabajo";
  const trimmed = cat.trim();
  const match = VALID_CATS.find(v => v.toLowerCase() === trimmed.toLowerCase());
  return match ?? "Trabajo";
}

function normalizeTasks(data) {
  if (!Array.isArray(data)) return [];
  return data.map(t => ({
    ...t,
    category: normalizeCategory(t.category),
  }));
}

export async function fetchTasksFromDB(uid) {
  const data = await api.get(`/users/${uid}/tasks`);
  const tasks = normalizeTasks(data);
  console.log("[fetchTasks] tareas recibidas:", tasks.map(t => `${t.title}|${t.category}|done:${t.done}`));
  return tasks;
}

export async function addTaskToDB(uid, data) {
  const category = normalizeCategory(data.category);
  console.log("[addTask] enviando category:", category, "| original:", data.category);
  const task = await api.post(`/users/${uid}/tasks`, {
    title:    data.title,
    date:     data.date,
    time:     data.time ?? "",
    category,
    priority: data.priority,
    desc:     data.desc ?? "",
  });
  const normalized = task ? { ...task, category: normalizeCategory(task.category) } : task;
  console.log("[addTask] respuesta del backend:", normalized?.category);
  return normalized;
}

export async function toggleTaskInDB(uid, taskId, currentDone) {
  await api.put(`/users/${uid}/tasks/${taskId}`, { done: !currentDone });
}

export async function deleteTaskFromDB(uid, taskId) {
  await api.delete(`/users/${uid}/tasks/${taskId}`);
}

export async function updateTaskInDB(uid, taskId, data) {
  const category = normalizeCategory(data.category);
  return api.put(`/users/${uid}/tasks/${taskId}`, {
    title:    data.title,
    date:     data.date,
    time:     data.time    ?? "",
    category,
    priority: data.priority,
    desc:     data.desc    ?? "",
  });
}
