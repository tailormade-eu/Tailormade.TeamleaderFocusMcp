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
    "List projects using projects-v2 API. Returns array of projects with id, title, status, customers, starts_on, due_on. Use to find project IDs for further operations. Next steps: teamleader_get_project_v2 for details, teamleader_list_project_groups for phases, teamleader_list_project_tasks_v2 for tasks.",
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
    "Get full details of a project including title, status, customers, owners, starts_on, due_on, description. Next steps: teamleader_list_project_groups for phases, teamleader_list_project_tasks_v2 for tasks, teamleader_add_project_customer to add customers.",
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
    "Create a new project. Returns {id, type}. Next steps: teamleader_create_project_group to add phases, teamleader_create_project_task_v2 to add tasks, teamleader_assign_project to assign users/teams.",
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
    "Update an existing project. Only provided fields are changed. Returns {id, type}.",
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
    "List project groups (phases) for a specific project. Returns array with id, title, start_date, end_date for each group. NOTE: internally uses projectLines.list with project_id at top level (NOT inside filter — API quirk). Next steps: teamleader_list_project_tasks_v2 with project_group_id to see tasks in a phase.",
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
    "List tasks for a project or project group (phase). Returns array with id, title, status, assignees, group, estimated_duration. NOTE: project_group_id and only_open are filtered client-side (API does not support these as server-side filters). For a full project tree with IDs, prefer teamleader_load_tasks.",
    {
      project_id: z.string().describe("Project ID to list tasks for"),
      project_group_id: z
        .string()
        .optional()
        .describe("Optional: filter tasks by group (phase) ID. NOTE: filtered client-side after API fetch, not server-side."),
      only_open: z
        .boolean()
        .default(false)
        .describe("Only return open tasks (to_do, in_progress, on_hold). NOTE: filtered client-side."),
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
    "Create a new project group (phase) within a project. Returns {id, type}. WARNING: the API uses 'start_date'/'end_date' internally (NOT 'starts_on'/'due_on') — this tool maps the params automatically. Next step: teamleader_create_project_task_v2 to add tasks to this group.",
    {
      project_id: z.string().describe("Parent project ID"),
      title: z.string().describe("Group/phase title"),
      description: z.string().optional().describe("Group/phase description"),
      starts_on: z
        .string()
        .optional()
        .describe("Start date (YYYY-MM-DD). Mapped to API field 'start_date' automatically."),
      due_on: z
        .string()
        .optional()
        .describe("Due/end date (YYYY-MM-DD). Mapped to API field 'end_date' automatically."),
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

  // ── Close Project (v2) ──────────────────────────────────────────────────
  server.tool(
    "teamleader_close_project_v2",
    "Close a project. CRITICAL: requires closing_strategy parameter — without it the API returns an error. Options: 'mark_tasks_and_materials_as_done' (marks all open tasks done) or 'none' (leaves tasks as-is). To reopen later: use teamleader_reopen_project_v2.",
    {
      id: z.string().describe("Project ID"),
      closing_strategy: z
        .enum(["mark_tasks_and_materials_as_done", "none"])
        .default("mark_tasks_and_materials_as_done")
        .describe("Strategy for open tasks: mark_tasks_and_materials_as_done or none"),
    },
    async (params) => {
      await client.request({
        endpoint: "projects-v2/projects.close",
        body: { id: params.id, closing_strategy: params.closing_strategy },
      });
      return {
        content: [{ type: "text" as const, text: `Project ${params.id} closed (strategy: ${params.closing_strategy}).` }],
      };
    }
  );

  // ── Reopen Project (v2) ────────────────────────────────────────────────
  server.tool(
    "teamleader_reopen_project_v2",
    "Reopen a previously closed project. Sets status back to active.",
    {
      id: z.string().describe("Project ID"),
    },
    async (params) => {
      await client.request({
        endpoint: "projects-v2/projects.reopen",
        body: { id: params.id },
      });
      return {
        content: [{ type: "text" as const, text: `Project ${params.id} reopened.` }],
      };
    }
  );

  // ── Delete Project (v2) ────────────────────────────────────────────────
  server.tool(
    "teamleader_delete_project_v2",
    "Delete a project. This action is irreversible. CRITICAL: requires delete_strategy — without it the API returns an error. Options: 'unlink_tasks_and_time_trackings' (keeps tasks/time), 'delete_tasks_and_time_trackings' (deletes all), 'delete_tasks_unlink_time_trackings'.",
    {
      id: z.string().describe("Project ID"),
      delete_strategy: z
        .enum(["unlink_tasks_and_time_trackings", "delete_tasks_and_time_trackings", "delete_tasks_unlink_time_trackings"])
        .default("unlink_tasks_and_time_trackings")
        .describe("Strategy: unlink_tasks_and_time_trackings, delete_tasks_and_time_trackings, or delete_tasks_unlink_time_trackings"),
    },
    async (params) => {
      await client.request({
        endpoint: "projects-v2/projects.delete",
        body: { id: params.id, delete_strategy: params.delete_strategy },
      });
      return {
        content: [{ type: "text" as const, text: `Project ${params.id} deleted (strategy: ${params.delete_strategy}).` }],
      };
    }
  );

  // ── Duplicate Project (v2) ─────────────────────────────────────────────
  server.tool(
    "teamleader_duplicate_project_v2",
    "Duplicate a project with a new title. Copies all groups, tasks, and structure. Returns {id, type} of the new project.",
    {
      id: z.string().describe("Source project ID to duplicate"),
      title: z.string().describe("Title for the duplicated project"),
    },
    async (params) => {
      const result = await client.request<{ data: { id: string; type: string } }>({
        endpoint: "projects-v2/projects.duplicate",
        body: { id: params.id, title: params.title },
      });
      return {
        content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }],
      };
    }
  );

  // ── Add Customer to Project ────────────────────────────────────────────
  server.tool(
    "teamleader_add_project_customer",
    "Add a customer (company or contact) to a project. NOTE: the API uses a nested {type, id} object for the customer — this tool handles that automatically.",
    {
      id: z.string().describe("Project ID"),
      customer_type: z.enum(["company", "contact"]).describe("Customer type"),
      customer_id: z.string().describe("Customer ID"),
    },
    async (params) => {
      await client.request({
        endpoint: "projects-v2/projects.addCustomer",
        body: { id: params.id, customer: { type: params.customer_type, id: params.customer_id } },
      });
      return {
        content: [{ type: "text" as const, text: `Customer ${params.customer_id} added to project ${params.id}.` }],
      };
    }
  );

  // ── Remove Customer from Project ───────────────────────────────────────
  server.tool(
    "teamleader_remove_project_customer",
    "Remove a customer (company or contact) from a project.",
    {
      id: z.string().describe("Project ID"),
      customer_type: z.enum(["company", "contact"]).describe("Customer type"),
      customer_id: z.string().describe("Customer ID"),
    },
    async (params) => {
      await client.request({
        endpoint: "projects-v2/projects.removeCustomer",
        body: { id: params.id, customer: { type: params.customer_type, id: params.customer_id } },
      });
      return {
        content: [{ type: "text" as const, text: `Customer ${params.customer_id} removed from project ${params.id}.` }],
      };
    }
  );

  // ── Add Deal to Project ────────────────────────────────────────────────
  server.tool(
    "teamleader_add_project_deal",
    "Link a deal to a project.",
    {
      id: z.string().describe("Project ID"),
      deal_id: z.string().describe("Deal ID to link"),
    },
    async (params) => {
      await client.request({
        endpoint: "projects-v2/projects.addDeal",
        body: { id: params.id, deal_id: params.deal_id },
      });
      return {
        content: [{ type: "text" as const, text: `Deal ${params.deal_id} linked to project ${params.id}.` }],
      };
    }
  );

  // ── Remove Deal from Project ───────────────────────────────────────────
  server.tool(
    "teamleader_remove_project_deal",
    "Remove a deal link from a project.",
    {
      id: z.string().describe("Project ID"),
      deal_id: z.string().describe("Deal ID to unlink"),
    },
    async (params) => {
      await client.request({
        endpoint: "projects-v2/projects.removeDeal",
        body: { id: params.id, deal_id: params.deal_id },
      });
      return {
        content: [{ type: "text" as const, text: `Deal ${params.deal_id} removed from project ${params.id}.` }],
      };
    }
  );

  // ── Add Owner to Project ───────────────────────────────────────────────
  server.tool(
    "teamleader_add_project_owner",
    "Add an owner (user) to a project.",
    {
      id: z.string().describe("Project ID"),
      user_id: z.string().describe("User ID to add as owner"),
    },
    async (params) => {
      await client.request({
        endpoint: "projects-v2/projects.addOwner",
        body: { id: params.id, user_id: params.user_id },
      });
      return {
        content: [{ type: "text" as const, text: `User ${params.user_id} added as owner of project ${params.id}.` }],
      };
    }
  );

  // ── Remove Owner from Project ──────────────────────────────────────────
  server.tool(
    "teamleader_remove_project_owner",
    "Remove an owner (user) from a project.",
    {
      id: z.string().describe("Project ID"),
      user_id: z.string().describe("User ID to remove as owner"),
    },
    async (params) => {
      await client.request({
        endpoint: "projects-v2/projects.removeOwner",
        body: { id: params.id, user_id: params.user_id },
      });
      return {
        content: [{ type: "text" as const, text: `User ${params.user_id} removed as owner of project ${params.id}.` }],
      };
    }
  );

  // ── Assign User/Team to Project ────────────────────────────────────────
  server.tool(
    "teamleader_assign_project",
    "Assign a user or team to a project. NOTE: the API uses a nested {type, id} object for the assignee — this tool handles that automatically. Use teamleader_list_users or teamleader_list_teams to find IDs.",
    {
      id: z.string().describe("Project ID"),
      assignee_type: z.enum(["user", "team"]).default("user").describe("Assignee type: user or team"),
      assignee_id: z.string().describe("User or team ID to assign"),
    },
    async (params) => {
      await client.request({
        endpoint: "projects-v2/projects.assign",
        body: { id: params.id, assignee: { type: params.assignee_type, id: params.assignee_id } },
      });
      return {
        content: [{ type: "text" as const, text: `${params.assignee_type} ${params.assignee_id} assigned to project ${params.id}.` }],
      };
    }
  );

  // ── Unassign User/Team from Project ────────────────────────────────────
  server.tool(
    "teamleader_unassign_project",
    "Unassign a user or team from a project.",
    {
      id: z.string().describe("Project ID"),
      assignee_type: z.enum(["user", "team"]).default("user").describe("Assignee type: user or team"),
      assignee_id: z.string().describe("User or team ID to unassign"),
    },
    async (params) => {
      await client.request({
        endpoint: "projects-v2/projects.unassign",
        body: { id: params.id, assignee: { type: params.assignee_type, id: params.assignee_id } },
      });
      return {
        content: [{ type: "text" as const, text: `${params.assignee_type} ${params.assignee_id} unassigned from project ${params.id}.` }],
      };
    }
  );

  // ── Update Project Group (Phase) ───────────────────────────────────────
  server.tool(
    "teamleader_update_project_group",
    "Update a project group (phase). All fields except id are optional. WARNING: API uses 'start_date'/'end_date' (NOT 'starts_on'/'due_on') — params are named correctly here.",
    {
      id: z.string().describe("Project group ID"),
      title: z.string().optional().describe("New group title"),
      description: z.string().optional().describe("New description"),
      start_date: z.string().optional().describe("Start date (YYYY-MM-DD). API field name is 'start_date' (NOT 'starts_on')."),
      end_date: z.string().optional().describe("End date (YYYY-MM-DD). API field name is 'end_date' (NOT 'due_on')."),
    },
    async (params) => {
      const body: Record<string, unknown> = { id: params.id };
      if (params.title) body.title = params.title;
      if (params.description) body.description = params.description;
      if (params.start_date) body.start_date = params.start_date;
      if (params.end_date) body.end_date = params.end_date;

      await client.request({
        endpoint: "projects-v2/projectGroups.update",
        body,
      });
      return {
        content: [{ type: "text" as const, text: `Project group ${params.id} updated.` }],
      };
    }
  );

  // ── Complete Project Task (v2) ─────────────────────────────────────────
  server.tool(
    "teamleader_complete_project_task",
    "Mark a project task as complete (sets status to 'done'). Use teamleader_reopen_project_task to undo.",
    {
      id: z.string().describe("Project task ID"),
    },
    async (params) => {
      await client.request({
        endpoint: "projects-v2/tasks.complete",
        body: { id: params.id },
      });
      return {
        content: [{ type: "text" as const, text: `Project task ${params.id} completed.` }],
      };
    }
  );

  // ── Reopen Project Task (v2) ───────────────────────────────────────────
  server.tool(
    "teamleader_reopen_project_task",
    "Reopen a completed project task.",
    {
      id: z.string().describe("Project task ID"),
    },
    async (params) => {
      await client.request({
        endpoint: "projects-v2/tasks.reopen",
        body: { id: params.id },
      });
      return {
        content: [{ type: "text" as const, text: `Project task ${params.id} reopened.` }],
      };
    }
  );

  // ── Delete Project Task (v2) ───────────────────────────────────────────
  server.tool(
    "teamleader_delete_project_task",
    "Delete a project task. This action is irreversible. Time tracking entries linked to this task are NOT deleted.",
    {
      id: z.string().describe("Project task ID"),
    },
    async (params) => {
      await client.request({
        endpoint: "projects-v2/tasks.delete",
        body: { id: params.id },
      });
      return {
        content: [{ type: "text" as const, text: `Project task ${params.id} deleted.` }],
      };
    }
  );

  // ── Remove Task from Group ─────────────────────────────────────────────
  server.tool(
    "teamleader_remove_task_from_group",
    "Remove a task or material from the group it is currently in.",
    {
      line_id: z.string().describe("Task or material ID to remove from its group"),
    },
    async (params) => {
      await client.request({
        endpoint: "projects-v2/projectLines.removeFromGroup",
        body: { line_id: params.line_id },
      });
      return {
        content: [{ type: "text" as const, text: `Task/material ${params.line_id} removed from its group.` }],
      };
    }
  );

  // ── Create Project Task (v2) ─────────────────────────────────────────────
  server.tool(
    "teamleader_create_project_task_v2",
    "Create a new task within a project or project group (phase). Returns {id, type}. NOTE: API uses 'group_id' (NOT 'project_group_id') and 'assignees: [{type,id}]' array (NOT 'assignee_id') — this tool maps the params automatically. Lookup IDs: teamleader_list_work_types (work_type_id), teamleader_list_users (assignee_id).",
    {
      project_id: z.string().describe("Parent project ID"),
      project_group_id: z
        .string()
        .optional()
        .describe("Optional: parent group (phase) ID. Mapped to API field 'group_id' automatically."),
      title: z.string().describe("Task title"),
      description: z.string().optional().describe("Task description"),
      assignee_id: z
        .string()
        .optional()
        .describe("Assignee user ID (use teamleader_list_users to find). Mapped to API field 'assignees: [{type:user, id}]' automatically."),
      work_type_id: z
        .string()
        .optional()
        .describe("Work type ID (use teamleader_list_work_types to find)"),
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
