# Teamleader Focus MCP — Claude/CodingMachine Instructions

This file provides context for AI agents (Claude Code, CodingMachine) working on this codebase.

---

## Language Rules

- ALL tool descriptions (`server.tool()` second argument): **English**
- ALL parameter `.describe()` strings: **English**
- ALL `respond()` output text: **English** (AI translates to user's language)
- Comments in code: **English preferred**

---

## Architecture

### Entry Point

`src/index.ts` — creates MCP server, registers all tools, initializes cache, starts stdio transport.

### Tool Registration

Each domain has its own file in `src/tools/`. Export a `register*Tools(server, client)` function and import it in `src/index.ts`.

```
src/tools/contacts.ts       → registerContactTools
src/tools/companies.ts      → registerCompanyTools
src/tools/deals.ts          → registerDealTools
src/tools/tasks.ts          → registerTaskTools (legacy)
src/tools/events.ts         → registerEventTools
src/tools/invoices.ts       → registerInvoiceTools
src/tools/timetracking.ts   → registerTimeTrackingTools
src/tools/projects.ts       → registerProjectTools
src/tools/resolve.ts        → registerResolveTools (smart tools)
```

### Cache

File: `~/.teamleader-cache.json`

```typescript
interface Cache {
  active_user?: CachedUser;          // no expiry
  default_work_type_id?: string;     // no expiry
  work_types?: CachedWorkType[];     // TTL: 7 days
  companies?: CachedCompany[];       // TTL: 24 hours
  projects?: CachedProject[];        // TTL: 2 hours
  groups?: CachedGroup[];            // TTL: 1 hour
  tasks?: CachedTask[];              // TTL: 1 hour
  task_trees?: TaskTree[];           // TTL: 30 min
}
```

All functions are in `src/api/cache.ts`. Auto-prune on every `save()`.

### Task YAML Files

Written by `teamleader_load_tasks` to `~/.teamleader-tasks-{slug}.yaml`.
Contains full project > group > task tree with all IDs.
Used by humans and AI to get IDs for direct calls.

### Auth / Tokens

`src/api/auth.ts` handles OAuth2. Refresh tokens are auto-rotated and persisted to `~/.teamleader-tokens.json`.

---

## Teamleader API Quirks (CRITICAL)

### `projects-v2/projectLines.list`

- `project_id` must be **top-level** in request body — NOT inside `filter`
- `project_group_id` is NOT a server-side filter — filter client-side on `l.group?.id`

### `projects-v2/tasks.list`

- `ids` array filter works server-side
- Status is NOT a server-side filter — filter client-side after fetch

### `projects-v2/projectGroups.create`

- Use `start_date` / `end_date` (NOT `starts_on` / `due_on`)
- Use `projectGroups.create` (NOT `projectLines.create` — does not exist)

### `projects-v2/projectGroups.delete`

- Requires `delete_strategy`: `"ungroup_tasks_and_materials"` or `"delete_tasks_and_materials"`

### `projects-v2/tasks.create`

- Use `group_id` field (NOT `project_group_id`)
- Use `assignees: [{ type: "user", id }]` (NOT `assignee_id`)
- Use `tasks.create` endpoint (NOT `projectLines.create` — does not exist)

### `timeTracking.list`

- Returns `subject.type: "todo"` — ID differs from `nextgenTask` ID
- Dedup must match on **start time** (to second precision), not on subject ID

### `timeTracking.add`

- Use `toFilterDate()` helper (strips milliseconds) — NOT `.toISOString()`
- Milliseconds cause dedup mismatches

### General

- All API calls are POST with JSON body
- Base URL: `https://api.focus.teamleader.eu`
- Pagination: `page.number` + `page.size`

---

## Tool Design Rules

| Rule | Description |
|------|-------------|
| Cache-first | Always check cache before API call. Cache on hit. |
| Numbered lists | Show numbered lists whenever user must select between options |
| `only_open` default | Default `true` — filter tasks to to_do / in_progress / on_hold |
| `visual` flag | ASCII tree for human-readable output. Default output = compact summary. |
| Context protection | Default responses are short summaries. Write large data (trees, IDs) to YAML file. |
| `task_id` shortcut | Prefer `task_id` over cache lookup when ID is already known |
| English output | All tool responses in English. AI translates to user language. |

---

## Adding New Tools

1. Create or edit `src/tools/{domain}.ts`
2. Export a `register{Domain}Tools(server: McpServer, client: TeamleaderClient): void` function
3. Register tools with `server.tool(name, description, schema, handler)`
4. Import and call in `src/index.ts`
5. Always include:
   - Comprehensive English description in `server.tool()` second argument
   - `.describe()` on every Zod parameter
   - Cache where appropriate
   - Numbered list output when user must choose

### Tool Template

```typescript
server.tool(
  "teamleader_my_tool",
  "Description of what this tool does and when to use it. English only.",
  {
    company_name: z.string().describe("Company name (partial match)"),
    optional_param: z.string().optional().describe("Optional: description of param"),
  },
  async (params) => {
    // 1. Cache check
    // 2. API call if miss
    // 3. Return respond(text)
    return respond("Result text in English");
  }
);
```

---

## Cache Functions Reference

```typescript
// User
getActiveUser(): CachedUser | undefined
setActiveUser(user: CachedUser): void

// Work types
getWorkTypes(): CachedWorkType[] | undefined
setWorkTypes(types): void

// Companies
getCompany(term: string): CachedCompany | undefined
upsertCompany(company): void

// Projects
getProjectsForCompany(company_id: string): CachedProject[] | undefined
upsertProjects(projects): void

// Groups
getGroupsForProject(project_id: string): CachedGroup[] | undefined
upsertGroups(groups): void

// Flat task cache
findTask(company: string, task: string): CachedTask | undefined  // sorted by last_used
searchTasks(term: string): CachedTask[]
upsertTask(task): void
listTasks(companyFilter?: string): CachedTask[]

// Task trees (full hierarchy)
getTaskTree(company_id: string): TaskTree | undefined
setTaskTree(tree): void
invalidateTaskTree(company_id: string): void
findInTree(company_id, task_name, group_name?): Array<{project, group?, task}>
scoreTasksInTree(company_id, description): ScoredTaskMatch[]  // keyword scoring

// Utility
clearCache(): void
getCacheStats(): string
```

---

## Task Tree Scoring (`scoreTasksInTree`)

Used as fallback when flat cache misses. Scores all tasks in the tree against a natural language description.

| Match | Score per word |
|-------|---------------|
| Task title | 3 points |
| Group name | 1 point |
| Project name | 0.5 points |

Words shorter than 3 characters are ignored. Results sorted by score descending.

---

## File Structure

```
src/
  api/
    auth.ts           — OAuth2 token management
    client.ts         — HTTP client (all POST)
    cache.ts          — Cache types, TTL, CRUD, task tree functions
  tools/
    resolve.ts        — Smart tools (find_task, log_time, load_tasks, task_action, cache_stats, clear_cache)
    contacts.ts       — Contact CRUD
    companies.ts      — Company CRUD
    deals.ts          — Deal CRUD
    tasks.ts          — Legacy task tools
    events.ts         — Event tools
    invoices.ts       — Invoice tools
    timetracking.ts   — Time tracking tools
    projects.ts       — Projects v2 tools
  index.ts            — Server entry point
docs/
  find-task-business-logic.md  — Detailed business logic documentation
dist/                 — Compiled output (gitignored)
```

---

## Build & Test

```bash
npm run build        # compile TypeScript → dist/
npm run typecheck    # type check without emit
npm run dev          # watch mode

# Test with inspector:
npx @modelcontextprotocol/inspector node dist/index.js
```

---

## Common Pitfalls

1. **Do not** put `project_id` inside `filter` in `projectLines.list` — it must be top-level
2. **Do not** use `projectLines.create` — it does not exist. Use `projectGroups.create` for groups, `tasks.create` for tasks
3. **Do not** use `project_group_id` as server-side filter — filter client-side
4. **Do not** use `.toISOString()` for Teamleader time comparisons — use `toFilterDate()` (strips ms)
5. **Do not** match dedup on subject ID from `timeTracking.list` — match on start time
6. **Always** set `only_open=true` by default for task filters
7. **Always** write large datasets (task trees) to YAML file, not to MCP response
8. **Never guess a task_id** — the visual tree does NOT show IDs. Always read the YAML file (`~/.teamleader-tasks-{slug}.yaml`) to get the correct ID before calling `log_time(task_id=...)`
