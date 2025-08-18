import { z } from "zod";
import { runInsightQuery } from "../../mern-backend/ai.js"; 

export const analyzeInsightsTool = {
  name: "analyze_insights",
  schema: z.object({
    query: z.string(),
    points: z.array(
      z.object({
        k: z.string(),
        t: z.number(),
        v: z.number(),
      })
    ).default([]),
  }),
  async run({ query, points }) {
    const result = await runInsightQuery(query, points);
    return {
      content: [{ type: "text", text: result.narrative ?? "No answer" }],
    };
  },
};