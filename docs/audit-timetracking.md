# Audit: timetracking.ts vs API docs

Date: 2026-03-05

---

## 1. Endpoint coverage

| API endpoint | MCP tool | Status |
|---|---|---|
| `timeTracking.list` | `teamleader_list_timetracking` | Covered |
| `timeTracking.info` | `teamleader_get_timetracking` | Covered |
| `timeTracking.add` | `teamleader_add_timetracking` | Covered |
| `timeTracking.update` | `teamleader_update_timetracking` | Covered |
| `timeTracking.delete` | `teamleader_delete_timetracking` | Covered |
| `timeTracking.resume` | `teamleader_resume_timetracking` | Covered |
| `timers.current` | `teamleader_get_current_timer` | Covered |
| `timers.start` | `teamleader_start_timer` | Covered |
| `timers.stop` | `teamleader_stop_timer` | Covered |
| `timers.update` | `teamleader_update_timer` | Covered |

**10/10 endpoints covered.**

---

## 2. Param coverage

### `teamleader_list_timetracking` (timeTracking.list)

| API param | In tool? | Notes |
|---|---|---|
| `filter.ids` | MISSING | Array of IDs filter |
| `filter.user_id` | Yes | |
| `filter.started_after` | Yes | Stripped to date-only |
| `filter.started_before` | Yes | Stripped to date-only |
| `filter.ended_after` | MISSING | |
| `filter.ended_before` | MISSING | |
| `filter.subject` (type+id) | Yes | Via `subject_type` + `subject_id` |
| `filter.subject_types` | MISSING | Array of subject types |
| `filter.relates_to` (type+id) | MISSING | Find entries linked to project/milestone/etc |
| `sort` (field+order) | MISSING | Only field: `starts_on` |
| `page` (size+number) | Yes | |
| `includes` | MISSING | `materials,relates_to` |
| subject_type enum values | **BUG** | Tool has `nextgenTask`, `project` — API says `company`, `contact`, `event`, `todo`, `milestone`, `ticket` (no `nextgenTask` or `project` in filter) |

### `teamleader_get_timetracking` (timeTracking.info)

| API param | In tool? | Notes |
|---|---|---|
| `id` | Yes | |
| `includes` | MISSING | `materials,relates_to` |

### `teamleader_add_timetracking` (timeTracking.add)

| API param | In tool? | Notes |
|---|---|---|
| `started_at` | Yes | Via `started_on` param, mapped to `started_at` in body |
| `ended_at` | Yes | Via `ended_on` param, mapped to `ended_at` in body |
| `duration` | MISSING | Alternative to ended_at: started_at + duration |
| `started_on` (date-only) | MISSING | Duration-only mode: started_on + duration |
| `work_type_id` | Yes | But **required** in tool, optional in API |
| `description` | Yes | |
| `subject` (type+id) | Yes | But **required** in tool, optional in API |
| `invoiceable` | MISSING | |
| `user_id` | Yes | But **required** in tool, optional in API |
| subject.type enum values | **BUG** | Tool has `nextgenTask`, `todo`, `project`, `milestone`, `ticket` — API says `company`, `contact`, `event`, `milestone`, `nextgenTask`, `ticket`, `todo`. Tool is missing `company`, `contact`, `event` and has `project` which is not valid |

### `teamleader_update_timetracking` (timeTracking.update)

| API param | In tool? | Notes |
|---|---|---|
| `id` | Yes | |
| `started_at` | Yes | Via `started_on` param |
| `started_on` (date-only) | MISSING | Duration-only mode |
| `duration` | MISSING | **BUG**: API requires `duration` (not `ended_at`). Tool sends `ended_at` which does not exist in the API |
| `work_type_id` | Yes | |
| `description` | Yes | |
| `subject` (type+id) | MISSING | Can change subject on update |
| `invoiceable` | MISSING | |
| `ended_at` | **BUG** | Tool sends `ended_at` but API does NOT accept `ended_at` — it uses `started_at` + `duration` |

### `teamleader_delete_timetracking` (timeTracking.delete)

| API param | In tool? | Notes |
|---|---|---|
| `id` | Yes | Complete |

### `teamleader_resume_timetracking` (timeTracking.resume)

| API param | In tool? | Notes |
|---|---|---|
| `id` | Yes | |
| `started_at` | Yes | Complete |

### `teamleader_start_timer` (timers.start)

| API param | In tool? | Notes |
|---|---|---|
| `work_type_id` | Yes | But **required** in tool, optional in API |
| `started_at` | MISSING | Optional, defaults to current time |
| `description` | Yes | |
| `subject` (type+id) | Yes | But **required** in tool, optional in API |
| `invoiceable` | MISSING | |
| `user_id` | **BUG** | Tool has `user_id` as required param — API does NOT have this field at all. `timers.start` always starts for the authenticated user |
| subject.type enum values | **BUG** | Tool has `nextgenTask`, `todo`, `project`, `milestone`, `ticket` — API says `company`, `contact`, `event`, `todo`, `milestone`, `ticket`. Tool is missing `company`, `contact`, `event` and has `nextgenTask`, `project` which are not valid |

### `teamleader_stop_timer` (timers.stop)

| API param | In tool? | Notes |
|---|---|---|
| (none) | Correct | API takes no parameters. Tool has dummy `id` param marked as IGNORED |

### `teamleader_get_current_timer` (timers.current)

| API param | In tool? | Notes |
|---|---|---|
| (none) | Correct | Complete |

### `teamleader_update_timer` (timers.update)

