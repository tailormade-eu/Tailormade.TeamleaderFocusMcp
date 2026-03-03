# Teamleader Focus MCP

A [Model Context Protocol (MCP)](https://modelcontextprotocol.io/) server that wraps the **Teamleader Focus CRM API**. Gives AI assistants (Claude Code, Claude Desktop, Cursor, etc.) the ability to manage contacts, companies, deals, tasks, events, invoices, time tracking, and projects — including a smart task resolution workflow for automated time logging.

Based on [globodai-group/mcp-teamleader](https://github.com/globodai-group/mcp-teamleader), extended with time tracking, projects v2, and smart cache-first task resolution.

---

## Features

- **Contacts** — List, get, create, update
- **Companies** — List, get, create
- **Deals** — List, get, create, update
- **Tasks** — List, create (legacy task API)
- **Events** — List, get, create calendar events
- **Invoices** — List, get, create draft invoices
- **Time Tracking** — List, add, update, delete, start/stop timer
- **Projects v2** — List, get, create, update projects, groups (phases), and tasks
- **Smart Resolution** — Cache-first Company > Project > Group > Task navigation
- **OAuth2** — Automatic token refresh with rotation support

---

## Prerequisites

A **Teamleader Focus** account with API access:

1. Go to [Developer Portal](https://developer.focus.teamleader.eu/)
2. Register an integration to get your **Client ID** and **Client Secret**
3. Complete the OAuth2 flow to obtain a **Refresh Token** (see [QUICKSTART.md](QUICKSTART.md))

---

## Quick Start

### Build from source

```bash
git clone https://github.com/YOUR_USERNAME/Tailormade.TeamleaderFocusMcp.git
cd Tailormade.TeamleaderFocusMcp
npm install
npm run build
```

### Claude Desktop / Claude Code

Add to `%APPDATA%\Claude\claude_desktop_config.json` (Windows) or `~/.claude.json`:

```json
{
  "mcpServers": {
    "teamleader": {
      "command": "node",
      "args": ["C:\\ABSOLUTE\\PATH\\TO\\dist\\index.js"],
      "env": {
        "TEAMLEADER_CLIENT_ID": "your_client_id",
        "TEAMLEADER_CLIENT_SECRET": "your_client_secret",
        "TEAMLEADER_REFRESH_TOKEN": "your_refresh_token"
      }
    }
  }
}
```

---

## Configuration

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `TEAMLEADER_CLIENT_ID` | Yes | OAuth2 Client ID |
| `TEAMLEADER_CLIENT_SECRET` | Yes | OAuth2 Client Secret |
| `TEAMLEADER_REFRESH_TOKEN` | Yes | OAuth2 Refresh Token (auto-rotated, persisted to `~/.teamleader-tokens.json`) |

### Cache Files

| File | Purpose |
|------|---------|
| `~/.teamleader-cache.json` | Entity cache (companies, projects, groups, tasks, task trees) |
| `~/.teamleader-tasks-{slug}.yaml` | Full task tree written by `teamleader_load_tasks` (contains all IDs) |
| `~/.teamleader-tokens.json` | Persisted OAuth2 tokens (auto-managed) |

---

## Available Tools

### Contacts

| Tool | Description |
|------|-------------|
| `teamleader_list_contacts` | List contacts with optional filtering by term, tags, or updated_since |
| `teamleader_get_contact` | Get full details of a specific contact by ID |
| `teamleader_create_contact` | Create a new contact (first name, last name, email, phone, tags, language) |
| `teamleader_update_contact` | Update an existing contact |

### Companies

| Tool | Description |
|------|-------------|
| `teamleader_list_companies` | List companies with filtering by term, tags, or VAT number |
| `teamleader_get_company` | Get full details of a specific company by ID |
| `teamleader_create_company` | Create a new company (name, email, phone, VAT, website, tags) |

### Deals

| Tool | Description |
|------|-------------|
| `teamleader_list_deals` | List deals with filtering by term, phase, or responsible user |
| `teamleader_get_deal` | Get full details of a specific deal by ID |
| `teamleader_create_deal` | Create a new deal (title, customer, phase, value, probability) |
| `teamleader_update_deal` | Update an existing deal (title, value, dates, responsible user) |

### Tasks (legacy)

| Tool | Description |
|------|-------------|
| `teamleader_list_tasks` | List tasks with optional filtering and pagination |
| `teamleader_create_task` | Create a new task with description, due date, and assignee |

### Events

| Tool | Description |
|------|-------------|
| `teamleader_list_events` | List calendar events with optional date range filter |
| `teamleader_get_event` | Get full details of a specific event by ID |
| `teamleader_create_event` | Create a new calendar event (title, activity type, start/end, attendees) |

### Invoices

| Tool | Description |
|------|-------------|
| `teamleader_list_invoices` | List invoices with filtering by status, date range, or department |
| `teamleader_get_invoice` | Get full details of a specific invoice by ID |
| `teamleader_create_invoice` | Create a new draft invoice with line items |

### Time Tracking

| Tool | Description |
|------|-------------|
| `teamleader_list_timetracking` | List time entries filtered by user, date range, or subject |
| `teamleader_get_timetracking` | Get details of a specific time entry by ID |
| `teamleader_add_timetracking` | Add a new time entry (user, work type, start/end, subject) |
| `teamleader_update_timetracking` | Update an existing time entry |
| `teamleader_delete_timetracking` | Delete a time entry |
| `teamleader_start_timer` | Start a running timer (creates an open-ended time entry) |
| `teamleader_stop_timer` | Stop a running timer (closes the open-ended entry) |

### Projects v2

| Tool | Description |
|------|-------------|
| `teamleader_list_projects_v2` | List projects with filtering by status, company, or search term |
| `teamleader_get_project_v2` | Get full details of a specific project by ID |
| `teamleader_create_project_v2` | Create a new project with customer, dates, and responsible user |
| `teamleader_update_project_v2` | Update an existing project |
| `teamleader_list_project_groups` | List project groups (phases/milestones) for a project |
| `teamleader_create_project_group` | Create a new group (phase) within a project |
| `teamleader_list_project_tasks_v2` | List tasks by project or project group |
| `teamleader_create_project_task_v2` | Create a task within a project or group |

### Smart Resolution (Cache-first)

These tools implement the recommended workflow for time logging. They maintain a local cache to avoid repeated API calls.

| Tool | Description |
|------|-------------|
| `teamleader_find_task` | Navigate Company > Project > Group > Task hierarchy interactively. Numbered selection when multiple options. Tasks auto-created if not found. |
| `teamleader_log_time` | Register time for a task. Resolves from cache. Supports deduplication and overlap detection. |
| `teamleader_load_tasks` | Load and display the full Project > Group > Task tree for a company. Cache-first (30 min TTL). Writes YAML with all IDs. |
| `teamleader_task_action` | Maintenance actions on tasks: close, create, move a time entry, or delete a project group. |
| `teamleader_cache_stats` | Show cache statistics and all cached tasks. |
| `teamleader_clear_cache` | Clear the entire local cache (forces fresh API lookups on next call). |

---

## Recommended Workflow: Time Logging

### Option A — Interactive (first use or unknown task)

```
1. teamleader_find_task(company_name="Acme", group_name="Sprint 12", task_name="Bug fix login")
   → resolves company > project > group > task, caches result

2. teamleader_log_time(company_name="Acme", task_name="Bug fix login", started_on="09:00", ended_on="11:30")
   → reads from cache, logs time entry, checks for duplicates
```

### Option B — Load tree first (recommended for sessions with many log entries)

```
1. teamleader_load_tasks(company_name="Acme")
   → fetches full tree, writes ~/.teamleader-tasks-acme.yaml, shows summary

2. teamleader_load_tasks(company_name="Acme", visual=true)
   → shows numbered ASCII tree

   Company: Acme Corp
   === Project Alpha ===
     [Sprint 12]
       1. Bug fix login (to_do)
       2. Add unit tests (in_progress)

3. teamleader_load_tasks(company_name="Acme", task_selection=1)
   → caches task #1 for direct use

4. teamleader_log_time(company_name="Acme", task_name="Bug fix login", started_on="09:00", ended_on="11:30")
   → resolves from cache, logs time
```

### Option C — Direct task_id (fastest, when ID is already known)

```
teamleader_log_time(company_name="Acme", task_id="abc-123", started_on="09:00", ended_on="11:30")
```

---

## Smart Resolution: `teamleader_find_task` Parameters

| Parameter | Required | Description |
|-----------|----------|-------------|
| `company_name` | Yes | Partial match on company name |
| `group_name` | Yes | Partial match on group/phase name (searched across all projects) |
| `task_name` | Yes | Partial match on task name (auto-created if not found) |
| `project_selection` | Auto | Select project by number when multiple found |
| `task_selection` | Auto | Select task by number from listed options |
| `confirm_create_group` | Auto | Confirm creation of new group (requires project_selection) |
| `confirm_create_project` | Auto | Confirm creation of new project |
| `only_open` | Optional | Only show open tasks — to_do, in_progress, on_hold (default: true) |
| `_company_id` | Internal | Resolved company ID, pass between calls to avoid re-resolving |
| `_project_id` | Internal | Resolved project ID |
| `_group_id` | Internal | Resolved group ID |
| `_group_title` | Internal | Resolved group title |

---

## Smart Resolution: `teamleader_log_time` Parameters

| Parameter | Required | Description |
|-----------|----------|-------------|
| `company_name` | Yes | Partial match on company name |
| `task_name` | Conditional | Task name (partial match, must be in cache). Required if task_id not given. |
| `task_id` | Conditional | Direct task ID — skips cache lookup. Use when ID is known from load_tasks. |
| `started_on` | Yes | Start time: ISO 8601, `YYYY-MM-DD HH:MM`, or `HH:MM` (uses today) |
| `ended_on` | Yes | End time: same formats as started_on |
| `description` | Optional | Description of work done |
| `work_type_id` | Optional | Override the default work type |
| `date` | Optional | Date for HH:MM format (YYYY-MM-DD, default: today) |
| `force` | Optional | Skip deduplication and overlap checks entirely |
| `confirm_overlap` | Optional | Confirm registration when overlap with another task is detected |

---

## Deduplication Rules (`teamleader_log_time`)

| Rule | Condition | Action |
|------|-----------|--------|
| Exact duplicate | Same task ID, same start time (to second) | Block with error |
| Overlap | Any time range overlap with existing entry | Warn, ask `confirm_overlap=true` |
| Force | `force=true` | Skip all checks |

---

## `teamleader_load_tasks` Parameters

| Parameter | Description |
|-----------|-------------|
| `company_name` | Company to load (partial match) |
| `project_filter` | Filter projects by name (partial match) |
| `group_filter` | Filter groups by name (partial match) |
| `only_open` | Only include open tasks (default: true) |
| `visual` | Show ASCII tree with numbered tasks instead of summary |
| `task_selection` | Cache a specific task by number (from visual output) |
| `force_refresh` | Force reload from API, bypass 30 min cache |
| `_company_id` | Internal: resolved company ID |

---

## Cache TTL

| Entity | TTL |
|--------|-----|
| active_user | No expiry (manual clear only) |
| work_types | 7 days |
| companies | 24 hours |
| projects | 2 hours |
| groups | 1 hour |
| tasks | 1 hour |
| task_trees | 30 minutes |

Auto-prune: expired entries are removed on every cache write.

---

## Teamleader API Quirks

These are critical for any future development or debugging.

### `projects-v2/projectLines.list`

- `project_id` must be **top-level** in the request body — NOT inside `filter`
- `project_group_id` is **NOT** a server-side filter — must filter client-side on `l.group?.id`

### `projects-v2/tasks.list`

- Filter by `ids` array works server-side
- Status is **NOT** a server-side filter — filter client-side on status field

### `projects-v2/tasks.create`

- Use `group_id` (NOT `project_group_id`)
- Use `tasks.create` endpoint (NOT `projectLines.create`)

### `timeTracking.list`

- Returns `subject.type: "todo"` — the ID differs from the `nextgenTask` ID
- Deduplication must match on **start time** (to second precision), not on subject ID

### General

- All API calls use **POST** with JSON body
- Base URL: `https://api.focus.teamleader.eu`
- Pagination uses `page.number` and `page.size`

---

## File Structure

```
src/
  api/
    auth.ts       — OAuth2 token management (auto-rotate, persist to ~/.teamleader-tokens.json)
    client.ts     — HTTP client (all POST requests)
    cache.ts      — Cache types, TTL constants, CRUD functions, task tree operations
  tools/
    resolve.ts    — Smart tools: find_task, log_time, load_tasks, task_action, cache_stats, clear_cache
    contacts.ts   — Contact tools
    companies.ts  — Company tools
    deals.ts      — Deal tools
    tasks.ts      — Legacy task tools
    events.ts     — Event tools
    invoices.ts   — Invoice tools
    timetracking.ts — Time tracking tools
    projects.ts   — Projects v2 tools
  index.ts        — MCP server entry point, tool registration
docs/
  find-task-business-logic.md — Detailed business logic for smart resolution tools
```

---

## Development

```bash
# Install
npm install

# Build (TypeScript → dist/)
npm run build

# Type check only
npm run typecheck

# Dev mode (watch)
npm run dev

# Test with MCP inspector
npx @modelcontextprotocol/inspector node dist/index.js
```

---

## API Reference

- Teamleader Focus API docs: [developer.focus.teamleader.eu](https://developer.focus.teamleader.eu/)
- Base URL: `https://api.focus.teamleader.eu`
- All endpoints use POST with JSON body
- Authentication: OAuth2 with automatic token refresh

---

## License

[MIT](LICENSE)
