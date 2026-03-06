# TL MCP — Backlog

Items hier wachten op een CM-run of manuele fix. Geef elk item een task-nummer bij uitvoering.

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
| N1 | LOW | `teamleader_list_orders` uitbreiden met `get` | Enkel list aanwezig — valideer of create/update zinvol is |

---

## Afgewerkt (referentie)

| Task | Wat |
|------|-----|
| 01-51 | Volledige TL MCP implementatie v3.0.0 (55 tasks) |
| B1 | Fix timetracking update started_on — guard + llmTip al in src/, dist/ herbouwd 06-03 |
| V3 | load_tasks project+group filter — al AND-gedrag, geen actie nodig |
| N2 | calls date filter — al geïmplementeerd (scheduled_after/before) |
