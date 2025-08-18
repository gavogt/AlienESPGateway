import { z } from "zod";
import { text } from "../mcp-utils.js";

const getRecentPointsTool = {
  name: "get_recent_points",
  schema: {
    sensor: z.string().optional(),
    limit: z.number().default(200),
  },
  async run({ sensor, limit }: { sensor?: string; limit: number }) {
    const qs = new URLSearchParams({ limit: String(limit ?? 200) });
    if (sensor) qs.set("sensor", sensor);
    const url = `http://localhost:3001/api/telemetry/recent?${qs.toString()}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`GET ${url} failed: ${res.status} ${res.statusText}`);
    const data = await res.json();
    return { content: [text(JSON.stringify(data, null, 2))] };
  },
};

export default getRecentPointsTool;