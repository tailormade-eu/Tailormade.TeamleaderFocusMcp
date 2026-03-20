# Changelog

All notable changes to this extended fork of globodai-mcp-teamleader.

---

## [3.2.0] - 2026-03-20

### Added

- **`teamleader_timesheet` — `format=manictime`**: TSV output for ManicTime memos (`DD/MM/YYYY\tclient, group, task`). Helpers `dateToDDMMYYYY()` and `buildManicTimeMemo()` exported for testing.
- **`teamleader_log_time` — active timer overlap check**: Calls `timers.current` after dedup check; warns if active timer overlaps with the logged period. Options: stop timer or `force=true` to skip.

### Bug Fixes

- **`auto-retry on invalid_grant`**: Reload token file from disk before failing — handles cases where another process refreshed the token.
- **`add_project_line_to_group`**: Now also handles standalone `todo` → project group moves. Improved description for better discoverability.
- **llmTips improved**: Documented v1 `todo` vs v2 `nextgenTask` ID incompatibility across tools. Better guidance for group IDs, `add_project_line_to_group`, and `update_timetracking` subject type.

---

## [3.1.0] - 2026-03-12

### Added

- **`teamleader_login`**: New OAuth login tool — starts Authorization Code flow via browser + local callback server on port 19836. Exchanges code for tokens and persists to `~/.teamleader-tokens.json`. Use for initial setup or expired refresh token recovery.

### Changed

- **`TEAMLEADER_REFRESH_TOKEN` no longer required** — server starts without it, exposing only the `teamleader_login` tool. All other API tools become available once a refresh token is obtained.
- **`open` package** added as dependency for browser-based OAuth flow (fallback to URL text if browser open fails).

---

## [3.0.0] - 2026-03-05

### Added

- **`teamleader_timesheet`**: New tool — daily timesheet from Teamleader. Returns all time entries for a date (default: today) grouped by project/task. Supports `format` param: `md` (markdown table) or `beauty` (rich formatted). `desc_length` param controls description truncation.
- **`teamleader_task_action` — `move_to_group`**: Move an existing task to a different group/phase using `projectLines.addToGroup`.
- **Business Logic docs** (`docs/`): CRM, Billing, Time & Projects — complete reference for AI agents.

### Improvements

- **`teamleader_timesheet`** — cross-request cache: group, project, user, and customer lookups are cached per session to eliminate redundant API calls.
- **`load_tasks`** — standalone tasks get `[S]` marker + `task_type` in YAML to distinguish from project tasks.

### Bug Fixes

- **`load_tasks` — standalone task IDs**: Standalone tasks used wrong endpoint IDs → 404 on close. Now uses correct standalone task endpoint automatically.
- **`load_tasks` — duplicate tasks**: Project tasks were appearing twice in `[no group]`. Fixed deduplication.
- **`load_tasks` — `task_selection` wrong ID**: When multiple projects loaded, task_selection picked wrong ID. Now reads from YAML directly.
- **`teamleader_update_timetracking` — `started_on` required**: Added guard + llmTip. Clear error when field missing.
- **`teamleader_log_time` — "Invalid subject" 400**: Better error message with body sent + `force_refresh` suggestion.
- **Coverage script** (`npm run check-coverage`): Verifies all tools in INDEX.md are implemented. INDEX.md = source of truth.

---

## [2.1.0] - 2026-03-05

### Added — Subscriptions Module

- **`teamleader_list_subscriptions`** — List recurring invoices with filtering
- **`teamleader_get_subscription`** — Get subscription details
- **`teamleader_create_subscription`** — Create new recurring invoice
- **`teamleader_update_subscription`** — Update subscription settings
- **`teamleader_deactivate_subscription`** — Deactivate a subscription

---

## [2.0.0] - 2026-03-04

### Major Release — Complete API Coverage

Complete implementation of all Teamleader Focus API endpoints. 56 tools covering the full CRM, billing, projects, time tracking, and support surface.

### Added

- **CRM**: companies.delete, companies.tag/untag, events.update/cancel, contacts full CRUD
- **Billing**: quotations (full workflow), credit notes, products CRUD, materials, orders
- **Lookups**: businessTypes, callOutcomes, currencies, unitsOfMeasure, withholdingTaxRates, documentTemplates, paymentMethods, paymentTerms, taxRates, commercialDiscounts, lostReasons, dealSources, priceList
- **Calls module**: list, get, add, complete, update calls
- **Deal pipelines + phases**: full CRUD
- **Unit tests**: full suite via Vitest

### Infrastructure

- **`npm run check-coverage`**: Automated coverage script — reads INDEX.md, scans src/, reports gaps
- **TESTING.md**: Complete testing guide with all 56 tools documented
- All gap audits completed (tasks 16-23 + 33)

