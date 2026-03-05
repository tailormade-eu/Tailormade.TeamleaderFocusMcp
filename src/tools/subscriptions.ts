/**
 * Teamleader Subscriptions Tools
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import type { TeamleaderClient } from "../api/client.js";
import type {
  Subscription,
  TeamleaderListResponse,
  TeamleaderInfoResponse,
} from "../types/index.js";

function respond(text: string) {
  return { content: [{ type: "text" as const, text }] };
}

export function registerSubscriptionTools(
  server: McpServer,
  client: TeamleaderClient
): void {
  // ── List Subscriptions ───────────────────────────────────────────────────
  server.tool(
    "teamleader_list_subscriptions",
    "List subscriptions (recurring invoices) from Teamleader Focus. Returns array with id, title, status, invoicee, billing_cycle, next_renewal_date, total. billing_cycle = {periodicity: {unit: 'week'|'month'|'year', period: N}, days_in_advance: N}. Valid statuses: 'active', 'deactivated'. No company_id filter — filter by invoicee.customer.id client-side. Next steps: teamleader_get_subscription for full details.",
    {
      page: z.number().optional().describe("Page number (default: 1)"),
      page_size: z.number().optional().describe("Page size (default: 20, max: 100)"),
      status: z
        .array(z.enum(["active", "deactivated"]))
        .optional()
        .describe("Filter by status: 'active' or 'deactivated'"),
      department_id: z.string().optional().describe("Filter by department ID"),
      updated_since: z.string().optional().describe("ISO 8601 date — only subscriptions updated after this date"),
    },
    async (params) => {
      const body: Record<string, unknown> = {};

      if (params.page || params.page_size) {
        body.page = {
          number: params.page ?? 1,
          size: params.page_size ?? 20,
        };
      }

      const filter: Record<string, unknown> = {};
      if (params.status) filter.status = params.status;
      if (params.department_id) filter.department_id = params.department_id;
      if (params.updated_since) filter.updated_since = params.updated_since;
      if (Object.keys(filter).length > 0) body.filter = filter;

      const result = await client.request<TeamleaderListResponse<Subscription>>({
        endpoint: "subscriptions.list",
        body,
      });

      return respond(JSON.stringify(result, null, 2));
    }
  );

  // ── Get Subscription ─────────────────────────────────────────────────────
  server.tool(
    "teamleader_get_subscription",
    "Get full details of a subscription including invoicee, renewal period, line items, and next renewal date. Next steps: teamleader_update_subscription to modify, teamleader_deactivate_subscription to stop.",
    {
      id: z.string().describe("The subscription ID"),
    },
    async (params) => {
      const result = await client.request<TeamleaderInfoResponse<Subscription>>({
        endpoint: "subscriptions.info",
        body: { id: params.id },
      });

      return respond(JSON.stringify(result, null, 2));
    }
  );

  // ── Create Subscription ──────────────────────────────────────────────────
  server.tool(
    "teamleader_create_subscription",
    "Create a new subscription (recurring invoice) in Teamleader Focus. Returns {id, type}. billing_cycle uses unit ('week','month','year') + period (e.g. period=3,unit=month = quarterly). days_in_advance = how many days before renewal the invoice is created. Lookup IDs first: teamleader_list_departments (department_id), teamleader_list_tax_rates (tax_rate_id), teamleader_list_payment_terms (payment_term types).",
    {
      customer_type: z.enum(["contact", "company"]).describe("Customer type"),
      customer_id: z.string().describe("Customer ID"),
      department_id: z.string().describe("Department ID (use teamleader_list_departments to find)"),
      starts_on: z.string().describe("Start date (YYYY-MM-DD)"),
      billing_unit: z
        .enum(["week", "month", "year"])
        .describe("Billing period unit: 'week', 'month', or 'year'"),
      billing_period: z
        .number()
        .describe("Number of units per billing cycle (e.g. 1 for monthly, 3 for quarterly, 1 for yearly)"),
      days_in_advance: z
        .number()
        .describe("Days before renewal date that the invoice is created (e.g. 28)"),
      payment_term_type: z
        .string()
        .describe("Payment term type (use teamleader_list_payment_terms to find valid types)"),
      payment_term_days: z.number().optional().describe("Days for payment term"),
      title: z.string().optional().describe("Subscription title"),
      ends_on: z.string().optional().describe("End date (YYYY-MM-DD) — omit for indefinite"),
      note: z.string().optional().describe("Note on the subscription"),
      line_items: z
        .array(
          z.object({
            quantity: z.number().describe("Quantity"),
            description: z.string().describe("Line item description"),
            unit_price_amount: z.number().describe("Unit price (tax exclusive)"),
            unit_price_currency: z.string().describe("Currency code (e.g. 'EUR')"),
            tax_rate_id: z.string().describe("Tax rate ID (use teamleader_list_tax_rates to find)"),
            product_id: z.string().optional().describe("Product ID (optional)"),
          })
        )
        .describe("Line items for the subscription invoice"),
    },
    async (params) => {
      const body: Record<string, unknown> = {
        invoicee: {
          customer: {
            type: params.customer_type,
            id: params.customer_id,
          },
        },
        department_id: params.department_id,
        starts_on: params.starts_on,
        billing_cycle: {
          periodicity: {
            unit: params.billing_unit,
            period: params.billing_period,
          },
          days_in_advance: params.days_in_advance,
        },
        payment_term: {
          type: params.payment_term_type,
          ...(params.payment_term_days !== undefined && { days: params.payment_term_days }),
        },
        grouped_lines: [
          {
            line_items: params.line_items.map((item) => ({
              quantity: item.quantity,
              description: item.description,
              unit_price: {
                amount: item.unit_price_amount,
                currency: item.unit_price_currency,
              },
              tax_rate_id: item.tax_rate_id,
              ...(item.product_id && { product_id: item.product_id }),
            })),
          },
        ],
      };

      if (params.title) body.title = params.title;
      if (params.ends_on) body.ends_on = params.ends_on;
      if (params.note) body.note = params.note;

      const result = await client.request<{ data: { id: string; type: string } }>({
        endpoint: "subscriptions.create",
        body,
      });

      return respond(JSON.stringify(result, null, 2));
    }
  );

  // ── Update Subscription ──────────────────────────────────────────────────
  server.tool(
    "teamleader_update_subscription",
    "Update an existing subscription. Only provided fields are updated. Lookup IDs: teamleader_list_tax_rates (tax_rate_id), teamleader_list_payment_terms (payment_term types).",
    {
      id: z.string().describe("The subscription ID to update"),
      title: z.string().optional().describe("Subscription title"),
      customer_type: z.enum(["contact", "company"]).optional().describe("Customer type"),
      customer_id: z.string().optional().describe("Customer ID"),
      starts_on: z.string().optional().describe("Start date (YYYY-MM-DD)"),
      ends_on: z.string().optional().describe("End date (YYYY-MM-DD)"),
      billing_unit: z
        .enum(["week", "month", "year"])
        .optional()
        .describe("Billing period unit: 'week', 'month', or 'year'"),
      billing_period: z.number().optional().describe("Number of units per billing cycle"),
      days_in_advance: z.number().optional().describe("Days in advance to create the invoice"),
      payment_term_type: z.string().optional().describe("Payment term type"),
      payment_term_days: z.number().optional().describe("Payment term days"),
      note: z.string().optional().describe("Note on the subscription"),
      line_items: z
        .array(
          z.object({
            quantity: z.number().describe("Quantity"),
            description: z.string().describe("Line item description"),
            unit_price_amount: z.number().describe("Unit price (tax exclusive)"),
            unit_price_currency: z.string().describe("Currency code (e.g. 'EUR')"),
            tax_rate_id: z.string().describe("Tax rate ID"),
            product_id: z.string().optional().describe("Product ID"),
          })
        )
        .optional()
        .describe("Replace all line items"),
    },
    async (params) => {
      const body: Record<string, unknown> = { id: params.id };

      if (params.title) body.title = params.title;
      if (params.customer_type && params.customer_id) {
        body.invoicee = {
          customer: { type: params.customer_type, id: params.customer_id },
        };
      }
      if (params.starts_on) body.starts_on = params.starts_on;
      if (params.ends_on !== undefined) body.ends_on = params.ends_on;
      if (params.billing_unit || params.billing_period !== undefined || params.days_in_advance !== undefined) {
        body.billing_cycle = {
          ...(params.billing_unit && params.billing_period !== undefined && {
            periodicity: { unit: params.billing_unit, period: params.billing_period },
          }),
          ...(params.days_in_advance !== undefined && { days_in_advance: params.days_in_advance }),
        };
      }
      if (params.payment_term_type) {
        body.payment_term = {
          type: params.payment_term_type,
          ...(params.payment_term_days !== undefined && { days: params.payment_term_days }),
        };
      }
      if (params.note !== undefined) body.note = params.note;
      if (params.line_items) {
        body.grouped_lines = [
          {
            line_items: params.line_items.map((item) => ({
              quantity: item.quantity,
              description: item.description,
              unit_price: { amount: item.unit_price_amount, currency: item.unit_price_currency },
              tax_rate_id: item.tax_rate_id,
              ...(item.product_id && { product_id: item.product_id }),
            })),
          },
        ];
      }

      await client.request<void>({ endpoint: "subscriptions.update", body });
      return respond(`Subscription ${params.id} updated.`);
    }
  );

  // ── Deactivate Subscription ──────────────────────────────────────────────
  server.tool(
    "teamleader_deactivate_subscription",
    "Deactivate an active subscription. This stops future invoice generation. The subscription remains visible with status 'deactivated'.",
    {
      id: z.string().describe("The subscription ID to deactivate"),
    },
    async (params) => {
      await client.request<void>({
        endpoint: "subscriptions.deactivate",
        body: { id: params.id },
      });
      return respond(`Subscription ${params.id} deactivated.`);
    }
  );
}
