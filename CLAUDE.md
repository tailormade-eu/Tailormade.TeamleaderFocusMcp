# Teamleader Focus MCP — Claude/CodingMachine Instructions

This file provides context for AI agents (Claude Code, CodingMachine) working on this codebase.

---

## ⚠️ CRITICAL: Always Read the API Doc First

**Before implementing OR modifying any tool, read the corresponding doc in `docs/api/`.**

Never derive a Teamleader API implementation from general knowledge. The API has non-obvious field names, nested structures, and filter params that differ from what you'd expect.

| Action | Required |
|--------|----------|
| Implementing a new tool | Read `docs/api/*-{endpoint}.md` |
| Adding a filter param | Read the full filter object in the doc |
| Unsure about a field name | Read the doc — do not guess |
| Auditing existing tools | Read doc + compare every param |

**The docs are in `docs/api/` — use them. This is not optional.**

---

## Scope — What to Implement

### In Scope

- All `projects-v2/*` endpoints (the current projects API)
- All `tasks.*` standalone task endpoints (NOT legacy)
- All other current Teamleader Focus API endpoints (contacts, companies, deals, tickets, invoices, etc.)

### Out of Scope (Legacy — Do NOT Implement)

| Endpoint group | Reason |
|----------------|--------|
| `projects.*` (080-089) | Old project API, replaced by `projects-v2/*` |
| `milestones.*` (078-079) | Old milestone API, replaced by project groups in `projects-v2` |

These legacy endpoints still exist in the Teamleader API but represent the old data model. All new work uses `projects-v2/`.

### Out of Scope (HR)

| Endpoint group | Reason |
|----------------|--------|
| `users.listDaysOff`, `users.getWeekSchedule` | HR |
| `closingDays.*`, `dayOffTypes.*`, `daysOff.*` | HR |
| `userAvailability.*` | HR/planning |

### Out of Scope (Accounting / Bookkeeping)

| Endpoint group | Reason |
|----------------|--------|
| `incomingInvoices.*` | Bookkeeping, not CRM/PM |
| `incomingCreditNotes.*` | Bookkeeping |
| `receipts.*` | Bookkeeping |
| `bookkeepingSubmissions.list` | Bookkeeping |

### Out of Scope (Admin / Infra / Niche)

| Endpoint group | Reason |
|----------------|--------|
| `customFieldDefinitions.*` | Admin/schema management |
| `webhooks.*` | Infrastructure |
| `migrate.*` | One-time migration |
| `cloudPlatforms.*`, `accounts.*` | Infrastructure |
| `emailTracking.*` | Niche |
| `externalParties.*` | Niche project feature |
| `levelTwoAreas.list` | Geographic/niche |
| `plannableItems.*`, `reservations.*` | Planning/niche |
| `contacts.uploadAvatar`, `companies.uploadLogo` | Binary upload, skip |

**Out-of-scope decisions are also recorded in `tools/coverage-config.json`** (used by `npm run check-coverage`).

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
src/tools/contacts.ts       → registerContactTools      (list, get, create, update, delete, link, unlink, tag, untag, updateCompanyLink)
src/tools/companies.ts      → registerCompanyTools      (list, get, create, update, delete, tag, untag)
src/tools/deals.ts          → registerDealTools         (list, get, create, update, delete, lose, win, move + pipelines/phases/sources CRUD + lookups)
src/tools/tasks.ts          → registerTaskTools         (standalone tasks: list, get, create, update, delete, complete, reopen, schedule)
src/tools/events.ts         → registerEventTools        (list, get, create, update, cancel)
src/tools/invoices.ts       → registerInvoiceTools      (list, get, create, book, send, delete, update, payment, credit + lookups)
src/tools/timetracking.ts   → registerTimeTrackingTools (list, get, add, update, delete, resume + timers.start/stop/current/update + timesheet)
src/tools/projects.ts       → registerProjectTools      (full CRUD + lifecycle + relationships + projectGroups + projectLines + project tasks)
src/tools/resolve.ts        → registerResolveTools      (smart tools: find_task, log_time, load_tasks, task_action, cache_stats, clear_cache)
src/tools/users.ts          → registerUserTools         (list, get)
src/tools/tickets.ts        → registerTicketTools       (list, get, create, update, messages, reply, internal, importMessage)
src/tools/meetings.ts       → registerMeetingTools      (list, get, schedule, update, complete, delete, report)
src/tools/departments.ts    → registerDepartmentTools   (list, get)
src/tools/lookups.ts        → registerLookupTools       (activityTypes, taxRates, paymentTerms, paymentMethods, ticketStatuses, products, productCategories, workTypes, teams, tags, expenses, mailTemplates, lostReasons, businessTypes, callOutcomes, currencies, documentTemplates, priceLists, unitsOfMeasure, withholdingTaxRates, commercialDiscounts)
src/tools/files.ts          → registerFileTools         (list, get, download, delete, upload)
src/tools/notes.ts          → registerNoteTools         (list, create, update)
src/tools/subscriptions.ts  → registerSubscriptionTools (list, get, create, update, deactivate)
src/tools/quotations.ts     → registerQuotationTools    (list, get, create, update, delete, accept, send, download)
src/tools/creditnotes.ts    → registerCreditNoteTools   (list, get, download, sendViaPeppol)
src/tools/materials.ts      → registerMaterialTools     (list, get, create, update, delete, assign, unassign, duplicate)
src/tools/calls.ts          → registerCallTools         (list, get, add, update, complete)
src/tools/orders.ts         → registerOrderTools        (list, get)
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
- `filter.started_after` / `filter.started_before` accept **date only** (`YYYY-MM-DD`) — datetime strings cause 400 Bad Request. Filter by time client-side after fetching.

