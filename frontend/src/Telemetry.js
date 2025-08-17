import React, { useEffect, useMemo, useState } from "react";
import ReactECharts from "echarts-for-react";
import { io } from "socket.io-client";

export default function TelemetryPage({ apiBase }) {
  const API =
    apiBase ??
    (typeof window !== "undefined" && window.location
      ? `${window.location.protocol}//${window.location.hostname}:3001`
      : "http://127.0.0.1:3001");

  const [points, setPoints] = useState([]);   // [{ k, t, v }]
  const [aiQ, setAiQ] = useState("");         // AI question
  const [aiA, setAiA] = useState("");         // AI answer

  // 1) history once
  useEffect(() => {
    fetch(`${API}/api/history?interval=1`)
      .then((r) => r.json())
      .then((rows) => {
        const pts = (rows || []).flatMap((r) => {
          if (!r?.module_type || !r?.t) return [];
          const v = Number(r.value);
          if (!Number.isFinite(v)) return [];
          return [{ k: r.module_type, t: new Date(r.t).getTime(), v }];
        });
        setPoints(pts);
      })
      .catch(console.error);
  }, [API]);

  // 2) live
  useEffect(() => {
    const s = io(API, { path: "/socket.io", transports: ["polling", "websocket"] });

    s.on("connect", () => console.log("socket connected", s.id));
    s.on("connect_error", (e) => console.error("socket error:", e?.message || e));

    s.on("telemetry", (d) => {
      const t = new Date(d.time ?? d.timestamp ?? Date.now()).getTime();
      const k = d.module_type ?? d?.tags?.module_type ?? d?.type;
      const v = Number(d.value ?? d?.fields?.value);

      if (k && Number.isFinite(v)) {
        setPoints((p) => [...p.slice(-999), { k, t, v }]);
      } else if (Array.isArray(d?.modules)) {
        const rows = d.modules.flatMap((m) => {
          const vv = Number(m?.value);
          return m?.type && Number.isFinite(vv) ? [{ k: m.type, t, v: vv }] : [];
        });
        if (rows.length) {
          setPoints((p) => {
            const keep = Math.max(0, 1000 - rows.length);
            return [...p.slice(-keep), ...rows];
          });
        }
      } else {
        console.debug("ignored telemetry:", d);
      }
    });

    return () => s.close();
  }, [API]);

  // 3) ask AI
  async function askAI(e) {
    e.preventDefault();
    setAiA("Thinking…");
    try {
      const r = await fetch(`${API}/api/ai/query`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          q: aiQ,
          data: points.slice(-300)
        }),
      });
      const j = await r.json();
      setAiA(j?.narrative || "No answer");
    } catch {
      setAiA("AI query failed");
    }
  }

  // Colors
  const COLORS = {
    BIO: "#f003dcff",
    NEURO: "#86EFAC",
    PLASMA: "#FDE68A",
    PING: "#FCA5A5",
    default: "#E5E7EB",
  };

  // 4) chart option
  const option = useMemo(() => {
    const groups = new Map();
    for (const { k, t, v } of points) {
      if (!groups.has(k)) groups.set(k, []);
      groups.get(k).push([t, v]);
    }
    const series = [...groups.entries()].map(([name, data]) => ({
      name,
      type: "line",
      showSymbol: false,
      smooth: true,
      data,
      lineStyle: { width: 2, color: COLORS[name] ?? COLORS.default },
      itemStyle: { color: COLORS[name] ?? COLORS.default },
    }));
    return {
      animation: false,
      tooltip: { trigger: "axis", axisPointer: { type: "cross" } },
      legend: {
        type: "scroll",
        top: 8,
        textStyle: { color: "#aeeadcff", fontWeight: 600 },
        inactiveColor: "rgba(181, 181, 181, 0.51)",
      },
      xAxis: { type: "time" },
      yAxis: { type: "value", scale: true },
      dataZoom: [{ type: "inside" }, { type: "slider" }],
      series,
    };
  }, [points]);

  return (
    <div style={{ padding: 16 }}>
      <div style={{ fontSize: 12, opacity: 0.7, marginBottom: 6 }}>
        Live points: {points.length}
      </div>

      <ReactECharts option={option} style={{ height: 420, width: "100%" }} notMerge />

      <div
        style={{
          marginTop: 16,
          padding: 12,
          border: "1px solid #e5e7eb",
          borderRadius: 8,
        }}
      >
        <b>🤖 AI Insights</b>
        <form onSubmit={askAI} style={{ display: "flex", gap: 8, marginTop: 8 }}>
          <input
            value={aiQ}
            onChange={(e) => setAiQ(e.target.value)}
            placeholder='Try: "Show last week’s highest NeuroFlux spikes"'
            style={{ flex: 1, padding: 8 }}
          />
          <button disabled={!aiQ.trim()}>Ask</button>
        </form>
        {aiA && (
          <p style={{ whiteSpace: "pre-wrap", marginTop: 8, fontSize: 14 }}>{aiA}</p>
        )}
      </div>
    </div>
  );
}