import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { analyzeInsightsTool } from "./tools/insightTool.js";
import { findAnomaliesTool } from "./tools/anomalyTool.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { runInsightQuery } from "../mern-backend/ai.js";
import dotenv from "dotenv";

dotenv.config({ quiet: true});

if (!process.env.OPENAI_API_KEY?.trim()) {
  console.error("OPENAI_API_KEY missing or empty");
  process.exit(1);
}

const server = new McpServer({
    name: "alien-temeletry-mcp",
    version: "1.0.0",
});

const Point = z.object({
    k: z.string(), 
    t: z.number(), 
    v: z.number(), 
});

// Register tools
server.registerTool(
  analyzeInsightsTool.name,
  {
    title: "AI Insight Query",
    description: "Ask AI about telemetry data",
    inputSchema: analyzeInsightsTool.schema,
  },
  async (args) => {
    return await analyzeInsightsTool.run(args as any);
  }
);

server.registerTool(
  findAnomaliesTool.name,
  {
    title: "Find Anomalies",
    description: "Detect anomalies in telemetry points",
    inputSchema: findAnomaliesTool.schema,
  },
  async (args) => {
    return await findAnomaliesTool.run(args as any);
  }
);

const transport = new StdioServerTransport();
await server.connect(transport);