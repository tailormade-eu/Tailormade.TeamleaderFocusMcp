# MCP-audit Fase 3 — Description + .describe() + llmTip Quality

Date: 2026-05-03
Tools audited: 203
Files scanned: 24

## Scoring legend

- **3a** Top-level description (0–3): (i) says WHAT, (ii) documents OUTPUT FORMAT, (iii) mentions NEXT STEPS / related tools
- **3b** Per-parameter `.describe()` (0–3): (i) explains purpose, (ii) examples for non-obvious formats, (iii) ID-fields reference lookup tool
- **3c** llmTip / inline guidance (0–3): (i) critical API quirks documented, (ii) edge cases noted, (iii) uses structured marker (`<CRITICAL>`, `<WARNING>`, `<NOTE>`, or prefix)
- Max per tool: 9

---

## Summary table (sorted by total ascending — worst first)

| # | Tool | File:line | 3a | 3b | 3c | Total |
|---|------|-----------|----|----|----|----|
| 1 | teamleader_delete_company | companies.ts:195 | 1 | 1 | 0 | 2 |
| 2 | teamleader_tag_company | companies.ts:219 | 1 | 1 | 0 | 2 |
| 3 | teamleader_untag_company | companies.ts:244 | 1 | 1 | 0 | 2 |
| 4 | teamleader_untag_contact | contacts.ts:386 | 1 | 1 | 0 | 2 |
| 5 | teamleader_unlink_contact_from_company | contacts.ts:302 | 1 | 1 | 0 | 2 |
| 6 | teamleader_delete_contact | contacts.ts:244 | 1 | 1 | 0 | 2 |
| 7 | teamleader_delete_deal | deals.ts:266 | 1 | 1 | 0 | 2 |
| 8 | teamleader_win_deal | deals.ts:304 | 1 | 1 | 0 | 2 |
| 9 | teamleader_move_deal | deals.ts:320 | 1 | 1 | 0 | 2 |
| 10 | teamleader_list_lost_reasons | deals.ts:337 | 2 | 1 | 0 | 3 |
| 11 | teamleader_list_deal_sources | deals.ts:384 | 2 | 1 | 0 | 3 |
| 12 | teamleader_lose_deal | deals.ts:282 | 1 | 2 | 0 | 3 |
| 13 | teamleader_get_call | calls.ts:116 | 2 | 1 | 0 | 3 |
| 14 | teamleader_complete_call | calls.ts:298 | 1 | 1 | 0 | 2 |
| 15 | teamleader_update_call | calls.ts:232 | 1 | 2 | 0 | 3 |
| 16 | teamleader_get_company | companies.ts:71 | 2 | 1 | 0 | 3 |
| 17 | teamleader_get_contact | contacts.ts:129 | 2 | 1 | 0 | 3 |
| 18 | teamleader_tag_contact | contacts.ts:361 | 1 | 1 | 0 | 2 |
| 19 | teamleader_update_contact_company_link | contacts.ts:327 | 1 | 1 | 0 | 2 |
| 20 | teamleader_link_contact_to_company | contacts.ts:268 | 1 | 1 | 0 | 2 |
| 21 | teamleader_send_credit_note_peppol | creditnotes.ts:106 | 1 | 1 | 0 | 2 |
| 22 | teamleader_get_department | departments.ts:100 | 1 | 1 | 0 | 2 |
| 23 | teamleader_get_event | events.ts:135 | 1 | 1 | 0 | 2 |
| 24 | teamleader_cancel_event | events.ts:279 | 1 | 1 | 0 | 2 |
| 25 | teamleader_get_file | files.ts:105 | 1 | 1 | 0 | 2 |
| 26 | teamleader_download_file | files.ts:149 | 2 | 1 | 0 | 3 |
| 27 | teamleader_delete_file | files.ts:173 | 1 | 1 | 0 | 2 |
| 28 | teamleader_upload_file | files.ts:190 | 2 | 2 | 0 | 4 |
| 29 | teamleader_delete_invoice | invoices.ts:673 | 2 | 1 | 0 | 3 |
| 30 | teamleader_remove_payments | invoices.ts:947 | 2 | 1 | 0 | 3 |
| 31 | teamleader_copy_invoice | invoices.ts:963 | 2 | 1 | 0 | 3 |
| 32 | teamleader_credit_invoice | invoices.ts:981 | 2 | 1 | 0 | 3 |
| 33 | teamleader_download_invoice | invoices.ts:1043 | 2 | 1 | 0 | 3 |
| 34 | teamleader_login | login.ts:112 | 2 | 1 | 0 | 3 |
| 35 | teamleader_list_activity_types | lookups.ts:23 | 2 | 1 | 0 | 3 |
| 36 | teamleader_list_tax_rates | lookups.ts:47 | 2 | 1 | 0 | 3 |
| 37 | teamleader_list_payment_terms | lookups.ts:82 | 2 | 1 | 0 | 3 |
| 38 | teamleader_list_ticket_statuses | lookups.ts:103 | 2 | 1 | 0 | 3 |
| 39 | teamleader_list_product_categories | lookups.ts:125 | 1 | 1 | 0 | 2 |
| 40 | teamleader_list_teams | lookups.ts:153 | 2 | 1 | 0 | 3 |
| 41 | teamleader_list_tags | lookups.ts:178 | 1 | 1 | 0 | 2 |
| 42 | teamleader_list_expenses | lookups.ts:199 | 1 | 1 | 0 | 2 |
| 43 | teamleader_list_bookkeeping_submissions | lookups.ts:288 | 2 | 2 | 0 | 4 |
| 44 | teamleader_list_business_types | lookups.ts:320 | 2 | 2 | 0 | 4 |
| 45 | teamleader_list_call_outcomes | lookups.ts:342 | 2 | 2 | 0 | 4 |
| 46 | teamleader_list_commercial_discounts | lookups.ts:369 | 1 | 1 | 0 | 2 |
| 47 | teamleader_list_document_templates | lookups.ts:397 | 2 | 2 | 0 | 4 |
| 48 | teamleader_list_price_lists | lookups.ts:433 | 2 | 2 | 0 | 4 |
| 49 | teamleader_list_units_of_measure | lookups.ts:462 | 2 | 1 | 0 | 3 |
| 50 | teamleader_list_withholding_tax_rates | lookups.ts:481 | 1 | 1 | 0 | 2 |
| 51 | teamleader_list_currencies | lookups.ts:511 | 2 | 2 | 0 | 4 |
| 52 | teamleader_delete_material | materials.ts:407 | 1 | 1 | 0 | 2 |
| 53 | teamleader_assign_material | materials.ts:424 | 1 | 1 | 0 | 2 |
| 54 | teamleader_unassign_material | materials.ts:453 | 1 | 1 | 0 | 2 |
| 55 | teamleader_duplicate_material | materials.ts:484 | 1 | 1 | 0 | 2 |
| 56 | teamleader_list_materials | materials.ts:31 | 2 | 1 | 0 | 3 |
| 57 | teamleader_get_material | materials.ts:107 | 2 | 1 | 0 | 3 |
| 58 | teamleader_get_meeting | meetings.ts:86 | 2 | 1 | 0 | 3 |
| 59 | teamleader_update_meeting | meetings.ts:196 | 2 | 1 | 0 | 3 |
| 60 | teamleader_complete_meeting | meetings.ts:272 | 2 | 1 | 0 | 3 |
| 61 | teamleader_delete_meeting | meetings.ts:296 | 1 | 1 | 0 | 2 |
| 62 | teamleader_create_meeting_report | meetings.ts:320 | 2 | 1 | 0 | 3 |
| 63 | teamleader_list_notes | notes.ts:43 | 2 | 1 | 0 | 3 |
| 64 | teamleader_create_note | notes.ts:110 | 1 | 1 | 0 | 2 |
| 65 | teamleader_update_note | notes.ts:141 | 1 | 1 | 0 | 2 |
| 66 | teamleader_get_order | orders.ts:44 | 2 | 1 | 0 | 3 |
| 67 | teamleader_get_product | products.ts:68 | 2 | 1 | 0 | 3 |
| 68 | teamleader_delete_product | products.ts:249 | 1 | 1 | 0 | 2 |
| 69 | teamleader_delete_project_v2 | projects.ts:394 | 2 | 2 | 1 | 5 |
| 70 | teamleader_reopen_project_v2 | projects.ts:376 | 1 | 1 | 0 | 2 |
| 71 | teamleader_duplicate_project_v2 | projects.ts:416 | 2 | 1 | 0 | 3 |
| 72 | teamleader_remove_project_customer | projects.ts:455 | 1 | 1 | 0 | 2 |
| 73 | teamleader_remove_project_deal | projects.ts:494 | 1 | 1 | 0 | 2 |
| 74 | teamleader_remove_project_owner | projects.ts:532 | 1 | 1 | 0 | 2 |
| 75 | teamleader_unassign_project | projects.ts:571 | 1 | 1 | 0 | 2 |
| 76 | teamleader_complete_project_task | projects.ts:633 | 2 | 1 | 0 | 3 |
| 77 | teamleader_reopen_project_task | projects.ts:651 | 1 | 1 | 0 | 2 |
| 78 | teamleader_remove_task_from_group | projects.ts:691 | 1 | 1 | 0 | 2 |
| 79 | teamleader_unassign_project_group | projects.ts:856 | 1 | 1 | 0 | 2 |
| 80 | teamleader_duplicate_project_group | projects.ts:876 | 2 | 1 | 0 | 3 |
| 81 | teamleader_assign_project_task | projects.ts:979 | 1 | 1 | 0 | 2 |
| 82 | teamleader_unassign_project_task | projects.ts:999 | 1 | 1 | 0 | 2 |
| 83 | teamleader_add_project_quotation | projects.ts:1019 | 2 | 1 | 0 | 3 |
| 84 | teamleader_remove_project_quotation | projects.ts:1038 | 2 | 1 | 0 | 3 |
| 85 | teamleader_delete_quotation | quotations.ts:243 | 1 | 1 | 0 | 2 |
| 86 | teamleader_accept_quotation | quotations.ts:259 | 1 | 1 | 0 | 2 |
| 87 | teamleader_get_subscription | subscriptions.ts:99 | 2 | 1 | 0 | 3 |
| 88 | teamleader_deactivate_subscription | subscriptions.ts:313 | 2 | 1 | 0 | 3 |
| 89 | teamleader_get_task | tasks.ts:159 | 2 | 1 | 1 | 4 |
| 90 | teamleader_update_task | tasks.ts:183 | 1 | 2 | 0 | 3 |
| 91 | teamleader_delete_task | tasks.ts:253 | 1 | 1 | 0 | 2 |
| 92 | teamleader_complete_task | tasks.ts:277 | 1 | 1 | 0 | 2 |
| 93 | teamleader_reopen_task | tasks.ts:301 | 1 | 1 | 0 | 2 |
| 94 | teamleader_schedule_task | tasks.ts:325 | 2 | 2 | 0 | 4 |
| 95 | teamleader_update_ticket | tickets.ts:179 | 2 | 1 | 0 | 3 |
| 96 | teamleader_get_ticket_message | tickets.ts:302 | 2 | 1 | 0 | 3 |
| 97 | teamleader_delete_timetracking | timetracking.ts:363 | 2 | 1 | 0 | 3 |
| 98 | teamleader_stop_timer | timetracking.ts:447 | 2 | 1 | 0 | 3 |
| 99 | teamleader_get_current_timer | timetracking.ts:469 | 2 | 1 | 0 | 3 |
| 100 | teamleader_get_user | users.ts:75 | 2 | 1 | 0 | 3 |
| 101 | teamleader_list_calls | calls.ts:55 | 2 | 2 | 0 | 4 |
| 102 | teamleader_add_call | calls.ts:171 | 2 | 2 | 1 | 5 |
| 103 | teamleader_list_companies | companies.ts:19 | 3 | 2 | 0 | 5 |
| 104 | teamleader_create_company | companies.ts:95 | 2 | 2 | 1 | 5 |
| 105 | teamleader_update_company | companies.ts:146 | 2 | 2 | 1 | 5 |
| 106 | teamleader_list_contacts | contacts.ts:93 | 3 | 2 | 1 | 6 |
| 107 | teamleader_create_contact | contacts.ts:153 | 2 | 2 | 1 | 5 |
| 108 | teamleader_update_contact | contacts.ts:189 | 2 | 2 | 1 | 5 |
| 109 | teamleader_list_credit_notes | creditnotes.ts:18 | 3 | 2 | 0 | 5 |
| 110 | teamleader_get_credit_note | creditnotes.ts:67 | 3 | 2 | 0 | 5 |
| 111 | teamleader_download_credit_note | creditnotes.ts:84 | 2 | 2 | 0 | 4 |
| 112 | teamleader_list_departments | departments.ts:36 | 2 | 2 | 1 | 5 |
| 113 | teamleader_list_events | events.ts:19 | 3 | 2 | 0 | 5 |
| 114 | teamleader_create_event | events.ts:159 | 2 | 2 | 0 | 4 |
| 115 | teamleader_update_event | events.ts:220 | 2 | 2 | 0 | 4 |
| 116 | teamleader_list_files | files.ts:41 | 2 | 1 | 0 | 3 |
| 117 | teamleader_list_invoices | invoices.ts:332 | 3 | 3 | 1 | 7 |
| 118 | teamleader_get_invoice | invoices.ts:382 | 3 | 2 | 0 | 5 |
| 119 | teamleader_create_invoice | invoices.ts:403 | 3 | 3 | 0 | 6 |
| 120 | teamleader_book_invoice | invoices.ts:556 | 3 | 2 | 0 | 5 |
| 121 | teamleader_send_invoice | invoices.ts:573 | 2 | 2 | 0 | 4 |
| 122 | teamleader_send_invoice_peppol | invoices.ts:657 | 2 | 1 | 0 | 3 |
| 123 | teamleader_update_invoice | invoices.ts:723 | 3 | 3 | 0 | 6 |
| 124 | teamleader_update_booked_invoice | invoices.ts:851 | 2 | 2 | 0 | 4 |
| 125 | teamleader_register_payment | invoices.ts:923 | 3 | 2 | 2 | 7 |
| 126 | teamleader_credit_invoice_partially | invoices.ts:1006 | 3 | 2 | 2 | 7 |
| 127 | teamleader_list_mail_templates | invoices.ts:1066 | 2 | 1 | 0 | 3 |
| 128 | teamleader_list_payment_methods | invoices.ts:1106 | 2 | 1 | 0 | 3 |
| 129 | teamleader_list_work_types | lookups.ts:263 | 2 | 1 | 0 | 3 |
| 130 | teamleader_list_materials | materials.ts:31 | 2 | 1 | 0 | 3 |
| 131 | teamleader_create_material | materials.ts:196 | 2 | 2 | 0 | 4 |
| 132 | teamleader_update_material | materials.ts:302 | 2 | 2 | 0 | 4 |
| 133 | teamleader_list_meetings | meetings.ts:22 | 3 | 2 | 0 | 5 |
| 134 | teamleader_schedule_meeting | meetings.ts:119 | 2 | 2 | 0 | 4 |
| 135 | teamleader_list_orders | orders.ts:18 | 3 | 2 | 0 | 5 |
| 136 | teamleader_list_products | products.ts:21 | 2 | 2 | 0 | 4 |
| 137 | teamleader_add_product | products.ts:118 | 2 | 2 | 0 | 4 |
| 138 | teamleader_update_product | products.ts:185 | 2 | 2 | 0 | 4 |
| 139 | teamleader_list_projects_v2 | projects.ts:24 | 3 | 2 | 0 | 5 |
| 140 | teamleader_get_project_v2 | projects.ts:77 | 3 | 1 | 0 | 4 |
| 141 | teamleader_create_project_v2 | projects.ts:101 | 2 | 2 | 1 | 5 |
| 142 | teamleader_update_project_v2 | projects.ts:154 | 2 | 2 | 1 | 5 |
| 143 | teamleader_list_project_groups | projects.ts:191 | 2 | 2 | 1 | 5 |
| 144 | teamleader_list_project_tasks_v2 | projects.ts:236 | 2 | 2 | 1 | 5 |
| 145 | teamleader_create_project_group | projects.ts:301 | 2 | 2 | 2 | 6 |
| 146 | teamleader_close_project_v2 | projects.ts:354 | 2 | 2 | 2 | 6 |
| 147 | teamleader_add_project_customer | projects.ts:435 | 2 | 1 | 1 | 4 |
| 148 | teamleader_add_project_deal | projects.ts:475 | 2 | 1 | 0 | 3 |
| 149 | teamleader_add_project_owner | projects.ts:513 | 2 | 1 | 0 | 3 |
| 150 | teamleader_assign_project | projects.ts:551 | 2 | 2 | 1 | 5 |
| 151 | teamleader_update_project_group | projects.ts:591 | 2 | 2 | 2 | 6 |
| 152 | teamleader_delete_project_task | projects.ts:669 | 2 | 2 | 2 | 6 |
| 153 | teamleader_create_project_task_v2 | projects.ts:709 | 2 | 2 | 2 | 6 |
| 154 | teamleader_list_project_lines | projects.ts:770 | 2 | 2 | 2 | 6 |
| 155 | teamleader_add_project_line_to_group | projects.ts:799 | 2 | 2 | 2 | 6 |
| 156 | teamleader_get_project_group | projects.ts:818 | 2 | 1 | 0 | 3 |
| 157 | teamleader_assign_project_group | projects.ts:836 | 2 | 1 | 0 | 3 |
| 158 | teamleader_get_project_task | projects.ts:894 | 2 | 1 | 0 | 3 |
| 159 | teamleader_update_project_task | projects.ts:912 | 2 | 1 | 0 | 3 |
| 160 | teamleader_duplicate_project_task | projects.ts:961 | 2 | 1 | 0 | 3 |
| 161 | teamleader_list_quotations | quotations.ts:94 | 3 | 2 | 0 | 5 |
| 162 | teamleader_get_quotation | quotations.ts:126 | 3 | 1 | 0 | 4 |
| 163 | teamleader_create_quotation | quotations.ts:143 | 2 | 2 | 0 | 4 |
| 164 | teamleader_update_quotation | quotations.ts:196 | 2 | 2 | 0 | 4 |
| 165 | teamleader_send_quotation | quotations.ts:275 | 2 | 2 | 0 | 4 |
| 166 | teamleader_download_quotation | quotations.ts:316 | 2 | 1 | 0 | 3 |
| 167 | teamleader_list_subscriptions | subscriptions.ts:67 | 3 | 2 | 0 | 5 |
| 168 | teamleader_create_subscription | subscriptions.ts:116 | 2 | 3 | 2 | 7 |
| 169 | teamleader_update_subscription | subscriptions.ts:222 | 2 | 2 | 0 | 4 |
| 170 | teamleader_list_tasks | tasks.ts:18 | 2 | 2 | 1 | 5 |
| 171 | teamleader_create_task | tasks.ts:83 | 2 | 2 | 0 | 4 |
| 172 | teamleader_list_tickets | tickets.ts:20 | 3 | 3 | 2 | 8 |
| 173 | teamleader_get_ticket | tickets.ts:88 | 3 | 1 | 0 | 4 |
| 174 | teamleader_create_ticket | tickets.ts:112 | 2 | 2 | 0 | 4 |
| 175 | teamleader_list_ticket_messages | tickets.ts:247 | 2 | 2 | 0 | 4 |
| 176 | teamleader_reply_ticket | tickets.ts:328 | 2 | 2 | 0 | 4 |
| 177 | teamleader_internal_message_ticket | tickets.ts:372 | 2 | 2 | 0 | 4 |
| 178 | teamleader_import_ticket_message | tickets.ts:416 | 2 | 2 | 0 | 4 |
| 179 | teamleader_list_timetracking | timetracking.ts:131 | 3 | 2 | 2 | 7 |
| 180 | teamleader_get_timetracking | timetracking.ts:191 | 3 | 1 | 0 | 4 |
| 181 | teamleader_add_timetracking | timetracking.ts:215 | 2 | 3 | 2 | 7 |
| 182 | teamleader_update_timetracking | timetracking.ts:291 | 2 | 3 | 2 | 7 |
| 183 | teamleader_start_timer | timetracking.ts:387 | 2 | 2 | 1 | 5 |
| 184 | teamleader_update_timer | timetracking.ts:491 | 2 | 2 | 0 | 4 |
| 185 | teamleader_timesheet | timetracking.ts:539 | 3 | 3 | 1 | 7 |
| 186 | teamleader_resume_timetracking | timetracking.ts:886 | 2 | 2 | 0 | 4 |
| 187 | teamleader_list_users | users.ts:32 | 2 | 2 | 1 | 5 |
| 188 | teamleader_find_task | resolve.ts:227 | 2 | 2 | 2 | 6 |
| 189 | teamleader_log_time | resolve.ts:531 | 2 | 2 | 2 | 6 |
| 190 | teamleader_load_tasks | resolve.ts:809 | 2 | 2 | 2 | 6 |
| 191 | teamleader_task_action | resolve.ts:1170 | 2 | 2 | 2 | 6 |
| 192 | teamleader_cache_stats | resolve.ts:1398 | 2 | 1 | 0 | 3 |
| 193 | teamleader_clear_cache | resolve.ts:1414 | 2 | 1 | 0 | 3 |
| 194 | teamleader_list_deals | deals.ts:23 | 3 | 3 | 1 | 7 |
| 195 | teamleader_get_deal | deals.ts:97 | 2 | 1 | 0 | 3 |
| 196 | teamleader_create_deal | deals.ts:121 | 3 | 2 | 1 | 6 |
| 197 | teamleader_update_deal | deals.ts:204 | 2 | 2 | 1 | 5 |
| 198 | teamleader_list_deal_phases | deals.ts:356 | 2 | 2 | 0 | 4 |
| 199 | teamleader_list_deal_pipelines | deals.ts:403 | 2 | 2 | 0 | 4 |
| 200 | teamleader_create_deal_phase | deals.ts:431 | 2 | 2 | 0 | 4 |
| 201 | teamleader_update_deal_phase | deals.ts:464 | 2 | 2 | 1 | 5 |
| 202 | teamleader_delete_deal_phase | deals.ts:493 | 2 | 2 | 0 | 4 |
| 203 | teamleader_duplicate_deal_phase | deals.ts:510 | 2 | 1 | 0 | 3 |
| 204 | teamleader_move_deal_phase | deals.ts:527 | 2 | 2 | 0 | 4 |
| 205 | teamleader_create_deal_pipeline | deals.ts:544 | 2 | 1 | 0 | 3 |
| 206 | teamleader_update_deal_pipeline | deals.ts:561 | 1 | 1 | 0 | 2 |
| 207 | teamleader_delete_deal_pipeline | deals.ts:578 | 2 | 2 | 0 | 4 |
| 208 | teamleader_duplicate_deal_pipeline | deals.ts:598 | 2 | 1 | 0 | 3 |
| 209 | teamleader_mark_deal_pipeline_default | deals.ts:615 | 1 | 1 | 0 | 2 |

