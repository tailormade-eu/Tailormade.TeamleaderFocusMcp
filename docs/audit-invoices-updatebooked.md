# Audit: invoices.updateBooked vs MCP schema

**Date:** 2026-05-02  
**API doc:** `docs/api/157-invoicesupdatebooked.md`  
**MCP tool:** `teamleader_update_booked_invoice` in `src/tools/invoices.ts`

---

## Summary

| Result | Count |
|--------|-------|
| Missing in MCP (feature gap) | 2 |
| Over-generous in MCP (potential 400) | 1 |
| OK | 10 |
| **Total gaps** | **3** |

---

## Field-by-field comparison

| Field (API path) | API status | Zod status | Risk | Notes |
|-----------------|-----------|-----------|------|-------|
| `id` | required | ✅ required | OK | |
| `invoicee.customer.type` | required | ✅ via `customer_type` | OK | |
| `invoicee.customer.id` | required | ✅ via `customer_id` | OK | |
| `invoicee.for_attention_of` | optional oneOf `{name}` / `{contact_id}` | ❌ MISSING | **data-loss** — cannot set attention line on booked invoices | Present in `update_invoice` but never added to `update_booked_invoice` |
| `payment_term.type` | optional | ✅ via `payment_term_type` | OK | |
| `payment_term.days` | optional | ✅ via `payment_term_days` | OK | |
| `project_id` | optional | ✅ | OK | |
| `grouped_lines[].section.title` | **required** (when section present) | ⚠️ optional in Zod | potential 400 | Schema allows `section: {}` but API requires title. Inherited from shared schema. |
| `grouped_lines[].line_items[].quantity` | required | ✅ | OK | |
| `grouped_lines[].line_items[].description` | required | ✅ | OK | |
| `grouped_lines[].line_items[].extended_description` | nullable | ✅ | OK | |
| `grouped_lines[].line_items[].unit_of_measure_id` | nullable | ✅ | OK | |
| `grouped_lines[].line_items[].unit_price` | required | ✅ | OK | |
| `grouped_lines[].line_items[].tax_rate_id` | required | ✅ | OK | |
| `grouped_lines[].line_items[].discount` | optional | ✅ | OK | |
| `grouped_lines[].line_items[].product_id` | optional | ✅ | OK | |
| `grouped_lines[].line_items[].withholding_tax_rate_id` | optional | ✅ | OK | |
| `grouped_lines[].line_items[].product_category_id` | optional | ✅ | OK | |
| `invoice_date` | optional | ✅ | OK | |
| `note` | nullable | ✅ | OK | |
| `custom_fields[]` | optional | ❌ MISSING | **data-loss** — cannot update custom fields on booked invoices | Present in `update_invoice` but never added to `update_booked_invoice` |

---

## Gaps detail

### B3.3.1 — `for_attention_of` missing (medium)

- **API:** `invoicee.for_attention_of` optional, oneOf `{ name: string }` or `{ contact_id: string }`
- **MCP:** field absent from `update_booked_invoice` Zod schema
- **Impact:** Cannot set/change the attention line on a booked invoice. The `update_invoice` tool already has this field.
- **Fix:** Copy `for_attention_of` union param from `update_invoice` schema and add to `buildUpdateInvoiceBody` mapping for `updateBooked`.

### B3.3.2 — `custom_fields[]` missing (high)

- **API:** `custom_fields[]` optional, same shape as `update_invoice` (id + value: string/number/bool/array/object)
- **MCP:** field absent from `update_booked_invoice` Zod schema
- **Impact:** Cannot update mandatory custom fields on booked invoices → data-loss if those fields must be set post-booking.
- **Fix:** Add `custom_fields` param (same schema as in `update_invoice`) and include in body construction.

### B3.3.3 — `section.title` required in API but optional in MCP (low)

- **API:** `grouped_lines[].section.title` is `stringrequired`
- **MCP:** `title: z.string().optional()` — sending `section: {}` would cause a 400
- **Impact:** Low — only triggers if caller explicitly passes `section: {}` with no title. Inherited issue from shared `grouped_lines` schema (same in `update_invoice`).
- **Fix:** Change `title` to `z.string()` (required) within the section object, or guard in body builder.
