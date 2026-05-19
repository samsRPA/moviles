import { api } from "../api";

// ── Sesión local ──────────────────────────────────────────────
// Guarda { uid, token, ...profile } en sessionStorage para que
// el observer de auth se comporte igual que onAuthStateChanged.

const SESSION_KEY = "tf_session";

function saveSession(user, token) {
  sessionStorage.setItem("tf_token",  token);
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(user));
}

function clearSession() {
  sessionStorage.removeItem("tf_token");
  sessionStorage.removeItem(SESSION_KEY);
}

function loadSession() {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

// ── Auth ──────────────────────────────────────────────────────

export async function registerUserInFirebase(name, email, password) {
  const res = await api.post("/auth/register", {
    name, email, password, password2: password,
  });
  if (!res.ok) throw new Error(res.error ?? "Error al registrar");
  saveSession(res.user, res.token);
  return res.user;
}

export async function loginUserInFirebase(email, password) {
  const res = await api.post("/auth/login", { email, password });
  if (!res.ok) throw new Error(res.error ?? "Error al iniciar sesión");
  saveSession(res.user, res.token);
  return res.user;
}

export async function logoutFromFirebase() {
  clearSession();
}

// ── Perfil ────────────────────────────────────────────────────

export async function fetchUserProfile(uid) {
  const data = await api.get(`/users/${uid}`);
  if (!data || data.error) throw new Error("Perfil no encontrado");
  return data;
}

export async function updateUserProfile(uid, updates) {
  await api.put(`/users/${uid}`, updates);
}

// ── Observer de sesión (reemplaza onAuthStateChanged) ─────────
// Llama al callback de inmediato con el usuario guardado en
// sessionStorage, igual que Firebase haría al recargar la página.

export function subscribeToAuthState(callback) {
  const user = loadSession();
  // Ejecuta en el siguiente tick para que el caller pueda
  // registrar el unsub antes de recibir el valor
  setTimeout(() => callback(user), 0);
  return () => {}; // unsub no-op
}