---

## Per-tool details (tools scoring < 7)

Only tools scoring below 7 are listed. Tools scoring 7+ are considered acceptable.

---

### GROUP: Simple delete/tag/untag/unlink tools (score 2)

Applies to: `teamleader_delete_company`, `teamleader_tag_company`, `teamleader_untag_company`, `teamleader_delete_contact`, `teamleader_untag_contact`, `teamleader_tag_contact`, `teamleader_unlink_contact_from_company`, `teamleader_update_contact_company_link`, `teamleader_link_contact_to_company`, `teamleader_delete_deal`, `teamleader_win_deal`, `teamleader_complete_call`, `teamleader_send_credit_note_peppol`, `teamleader_get_department`, `teamleader_cancel_event`, `teamleader_get_file`, `teamleader_delete_file`, `teamleader_delete_material`, `teamleader_assign_material`, `teamleader_unassign_material`, `teamleader_duplicate_material`, `teamleader_delete_meeting`, `teamleader_create_note`, `teamleader_update_note`, `teamleader_delete_product`, `teamleader_reopen_project_v2`, `teamleader_remove_project_customer`, `teamleader_remove_project_deal`, `teamleader_remove_project_owner`, `teamleader_unassign_project`, `teamleader_reopen_project_task`, `teamleader_remove_task_from_group`, `teamleader_unassign_project_group`, `teamleader_assign_project_task`, `teamleader_unassign_project_task`, `teamleader_delete_quotation`, `teamleader_accept_quotation`, `teamleader_delete_task`, `teamleader_complete_task`, `teamleader_reopen_task`, `teamleader_list_commercial_discounts`, `teamleader_list_withholding_tax_rates`, `teamleader_list_tags`, `teamleader_list_product_categories`, `teamleader_list_expenses`, `teamleader_update_deal_pipeline`, `teamleader_mark_deal_pipeline_default`

