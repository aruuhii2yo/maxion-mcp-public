# Maxion MCP Gateway

Enterprise MCP server suite — 19 tools across four products:

- **Maxion V16** — thermal performance / telemetry engine
- **Diamonize LSA** — zero-trust security scanning
- **Quezar** — AES-256-GCM encrypted storage
- **Lineage.0 VC** — AI video/image generation (Amazon Nova Reel + Nova Canvas)

Hosted on AWS Lambda. A free 60-minute trial is auto-activated on first tool call — no configuration required.

This package (`index.js`) is a thin local/stdio bridge to the hosted gateway — it forwards MCP requests over HTTPS and relays the responses. All tool logic, licensing, and billing live server-side.

## Install

```bash
npm install -g @aruuhii2yo/maxion-mcp-gateway
```

Add to your MCP client config (e.g. Claude Desktop):

```json
{
  "mcpServers": {
    "maxion": {
      "command": "maxion-mcp-gateway"
    }
  }
}
```

Or connect directly over HTTP without installing anything: see [Smithery](https://smithery.ai/servers/aruuhii2yo/maxion-mcp-gateway).

## Licensing

A free 30–60 minute trial is granted automatically on first use. For ongoing access, call the `billing-purchase` tool, or contact `aruuh@advancedapparchitect.com` for enterprise/fleet licensing.

## Links

- Website: https://advancedapparchitect.com
- Smithery: https://smithery.ai/servers/aruuhii2yo/maxion-mcp-gateway
