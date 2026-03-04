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
    "List all activity types. Returns numbered list with name and ID. Use the IDs when creating events (teamleader_create_event activity_type_id param).",
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
    "List all tax rates with description and percentage. Returns numbered list with rate and ID. Use the IDs for invoice line items (teamleader_create_invoice, teamleader_credit_invoice_partially).",
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
    "List all payment term types (cash, end_of_month, after_invoice_date, etc.). Returns the type strings needed for teamleader_create_invoice and teamleader_update_invoice (payment_term_type param).",
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
    "List all ticket statuses with label and status type. Returns IDs needed for teamleader_create_ticket, teamleader_update_ticket, and teamleader_list_tickets (exclude_status_ids).",
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

  // ── Teams ───────────────────────────────────────────────────────────────
  server.tool(
    "teamleader_list_teams",
    "List all teams. Returns team IDs needed for tickets (team_id param in tickets.create/update).",
    {},
    async () => {
      const result = await client.request<TeamleaderListResponse<{
        id: string;
        name: string;
        team_lead?: { type: string; id: string };
        members?: Array<{ type: string; id: string }>;
      }>>({
        endpoint: "teams.list",
        body: {},
      });

      const lines = (result.data ?? []).map((t, i) => {
        let line = `${i + 1}. ${t.name} (${t.id})`;
        if (t.members?.length) line += ` — ${t.members.length} member(s)`;
        return line;
      });
      return respond(lines.length ? lines.join("\n") : "No teams found.");
    }
  );

  // ── Tags ───────────────────────────────────────────────────────────────
  server.tool(
    "teamleader_list_tags",
    "List all tags used for labeling contacts, companies, and deals. Useful for filtering or tagging entities.",
    {},
    async () => {
      const result = await client.request<TeamleaderListResponse<{
        tag: string;
        count: number;
      }>>({
        endpoint: "tags.list",
        body: {},
      });

      const lines = (result.data ?? []).map((t, i) =>
        `${i + 1}. ${t.tag} (${t.count} usage(s))`
      );
      return respond(lines.length ? lines.join("\n") : "No tags found.");
    }
  );

  // ── Expenses ───────────────────────────────────────────────────────────
  server.tool(
    "teamleader_list_expenses",
    "List expenses (incoming invoices, credit notes, receipts). Supports filtering by search term, source type, review/payment status, supplier, and date ranges.",
    {
      term: z.string().optional().describe("Filter by document number or supplier name (case-insensitive)"),
      source_types: z.array(z.enum(["incomingInvoice", "incomingCreditNote", "receipt"])).optional()
        .describe("Filter by source types"),
      review_statuses: z.array(z.enum(["pending", "approved", "refused"])).optional()
        .describe("Filter by review statuses"),
      payment_statuses: z.array(z.enum(["paid", "unpaid"])).optional()
        .describe("Filter by payment statuses"),
      page: z.number().optional().describe("Page number (default: 1)"),
      page_size: z.number().optional().describe("Page size (default: 20)"),
    },
    async (params) => {
      const body: Record<string, unknown> = {};
      const filter: Record<string, unknown> = {};

      if (params.term) filter.term = params.term;
      if (params.source_types) filter.source_types = params.source_types;
      if (params.review_statuses) filter.review_statuses = params.review_statuses;
      if (params.payment_statuses) filter.payment_statuses = params.payment_statuses;
      if (Object.keys(filter).length > 0) body.filter = filter;

      body.page = { number: params.page ?? 1, size: params.page_size ?? 20 };

      const result = await client.request<TeamleaderListResponse<{
        source: { type: string; id: string };
        title: string;
        supplier?: { type: string; id: string } | null;
        document_number?: string | null;
        document_date?: string | null;
        currency: { code: string };
        total: {
          tax_exclusive?: { amount: number } | null;
          tax_inclusive?: { amount: number } | null;
        };
        review_status: string;
        payment_status: string;
        paid_amount?: number | null;
      }>>({
        endpoint: "expenses.list",
        body,
      });

      const lines = (result.data ?? []).map((e, i) => {
        const amount = e.total.tax_inclusive?.amount ?? e.total.tax_exclusive?.amount ?? 0;
        let line = `${i + 1}. ${e.title || e.document_number || "Untitled"}`;
        line += ` — ${amount} ${e.currency.code}`;
        if (e.document_date) line += ` (${e.document_date})`;
        line += ` [${e.review_status}/${e.payment_status}]`;
        line += ` (${e.source.id})`;
        return line;
      });

      const meta = (result as unknown as { meta?: { matches?: number } }).meta;
      let header = "";
      if (meta?.matches != null) header = `${meta.matches} expense(s) found.\n`;

      return respond(lines.length ? header + lines.join("\n") : "No expenses found.");
    }
  );

  // ── Work Types ───────────────────────────────────────────────────────────
  server.tool(
    "teamleader_list_work_types",
    "List all work types. Returns numbered list with name and ID. Use the IDs for time tracking (teamleader_add_timetracking, teamleader_start_timer), task creation (teamleader_create_task, teamleader_create_project_task_v2), and teamleader_log_time. Uses cache (7-day TTL).",
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