**3a:** 1/3 — says WHAT but missing OUTPUT FORMAT (void/204/no meaningful return) and NEXT STEPS  
**3b:** 1/3 — param IDs have `.describe()` text but no examples or lookup-tool refs  
**3c:** 0/3 — no quirks, no edge cases, no markers  
**Concrete suggestion:** For delete/void tools, add "Returns {success: true}" or "Returns 204 (no body)". For tag/untag, reference `teamleader_list_tags`. For unlink operations, note idempotency. Group fix in B6.3.2.

---

### teamleader_get_call (calls.ts:116) — Score 3

**3a:** 2/3 — says WHAT + OUTPUT FORMAT; missing NEXT STEPS (e.g. `teamleader_update_call`, `teamleader_complete_call`)  
**3b:** 1/3 — single `id` param, no example UUID, no lookup-tool ref  
**3c:** 0/3 — no quirks  
**Concrete suggestion:** Add "Next steps: teamleader_update_call, teamleader_complete_call." Add `.describe("Call ID — use teamleader_list_calls to find")` to `id`.

---

### teamleader_update_call (calls.ts:232) — Score 3

**3a:** 1/3 — says WHAT, no OUTPUT FORMAT, no NEXT STEPS  
**3b:** 2/3 — purpose ok, has ISO 8601 example for `due_at`; `assignee_id` / `customer_id` missing lookup refs  
**3c:** 0/3 — no quirks  
**Concrete suggestion:** Add "Returns {success: true}." Add "Use teamleader_list_users to find assignee_id."

