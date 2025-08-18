import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { analyzeInsightsTool } from "./tools/insightTool.js";
import { findAnomaliesTool } from "./tools/anomalyTool.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { runInsightQuery } from "../mern-backend/ai.js";
const server = new McpServer({
    name: "alien-temeletry-mcp",
    version: "1.0.0",
});

const Point = z.object({
    k: z.string(), // Key
    t: z.number(), // Timestamp
    v: z.number(), // Value
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
    // delegate to tool.run; ensure it returns { content: [...] } with as const
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