---

## [1.3.5] - 2026-03-03

### Bug Fixes

- **`timers.start` / `timers.stop`**: `timeTracking.start` and `timeTracking.stop` do not exist in the Teamleader API. Corrected to `timers.start` and `timers.stop` (separate `Timers` resource). `timers.stop` takes no parameters — it stops the current user's active timer.

### Documentation

- **API docs scraped**: 187 Markdown files saved to `docs/api/` (was 18 overview pages). Two-pass scraper now follows content sub-links to capture all endpoint detail pages.
- **`tools/tl_docs_scraper.py`** (CodingMachine repo): Updated with two-pass approach — collects nav links + content links per section page.
- **`tasks/`**: CodingMachine task queue added with 11 planned tool additions (see README Roadmap).
- **README**: Updated tool descriptions, file structure, roadmap table, API reference with local docs path.
- **CLAUDE.md**: Updated file structure, planned tool files, added pitfalls #9 (timers) and #10 (read docs before implementing).

---

## [1.3.4] - 2026-03-03

### Added

- **`task_action update`**: Update a project task via `tasks.update` (title, description, status)
- **`find_task` — `description` param**: Description is now passed to `tasks.create` when a new task is created
- **`task_action create` — `description` param**: Description is now passed to `tasks.create`

---

## [1.3.3] - 2026-03-03

### Added

- **`teamleader_task_action` — `move_to_group`**: Move an existing task to a different group using `projects-v2/projectLines.addToGroup`. Requires `task_id` (or `task_number`) + `group_id`. Invalidates task tree cache.

---

## [1.3.2] - 2026-03-03

### Bug Fixes

- **Wrong API endpoints throughout**: `projectLines.create` and `projectLines.delete` do not exist in the Teamleader Focus API. All callers updated:
  - `find_task` group creation: `projectLines.create` → `projectGroups.create`
  - `task_action delete_group`: `projectLines.delete` → `projectGroups.delete` (+ required `delete_strategy` param)
  - `create_project_group` tool: `projectLines.create` → `projectGroups.create`, field names corrected (`start_date`/`end_date`)
  - `create_project_task_v2` tool: `projectLines.create` → `tasks.create`, field names corrected (`group_id`, `assignees` array)
- **`find_task` crash after confirm_create_group**: After group creation, code fell through to `matches[0].groupId` on an empty array → crash. Fixed: wrapped in `if (matches.length)` guard.

### Result

- `find_task` confirm_create_project → full flow working end-to-end ✅
- `find_task` confirm_create_group → group + task created correctly ✅
- `task_action delete_group` → working with `projectGroups.delete` ✅

---

## [1.3.1] - 2026-03-03

### Bug Fixes

- **`teamleader_log_time` — BUG-01**: Added `timeTracking.info` verification after `timeTracking.add`. Silent API acceptance no longer causes ghost entries after tree invalidation. Clear error shown with body sent + `force_refresh` suggestion.
- **`resolveTaskFromTree`**: Fixed task numbering mismatch when using `task_number` in `task_action`. Now filters to open tasks only (matching visual tree output).
- **Visual tree icons**: `done` and `cancelled` tasks showed as `[o]` in `only_open=false` mode. Fixed: `done → [x]`, `cancelled → [-]`. Legend updated.

### Added

- **`teamleader_task_action` — `delete_group`**: New action to delete a project group (phase) by `group_id`. Uses `projects-v2/projectLines.delete`. Invalidates task tree cache. `group_id` available from `load_tasks` YAML or visual tree.

---

## [1.3.0] - 2026-03-03

### Added — Smart Task Tree + Improved Time Logging

#### New Tools (3)

- `teamleader_load_tasks` — Load and display the full Project > Group > Task tree for a company
  - Cache-first (30 min TTL)
  - Writes YAML with all IDs to `~/.teamleader-tasks-{slug}.yaml`
  - Default output: summary (small context footprint)
  - `visual=true` → numbered ASCII tree for human-readable output
  - `only_open=true` (default) → filter to to_do / in_progress / on_hold
  - `task_selection=N` → cache a specific task for immediate use in `log_time`
  - `force_refresh=true` → bypass 30 min cache and reload from API
- `teamleader_task_action` — Maintenance actions on tasks
  - `close` — Close a task by ID or number from load_tasks list
  - `create` — Create a new task in a project/group
  - `move_time` — Move a time entry from one task to another
  - `delete_group` — Delete a project group/phase by group_id (added in v1.3.1)
- `teamleader_cache_stats` — Show cache statistics and cached tasks (with optional company filter)
- `teamleader_clear_cache` — Clear the entire local cache

#### Enhancements to `teamleader_log_time`