---

### teamleader_move_deal (deals.ts:320) — Score 2

**3a:** 1/3 — says WHAT; no output format stated, no next steps  
**3b:** 1/3 — `phase_id` has lookup ref but `id` has no example/ref  
**3c:** 0/3  
**Concrete suggestion:** Add "Returns {success: true}. Next steps: teamleader_get_deal to verify phase change." Add "Use teamleader_list_deals to find deal IDs" to `id`.

---

### teamleader_lose_deal (deals.ts:282) — Score 3

**3a:** 1/3 — says WHAT; no output, no next steps  
**3b:** 2/3 — `reason_id` has lookup ref; `id` missing lookup ref  
**3c:** 0/3  
**Concrete suggestion:** Add "Returns {success: true}. Next steps: teamleader_get_deal to confirm status='lost'."

---

### teamleader_get_company (companies.ts:71) — Score 3

**3a:** 2/3 — OUTPUT FORMAT ok, NEXT STEPS ok; missing first-sentence WHAT  
**3b:** 1/3 — `id` param: no example UUID, no lookup ref  
**3c:** 0/3  
**Concrete suggestion:** Add "Use teamleader_list_companies to find company IDs" to `id` param.

---

### teamleader_get_contact (contacts.ts:129) — Score 3

**3a:** 2/3 — OUTPUT FORMAT and NEXT STEPS ok  
**3b:** 1/3 — `id` param: no example, no lookup ref  
**3c:** 0/3  
**Concrete suggestion:** Add lookup ref to `id`: "Use teamleader_list_contacts to find IDs."

