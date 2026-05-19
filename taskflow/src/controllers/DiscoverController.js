// CONTROLLER: Descubrir — Gemini 1.5 Flash
// Convierte los intereses del usuario en labels legibles,
// llama al modelo, aplica caché para no repetir llamadas
// innecesarias y expone helpers de formato para las vistas.

import { fetchEventsFromAI } from "../models/DiscoverModel";
import { INTERESTS }         from "../constants/interests";
import { COLOMBIA_CITIES }   from "../constants/cities";

// ─── Caché en memoria ────────────────────────────────────────
// Evita llamadas repetidas si el usuario ya cargó el feed con
// la misma combinación de ciudad + intereses en esta sesión.
const _cache = new Map();

function cacheKey(city, interests) {
  return `${city}::${[...interests].sort().join(",")}`;
}

/**
 * Obtiene eventos recomendados según ciudad e intereses.
 * Usa caché de sesión para no consumir quota innecesariamente.
 *
 * @param {string}   city       - valor de COLOMBIA_CITIES.value
 * @param {string[]} interests  - array de ids de intereses
 * @param {boolean}  forceRefresh - ignora caché y hace nueva llamada
 * @returns {Promise<object[]>}
 */
export async function getRecommendedEvents(city, interests, forceRefresh = false) {
  const key = cacheKey(city, interests);

  if (!forceRefresh && _cache.has(key)) {
    return _cache.get(key);
  }

  // Convierte ids de interés a labels en español para el prompt
  const interestLabels = interests
    .map(id => INTERESTS.find(i => i.id === id)?.label)
    .filter(Boolean);

  // Resuelve el nombre de ciudad en formato legible
  const cityLabel = COLOMBIA_CITIES.find(c => c.value === city)?.label ?? city;

  const events = await fetchEventsFromAI({
    city:      cityLabel,
    interests: interestLabels,
    size:      12,
  });

  _cache.set(key, events);
  return events;
}

/**
 * Invalida el caché para forzar recarga en la próxima llamada.
 * Llamar cuando el usuario actualiza ciudad o intereses.
 * @param {string}   city
 * @param {string[]} interests
 */
export function invalidateCache(city, interests) {
  _cache.delete(cacheKey(city, interests));
}

// ─── Helpers de formato ──────────────────────────────────────

/**
 * Formatea la fecha y hora de un evento para mostrar en tarjeta.
 * @param {string|null} dateStr  "2025-06-15"
 * @param {string|null} timeStr  "20:00:00"
 * @returns {string}
 */
export function formatEventDate(dateStr, timeStr) {
  if (!dateStr) return "Fecha por confirmar";

  const date     = new Date(`${dateStr}T${timeStr ?? "00:00:00"}`);
  const datePart = date.toLocaleDateString("es-CO", {
    weekday: "short", day: "numeric", month: "short",
  });
  const timePart = timeStr
    ? date.toLocaleTimeString("es-CO", { hour: "2-digit", minute: "2-digit" })
    : null;

  return timePart ? `${datePart} · ${timePart}` : datePart;
}

/**
 * Formatea el precio de un evento en COP.
 * @param {number|null} min
 * @param {number|null} max
 * @param {string}      currency
 * @returns {string}
 */
export function formatEventPrice(min, max, currency = "COP") {
  if (min === null || min === undefined) return "Precio por confirmar";
  if (min === 0)                         return "Entrada gratuita";

  const fmt = n =>
    new Intl.NumberFormat("es-CO", {
      style:                 "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(n);

  return max && max !== min ? `${fmt(min)} – ${fmt(max)}` : fmt(min);
}

/**
 * Devuelve el emoji de segmento para mostrar como tag visual.
 * @param {string|null} segment
 * @returns {string}
 */
export function segmentEmoji(segment) {
  const map = {
    "Música":      "🎵",
    "Deportes":    "⚽",
    "Artes":       "🎭",
    "Tecnología":  "💻",
    "Familia":     "👨‍👩‍👧",
    "Ciencia":     "🔭",
    "Music":       "🎵",
    "Sports":      "⚽",
    "Arts":        "🎭",
    "Technology":  "💻",
    "Family":      "👨‍👩‍👧",
    "Science":     "🔭",
  };
  return map[segment] ?? "📅";
}