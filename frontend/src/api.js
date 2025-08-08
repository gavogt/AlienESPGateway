const API = "http://localhost:5000"

export async function login(email, password) {
  const res = await fetch(`${API}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  }); 
    if(!res.ok) throw new Error((await res.json()).message || "Login failed");
    return res.json(); // token, user
}

export async function register(data){
    const res = await fetch(`${API}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });
    if(!res.ok) throw new Error((await res.json()).message || "Register failed");
    return res.json(); // token, user
}