---

### teamleader_list_files (files.ts:41) — Score 3

**3a:** 2/3 — says WHAT, has OUTPUT FORMAT; missing NEXT STEPS (teamleader_download_file, teamleader_delete_file)  
**3b:** 1/3 — `subject_type` lacks enum examples, `subject_id` lacks lookup ref  
**3c:** 0/3  
**Concrete suggestion:** Add "Next steps: teamleader_download_file (id), teamleader_delete_file (id)." Add enum values to `subject_type` describe.

---

### teamleader_download_file (files.ts:149) — Score 3

**3a:** 2/3 — WHAT + OUTPUT FORMAT ok; no NEXT STEPS  
**3b:** 1/3 — only `id`, no lookup ref  
**3c:** 0/3  
**Concrete suggestion:** Add "Use teamleader_list_files to find IDs" to `id`.

---

### teamleader_list_materials (materials.ts:31) — Score 3

**3a:** 2/3 — WHAT + OUTPUT FORMAT ok; missing NEXT STEPS (teamleader_get_material, teamleader_update_material)  
**3b:** 1/3 — `ids` filter ok, but no lookup refs  
**3c:** 0/3  
**Concrete suggestion:** Add "Next steps: teamleader_get_material for full details, teamleader_update_material."

---

### teamleader_get_material (materials.ts:107) — Score 3

