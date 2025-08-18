import { z } from "zod";
import { detectAnomalies } from "../../mern-backend/ai.js";
import { text } from "../mcp-utils.js";

const Point = z.object({ k: z.string(), t: z.number(), v: z.number() });

export const findAnomaliesTool = {
  name: "find_anomalies",
  schema: { points: z.array(Point) }, // raw shape
  async run(
    { points }: { points: Array<z.infer<typeof Point>> },
    _extra?: unknown
  ) {
    const anomalies = detectAnomalies(points || []);
    return { content: [text(JSON.stringify(anomalies, null, 2))] };
  },
};