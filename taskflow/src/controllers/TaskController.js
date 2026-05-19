import { fetchTasksFromDB, addTaskToDB, toggleTaskInDB, deleteTaskFromDB } from "../models/TaskModel";
import { CATEGORIES } from "../constants/categories";

export async function fetchTasks(uid)                 { return fetchTasksFromDB(uid); }
export async function completeTask(uid, taskId, done) { await toggleTaskInDB(uid, taskId, done); }
export async function deleteTask(uid, taskId)         { await deleteTaskFromDB(uid, taskId); }
export async function saveTask(uid, formData)         { return { newTask: await addTaskToDB(uid, formData) }; }

export function getDayProgress(tasks) {
  const todayStr = new Date().toLocaleDateString("es-CO", {
    day: "numeric",
    month: "long",
  });

  const todayTasks = tasks.filter(t => t.date === todayStr);
  const total = todayTasks.length;
  const done  = todayTasks.filter(t => t.done).length;

  return {
    done,
    total,
    pct: total === 0 ? 0 : Math.round((done / total) * 100),
  };
}
export function filterByCategory(tasks, cat) {
  return cat === "Todas" ? tasks : tasks.filter(t => t.category === cat);
}
export function getCategoryCounts(tasks) {
  return CATEGORIES.map(cat => ({
    ...cat,
    pend: tasks.filter(t => t.category === cat.label && !t.done).length,
  }));
}
