import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API = process.env.REACT_APP_API_URL || "http://localhost:3001";

export default function Scouts() {
  const nav = useNavigate();
  const [scouts, setScouts] = useState([]);
  const [sel, setSel] = useState(null);

  const token = localStorage.getItem("token");
  useEffect(() => { if (!token) nav("/login"); }, [token, nav]);

  useEffect(() => {
    if (!token) return;
    fetch(`${API}/api/scouts`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json()).then(setScouts).catch(() => setScouts([]));
  }, [token]);

  const cmd = (id, type) =>
    fetch(`${API}/api/scouts/${id}/command`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ type })
    });

  const open = async (id) => {
    const r = await fetch(`${API}/api/scouts/${id}`, { headers: { Authorization: `Bearer ${token}` } });
    setSel(await r.json());
  };

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: 16 }}>
      <h2>Scouts</h2>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead><tr><th>ID</th><th>Name</th><th>Status</th><th>Seen</th><th></th></tr></thead>
        <tbody>
          {scouts.map(s => (
            <tr key={s.scoutId} style={{ borderTop: "1px solid #eee" }}>
              <td>{s.scoutId}</td>
              <td>{s.name || "—"}</td>
              <td>{s.status || "offline"}</td>
              <td>{s.lastSeenAt ? new Date(s.lastSeenAt).toLocaleString() : "—"}</td>
              <td style={{ textAlign: "right" }}>
                <button onClick={() => open(s.scoutId)} style={{ marginRight: 6 }}>View</button>
                <button onClick={() => cmd(s.scoutId, "CALIBRATE")} style={{ marginRight: 6 }}>Cal</button>
                <button onClick={() => cmd(s.scoutId, "REBOOT")}>Reboot</button>
              </td>
            </tr>
          ))}
          {scouts.length === 0 && (
            <tr><td colSpan="5" style={{ padding: 12, textAlign: "center", color: "#666" }}>No scouts</td></tr>
          )}
        </tbody>
      </table>

      {sel && (
        <div style={{ marginTop: 12, padding: 12, border: "1px solid #eee", borderRadius: 8 }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <b>{sel.scoutId}</b>
            <button onClick={() => setSel(null)}>Close</button>
          </div>
          <div>Name: {sel.name || "—"}</div>
          <div>Status: {sel.status || "offline"}</div>
          <div>Last Seen: {sel.lastSeenAt ? new Date(sel.lastSeenAt).toLocaleString() : "—"}</div>
          <div>Modules:</div>
          <ul style={{ marginTop: 6 }}>
            {(sel.modules || []).map(m => (
              <li key={m.type}>
                <code>{m.type}</code> — {m.lastValue ?? "—"} {m.unit || ""} {m.lastSeenAt ? `(${new Date(m.lastSeenAt).toLocaleTimeString()})` : ""}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}