/**
 * Teamleader Deals Tools
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import type { TeamleaderClient } from "../api/client.js";
import type {
  Deal,
  TeamleaderListResponse,
  TeamleaderInfoResponse,
} from "../types/index.js";

function respond(text: string) {
  return { content: [{ type: "text" as const, text }] };
}

export function registerDealTools(
  server: McpServer,
  client: TeamleaderClient
): void {
  // ── List Deals ───────────────────────────────────────────────────────────
  server.tool(
    "teamleader_list_deals",
    "List deals/opportunities from Teamleader Focus with optional filtering and pagination",
    {
      page: z.number().optional().describe("Page number (default: 1)"),
      page_size: z.number().optional().describe("Page size (default: 20, max: 100)"),
      term: z.string().optional().describe("Search term to filter deals"),
      phase_id: z.string().optional().describe("Filter by deal phase ID"),
      responsible_user_id: z.string().optional().describe("Filter by responsible user ID"),
      updated_since: z
        .string()
        .optional()
        .describe("ISO 8601 date - only deals updated after this date"),
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
      if (params.term) filter.term = params.term;
      if (params.phase_id) filter.phase_id = params.phase_id;
      if (params.responsible_user_id)
        filter.responsible_user_id = params.responsible_user_id;
      if (params.updated_since) filter.updated_since = params.updated_since;
      if (Object.keys(filter).length > 0) body.filter = filter;

      const result = await client.request<TeamleaderListResponse<Deal>>({
        endpoint: "deals.list",
        body,
      });

      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(result, null, 2),
          },
        ],
      };
    }
  );

  // ── Get Deal ─────────────────────────────────────────────────────────────
  server.tool(
    "teamleader_get_deal",
    "Get detailed information about a specific deal",
    {
      id: z.string().describe("The deal ID"),
    },
    async (params) => {
      const result = await client.request<TeamleaderInfoResponse<Deal>>({
        endpoint: "deals.info",
        body: { id: params.id },
      });

      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(result, null, 2),
          },
        ],
      };
    }
  );

  // ── Create Deal ──────────────────────────────────────────────────────────
  server.tool(
    "teamleader_create_deal",
    "Create a new deal/opportunity in Teamleader Focus",
    {
      title: z.string().describe("Deal title"),
      customer_type: z.enum(["contact", "company"]).describe("Customer type"),
      customer_id: z.string().describe("Customer ID (contact or company)"),
      phase_id: z.string().describe("Deal phase ID"),
      estimated_value_amount: z.number().optional().describe("Estimated value amount"),
      estimated_value_currency: z
        .string()
        .optional()
        .describe("Currency code (e.g. 'EUR', 'USD')"),
      estimated_closing_date: z
        .string()
        .optional()
        .describe("Estimated closing date (YYYY-MM-DD)"),
      estimated_probability: z
        .number()
        .optional()
        .describe("Estimated probability (0-1)"),
      responsible_user_id: z
        .string()
        .optional()
        .describe("Responsible user ID"),
      department_id: z.string().optional().describe("Department ID"),
      source_id: z.string().optional().describe("Source ID"),
    },
    async (params) => {
      const body: Record<string, unknown> = {
        title: params.title,
        lead: {
          customer: {
            type: params.customer_type,
            id: params.customer_id,
          },
        },
        phase_id: params.phase_id,
      };

      if (
        params.estimated_value_amount !== undefined &&
        params.estimated_value_currency
      ) {
        body.estimated_value = {
          amount: params.estimated_value_amount,
          currency: params.estimated_value_currency,
        };
      }

      if (params.estimated_closing_date)
        body.estimated_closing_date = params.estimated_closing_date;
      if (params.estimated_probability !== undefined)
        body.estimated_probability = params.estimated_probability;
      if (params.responsible_user_id)
        body.responsible_user_id = params.responsible_user_id;
      if (params.department_id) body.department_id = params.department_id;
      if (params.source_id) body.source_id = params.source_id;

      const result = await client.request<
        TeamleaderInfoResponse<{ id: string; type: string }>
      >({
        endpoint: "deals.create",
        body,
      });

      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(result, null, 2),
          },
        ],
      };
    }
  );

  // ── Update Deal ──────────────────────────────────────────────────────────
  server.tool(
    "teamleader_update_deal",
    "Update an existing deal in Teamleader Focus",
    {
      id: z.string().describe("The deal ID to update"),
      title: z.string().optional().describe("Deal title"),
      estimated_value_amount: z.number().optional().describe("Estimated value amount"),
      estimated_value_currency: z
        .string()
        .optional()
        .describe("Currency code (e.g. 'EUR', 'USD')"),
      estimated_closing_date: z
        .string()
        .optional()
        .describe("Estimated closing date (YYYY-MM-DD)"),
      estimated_probability: z
        .number()
        .optional()
        .describe("Estimated probability (0-1)"),
      responsible_user_id: z
        .string()
        .optional()
        .describe("Responsible user ID"),
    },
    async (params) => {
      const body: Record<string, unknown> = { id: params.id };

      if (params.title) body.title = params.title;
      if (
        params.estimated_value_amount !== undefined &&
        params.estimated_value_currency
      ) {
        body.estimated_value = {
          amount: params.estimated_value_amount,
          currency: params.estimated_value_currency,
        };
      }
      if (params.estimated_closing_date)
        body.estimated_closing_date = params.estimated_closing_date;
      if (params.estimated_probability !== undefined)
        body.estimated_probability = params.estimated_probability;
      if (params.responsible_user_id)
        body.responsible_user_id = params.responsible_user_id;

      await client.request({
        endpoint: "deals.update",
        body,
      });

      return respond(`Deal ${params.id} updated.`);
    }
  );

  // ── Delete Deal ─────────────────────────────────────────────────────────
  server.tool(
    "teamleader_delete_deal",
    "Delete a deal from Teamleader Focus. This action is irreversible.",
    {
      id: z.string().describe("The deal ID to delete"),
    },
    async (params) => {
      await client.request<void>({
        endpoint: "deals.delete",
        body: { id: params.id },
      });
      return respond(`Deal ${params.id} deleted.`);
    }
  );

  // ── Lose Deal ───────────────────────────────────────────────────────────
  server.tool(
    "teamleader_lose_deal",
    "Mark a deal as lost. Use teamleader_list_lost_reasons to get available reason IDs.",
    {
      id: z.string().describe("The deal ID to mark as lost"),
      reason_id: z.string().optional().describe("Lost reason ID (use teamleader_list_lost_reasons to find IDs)"),
      extra_info: z.string().optional().describe("Additional info about why the deal was lost"),
    },
    async (params) => {
      const body: Record<string, unknown> = { id: params.id };
      if (params.reason_id) body.reason_id = params.reason_id;
      if (params.extra_info) body.extra_info = params.extra_info;

      await client.request<void>({
        endpoint: "deals.lose",
        body,
      });
      return respond(`Deal ${params.id} marked as lost.`);
    }
  );

  // ── Win Deal ────────────────────────────────────────────────────────────
  server.tool(
    "teamleader_win_deal",
    "Mark a deal as won.",
    {
      id: z.string().describe("The deal ID to mark as won"),
    },
    async (params) => {
      await client.request<void>({
        endpoint: "deals.win",
        body: { id: params.id },
      });
      return respond(`Deal ${params.id} marked as won.`);
    }
  );

  // ── Move Deal ───────────────────────────────────────────────────────────
  server.tool(
    "teamleader_move_deal",
    "Move a deal to a different phase in its pipeline. Use teamleader_list_deal_phases to get available phase IDs.",
    {
      id: z.string().describe("The deal ID to move"),
      phase_id: z.string().describe("Target phase ID (use teamleader_list_deal_phases to find IDs)"),
    },
    async (params) => {
      await client.request<void>({
        endpoint: "deals.move",
        body: { id: params.id, phase_id: params.phase_id },
      });
      return respond(`Deal ${params.id} moved to phase ${params.phase_id}.`);
    }
  );

  // ── List Lost Reasons ──────────────────────────────────────────────────
  server.tool(
    "teamleader_list_lost_reasons",
    "List available lost reasons for deals. Use the returned IDs with teamleader_lose_deal.",
    {},
    async () => {
      const result = await client.request<TeamleaderListResponse<{ id: string; name: string }>>({
        endpoint: "lostReasons.list",
        body: { page: { size: 100, number: 1 } },
      });

      const reasons = result.data ?? [];
      if (reasons.length === 0) return respond("No lost reasons found.");

      const lines = reasons.map((r, i) => `${i + 1}. ${r.name} (${r.id})`);
      return respond(`Lost reasons:\n${lines.join("\n")}`);
    }
  );

  // ── List Deal Phases ───────────────────────────────────────────────────
  server.tool(
    "teamleader_list_deal_phases",
    "List deal phases for a pipeline. Use the returned IDs with teamleader_move_deal or teamleader_create_deal.",
    {
      pipeline_id: z.string().optional().describe("Pipeline ID to filter phases (omit for all pipelines)"),
    },
    async (params) => {
      const body: Record<string, unknown> = { page: { size: 100, number: 1 } };
      if (params.pipeline_id) {
        body.filter = { pipeline_id: params.pipeline_id };
      }

      const result = await client.request<TeamleaderListResponse<{ id: string; name: string; pipeline: { type: string; id: string } }>>({
        endpoint: "dealPhases.list",
        body,
      });

      const phases = result.data ?? [];
      if (phases.length === 0) return respond("No deal phases found.");

      const lines = phases.map((p, i) => `${i + 1}. ${p.name} — pipeline: ${p.pipeline?.id ?? "?"} (${p.id})`);
      return respond(`Deal phases:\n${lines.join("\n")}`);
    }
  );

  // ── List Deal Sources ──────────────────────────────────────────────────
  server.tool(
    "teamleader_list_deal_sources",
    "List available deal sources. Use the returned IDs when creating deals.",
    {},
    async () => {
      const result = await client.request<TeamleaderListResponse<{ id: string; name: string }>>({
        endpoint: "dealSources.list",
        body: { page: { size: 100, number: 1 } },
      });

      const sources = result.data ?? [];
      if (sources.length === 0) return respond("No deal sources found.");

      const lines = sources.map((s, i) => `${i + 1}. ${s.name} (${s.id})`);
      return respond(`Deal sources:\n${lines.join("\n")}`);
    }
  );

  // ── List Deal Pipelines ────────────────────────────────────────────────
  server.tool(
    "teamleader_list_deal_pipelines",
    "List all deal pipelines. Use the returned IDs with teamleader_list_deal_phases to see phases within a pipeline.",
    {},
    async () => {
      const result = await client.request<TeamleaderListResponse<{ id: string; name: string }>>({
        endpoint: "dealPipelines.list",
        body: { page: { size: 100, number: 1 } },
      });

      const pipelines = result.data ?? [];
      if (pipelines.length === 0) return respond("No deal pipelines found.");

      const lines = pipelines.map((p, i) => `${i + 1}. ${p.name} (${p.id})`);
      return respond(`Deal pipelines:\n${lines.join("\n")}`);
    }
  );
}
