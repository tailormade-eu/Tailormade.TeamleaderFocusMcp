/**
 * Teamleader Time Tracking Tools
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import type { TeamleaderClient } from "../api/client.js";
import type {
  TimeTracking,
  TeamleaderListResponse,
} from "../types/index.js";

export function registerTimeTrackingTools(
  server: McpServer,
  client: TeamleaderClient
): void {
  // ── List Time Tracking ───────────────────────────────────────────────────
  server.tool(
    "teamleader_list_timetracking",
    "List time tracking entries from Teamleader Focus with optional filtering and pagination",
    {
      page: z.number().optional().describe("Page number (default: 1)"),
      page_size: z.number().optional().describe("Page size (default: 20, max: 100)"),
      user_id: z.string().optional().describe("Filter by user ID"),
      started_after: z
        .string()
        .optional()
        .describe("Filter entries started after this date (YYYY-MM-DD or ISO 8601 datetime)"),
      started_before: z
        .string()
        .optional()
        .describe("Filter entries started before this date (YYYY-MM-DD or ISO 8601 datetime)"),
      subject_type: z
        .enum(["nextgenTask", "todo", "project", "milestone", "ticket"])
        .optional()
        .describe("Filter by subject type (nextgenTask for project tasks)"),
      subject_id: z
        .string()
        .optional()
        .describe("Filter by subject ID"),
    },
    async (params) => {
      const body: Record<string, unknown> = {};

      if (params.page || params.page_size) {
        body.page = {
          number: params.page ?? 1,
          size: params.page_size ?? 20,
        };
      }

      const toDatetime = (s: string) =>
        /^\d{4}-\d{2}-\d{2}$/.test(s) ? `${s}T00:00:00+00:00` : s;

      const filter: Record<string, unknown> = {};
      if (params.user_id) filter.user_id = params.user_id;
      if (params.started_after) filter.started_after = toDatetime(params.started_after);
      if (params.started_before) filter.started_before = toDatetime(params.started_before);
      if (params.subject_type && params.subject_id) {
        filter.subject = {
          type: params.subject_type,
          id: params.subject_id,
        };
      }
      if (Object.keys(filter).length > 0) body.filter = filter;

      const result = await client.request<TeamleaderListResponse<TimeTracking>>({
        endpoint: "timeTracking.list",
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

  // ── Get Time Tracking ────────────────────────────────────────────────────
  server.tool(
    "teamleader_get_timetracking",
    "Get details of a specific time tracking entry by ID",
    {
      id: z.string().describe("Time tracking entry ID"),
    },
    async (params) => {
      const result = await client.request<{ data: TimeTracking }>({
        endpoint: "timeTracking.info",
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

  // ── Add Time Tracking ────────────────────────────────────────────────────
  server.tool(
    "teamleader_add_timetracking",
    "Add a new time tracking entry for work performed on a project, milestone, or ticket",
    {
      user_id: z.string().describe("ID of user who performed the work"),
      work_type_id: z
        .string()
        .describe("Type of work performed (get IDs from workTypes.list)"),
      started_on: z
        .string()
        .describe("Start datetime in ISO 8601 format (e.g., 2024-01-15T09:00:00+01:00)"),
      ended_on: z
        .string()
        .optional()
        .describe("End datetime in ISO 8601 format (e.g., 2024-01-15T10:00:00+01:00)"),
      subject_type: z
        .enum(["nextgenTask", "todo", "project", "milestone", "ticket"])
        .describe("What the time was tracked against (use nextgenTask for project tasks)"),
      subject_id: z
        .string()
        .describe("ID of the project/milestone/ticket"),
      description: z
        .string()
        .optional()
        .describe("Description of work performed"),
    },
    async (params) => {
      const body: Record<string, unknown> = {
        user_id: params.user_id,
        work_type_id: params.work_type_id,
        started_at: params.started_on,
        subject: {
          type: params.subject_type,
          id: params.subject_id,
        },
      };

      if (params.ended_on) body.ended_at = params.ended_on;
      if (params.description) body.description = params.description;

      const result = await client.request<{ data: { id: string; type: string } }>({
        endpoint: "timeTracking.add",
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

  // ── Update Time Tracking ─────────────────────────────────────────────────
  server.tool(
    "teamleader_update_timetracking",
    "Update an existing time tracking entry",
    {
      id: z.string().describe("Time tracking entry ID"),
      work_type_id: z
        .string()
        .optional()
        .describe("Type of work performed"),
      started_on: z
        .string()
        .optional()
        .describe("Start datetime in ISO 8601 format"),
      ended_on: z
        .string()
        .optional()
        .describe("End datetime in ISO 8601 format"),
      description: z
        .string()
        .optional()
        .describe("Description of work performed"),
    },
    async (params) => {
      const body: Record<string, unknown> = {
        id: params.id,
      };

      if (params.work_type_id) body.work_type_id = params.work_type_id;
      if (params.started_on) body.started_at = params.started_on;
      if (params.ended_on) body.ended_at = params.ended_on;
      if (params.description) body.description = params.description;

      const result = await client.request<{ data: { id: string; type: string } }>({
        endpoint: "timeTracking.update",
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

  // ── Delete Time Tracking ─────────────────────────────────────────────────
  server.tool(
    "teamleader_delete_timetracking",
    "Delete a time tracking entry",
    {
      id: z.string().describe("Time tracking entry ID to delete"),
    },
    async (params) => {
      await client.request({
        endpoint: "timeTracking.delete",
        body: { id: params.id },
      });

      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify({ success: true, id: params.id }, null, 2),
          },
        ],
      };
    }
  );

  // ── Start Timer ──────────────────────────────────────────────────────────
  server.tool(
    "teamleader_start_timer",
    "Start a running timer for time tracking (creates ongoing entry)",
    {
      user_id: z.string().describe("ID of user who will perform the work"),
      work_type_id: z
        .string()
        .describe("Type of work to be performed"),
      subject_type: z
        .enum(["nextgenTask", "todo", "project", "milestone", "ticket"])
        .describe("What the time will be tracked against (use nextgenTask for project tasks)"),
      subject_id: z
        .string()
        .describe("ID of the project/milestone/ticket"),
      description: z
        .string()
        .optional()
        .describe("Description of work to be performed"),
    },
    async (params) => {
      const body: Record<string, unknown> = {
        user_id: params.user_id,
        work_type_id: params.work_type_id,
        subject: {
          type: params.subject_type,
          id: params.subject_id,
        },
      };

      if (params.description) body.description = params.description;

      const result = await client.request<{ data: { id: string; type: string } }>({
        endpoint: "timers.start",
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

  // ── Stop Timer ───────────────────────────────────────────────────────────
  server.tool(
    "teamleader_stop_timer",
    "Stop a running timer (completes the time tracking entry)",
    {
      id: z.string().describe("Time tracking entry ID to stop"),
    },
    async (params) => {
      const result = await client.request<{ data: { id: string; type: string } }>({
        endpoint: "timers.stop",
        body: {},
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

  // ── Get Current Timer ──────────────────────────────────────────────────
  server.tool(
    "teamleader_get_current_timer",
    "Get the currently running timer for the authenticated user. Returns timer details (subject, work type, started_at) or indicates no timer is running. Only one timer can run per user at a time.",
    {},
    async () => {
      const result = await client.request({
        endpoint: "timers.current",
        body: {},
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

  // ── Update Timer ───────────────────────────────────────────────────────
  server.tool(
    "teamleader_update_timer",
    "Update the currently running timer. Only possible if a timer is running. Use this to change the subject, work type, description, or start time of the active timer.",
    {
      work_type_id: z.string().optional().describe("New work type ID"),
      started_at: z
        .string()
        .optional()
        .describe("New start datetime in ISO 8601 format (e.g., 2024-01-15T09:00:00+01:00)"),
      description: z.string().optional().describe("New description for the timer"),
      subject_type: z
        .enum(["company", "contact", "event", "todo", "milestone", "ticket"])
        .optional()
        .describe("Subject type to track time against"),
      subject_id: z.string().optional().describe("Subject ID to track time against"),
      invoiceable: z.boolean().optional().describe("Whether the tracked time is invoiceable"),
    },
    async (params) => {
      const body: Record<string, unknown> = {};

      if (params.work_type_id) body.work_type_id = params.work_type_id;
      if (params.started_at) body.started_at = params.started_at;
      if (params.description !== undefined) body.description = params.description;
      if (params.invoiceable !== undefined) body.invoiceable = params.invoiceable;
      if (params.subject_type && params.subject_id) {
        body.subject = {
          type: params.subject_type,
          id: params.subject_id,
        };
      }

      await client.request({
        endpoint: "timers.update",
        body,
      });

      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify({ success: true, message: "Timer updated" }, null, 2),
          },
        ],
      };
    }
  );

  // ── Resume Time Tracking ───────────────────────────────────────────────
  server.tool(
    "teamleader_resume_timetracking",
    "Start a new timer based on a previously tracked time entry. Copies the subject and work type from the existing entry. Only one timer can run per user — any running timer will be stopped first.",
    {
      id: z.string().describe("ID of the existing time tracking entry to resume from"),
      started_at: z
        .string()
        .optional()
        .describe("Start datetime in ISO 8601 format. If not provided, current time is used."),
    },
    async (params) => {
      const body: Record<string, unknown> = { id: params.id };
      if (params.started_at) body.started_at = params.started_at;

      const result = await client.request<{ data: { id: string; type: string } }>({
        endpoint: "timeTracking.resume",
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
}
