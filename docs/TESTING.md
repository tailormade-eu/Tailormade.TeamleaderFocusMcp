# Testing Checklist — Teamleader Focus MCP

Status: ✅ Tested | ⚠️ Partial | ❌ Not tested | 🐛 Bug found

---

## Core Resolution Tools

| Tool | Test | Status | Notes |
|------|------|--------|-------|
| `teamleader_find_task` | Company resolve (cache miss) | ✅ | |
| `teamleader_find_task` | Company resolve (cache hit) | ✅ | |
| `teamleader_find_task` | Group found in 1 project → auto-pick | ✅ | Ontwikkeling → auto-picked Access Application |
| `teamleader_find_task` | Group found in multiple projects → ask project_selection | ✅ | Barucci: 5 projects with "Support" group → project_selection=N |
| `teamleader_find_task` | Group not found → ask confirm_create_group | ✅ | Fixed v1.3.2: projectGroups.create (was projectLines.create → 404) |
| `teamleader_find_task` | Task: 1 exact match → auto-pick | ✅ | Tijdregistratie: Ontwikkeling |
| `teamleader_find_task` | Task: multiple matches → ask task_selection | ✅ | Collection → 4 matches shown |
| `teamleader_find_task` | Task: no match, tasks exist → ask confirm_create_task | ✅ | Shows existing tasks + asks confirm_create_task=true |
| `teamleader_find_task` | No projects for company → ask confirm_create_project | ✅ | Fixed v1.3.2: BV Antwerp Nightlife Center → project + group + task created end-to-end |
| `teamleader_find_task` | Task: no tasks in group → auto-create | ✅ | Confirmed: empty group → task auto-created without confirm_create_task |
| `teamleader_find_task` | only_open=false includes done tasks | ✅ | BRN Support: 2 done tasks shown; default only_open=true → hidden |
| `teamleader_load_tasks` | Full tree load (cache miss) | ✅ | Tested on BV Belgian Recycle Network |
| `teamleader_load_tasks` | Cache hit (30 min TTL) | ✅ | |
| `teamleader_load_tasks` | visual=true ASCII tree | ✅ | |
| `teamleader_load_tasks` | only_open=false includes done | ✅ | Fixed: done=[x] cancelled=[-] icons added |
| `teamleader_load_tasks` | force_refresh=true | ✅ | Tested: bypasses 30min cache, reloads from API |
| `teamleader_load_tasks` | task_selection=N caches task | ✅ | visual=true → task_selection=1 → flat cache hit confirmed |
| `teamleader_load_tasks` | project_filter / group_filter | ❌ | |
| `teamleader_load_tasks` | YAML file written correctly | ✅ | ~/.teamleader-tasks-bv-belgian-recycle-network.yaml |
| `teamleader_load_tasks` | on_hold projects included | ✅ | Fixed: was filtering only active |

## Time Logging

| Tool | Test | Status | Notes |
|------|------|--------|-------|
| `teamleader_log_time` | task_name from flat cache | ✅ | Basic flow tested |
| `teamleader_log_time` | task_id shortcut (1st call, tree fresh) | ✅ | Path + entry correct |
| `teamleader_log_time` | task_id shortcut (after tree invalidated) | ✅ | Fixed v1.3.1: verification via timeTracking.info after add |
| `teamleader_log_time` | Tree fallback (scoreTasksInTree) | ✅ | Ambiguous task_name → scored list shown |
| `teamleader_log_time` | confirm_task_match=N | ✅ | Pick from list, full path shown, entry created |
| `teamleader_log_time` | HH:MM time format | ✅ | |
| `teamleader_log_time` | YYYY-MM-DD HH:MM format | ✅ | |
| `teamleader_log_time` | Exact duplicate blocked | ✅ | |
| `teamleader_log_time` | Overlap warning + confirm_overlap | ✅ | |
| `teamleader_log_time` | force=true skips dedup | ❌ | |
| `teamleader_log_time` | date param (past date with HH:MM times) | ✅ | Entry created on 2026-03-01 via date="2026-03-01" + HH:MM |
| `teamleader_log_time` | work_type_id from task cache | ✅ | Verified: task tree + flat cache both propagate work_type_id |
| `teamleader_log_time` | description stored | ✅ | Verified via list |

## Task Maintenance

| Tool | Test | Status | Notes |
|------|------|--------|-------|
| `teamleader_task_action` | close (task_id) | ✅ | `tasks.update` confirmed working |
| `teamleader_task_action` | close (task_number from tree) | ✅ | Fixed v1.3.1: filter open tasks in resolveTaskFromTree |
| `teamleader_task_action` | create (project_id + group_id) | ✅ | |
| `teamleader_task_action` | create (project_id only, no group) | ❌ | |
| `teamleader_task_action` | move_time | ✅ | delete + recreate on new task, verified via get_timetracking |
| `teamleader_task_action` | delete_group | ✅ | Fixed v1.3.2: projectGroups.delete + delete_strategy param |
| `teamleader_task_action` | tree cache invalidated after close | ✅ | invalidateTaskTree called |
| `teamleader_task_action` | tree cache invalidated after create | ✅ | invalidateTaskTree called |
| `teamleader_task_action` | tree cache invalidated after delete_group | ✅ | invalidateTaskTree called |

## Tasks (Legacy API)

