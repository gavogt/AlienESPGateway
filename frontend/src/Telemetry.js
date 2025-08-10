import React, { useEffect, useMemo, useRef, useState } from 'react';
import ReactECharts from 'echarts-for-react';
import { io } from 'socket.io-client';

export default function TelemetryPage({ apiBase = 'http://127.0.0.1:3001' }) {
  const [rows, setRows] = useState([]);
  const [live, setLive] = useState([]);
  const socketRef = useRef(null);

  useEffect(() => {
    fetch(`${apiBase}/api/history?interval=1`)
      .then(r => r.json())
      .then(setRows)
      .catch(console.error);
  }, [apiBase]);

  useEffect(() => {
    const s = io(apiBase);
    socketRef.current = s;
    s.on('telemetry', doc => {
      setLive(prev => [...prev.slice(-499), doc]);
    });
    return () => s.close();
  }, [apiBase]);

  const seriesByType = useMemo(() => {
    const map = new Map();
    for (const r of rows) {
      const key = r.module_type;
      if (!map.has(key)) map.set(key, []);
      map.get(key).push({ name: key, value: [new Date(r.t).getTime(), r.value] });
    }
    for (const d of live) {
      const t = new Date(d.time ?? d.timestamp ?? Date.now()).getTime();
      const modType = d.module_type ?? d?.tags?.module_type;
      const val = (typeof d.value === 'number') ? d.value : d?.fields?.value;
      if (modType != null && typeof val === 'number') {
        if (!map.has(modType)) map.set(modType, []);
        map.get(modType).push({ name: modType, value: [t, val] });
        continue;
      }
      if (Array.isArray(d.modules)) {
        for (const m of d.modules) {
          const key = m.type;
          if (!map.has(key)) map.set(key, []);
          map.get(key).push({ name: key, value: [t, m.value] });
        }
      }
    }
    for (const arr of map.values()) arr.sort((a, b) => a.value[0] - b.value[0]);
    return map;
  }, [rows, live]);

  const option = useMemo(() => {
    const series = Array.from(seriesByType.entries()).map(([key, data]) => ({
      name: key,
      type: 'line',
      showSymbol: false,
      smooth: true,
      data
    }));
    return {
      tooltip: { trigger: 'axis', axisPointer: { type: 'cross' } },
      legend: { type: 'scroll' },
      xAxis: { type: 'time' },
      yAxis: { type: 'value', scale: true },
      series,
      dataZoom: [{ type: 'inside' }, { type: 'slider' }]
    };
  }, [seriesByType]);

  const hasData = seriesByType.size > 0;

  return (
    <div style={{ padding: 16 }}>
      <h2>Telemetry</h2>
      {!hasData && <div style={{ opacity: 0.7, marginBottom: 8 }}>No data yet—waiting for history or live points…</div>}
      <ReactECharts option={option} style={{ height: 420, width: '100%', minHeight: 420 }} notMerge />
    </div>
  );
}
