# Audit: invoices.draft (create) vs API doc

**Date:** 2026-05-02
**Task:** B3.01
**API doc:** `docs/api/149-invoicesdraft.md`
**MCP tool:** `teamleader_create_invoice` in `src/tools/invoices.ts`

---

## Summary

13 fields/features present in the API doc are missing from `teamleader_create_invoice`.
The update tool (`teamleader_update_invoice`) already supports all these fields (added in B2/v3.2.11) — the create tool was never brought up to parity.

---

## Field-by-Field Comparison

| # | API Path | Required | Zod Status | Notes |
|---|----------|----------|------------|-------|
| 1 | `invoicee.customer.type` | yes | ✅ OK | |
| 2 | `invoicee.customer.id` | yes | ✅ OK | |
| 3 | `invoicee.for_attention_of` | no | ❌ MISSING | oneOf `{name}` or `{contact_id}` |
| 4 | `department_id` | yes | ✅ OK | top-level |
| 5 | `payment_term.type` | yes | ✅ OK | |
| 6 | `payment_term.days` | no | ✅ OK | |
| 7 | `currency.code` | no | ❌ MISSING | only in update tool |
| 8 | `currency.exchange_rate` | no | ❌ MISSING | only in update tool |
| 9 | `project_id` | no | ✅ OK | |
| 10 | `purchase_order_number` | no | ✅ OK | |
| 11 | `grouped_lines[].section.title` | no | ❌ MISSING | tool only supports flat line_items (single implicit group, no titles) |
| 12 | `grouped_lines[].line_items[].extended_description` | no | ❌ MISSING | |
| 13 | `grouped_lines[].line_items[].unit_of_measure_id` | no | ❌ MISSING | |
| 14 | `grouped_lines[].line_items[].discount.value/type` | no | ❌ MISSING | |
| 15 | `grouped_lines[].line_items[].product_category_id` | no | ❌ MISSING | |
| 16 | `grouped_lines[].line_items[].withholding_tax_rate_id` | no | ❌ MISSING | |
| 17 | `invoice_date` | no | ✅ OK | |
| 18 | `discounts[]` (invoice-level) | no | ❌ MISSING | distinct from per-line discount |
| 19 | `note` | no | ✅ OK | |
| 20 | `expected_payment_method` | no | ❌ MISSING | oneOf with/without reference |
| 21 | `custom_fields[]` | no | ❌ MISSING | id + value (string/number/bool/array/object) |
| 22 | `document_template_id` | no | ❌ MISSING | |
| 23 | `delivery_date` | no | ❌ MISSING | nullable |

---

## Gaps (13 total)

Ordered by use-case impact:

| Priority | Gap | Impact |
|----------|-----|--------|
| 🔴 high | `currency` (code + exchange_rate) | Foreign-currency invoices impossible to create |
| 🔴 high | `delivery_date` | Required for Belgian VAT compliance on certain invoices |
| 🔴 high | `document_template_id` | Can't select template at creation time |
| 🔴 high | `custom_fields[]` | Can't set mandatory custom fields at creation |
| 🟡 medium | `grouped_lines` (sections + multi-group) | No section titles; no multiple groups at create time |
| 🟡 medium | `line_items[].extended_description` | Common in detailed invoices |
| 🟡 medium | `line_items[].unit_of_measure_id` | Missing unit labels (hour, day, piece) |
| 🟡 medium | `line_items[].discount` | No per-line discounts at creation |
| 🟡 medium | `line_items[].product_category_id` | Accounting classification missing |
| 🟡 medium | `line_items[].withholding_tax_rate_id` | Bedrijfsvoorheffing missing |
| 🟡 medium | `discounts[]` (invoice-level) | No global invoice discount at creation |
| 🟡 medium | `invoicee.for_attention_of` | Attention line missing |
| 🟢 low | `expected_payment_method` | Nice to have; rarely set at draft time |

---

## Root Cause

`teamleader_create_invoice` was written as a minimal MVP. When B2 extended `teamleader_update_invoice` with 12 new fields, the create tool was not updated in parallel. The fix is to align `teamleader_create_invoice` with the full API surface — reusing the `UpdateInvoiceLineItem` / `mapLineItem` helpers already defined in invoices.ts.