| Tool | Test | Status | Notes |
|------|------|--------|-------|
| `teamleader_list_tasks` | Basic list (no filter) | ❌ | |
| `teamleader_list_tasks` | Filter by customer_id + customer_type | ❌ | |
| `teamleader_list_tasks` | Filter by term | ❌ | |
| `teamleader_create_task` | Create (description only) | ❌ | |
| `teamleader_create_task` | Create with assignee + due_on + work_type | ❌ | |
| `teamleader_create_task` | Create linked to customer | ❌ | |

## Time Tracking (raw)

| Tool | Test | Status | Notes |
|------|------|--------|-------|
| `teamleader_list_timetracking` | Basic list (no filter) | ✅ | Returns oldest-first |
| `teamleader_list_timetracking` | Filter by user_id | ✅ | |
| `teamleader_list_timetracking` | Filter by started_after | ✅ | |
| `teamleader_list_timetracking` | Filter by started_before | ❌ | |
| `teamleader_list_timetracking` | Filter by subject_id | ❌ | |
| `teamleader_get_timetracking` | Get by ID | ✅ | Returns full entry incl. meta.updatable |
| `teamleader_add_timetracking` | Add entry (via log_time) | ✅ | Indirect |
| `teamleader_update_timetracking` | Update description | ✅ | Returns {} (normal for Teamleader updates) |
| `teamleader_update_timetracking` | Update times | ❌ | |
| `teamleader_delete_timetracking` | Delete entry | ✅ | |
| `teamleader_start_timer` | Start running timer | ❌ | |
| `teamleader_stop_timer` | Stop running timer | ❌ | |

## Cache Management

| Tool | Test | Status | Notes |
|------|------|--------|-------|
| `teamleader_cache_stats` | Shows correct counts | ✅ | |
| `teamleader_cache_stats` | company_filter works | ❌ | |
| `teamleader_clear_cache` | Clears all data | ✅ | |
| Auto-prune on save | Expired entries removed | ❌ | |

## Projects

| Tool | Test | Status | Notes |
|------|------|--------|-------|
| `teamleader_list_projects_v2` | Basic list | ❌ | |
| `teamleader_list_projects_v2` | Filter by status | ❌ | |
| `teamleader_list_projects_v2` | Filter by company_id | ❌ | |
| `teamleader_get_project_v2` | Get by ID | ❌ | |
| `teamleader_create_project_v2` | Create | ❌ | |
| `teamleader_update_project_v2` | Update status | ❌ | |
| `teamleader_list_project_groups` | List groups | ❌ | |
| `teamleader_list_project_tasks_v2` | List tasks | ❌ | |
| `teamleader_create_project_task_v2` | Create task | ❌ | |
| `teamleader_create_project_group` | Create group | ❌ | |

## CRM

| Tool | Test | Status | Notes |
|------|------|--------|-------|
| `teamleader_list_companies` | Basic list | ❌ | |
| `teamleader_get_company` | Get by ID | ❌ | |
| `teamleader_create_company` | Create | ❌ | |
| `teamleader_list_contacts` | Basic list | ❌ | |
| `teamleader_get_contact` | Get by ID | ❌ | |
| `teamleader_create_contact` | Create | ❌ | |
| `teamleader_update_contact` | Update | ❌ | |
| `teamleader_list_deals` | Basic list | ❌ | |
| `teamleader_get_deal` | Get by ID | ❌ | |
| `teamleader_create_deal` | Create | ❌ | |
| `teamleader_update_deal` | Update | ❌ | |

## Invoices & Events

| Tool | Test | Status | Notes |
|------|------|--------|-------|
| `teamleader_list_invoices` | Basic list | ❌ | |
| `teamleader_get_invoice` | Get by ID | ❌ | |
| `teamleader_create_invoice` | Create draft | ❌ | |
| `teamleader_list_events` | Basic list | ❌ | |
| `teamleader_get_event` | Get by ID | ❌ | |
| `teamleader_create_event` | Create | ❌ | |

## Known API Quirks (documented)

| Endpoint | Quirk |
|----------|-------|
| `projectLines.list` | `project_id` top-level in body, NOT inside `filter` |
| `projectLines.list` | `project_group_id` NOT a server filter — must filter client-side on `l.group?.id` |
| `tasks.list` | status filter is client-side only |
| `tasks.create` | use `group_id` not `project_group_id` |
| `timeTracking.list` | returns `subject.type: "todo"` — ID differs from `nextgenTask` ID |
| `timeTracking.add` | strip milliseconds: `.replace(/\.\d+Z$/, "+00:00")` |
| `projects-v2/projects.create` | Created project has status `"open"` (not `"active"`) |
| `projects-v2/projectLines.create` | Does NOT exist — was wrong endpoint. Use `projectGroups.create` for groups and `tasks.create` for tasks |
| `projects-v2/projectGroups.delete` | Requires `delete_strategy` param: `"ungroup_tasks_and_materials"` or `"delete_tasks_and_materials"` |

---

## Known Bugs

### ✅ BUG-01: log_time task_id after tree invalidation — FIXED (v1.3.1)
**Status:** Fixed (03/03/2026)
**Symptom (old):** After `task_action` invalidates tree → `log_time` with `task_id` returned success but entry was 404.
**Root cause:** Silent API acceptance without verification.
**Fix:** Added `timeTracking.info` verification after `timeTracking.add`. If entry not found → clear error with body sent + force_refresh suggestion.
**Verified:** task_action create → log_time task_id → timeTracking.info ✅ entry exists.

---

## Priority Testing Queue

1. `teamleader_task_action` — create (project_id only, no group)
2. `teamleader_log_time` — force=true skips dedup
3. `teamleader_load_tasks` — project_filter / group_filter
