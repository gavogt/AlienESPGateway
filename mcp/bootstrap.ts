import dotenv from "dotenv";
dotenv.config({ quiet: true });

console.log = (...a) => console.error("[log->stderr]", ...a);
console.warn = (...a) => console.error("[warn]", ...a);

process.on("uncaughtException", e => console.error("[uncaught]", e));
process.on("unhandledRejection", e => console.error("[unhandled]", e));

await import("./mcp-server.ts");