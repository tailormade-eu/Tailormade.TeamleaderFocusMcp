# TL MCP — Backlog

Items hier wachten op een CM-run of manuele fix. Geef elk item een task-nummer bij uitvoering.

---

## Bugs

| # | Prioriteit | Wat | Reden |
|---|-----------|-----|-------|

---

## Verbeteringen

| # | Prioriteit | Wat | Reden |
|---|-----------|-----|-------|
| V1 | MED | `teamleader_timesheet`: ManicTime memo formaat toevoegen als output optie (`format=manictime`) | Raoul genereert memos uit timesheet — nu manueel |
| V2 | MED | `teamleader_log_time`: actieve timer check voor overlap detectie | Edge case: timer loopt + log_time op zelfde task = dubbel |

---

## Nieuwe endpoints

| # | Prioriteit | Wat | Reden |
|---|-----------|-----|-------|

---

## Afgewerkt (referentie)

| Task | Wat |
|------|-----|
| 01-51 | Volledige TL MCP implementatie v3.0.0 (55 tasks) |
| 52 | B2: Fix "Invalid subject" 400 → betere foutmelding in timetracking.ts + resolve.ts (3 locaties) |
| 53 | Fix load_tasks — standalone tasks krijgen [S] marker + task_type in YAML + correct close endpoint |
| 54 | Fix load_tasks — duplicate standalone tasks in [no group] verwijderd |
| 55 | Fix load_tasks — task_selection verkeerd ID bij project_filter → leest nu uit YAML (65/65 tests) |
| B1 | Fix timetracking update started_on — guard + llmTip al in src/, dist/ herbouwd 06-03 |
| V3 | load_tasks project+group filter — al AND-gedrag, geen actie nodig |
| N2 | calls date filter — al geïmplementeerd (scheduled_after/before) |
| N1 | orders get — teamleader_get_order bestaat al (orders.info). Fout in backlog. |
