/**
 * Teamleader Lookup Tools — read-only reference lists
 *
 * Activity types, tax rates, payment terms, ticket statuses,
 * products, product categories, work types.
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import type { TeamleaderClient } from "../api/client.js";
import type { TeamleaderListResponse } from "../types/index.js";
import { getWorkTypes, setWorkTypes } from "../api/cache.js";

function respond(text: string) {
  return { content: [{ type: "text" as const, text }] };
}

export function registerLookupTools(
  server: McpServer,
  client: TeamleaderClient
): void {
  // ── Activity Types ───────────────────────────────────────────────────────
  server.tool(
    "teamleader_list_activity_types",
    "List all activity types. Returns IDs needed for creating events (activity_type_id).",
    {
      page: z.number().optional().describe("Page number (default: 1)"),
      page_size: z.number().optional().describe("Page size (default: 20)"),
    },
    async (params) => {
      const body: Record<string, unknown> = {};
      if (params.page || params.page_size) {
        body.page = { number: params.page ?? 1, size: params.page_size ?? 20 };
      }

      const result = await client.request<TeamleaderListResponse<{ id: string; name: string }>>({
        endpoint: "activityTypes.list",
        body,
      });

      const lines = (result.data ?? []).map((at, i) => `${i + 1}. ${at.name} (${at.id})`);
      return respond(lines.length ? lines.join("\n") : "No activity types found.");
    }
  );

  // ── Tax Rates ────────────────────────────────────────────────────────────
  server.tool(
    "teamleader_list_tax_rates",
    "List all tax rates. Returns IDs needed for invoice line items (tax_rate_id).",
    {
      page: z.number().optional().describe("Page number (default: 1)"),
      page_size: z.number().optional().describe("Page size (default: 20)"),
    },
    async (params) => {
      const body: Record<string, unknown> = {};
      if (params.page || params.page_size) {
        body.page = { number: params.page ?? 1, size: params.page_size ?? 20 };
      }

      const result = await client.request<TeamleaderListResponse<{
        id: string;
        description: string;
        rate: number;
        department?: { type: string; id: string };
      }>>({
        endpoint: "taxRates.list",
        body,
      });

      const lines = (result.data ?? []).map((tr, i) =>
        `${i + 1}. ${tr.description ?? "?"} — ${tr.rate}% (${tr.id})`
      );
      return respond(lines.length ? lines.join("\n") : "No tax rates found.");
    }
  );

  // ── Payment Terms ────────────────────────────────────────────────────────
  server.tool(
    "teamleader_list_payment_terms",
    "List all payment term types. Returns types needed for creating invoices (payment_term.type).",
    {},
    async () => {
      const result = await client.request<TeamleaderListResponse<{
        type: string;
        days?: number;
      }>>({
        endpoint: "paymentTerms.list",
        body: {},
      });

      const lines = (result.data ?? []).map((pt, i) =>
        `${i + 1}. ${pt.type}${pt.days != null ? ` (${pt.days} days)` : ""}`
      );
      return respond(lines.length ? lines.join("\n") : "No payment terms found.");
    }
  );

  // ── Ticket Statuses ──────────────────────────────────────────────────────
  server.tool(
    "teamleader_list_ticket_statuses",
    "List all ticket statuses. Returns IDs needed for updating tickets (status_id).",
    {},
    async () => {
      const result = await client.request<TeamleaderListResponse<{
        id: string;
        status: string;
        label?: string;
      }>>({
        endpoint: "ticketStatus.list",
        body: {},
      });

      const lines = (result.data ?? []).map((ts, i) =>
        `${i + 1}. ${ts.label ?? ts.status} [${ts.status}] (${ts.id})`
      );
      return respond(lines.length ? lines.join("\n") : "No ticket statuses found.");
    }
  );

  // ── Products ─────────────────────────────────────────────────────────────
  server.tool(
    "teamleader_list_products",
    "List products from the product catalog. Returns IDs for use in invoice line items (product_id). Supports filtering by name or category.",
    {
      term: z.string().optional().describe("Search term to filter products by name"),
      category_id: z.string().optional().describe("Filter by product category ID"),
      page: z.number().optional().describe("Page number (default: 1)"),
      page_size: z.number().optional().describe("Page size (default: 20)"),
    },
    async (params) => {
      const body: Record<string, unknown> = {};
      const filter: Record<string, unknown> = {};

      if (params.term) filter.term = params.term;
      if (params.category_id) filter.category_id = params.category_id;
      if (Object.keys(filter).length > 0) body.filter = filter;

      if (params.page || params.page_size) {
        body.page = { number: params.page ?? 1, size: params.page_size ?? 20 };
      }

      const result = await client.request<TeamleaderListResponse<{
        id: string;
        name: string;
        description?: string;
        code?: string;
        unit_price?: { amount: number; currency: string };
        category?: { type: string; id: string };
      }>>({
        endpoint: "products.list",
        body,
      });

      const lines = (result.data ?? []).map((p, i) => {
        let line = `${i + 1}. ${p.name}`;
        if (p.code) line += ` [${p.code}]`;
        if (p.unit_price) line += ` — ${p.unit_price.amount} ${p.unit_price.currency}`;
        line += ` (${p.id})`;
        return line;
      });
      return respond(lines.length ? lines.join("\n") : "No products found.");
    }
  );

  // ── Product Categories ───────────────────────────────────────────────────
  server.tool(
    "teamleader_list_product_categories",
    "List all product categories. Returns IDs for filtering products.",
    {
      department_id: z.string().optional().describe("Filter by department ID"),
    },
    async (params) => {
      const body: Record<string, unknown> = {};
      if (params.department_id) {
        body.filter = { department_id: params.department_id };
      }

      const result = await client.request<TeamleaderListResponse<{
        id: string;
        name: string;
      }>>({
        endpoint: "productCategories.list",
        body,
      });

      const lines = (result.data ?? []).map((pc, i) =>
        `${i + 1}. ${pc.name} (${pc.id})`
      );
      return respond(lines.length ? lines.join("\n") : "No product categories found.");
    }
  );

  // ── Work Types ───────────────────────────────────────────────────────────
  server.tool(
    "teamleader_list_work_types",
    "List all work types. Returns IDs needed for time tracking and task creation (work_type_id). Uses cache when available.",
    {},
    async () => {
      // Try cache first
      let workTypes = getWorkTypes();

      if (!workTypes) {
        const result = await client.request<TeamleaderListResponse<{ id: string; name: string }>>({
          endpoint: "workTypes.list",
          body: {},
        });
        const fetched = result.data ?? [];
        setWorkTypes(fetched.map((wt) => ({ id: wt.id, name: wt.name })));
        workTypes = getWorkTypes();
      }

      const items = workTypes ?? [];
      const lines = items.map((wt, i) => `${i + 1}. ${wt.name} (${wt.id})`);
      return respond(lines.length ? lines.join("\n") : "No work types found.");
    }
  );
}
