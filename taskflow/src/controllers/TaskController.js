import { fetchTasksFromDB, addTaskToDB, toggleTaskInDB, deleteTaskFromDB, updateTaskInDB } from "../models/TaskModel";
import { CATEGORIES } from "../constants/categories";

export async function fetchTasks(uid)                        { return fetchTasksFromDB(uid); }
export async function completeTask(uid, taskId, done)        { await toggleTaskInDB(uid, taskId, done); }
export async function deleteTask(uid, taskId)                { await deleteTaskFromDB(uid, taskId); }
export async function saveTask(uid, formData)                { return { newTask: await addTaskToDB(uid, formData) }; }
export async function updateTask(uid, taskId, formData)      { return updateTaskInDB(uid, taskId, formData); }

export function getDayProgress(tasks) {
  const total = tasks.length;
  const done  = tasks.filter(t => t.done).length;
  return {
    done,
    total,
    pct: total === 0 ? 0 : Math.round((done / total) * 100),
  };
}
export function filterByCategory(tasks, cat) {
  if (cat === "Todas") return tasks;
  return tasks.filter(t => t?.category?.trim() === cat);
}
export function getCategoryCounts(tasks) {
  console.log("[getCategoryCounts] tasks.length:", tasks.length, "| cats:", tasks.map(t => t?.category));
  return CATEGORIES.map(cat => ({
    ...cat,
    pend: tasks.filter(t => t?.category?.trim() === cat.label && !t.done).length,
  }));
}