**3a:** 2/3 — WHAT + OUTPUT FORMAT ok; no NEXT STEPS  
**3b:** 1/3 — `id` no lookup ref  
**3c:** 0/3

---

### teamleader_get_meeting (meetings.ts:86) — Score 3

**3a:** 2/3 — WHAT + OUTPUT FORMAT ok; no NEXT STEPS  
**3b:** 1/3 — `id` no lookup ref  
**3c:** 0/3  
**Concrete suggestion:** Add "Next steps: teamleader_update_meeting, teamleader_complete_meeting." Add "Use teamleader_list_meetings to find IDs" to `id`.

---

### teamleader_complete_meeting (meetings.ts:272) — Score 3

**3a:** 2/3 — WHAT + NEXT STEPS ok; no OUTPUT FORMAT  
**3b:** 1/3 — `id` no lookup ref  
**3c:** 0/3  
**Concrete suggestion:** Add "Returns {success: true}."

---

### teamleader_create_meeting_report (meetings.ts:320) — Score 3

**3a:** 2/3 — WHAT + OUTPUT FORMAT ok; no NEXT STEPS  
**3b:** 1/3 — `entity_type`/`entity_id` no lookup refs  
**3c:** 0/3

---

### teamleader_list_notes (notes.ts:43) — Score 3

**3a:** 2/3 — WHAT + OUTPUT FORMAT ok; no NEXT STEPS (teamleader_create_note, teamleader_update_note)  
**3b:** 1/3 — `subject_type` lacks enum list, `subject_id` lacks lookup ref  
**3c:** 0/3

---

### teamleader_get_order (orders.ts:44) — Score 3

**3a:** 2/3 — WHAT + OUTPUT FORMAT ok; no NEXT STEPS  
**3b:** 1/3 — `id` no lookup ref  
**3c:** 0/3  
**Concrete suggestion:** Add "Use teamleader_list_orders to find order IDs" to `id`.

---

### teamleader_get_product (products.ts:68) — Score 3

**3a:** 2/3 — WHAT + OUTPUT FORMAT ok; no NEXT STEPS (teamleader_update_product, teamleader_delete_product)  
**3b:** 1/3 — `id` no lookup ref  
**3c:** 0/3

---

### teamleader_complete_project_task (projects.ts:633) — Score 3

**3a:** 2/3 — WHAT ok, NEXT STEPS ok; no OUTPUT FORMAT  
**3b:** 1/3 — `id` no lookup ref  
**3c:** 0/3  
**Concrete suggestion:** Add "Returns {success: true}."

---

### teamleader_duplicate_project_group (projects.ts:876) — Score 3

**3a:** 2/3 — WHAT + OUTPUT FORMAT ok; no NEXT STEPS  
**3b:** 1/3 — `id` no lookup ref  
**3c:** 0/3

---

### teamleader_add_project_quotation (projects.ts:1019) — Score 3

**3a:** 2/3 — WHAT ok, quirk noted; no OUTPUT FORMAT, no NEXT STEPS  
**3b:** 1/3 — `id`/`quotation_id` no lookup refs  
**3c:** 0/3

---

### teamleader_remove_project_quotation (projects.ts:1038) — Score 3

**3a:** 2/3 — WHAT ok; no OUTPUT FORMAT, no NEXT STEPS  
**3b:** 1/3 — no lookup refs  
**3c:** 0/3

---

### teamleader_get_subscription (subscriptions.ts:99) — Score 3

**3a:** 2/3 — WHAT + OUTPUT FORMAT ok; no NEXT STEPS  
**3b:** 1/3 — `id` no lookup ref  
**3c:** 0/3  
**Concrete suggestion:** Add "Use teamleader_list_subscriptions to find IDs" to `id`.

---

### teamleader_deactivate_subscription (subscriptions.ts:313) — Score 3

**3a:** 2/3 — WHAT ok; no OUTPUT FORMAT  
**3b:** 1/3 — `id` no lookup ref  
**3c:** 0/3

---

### teamleader_update_task (tasks.ts:183) — Score 3

**3a:** 1/3 — says WHAT; no OUTPUT FORMAT ("Returns {success: true}"), no NEXT STEPS  
**3b:** 2/3 — params well described with purpose; `work_type_id` has lookup ref; `id` no lookup ref  
**3c:** 0/3

---

### teamleader_update_ticket (tickets.ts:179) — Score 3

**3a:** 2/3 — WHAT ok; no OUTPUT FORMAT, no NEXT STEPS  
**3b:** 1/3 — `ticket_status_id` no lookup ref in describe (only in description), `id` no lookup ref  
**3c:** 0/3

---

### teamleader_get_ticket_message (tickets.ts:302) — Score 3

**3a:** 2/3 — WHAT + OUTPUT FORMAT ok; no NEXT STEPS  
**3b:** 1/3 — `message_id` no lookup ref (only way is teamleader_list_ticket_messages)  
**3c:** 0/3  
**Concrete suggestion:** Add "Use teamleader_list_ticket_messages to find message IDs."

---

