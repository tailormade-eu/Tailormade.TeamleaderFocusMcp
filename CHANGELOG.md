# Changelog

All notable changes to this extended fork of globodai-mcp-teamleader.

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
| 1.3.1 | 2026-03-03 | Bug fixes (BUG-01, task numbering, icons) + delete_group action |
| 1.3.0 | 2026-03-03 | Smart task tree, load_tasks, task_action, log_time improvements |
| 1.2.0 | 2026-02-28 | Projects v2 module (8 tools) |
| 1.1.0 | 2026-02-28 | Time tracking module (7 tools) |
| 1.0.0 | — | Original Globodai release |