| API param | In tool? | Notes |
|---|---|---|
| `work_type_id` | Yes | |
| `started_at` | Yes | |
| `description` | Yes | |
| `subject` (type+id) | Yes | |
| `invoiceable` | Yes | |
| subject.type enum values | Yes | Matches API: `company`, `contact`, `event`, `todo`, `milestone`, `ticket` |

---

## 3. describe() coverage

### `teamleader_list_timetracking`

| Param | Has describe()? |
|---|---|
| `page` | Yes |
| `page_size` | Yes |
| `user_id` | Yes |
| `started_after` | Yes — includes YYYY-MM-DD warning |
| `started_before` | Yes — includes YYYY-MM-DD warning |
| `subject_type` | Yes |
| `subject_id` | Yes |

### `teamleader_get_timetracking`

| Param | Has describe()? |
|---|---|
| `id` | Yes |

### `teamleader_add_timetracking`

| Param | Has describe()? |
|---|---|
| `user_id` | Yes |
| `work_type_id` | Yes — cross-ref to list_work_types |
| `started_on` | Yes — ISO 8601 + milliseconds warning |
| `ended_on` | Yes — ISO 8601 format |
| `subject_type` | Yes |
| `subject_id` | Yes |
| `description` | Yes |

### `teamleader_update_timetracking`

| Param | Has describe()? |
|---|---|
| `id` | Yes |
| `work_type_id` | Yes — cross-ref to list_work_types |
| `started_on` | Yes |
| `ended_on` | Yes |
| `description` | Yes |

### `teamleader_delete_timetracking`

| Param | Has describe()? |
|---|---|
| `id` | Yes |

### `teamleader_start_timer`

| Param | Has describe()? |
|---|---|
| `user_id` | Yes — cross-ref to list_users |
| `work_type_id` | Yes — cross-ref to list_work_types |
| `subject_type` | Yes |
| `subject_id` | Yes |
| `description` | Yes |

### `teamleader_stop_timer`

| Param | Has describe()? |
|---|---|
| `id` | Yes — documents that it's IGNORED |

### `teamleader_get_current_timer`

(no params)

### `teamleader_update_timer`

| Param | Has describe()? |
|---|---|
| `work_type_id` | Yes — cross-ref to list_work_types |
| `started_at` | Yes |
| `description` | Yes |
| `subject_type` | Yes |
| `subject_id` | Yes |
| `invoiceable` | Yes |

### `teamleader_resume_timetracking`

| Param | Has describe()? |
|---|---|
| `id` | Yes |
| `started_at` | Yes |

**All existing params have describe(). No gaps.**

---

## 4. llmTip / description quirk coverage

| Known quirk | Where expected | Present? | Notes |
|---|---|---|---|
| `started_after`/`started_before` accept date-only (`YYYY-MM-DD`), NOT datetime | `list_timetracking` description | Yes | "CRITICAL: started_after/started_before accept date-only format (YYYY-MM-DD) — datetime strings cause 400 Bad Request" |
| `timeTracking.update` requires both `started_at` + `ended_at` — no partial updates | `update_timetracking` description | Yes (but wrong) | Description says "started_at + ended_at together" — **but API actually uses `started_at` + `duration`, NOT `ended_at`**. The CLAUDE.md quirk itself may be wrong. |
| Dedup must match on start time, not subject ID | `add_timetracking` description | Partial | Description warns "do not include milliseconds — causes dedup mismatches" but does NOT explicitly state to match on start time instead of subject ID |
| Use `toFilterDate()` helper (strips ms) — NOT `.toISOString()` | Any time tracking tool | No | Not mentioned in any tool description. Code does use `toDate()` locally for date stripping, but `toFilterDate()` is not referenced |
| `timers.stop` takes no parameters | `stop_timer` description | Yes | "CRITICAL: this API takes NO parameters — it always stops the current user's active timer" |

---

## Summary of bugs and issues

### Critical bugs

1. **`update_timetracking` sends `ended_at` but API expects `duration`** — The API doc for `timeTracking.update` requires `started_at` + `duration` (or `started_on` + `duration`). There is NO `ended_at` field. The tool's auto-fetch logic for "missing started_at/ended_at" is based on a wrong assumption. The CLAUDE.md quirk about "always send started_at + ended_at together" appears to be incorrect per the API docs.

2. **`start_timer` sends `user_id` but API has no such field** — `timers.start` does not accept `user_id`; it always starts for the authenticated user. The tool requires this as a mandatory param and sends it to the API.

3. **Wrong subject type enums** in 3 tools:
   - `list_timetracking` filter: has `nextgenTask`, `project` — should be `company`, `contact`, `event`, `todo`, `milestone`, `ticket`
   - `add_timetracking`: has `project` — should not. Missing `company`, `contact`, `event`
   - `start_timer`: has `nextgenTask`, `project` — should be `company`, `contact`, `event`, `todo`, `milestone`, `ticket`
   - Only `update_timer` has the correct enum

### Missing params (high value)

4. `list_timetracking`: missing `filter.ids`, `filter.ended_after`, `filter.ended_before`, `filter.relates_to`, `sort`, `includes`
5. `add_timetracking`: missing `duration`, `invoiceable`; `user_id`, `work_type_id`, `subject` should be optional (not required)
6. `update_timetracking`: missing `duration` (required by API), `subject`, `invoiceable`
7. `info`: missing `includes` (materials, relates_to)
8. `start_timer`: missing `started_at`, `invoiceable`; `work_type_id`, `subject` should be optional

### Low priority

9. `stop_timer` has a dummy `id` param that's always ignored — should ideally have zero params
10. `add_timetracking` / `update_timetracking` use `started_on`/`ended_on` as param names but send `started_at`/`ended_at` to API — potentially confusing naming
