#!/usr/bin/env node

/**
 * MCP Server for Teamleader Focus CRM
 *
 * Provides tools to manage contacts, companies, deals, tasks, events, and invoices
 * via the Teamleader Focus API.
 *
 * Environment variables:
 *   TEAMLEADER_CLIENT_ID     - OAuth2 client ID
 *   TEAMLEADER_CLIENT_SECRET - OAuth2 client secret
 *   TEAMLEADER_REFRESH_TOKEN - OAuth2 refresh token
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { TeamleaderAuth, loadRefreshToken } from "./api/auth.js";
import { TeamleaderClient } from "./api/client.js";
import { registerContactTools } from "./tools/contacts.js";
import { registerCompanyTools } from "./tools/companies.js";
import { registerDealTools } from "./tools/deals.js";
import { registerTaskTools } from "./tools/tasks.js";
import { registerEventTools } from "./tools/events.js";
import { registerInvoiceTools } from "./tools/invoices.js";
import { registerTimeTrackingTools } from "./tools/timetracking.js";
import { registerProjectTools } from "./tools/projects.js";
import { registerResolveTools, initializeCache } from "./tools/resolve.js";
import { registerUserTools } from "./tools/users.js";
import { registerTicketTools } from "./tools/tickets.js";
import { registerMeetingTools } from "./tools/meetings.js";
import { registerDepartmentTools } from "./tools/departments.js";

function getRequiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `Missing required environment variable: ${name}. ` +
        `Please set it in your MCP configuration.`
    );
  }
  return value;
}

async function main(): Promise<void> {
  // Validate environment
  const clientId = getRequiredEnv("TEAMLEADER_CLIENT_ID");
  const clientSecret = getRequiredEnv("TEAMLEADER_CLIENT_SECRET");
  const refreshToken = loadRefreshToken(getRequiredEnv("TEAMLEADER_REFRESH_TOKEN"));

  // Initialize auth and API client
  const auth = new TeamleaderAuth({
    clientId,
    clientSecret,
    refreshToken,
  });
  const client = new TeamleaderClient(auth);

  // Create MCP server
  const server = new McpServer({
    name: "teamleader-focus",
    version: "1.2.0",
    description:
      "Tailormade Teamleader Focus MCP — manage contacts, companies, deals, tasks, events, invoices, time tracking, and projects with phases. Based on globodai-mcp-teamleader.",
  });

  // Register all tools
  registerContactTools(server, client);
  registerCompanyTools(server, client);
  registerDealTools(server, client);
  registerTaskTools(server, client);
  registerEventTools(server, client);
  registerInvoiceTools(server, client);
  registerTimeTrackingTools(server, client);
  registerProjectTools(server, client);
  registerResolveTools(server, client);
  registerUserTools(server, client);
  registerTicketTools(server, client);
  registerMeetingTools(server, client);
  registerDepartmentTools(server, client);

  // Initialize cache (active user + work types)
  await initializeCache(client);

  // Start server
  const transport = new StdioServerTransport();
  await server.connect(transport);

  // Handle graceful shutdown
  process.on("SIGINT", async () => {
    await server.close();
    process.exit(0);
  });

  process.on("SIGTERM", async () => {
    await server.close();
    process.exit(0);
  });
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