### `timeTracking.add`

- Use `toFilterDate()` helper (strips milliseconds) — NOT `.toISOString()`
- Milliseconds cause dedup mismatches

### `timeTracking.update`

- No partial updates for time fields — always send `started_at` + `ended_at` together
- Sending only `ended_at` causes 400 Bad Request (`started_at must be present`)

### `invoices.registerPayment`

- Use `paid_at` (NOT `payment_date`)
- Nested object: `{ payment: { amount: { amount, currency }, paid_at, payment_method_id } }`

### `invoices.creditPartially`

- Line item tax: `unit_price.tax: "excluding"` (NOT a currency field)

### `tickets.list`

- Customer filter: `relates_to: { type, id }` (NOT `customer_id`)
- Status filter: `exclude.status_ids` array (no direct status filter)

### `projects.close` / `projects.delete`

- `close` requires `closing_strategy`: `"mark_tasks_and_materials_as_done"` or `"none"`
- `delete` requires `delete_strategy`: `"unlink_tasks_and_time_trackings"` or `"delete_tasks_and_time_trackings"`

### `projects.assign` / `projects.addCustomer`

- `assignee: { type, id }` and `customer: { type, id }` — always objects, never flat IDs

### `projectGroups.update`

- Use `start_date` / `end_date` (NOT `starts_on` / `due_on`)

### `files.upload`

- Two-step: `files.upload` returns pre-signed URL → binary POST to URL (no auth headers needed)

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
    resolve.ts        — Smart tools (find_task, log_time, load_tasks, task_action)
    contacts.ts       — Contact CRUD + tag/link
    companies.ts      — Company CRUD + tag
    deals.ts          — Deal CRUD + pipelines/phases CRUD + lookups
    tasks.ts          — Standalone tasks
    events.ts         — Events
    invoices.ts       — Invoices + payment + credit
    timetracking.ts   — Time tracking + timers
    projects.ts       — Projects v2 + groups + lines + project tasks
    subscriptions.ts  — Subscriptions
    quotations.ts     — Quotations
    creditnotes.ts    — Credit notes
    materials.ts      — Materials
    calls.ts          — CRM calls
    orders.ts         — Orders
    users.ts          — Users
    tickets.ts        — Tickets + messages
    meetings.ts       — Meetings
    departments.ts    — Departments
    lookups.ts        — All reference data lists
    files.ts          — Files
    notes.ts          — Notes
  index.ts            — Server entry point
docs/
  api/                — Scraped Teamleader Focus API docs (360 pages, 2026-03-05)
  BusinessLogica/     — Business logic docs per domain (Rules + Mermaid workflow + Decisions)
  TESTING.md          — Manual test checklist per tool
  audit-*.md          — Audit output files (generated by CodingMachine audit tasks)
tools/
  tl_docs_scraper.py    — BFS scraper for Teamleader API docs (Selenium/Edge)
  check-coverage.ts     — Coverage verification script [🔨 task 39]
  coverage-config.json  — Endpoint→tool mapping + out-of-scope decisions [🔨 task 39]
tasks/                — CodingMachine task queue
dist/                 — Compiled output (gitignored)
```

---

## Build & Test

```bash
npm run build          # compile TypeScript → dist/
npm run typecheck      # type check without emit
npm run dev            # watch mode
npm run check-coverage # verify all API endpoints covered (reads INDEX.md + scans src/tools/)
npm test               # unit tests (body construction, no live API)

# Test with inspector:
npx @modelcontextprotocol/inspector node dist/index.js
```

### Coverage verification

`npm run check-coverage` compares `docs/api/INDEX.md` (scraped API endpoint list) against `src/tools/*.ts`.
Mapping and out-of-scope decisions live in `tools/coverage-config.json`.
**Never create a manual coverage matrix** — it duplicates INDEX.md and will go out of sync.

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
9. **Timers vs timeTracking**: `timers.start` and `timers.stop` are under the `timers.*` resource (NOT `timeTracking.start/stop` — those do not exist). `timers.stop` takes no parameters (stops the current user's active timer).
10. **Before implementing any new endpoint**: always read the corresponding scraped doc in `docs/api/` for exact field names, required vs optional params, and response structure.
