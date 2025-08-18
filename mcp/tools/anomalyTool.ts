import { z } from "zod";
import { detectAnomalies } from "../../mern-backend/ai.js";

export const findAnomaliesTool = {
    name: "find_anomalies",
    schema: z.object({
        points: z.array(
            z.object({
                k: z.string(),
                t: z.number(),
                v: z.number(),
            })
        ),
    }),
    async run({ points }) {
        const anomalies = detectAnomalies(points || []);
        return {
            content: [{ type: "text", text: JSON.stringify(anomalies, null, 2) || "No anomalies detected" }],
        };
    },
};