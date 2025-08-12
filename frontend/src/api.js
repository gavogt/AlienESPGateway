const API = "http://localhost:3001";

async function readJsonSafe(res) {
  const txt = await res.text();
  try { return JSON.parse(txt); } catch { return { message: txt || res.statusText }; }
}

export async function login(email, password) {
  const res = await fetch(`${API}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });

  const data = await readJsonSafe(res);
  if (!res.ok) throw new Error(data.message || "Login failed");
  return data; // { token, user }
}

export async function register(payload) {
  const res = await fetch(`${API}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  const data = await readJsonSafe(res);
  if (!res.ok) throw new Error(data.message || "Register failed");
  return data; // { token, user }
}