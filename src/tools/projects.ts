/**
 * Teamleader Projects-v2 Tools
 * 
 * Based on tailormade-eu/teamleader-focus-csv-importer C# implementation
 * Supports: Projects, ProjectGroups (Phases), and integration with Tasks
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import type { TeamleaderClient } from "../api/client.js";
import type {
  Project,
  ProjectGroup,
  ProjectLine,
  TeamleaderListResponse,
} from "../types/index.js";

export function registerProjectTools(
  server: McpServer,
  client: TeamleaderClient
): void {
  // ── List Projects (v2) ──────────────────────────────────────────────────
  server.tool(
    "teamleader_list_projects_v2",
    "List projects using projects-v2 API with optional filtering and pagination",
    {
      page: z.number().optional().describe("Page number (default: 1)"),
      page_size: z.number().optional().describe("Page size (default: 20, max: 100)"),
      term: z.string().optional().describe("Search term to filter projects"),
      status: z
        .enum(["active", "on_hold", "done", "cancelled"])
        .optional()
        .describe("Filter by project status"),
      company_id: z
        .string()
        .optional()
        .describe("Filter by company (customer) ID"),
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
      if (params.status) filter.status = params.status;
      if (params.company_id) {
        filter.customers = [
          { type: "company", id: params.company_id }
        ];
      }
      if (Object.keys(filter).length > 0) body.filter = filter;

      const result = await client.request<TeamleaderListResponse<Project>>({
        endpoint: "projects-v2/projects.list",
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

  // ── Get Project (v2) ─────────────────────────────────────────────────────
  server.tool(
    "teamleader_get_project_v2",
    "Get details of a specific project using projects-v2 API",
    {
      id: z.string().describe("Project ID"),
    },
    async (params) => {
      const result = await client.request<{ data: Project }>({
        endpoint: "projects-v2/projects.info",
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

  // ── Create Project (v2) ──────────────────────────────────────────────────
  server.tool(
    "teamleader_create_project_v2",
    "Create a new project using projects-v2 API",
    {
      title: z.string().describe("Project title"),
      description: z.string().optional().describe("Project description"),
      status: z
        .enum(["active", "on_hold", "done", "cancelled"])
        .default("active")
        .describe("Project status"),
      customer_type: z
        .enum(["company", "contact"])
        .describe("Customer type (company or contact)"),
      customer_id: z
        .string()
        .describe("Customer ID (company or contact)"),
      responsible_user_id: z
        .string()
        .optional()
        .describe("ID of responsible user"),
      starts_on: z
        .string()
        .optional()
        .describe("Project start date (YYYY-MM-DD)"),
      due_on: z
        .string()
        .optional()
        .describe("Project due date (YYYY-MM-DD)"),
    },
    async (params) => {
      const body: Record<string, unknown> = {
        title: params.title,
        status: params.status,
        customers: [
          {
            type: params.customer_type,
            id: params.customer_id,
          },
        ],
      };

      if (params.description) body.description = params.description;
      if (params.responsible_user_id) body.responsible_user_id = params.responsible_user_id;
      if (params.starts_on) body.starts_on = params.starts_on;
      if (params.due_on) body.due_on = params.due_on;

      const result = await client.request<{ data: { id: string; type: string } }>({
        endpoint: "projects-v2/projects.create",
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

  // ── Update Project (v2) ──────────────────────────────────────────────────
  server.tool(
    "teamleader_update_project_v2",
    "Update an existing project using projects-v2 API",
    {
      id: z.string().describe("Project ID"),
      title: z.string().optional().describe("New project title"),
      description: z.string().optional().describe("New description"),
      status: z
        .enum(["active", "on_hold", "done", "cancelled"])
        .optional()
        .describe("New project status"),
      responsible_user_id: z
        .string()
        .optional()
        .describe("New responsible user ID"),
      starts_on: z.string().optional().describe("New start date (YYYY-MM-DD)"),
      due_on: z.string().optional().describe("New due date (YYYY-MM-DD)"),
    },
    async (params) => {
      const body: Record<string, unknown> = {
        id: params.id,
      };

      if (params.title) body.title = params.title;
      if (params.description) body.description = params.description;
      if (params.status) body.status = params.status;
      if (params.responsible_user_id) body.responsible_user_id = params.responsible_user_id;
      if (params.starts_on) body.starts_on = params.starts_on;
      if (params.due_on) body.due_on = params.due_on;

      const result = await client.request<{ data: { id: string; type: string } }>({
        endpoint: "projects-v2/projects.update",
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

  // ── List Project Groups (Phases) ─────────────────────────────────────────
  server.tool(
    "teamleader_list_project_groups",
    "List project groups (phases/milestones) for a specific project",
    {
      project_id: z.string().describe("Project ID to list groups for"),
      page: z.number().optional().describe("Page number (default: 1)"),
      page_size: z.number().optional().describe("Page size (default: 20, max: 100)"),
    },
    async (params) => {
      const body: Record<string, unknown> = {
        project_id: params.project_id,
        filter: {
          types: ["nextgenProjectGroup"], // Only project groups (phases)
        },
      };

      if (params.page || params.page_size) {
        body.page = {
          number: params.page ?? 1,
          size: params.page_size ?? 20,
        };
      }

      const result = await client.request<TeamleaderListResponse<ProjectGroup>>({
        endpoint: "projects-v2/projectLines.list",
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

  // ── List Project Tasks (v2) ──────────────────────────────────────────────
  server.tool(
    "teamleader_list_project_tasks_v2",
    "List tasks for a specific project or project group (phase) using projects-v2 API",
    {
      project_id: z.string().describe("Project ID to list tasks for"),
      project_group_id: z
        .string()
        .optional()
        .describe("Optional: filter tasks by specific project group (phase)"),
      only_open: z
        .boolean()
        .default(false)
        .describe("Only return open tasks (to_do, in_progress, on_hold)"),
      page: z.number().optional().describe("Page number (default: 1)"),
      page_size: z.number().optional().describe("Page size (default: 20, max: 100)"),
    },
    async (params) => {
      const body: Record<string, unknown> = {
        project_id: params.project_id,
        filter: {
          types: ["nextgenTask"], // Only tasks, not groups/milestones
        },
      };

      if (params.page || params.page_size) {
        body.page = {
          number: params.page ?? 1,
          size: params.page_size ?? 20,
        };
      }

      const result = await client.request<TeamleaderListResponse<ProjectLine>>({
        endpoint: "projects-v2/projectLines.list",
        body,
      });

      // Client-side filtering for project_group_id and only_open
      // (API doesn't support these as server-side filters in projectLines.list)
      let filtered = result.data || [];

      if (params.project_group_id) {
        filtered = filtered.filter(
          (item: any) => item.project_group?.id === params.project_group_id
        );
      }

      if (params.only_open) {
        const openStatuses = new Set(["to_do", "in_progress", "on_hold"]);
        filtered = filtered.filter(
          (item: any) => item.status && openStatuses.has(item.status)
        );
      }

      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify({ data: filtered, meta: result.meta }, null, 2),
          },
        ],
      };
    }
  );

  // ── Create Project Group (Phase) ─────────────────────────────────────────
  server.tool(
    "teamleader_create_project_group",
    "Create a new project group (phase/milestone) within a project",
    {
      project_id: z.string().describe("Parent project ID"),
      title: z.string().describe("Group/phase title"),
      description: z.string().optional().describe("Group/phase description"),
      starts_on: z
        .string()
        .optional()
        .describe("Start date (YYYY-MM-DD)"),
      due_on: z
        .string()
        .optional()
        .describe("Due date (YYYY-MM-DD)"),
    },
    async (params) => {
      const body: Record<string, unknown> = {
        project_id: params.project_id,
        title: params.title,
      };

      if (params.description) body.description = params.description;
      if (params.starts_on) body.start_date = params.starts_on;
      if (params.due_on) body.end_date = params.due_on;

      const result = await client.request<{ data: { id: string; type: string } }>({
        endpoint: "projects-v2/projectGroups.create",
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

  // ── Create Project Task (v2) ─────────────────────────────────────────────
  server.tool(
    "teamleader_create_project_task_v2",
    "Create a new task within a project or project group (phase) using projects-v2 API",
    {
      project_id: z.string().describe("Parent project ID"),
      project_group_id: z
        .string()
        .optional()
        .describe("Optional: parent project group (phase) ID"),
      title: z.string().describe("Task title"),
      description: z.string().optional().describe("Task description"),
      assignee_id: z
        .string()
        .optional()
        .describe("Assignee user ID"),
      work_type_id: z
        .string()
        .optional()
        .describe("Work type ID"),
      estimated_duration: z
        .number()
        .optional()
        .describe("Estimated duration in seconds"),
      due_on: z
        .string()
        .optional()
        .describe("Due date (YYYY-MM-DD)"),
    },
    async (params) => {
      const body: Record<string, unknown> = {
        project_id: params.project_id,
        title: params.title,
      };

      if (params.project_group_id) body.group_id = params.project_group_id;
      if (params.description) body.description = params.description;
      if (params.assignee_id) body.assignees = [{ type: "user", id: params.assignee_id }];
      if (params.work_type_id) body.work_type_id = params.work_type_id;
      if (params.estimated_duration) body.estimated_duration = params.estimated_duration;
      if (params.due_on) body.due_on = params.due_on;

      const result = await client.request<{ data: { id: string; type: string } }>({
        endpoint: "projects-v2/tasks.create",
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
