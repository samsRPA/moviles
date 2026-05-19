import { api } from "../api";

export async function fetchEventsFromAI({ city, interests, size = 10 }) {
  const data = await api.post("/discover", { city, interests, size });
  if (!Array.isArray(data)) throw new Error("Respuesta inválida del servidor");
  return data;
}
