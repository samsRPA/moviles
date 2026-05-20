const BASE_URL = import.meta.env.VITE_API_URL ?? "http://10.0.2.2:9090";

// Lee el token guardado en sesión
const getToken = () => sessionStorage.getItem("tf_token");

async function request(method, path, body = null) {
  const headers = { "Content-Type": "application/json" };
  const token = getToken();
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (res.status === 204) return null;
  const text = await res.text();
  if (!text.trim()) return null;

  let data;
  try { data = JSON.parse(text); } catch { data = null; }

  if (!res.ok) {
    const msg = data?.error ?? data?.message ?? `Error ${res.status}`;
    throw new Error(msg);
  }

  return data;
}

export const api = {
  get:    (path)        => request("GET",    path),
  post:   (path, body)  => request("POST",   path, body),
  put:    (path, body)  => request("PUT",    path, body),
  delete: (path)        => request("DELETE", path),
};
