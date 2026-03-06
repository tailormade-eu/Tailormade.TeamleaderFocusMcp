# TL MCP — Backlog

Items hier wachten op een CM-run of manuele fix. Geef elk item een task-nummer bij uitvoering.

---

## Bugs

| # | Prioriteit | Wat | Task |
|---|-----------|-----|------|
| B1 | HIGH | `teamleader_update_timetracking`: started_on verplicht bij duration — tool enforceert dit niet. Live 400 error als alleen duration wordt meegestuurd. Fix: guard + llmTip update. | `tasks/52_fix-timetracking-update.md` |

---

## Verbeteringen

| # | Prioriteit | Wat | Reden |
|---|-----------|-----|-------|
| V1 | MED | `teamleader_timesheet`: ManicTime memo formaat toevoegen als output optie (`format=manictime`) | Raoul genereert memos uit timesheet — nu manueel |
| V2 | MED | `teamleader_log_time`: betere duplicate detectie bij overlap met actieve timer | Edge case: timer loopt + log_time op zelfde task = dubbel |
| V3 | LOW | `teamleader_load_tasks`: `project_filter` + `group_filter` combineren als AND (nu OR) | Grote bedrijven met veel projecten: te veel ruis |

---

## Nieuwe endpoints

| # | Prioriteit | Wat | Reden |
|---|-----------|-----|-------|
| N1 | LOW | `teamleader_list_orders` uitbreiden: nu enkel list + get, geen create/update | Orders komen vanuit Teamleader zelf, create misschien niet nodig — valideer |
| N2 | LOW | Calls vervolledigen: `teamleader_list_calls` filter op date range | Handig voor timesheet-reconstructie |

---

## Technische schuld

| # | Prioriteit | Wat |
|---|-----------|-----|
| T1 | LOW | `IRepository` (Good.Domain) — platte interface wordt te groot naarmate domain groeit. Splitsen per aggregate. (Relevant als Good.Domain backend wordt voor good.be) |

---

## Afgewerkt (referentie)

| Task | Wat |
|------|-----|
| 01-51 | Volledige TL MCP implementatie v3.0.0 (55 tasks) |
| 52 | Fix timetracking update started_on *(task file aangemaakt, nog niet uitgevoerd)* |