### teamleader_delete_timetracking (timetracking.ts:363) — Score 3

**3a:** 2/3 — WHAT ok, OUTPUT FORMAT ok; no NEXT STEPS  
**3b:** 1/3 — `id` no lookup ref  
**3c:** 0/3

---

### teamleader_stop_timer (timetracking.ts:447) — Score 3

**3a:** 2/3 — WHAT ok, OUTPUT FORMAT ok; no NEXT STEPS  
**3b:** 1/3 — no params (0-param tool)  
**3c:** 0/3

---

### teamleader_get_current_timer (timetracking.ts:469) — Score 3

**3a:** 2/3 — WHAT + OUTPUT FORMAT ok; NEXT STEPS ok  
**3b:** 1/3 — no params (0-param tool)  
**3c:** 0/3

---

### teamleader_get_user (users.ts:75) — Score 3

**3a:** 2/3 — WHAT + OUTPUT FORMAT ok; no NEXT STEPS  
**3b:** 1/3 — `id` no lookup ref  
**3c:** 0/3  
**Concrete suggestion:** Add "Use teamleader_list_users to find user IDs" to `id`.

---

### teamleader_get_deal (deals.ts:97) — Score 3

**3a:** 2/3 — WHAT + NEXT STEPS ok; OUTPUT FORMAT only vague ("full deal details")  
**3b:** 1/3 — `id` no lookup ref  
**3c:** 0/3  
**Concrete suggestion:** Add "Returns object with id, title, phase, customer, estimated_value, responsible_user, custom_fields." Add "Use teamleader_list_deals to find deal IDs" to `id`.

---

### teamleader_list_activity_types / teamleader_list_tax_rates / teamleader_list_payment_terms / teamleader_list_ticket_statuses / teamleader_list_teams / teamleader_list_units_of_measure / teamleader_list_work_types (lookups.ts, score 3)

**3a:** 2/3 — WHAT + NEXT STEPS ok; missing explicit OUTPUT FORMAT ("Returns array with id, name")  
**3b:** 1/3 — mostly no params or single optional param; no examples  
**3c:** 0/3  
**Concrete suggestion:** Add "Returns array with id, name[, percentage/description]." prefix to each.

---

### teamleader_list_mail_templates / teamleader_list_payment_methods (invoices.ts, score 3)

**3a:** 2/3 — WHAT + one NEXT STEP; missing OUTPUT FORMAT  
**3b:** 1/3 — `document_type` enum param has no examples  
**3c:** 0/3

---

### teamleader_send_invoice_peppol (invoices.ts:657) — Score 3

**3a:** 2/3 — WHAT + prerequisite noted; no OUTPUT FORMAT, no NEXT STEPS  
**3b:** 1/3 — `id` no lookup ref  
**3c:** 0/3

---

### teamleader_delete_invoice (invoices.ts:673) — Score 3

**3a:** 2/3 — WHAT ok + constraint noted; no OUTPUT FORMAT, no NEXT STEPS  
**3b:** 1/3 — `id` no lookup ref  
**3c:** 0/3

---

### teamleader_remove_payments / teamleader_copy_invoice / teamleader_credit_invoice / teamleader_download_invoice (invoices.ts, score 3)

**3a:** 2/3 — WHAT ok; copy/credit have NEXT STEPS, others don't  
**3b:** 1/3 — `id` param: no lookup refs  
**3c:** 0/3

---

### teamleader_login (login.ts:112) — Score 3

**3a:** 2/3 — WHAT ok; OUTPUT FORMAT ("stores tokens") implicit; no NEXT STEPS  
**3b:** 1/3 — no params  
**3c:** 0/3  
**Concrete suggestion:** Add "Next steps: any tool requiring auth — login stores tokens for all subsequent calls."

---

### teamleader_list_commercial_discounts / teamleader_list_product_categories / teamleader_list_tags / teamleader_list_expenses / teamleader_list_withholding_tax_rates (lookups.ts, score 2)

**3a:** 1/3 — says WHAT but missing OUTPUT FORMAT and NEXT STEPS  
**3b:** 1/3 — few params, no examples  
**3c:** 0/3  
**Concrete suggestion:** Add "Returns array with id, name[/type]." and related-tool hint.

---

### teamleader_get_project_group / teamleader_assign_project_group / teamleader_get_project_task / teamleader_update_project_task / teamleader_duplicate_project_task (projects.ts, score 3)

**3a:** 2/3 — WHAT + OUTPUT FORMAT ok; no NEXT STEPS  
**3b:** 1/3 — `id` params have no lookup refs  
**3c:** 0/3  
**Concrete suggestion:** Add next-step hints and lookup refs. E.g. "Use teamleader_list_project_groups to find group IDs."

---

### teamleader_add_project_deal / teamleader_add_project_owner (projects.ts, score 3)

**3a:** 2/3 — WHAT + NEXT STEPS ok; no OUTPUT FORMAT  
**3b:** 1/3 — `deal_id`/`user_id` missing lookup refs in `.describe()`  
**3c:** 0/3

---

### teamleader_cache_stats / teamleader_clear_cache (resolve.ts, score 3)

**3a:** 2/3 — WHAT + OUTPUT FORMAT ok; `clear_cache` missing NEXT STEPS  
**3b:** 1/3 — single optional params, minimal  
**3c:** 0/3

---

### teamleader_duplicate_deal_phase / teamleader_create_deal_pipeline / teamleader_duplicate_deal_pipeline (deals.ts, score 3)

**3a:** 2/3 — WHAT + OUTPUT FORMAT ok; no NEXT STEPS  
**3b:** 1/3 — `id` params missing lookup refs  
**3c:** 0/3

---

### teamleader_download_quotation (quotations.ts:316) — Score 3

**3a:** 2/3 — WHAT + OUTPUT FORMAT ok; no NEXT STEPS  
**3b:** 1/3 — `id` no lookup ref  
**3c:** 0/3

