/**
 * Teamleader Notes Tools
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import type { TeamleaderClient } from "../api/client.js";
import { respond } from "./helpers.js";

const SUBJECT_TYPES = [
  "company",
  "contact",
  "creditNote",
  "deal",
  "invoice",
  "nextgenProject",
  "product",
  "project",
  "quotation",
  "subscription",
] as const;

const CREATE_SUBJECT_TYPES = [
  "company",
  "contact",
  "creditNote",
  "deal",
  "invoice",
  "nextgenProject",
  "product",
  "quotation",
  "subscription",
] as const;

export function registerNoteTools(
  server: McpServer,
  client: TeamleaderClient
): void {
  // ── List Notes ──────────────────────────────────────────────────────────
  server.tool(
    "teamleader_list_notes",
    "List notes attached to a Teamleader entity (contact, company, deal, project). Returns note content, creator, and timestamps. Next step: teamleader_update_note to edit a note.",
    {
      subject_type: z
        .enum(SUBJECT_TYPES)
        .describe("Type of entity to list notes for ('company' | 'contact' | 'creditNote' | 'deal' | 'invoice' | 'nextgenProject' | 'product' | 'project' | 'quotation' | 'subscription')"),
      subject_id: z.string().describe("ID of the entity. Use teamleader_list_companies / teamleader_list_contacts / teamleader_list_deals etc. to find valid IDs."),
      page: z.number().optional().describe("Page number (default: 1)"),
      page_size: z
        .number()
        .optional()
        .describe("Page size (default: 20)"),
    },
    async (params) => {
      const body: Record<string, unknown> = {
        filter: {
          subject: {
            type: params.subject_type,
            id: params.subject_id,
          },
        },
      };

      if (params.page || params.page_size) {
        body.page = {
          number: params.page ?? 1,
          size: params.page_size ?? 20,
        };
      }

      const result = await client.request<{
        data: Array<{
          id: string;
          content: string;
          subject: { type: string; id: string };
          created_at: string;
          updated_at: string;
          creator?: { type: string; id: string };
        }>;
      }>({
        endpoint: "notes.list",
        body,
      });

      if (!result.data || result.data.length === 0) {
        return respond(
          `No notes found for ${params.subject_type} ${params.subject_id}.`
        );
      }

      const lines = result.data.map((n, i) => {
        const preview =
          n.content.length > 120
            ? n.content.substring(0, 120) + "…"
            : n.content;
        const date = n.created_at.substring(0, 10);
        return `${i + 1}. [${date}] ${preview}\n   ID: ${n.id}`;
      });

      return respond(
        `${result.data.length} note(s) for ${params.subject_type} ${params.subject_id}:\n\n${lines.join("\n\n")}`
      );
    }
  );

  // ── Create Note ─────────────────────────────────────────────────────────
  server.tool(
    "teamleader_create_note",
    "Create a new note on a Teamleader entity (contact, company, deal, invoice, quotation, etc.). Notes are free-text content attached to the entity. Returns note ID. Next steps: teamleader_list_notes to verify. <WARNING>Not idempotent: calling twice creates two resources.</WARNING>",
    {
      subject_type: z
        .enum(CREATE_SUBJECT_TYPES)
        .describe("Type of entity to attach the note to ('company' | 'contact' | 'creditNote' | 'deal' | 'invoice' | 'nextgenProject' | 'product' | 'quotation' | 'subscription')"),
      subject_id: z.string().describe("ID of the entity. Use teamleader_list_companies / teamleader_list_contacts / teamleader_list_deals / teamleader_list_invoices etc. depending on subject_type."),
      content: z.string().describe("Note content (free text)"),
    },
    async (params) => {
      const result = await client.request<{
        data: { id: string; type: string };
      }>({
        endpoint: "notes.create",
        body: {
          subject: {
            type: params.subject_type,
            id: params.subject_id,
          },
          content: params.content,
        },
      });

      return respond(
        `Note created on ${params.subject_type} ${params.subject_id} (note ID: ${result.data.id}).`
      );
    }
  );

  // ── Update Note ─────────────────────────────────────────────────────────
  server.tool(
    "teamleader_update_note",
    "Update the content of an existing note in Teamleader Focus. Returns {success: true} on success. Next steps: teamleader_list_notes to verify. <NOTE>Idempotent</NOTE>",
    {
      id: z.string().describe("The note ID to update. Use teamleader_list_notes to find valid IDs."),
      content: z.string().describe("New note content (replaces existing)"),
    },
    async (params) => {
      await client.request({
        endpoint: "notes.update",
        body: {
          id: params.id,
          content: params.content,
        },
      });

      return respond(`Note ${params.id} updated.`);
    }
  );
}
