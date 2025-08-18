import { z } from "zod";
import { runInsightQuery } from "../../mern-backend/ai.js"; // or ../ai if that's your path
import { text } from "../mcp-utils.js";

const Point = z.object({ k: z.string(), t: z.number(), v: z.number() });

export const analyzeInsightsTool = {
  name: "analyze_insights",
  schema: {
    query: z.string(),
    points: z.array(Point).default([]),
  },
  async run(
    { query, points }: { query: string; points: Array<z.infer<typeof Point>> },
    _extra?: unknown
  ) {
    const result = await runInsightQuery(query, points);
    return { content: [text(result?.narrative ?? "No answer")] };
  },
};