- New `task_id` parameter — skip cache lookup entirely when task ID is already known
- Tree-based fallback matching: if flat cache misses, searches task tree using `scoreTasksInTree`
- Scoring algorithm: task title word match = 3pts, group name = 1pt, project name = 0.5pt
- Proposes top matches with `confirm_task_match=N` for confirmation

#### Cache Extended

- New `task_trees` section in `~/.teamleader-cache.json`
- TTL: 30 minutes
- Auto-pruned on every `save()` call
- New functions: `getTaskTree`, `setTaskTree`, `invalidateTaskTree`, `findInTree`, `scoreTasksInTree`

#### Bug Fixes

- Deduplication: replaced `.toISOString()` with `toFilterDate()` to strip milliseconds for Teamleader API compatibility
- Deduplication: silent catch replaced with logged catch for better debugging
- `findTask` in cache: now sorts results by `last_used` descending (was always returning first match regardless of recency)

---

## [1.2.0] - 2026-02-28

### Added — Projects v2 Module

Complete implementation of the Teamleader Focus projects-v2 API:

**New Tools (8):**
- `teamleader_list_projects_v2` — List projects with filtering (status, company, search)
- `teamleader_get_project_v2` — Get detailed project information
- `teamleader_create_project_v2` — Create new projects with customers
- `teamleader_update_project_v2` — Update project details (title, status, dates, etc.)
- `teamleader_list_project_groups` — List project groups (phases/milestones)
- `teamleader_create_project_group` — Create phases within projects
- `teamleader_list_project_tasks_v2` — List tasks by project or phase
- `teamleader_create_project_task_v2` — Create tasks in projects or phases

**Hierarchy:**
```
Company
  └─ Project
      └─ ProjectGroup (Phase/Milestone)
          └─ Task (nextgenTask)
              └─ Time Entry
```

**API Endpoints:**
```
POST /projects-v2/projects.list
POST /projects-v2/projects.info
POST /projects-v2/projects.create
POST /projects-v2/projects.update
POST /projects-v2/projectLines.list   (groups + tasks)
POST /projects-v2/projectLines.create (groups + tasks)
```

---

## [1.1.0] - 2026-02-28

### Added — Time Tracking Module

Complete implementation of the Teamleader Focus time tracking API:

**New Tools (7):**
- `teamleader_list_timetracking` — List time entries with filtering by user, date range, or subject
- `teamleader_get_timetracking` — Get detailed information about a specific time tracking entry
- `teamleader_add_timetracking` — Add new time tracking entry for project/milestone/ticket
- `teamleader_update_timetracking` — Update existing time tracking entry
- `teamleader_delete_timetracking` — Delete a time tracking entry
- `teamleader_start_timer` — Start a running timer
- `teamleader_stop_timer` — Stop a running timer

**API Endpoints:**
```
POST /timeTracking.list
POST /timeTracking.info
POST /timeTracking.add
POST /timeTracking.update
POST /timeTracking.delete
POST /timeTracking.start
POST /timeTracking.stop
```

---

## [1.0.0] — Original Globodai Release

Base implementation from [globodai-group/mcp-teamleader](https://github.com/globodai-group/mcp-teamleader).

**Features:**
- Contacts management (list, get, create, update)
- Companies management (list, get, create)
- Deals management (list, get, create, update)
- Tasks management (list, create)
- Events management (list, get, create)
- Invoices management (list, get, create)
- OAuth2 authentication with auto-refresh
- TypeScript + Zod validation
- MCP SDK integration

---

## Version History

| Version | Date | Description |
|---------|------|-------------|
| 3.2.0 | 2026-03-20 | ManicTime format, active timer overlap check, llmTip improvements |
| 3.1.0 | 2026-03-12 | OAuth login tool, refresh token no longer required at startup |
| 3.0.0 | 2026-03-05 | Timesheet tool, load_tasks fixes, move_to_group, BL docs |
| 2.1.0 | 2026-03-05 | Subscriptions module (5 tools) |
| 2.0.0 | 2026-03-04 | Complete API coverage — 56 tools, unit tests, coverage script |
| 1.3.3 | 2026-03-03 | New: task_action move_to_group (projectLines.addToGroup) |
| 1.3.2 | 2026-03-03 | Fix wrong API endpoints (projectGroups.create/delete, tasks.create) + crash fix |
| 1.3.1 | 2026-03-03 | Bug fixes (BUG-01, task numbering, icons) + delete_group action |
| 1.3.0 | 2026-03-03 | Smart task tree, load_tasks, task_action, log_time improvements |
| 1.2.0 | 2026-02-28 | Projects v2 module (8 tools) |
| 1.1.0 | 2026-02-28 | Time tracking module (7 tools) |
| 1.0.0 | — | Original Globodai release |