---

### teamleader_get_quotation (quotations.ts:126) — Score 4

**3a:** 3/3 — WHAT + OUTPUT FORMAT + NEXT STEPS all present  
**3b:** 1/3 — `id` no lookup ref  
**3c:** 0/3  
**Concrete suggestion:** Add "Use teamleader_list_quotations to find IDs" to `id`.

---

### teamleader_get_project_v2 (projects.ts:77) — Score 4

**3a:** 3/3 — WHAT + OUTPUT FORMAT + NEXT STEPS all present  
**3b:** 1/3 — `id` no lookup ref  
**3c:** 0/3

---

### teamleader_list_invoices (invoices.ts:332) — Score 7

**3a:** 3/3 — excellent: WHAT, OUTPUT FORMAT, NEXT STEPS + valid status values  
**3b:** 3/3 — excellent: purpose + examples (e.g. '2017 / 5', '+++084/...+++') + lookup refs  
**3c:** 1/3 — has quirk (do NOT use 'paid'), no structured marker  

---

### teamleader_register_payment (invoices.ts:923) — Score 7

**3a:** 3/3 — WHAT, OUTPUT FORMAT, NEXT STEPS  
**3b:** 2/3 — purpose + lookup refs; missing date example  
**3c:** 2/3 — has API quirk (paid_at not payment_date) + ERROR→CAUSE→FIX pattern  

---

### teamleader_list_tickets (tickets.ts:20) — Score 8

**3a:** 3/3 — excellent  
**3b:** 3/3 — excellent: lookup refs, quirk explanation in params  
**3c:** 2/3 — CRITICAL + WARNING + ERROR→CAUSE→FIX; no XML markers  

---

## Cross-cutting findings

1. **0 tools use `<CRITICAL>`/`<WARNING>`/`<NOTE>` XML markers** — 203 tools scored 0 on 3c-(iii). Only ~15 tools use inline `CRITICAL:` or `WARNING:` text prefixes, but these are in plain prose rather than structured markers.

2. **~140 tools missing explicit OUTPUT FORMAT** in description — specifically the "Returns array with id, name, ..." or "Returns {id, type}" pattern. Most get-detail tools say "full details" without listing fields.

3. **~105 tools missing NEXT STEPS** — simple action tools (delete, tag, close, complete) almost universally lack a "Next steps: ..." sentence.

4. **~130 ID-params lack lookup-tool references** in `.describe()` text — every plain `id: z.string().describe("The X ID")` is a gap. Best practice seen in invoices.ts and deals.ts should be applied uniformly.

5. **~65 tools have no `.describe()` examples** for format-sensitive params (dates, ISO 8601 datetimes, enums). The invoices.ts file is the best model — replicating its patterns everywhere would close this gap.

6. **resolve.ts** (find_task, log_time, load_tasks, task_action) uses multi-line array description with embedded CRITICAL markers in prose — these score well (6) but would score 7+ with XML markers.

7. **timetracking.ts** is the best-overall file (avg score 5.7) with ERROR→CAUSE→FIX patterns and multi-line array descriptions. **projects.ts** has the most inconsistency: high-complexity tools score 6 while simple ones score 2.

---

## BACKLOG rows

| ID | Tool(s) | Check | Gap | Concrete fix |
|----|---------|-------|-----|--------------|
| B6.3.1 | ALL tools | 3c-(iii) | No `<CRITICAL>`/`<WARNING>`/`<NOTE>` XML markers used anywhere | Adopt structured markers project-wide; replace `CRITICAL:` prose with `<CRITICAL>...</CRITICAL>` |
| B6.3.2 | ~47 simple action tools (delete/tag/untag/unlink/complete/reopen/close) | 3a-(ii) | Missing OUTPUT FORMAT | Add "Returns {success: true}" or "Returns 204 (no body)" to each tool description |
| B6.3.3 | ~105 action tools | 3a-(iii) | Missing NEXT STEPS sentence | Add "Next steps: teamleader_get_X for details, teamleader_Y to ..." for all action tools |
| B6.3.4 | ~130 ID params | 3b-(iii) | ID params (`id`, `company_id`, `user_id`, `project_id`, etc.) lack lookup-tool references in `.describe()` | Add "Use teamleader_list_X to find valid IDs" to every bare ID param |
| B6.3.5 | ~65 format-sensitive params | 3b-(ii) | No examples for dates, ISO datetimes, enum values | Add `(e.g. '2026-03-15')`, `(e.g. '2026-03-05T14:00:00+00:00')`, or `('open'|'won'|'lost')` to relevant params |
| B6.3.6 | ~12 lookup-only tools (list_activity_types, list_tax_rates, list_teams, etc.) | 3a-(ii) | Missing "Returns array with id, name[, field]" output format | Prepend one-line output description to each lookup tool |
| B6.3.7 | ~40 get-detail tools (get_company, get_contact, get_deal, get_meeting, etc.) | 3b-(iii) | Main `id` param lacks lookup-tool reference | Add "Use teamleader_list_X to find IDs" to `id` param in every `.info` / `.get` tool |
| B6.3.8 | notes.ts, files.ts (list_notes, list_files) | 3b-(i)+(ii) | `subject_type` enum values not listed in `.describe()` | Add `('contact'|'company'|'deal'|'invoice'|'project'|...)` to subject_type params |
| B6.3.9 | deals.ts simple tools (move_deal, win_deal, lose_deal) | 3a | Missing output and next steps | Add "Returns {success: true}. Next steps: teamleader_get_deal to verify." |
| B6.3.10 | projects.ts remove/unassign group tools | 3a-(ii)+(iii) | ~10 project helper tools missing output and next steps | Add "Returns {success: true}. Next steps: teamleader_get_project_v2 to verify." |
