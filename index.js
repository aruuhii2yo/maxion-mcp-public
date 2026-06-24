#!/usr/bin/env node
"use strict";

// Local/stdio entry point. This is intentionally a thin proxy, not a second
// implementation of the gateway -- every tool, every licensing/billing check,
// and every secret lives in exactly one place: the hosted Lambda. Duplicating
// that logic here previously meant a local install had its own (unenforced)
// licensing path with no real payment check. Now there's only one gateway,
// reachable either over HTTPS directly or through this stdio bridge.

const { Server } = require("@modelcontextprotocol/sdk/server/index.js");
const { StdioServerTransport } = require("@modelcontextprotocol/sdk/server/stdio.js");
const { ListToolsRequestSchema, CallToolRequestSchema } = require("@modelcontextprotocol/sdk/types.js");

const GATEWAY_URL  = process.env.MAXION_GATEWAY_URL || "https://5pu357jdkqc3qynzkjvu3okgqy0ncsiy.lambda-url.us-east-1.on.aws/mcp";
const LICENSE_KEY  = process.env.MAXION_LICENSE_KEY || "";

async function callGateway(method, params) {
  const res = await fetch(GATEWAY_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json, text/event-stream",
      ...(LICENSE_KEY ? { "x-fleet-key": LICENSE_KEY } : {}),
    },
    body: JSON.stringify({ jsonrpc: "2.0", id: 1, method, params: params || {} }),
  });
  if (!res.ok) throw new Error(`Gateway returned HTTP ${res.status}`);
  const json = await res.json();
  if (json.error) throw new Error(json.error.message || JSON.stringify(json.error));
  return json.result;
}

const server = new Server(
  { name: "io.github.aruuhii2yo/maxion-mcp-gateway", version: "16.4.0" },
  { capabilities: { tools: {} } },
);

server.setRequestHandler(ListToolsRequestSchema, async () => callGateway("tools/list", {}));
server.setRequestHandler(CallToolRequestSchema, async (request) => callGateway("tools/call", request.params));

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error(`Maxion MCP Gateway (local proxy) running on stdio -> ${GATEWAY_URL}`);
}

main().catch(err => { console.error("Fatal:", err); process.exit(1); });
