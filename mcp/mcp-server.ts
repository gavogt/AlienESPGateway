// mcp-server.ts
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import dotenv from "dotenv";

// your other tools (named exports)
import { analyzeInsightsTool } from "./tools/insightTool.js";
import { findAnomaliesTool } from "./tools/anomalyTool.js";

// ✅ default export for getRecentPoints
import getRecentPointsTool from "./tools/getRecentPoints.js";

dotenv.config({ quiet: true });

if (!process.env.OPENAI_API_KEY?.trim()) {
  console.error("OPENAI_API_KEY missing or empty");
  process.exit(1);
}

const server = new McpServer({
  name: "alien-telemetry-mcp",
  version: "1.0.0",
});

// example shared type (if you still need it)
const Point = z.object({ k: z.string(), t: z.number(), v: z.number() });

// Register tools
server.registerTool(
  analyzeInsightsTool.name,
  {
    title: "AI Insight Query",
    description: "Ask AI about telemetry data",
    inputSchema: analyzeInsightsTool.schema,
  },
  async (args) => analyzeInsightsTool.run(args as any)
);

server.registerTool(
  findAnomaliesTool.name,
  {
    title: "Find Anomalies",
    description: "Detect anomalies in telemetry points",
    inputSchema: findAnomaliesTool.schema,
  },
  async (args) => findAnomaliesTool.run(args as any)
);

// ✅ Register the recent-points tool (uses default export)
server.registerTool(
  getRecentPointsTool.name, // "get_recent_points"
  {
    title: "Get Recent Points",
    description: "Fetch recent telemetry points from the backend",
    inputSchema: getRecentPointsTool.schema, // Zod *shape*
  },
  async (args) => getRecentPointsTool.run(args as any)
);

const transport = new StdioServerTransport();
await server.connect(transport);