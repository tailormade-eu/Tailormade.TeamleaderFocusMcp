# Audit: invoices.info (get_invoice) vs API docs

**Source:** `docs/api/150-invoicesinfo.md`  
**Tool:** `teamleader_get_invoice` in `src/tools/invoices.ts:308`  
**Type:** `Invoice` in `src/types/index.ts:413`  
**Date:** 2026-05-02

---

## Executive Summary

`get_invoice` is a **raw pass-through** — handler returns `JSON.stringify(result, null, 2)` on the full API response. **No data-loss at runtime.** All 37 gaps below are **typing-only** (the `Invoice` TypeScript interface in `src/types/index.ts` is incomplete vs the API response).

Request side: `id` + `includes: "late_fees"` correctly implemented — no gaps.

---

## Gap Table

### Top-level scalar fields

| API path | Status | Impact |
|----------|--------|--------|
| `data.sent` | MISSING from Invoice type | typing-only |
| `data.purchase_order_number` | MISSING from Invoice type | typing-only |
| `data.payment_reference` | MISSING from Invoice type | typing-only |
| `data.note` | MISSING from Invoice type | typing-only |
| `data.currency` | MISSING from Invoice type | typing-only |
| `data.on_hold_since` | MISSING from Invoice type | typing-only |
| `data.delivery_date` | MISSING from Invoice type | typing-only |
| `data.peppol_status` | MISSING from Invoice type (enum: 13 values) | typing-only |

### Top-level relation/object fields

| API path | Status | Impact |
|----------|--------|--------|
| `data.currency_exchange_rate` | MISSING from Invoice type (`{from, to, rate}`) | typing-only |
| `data.deal` | MISSING from Invoice type (IdObject\|null) | typing-only |
| `data.project` | MISSING from Invoice type (IdObject\|null) | typing-only |
| `data.file` | MISSING from Invoice type (IdObject\|null) | typing-only |
| `data.document_template` | MISSING from Invoice type (IdObject) | typing-only |
| `data.discounts[]` | MISSING from Invoice type (`{type, value, description}[]`) | typing-only |
| `data.payment_term` | MISSING from Invoice type (`{type, days?}`) | typing-only |
| `data.payments[]` | MISSING from Invoice type (`{paid_at, payment:{amount,currency}}[]`) | typing-only |
| `data.expected_payment_method` | MISSING from Invoice type (oneOf with/without reference) | typing-only |
| `data.custom_fields[]` | MISSING from Invoice type (`{definition, value}[]`) | typing-only |

### invoicee sub-type

| API path | Status | Impact |
|----------|--------|--------|
| `data.invoicee.name` | MISSING from Invoice.invoicee type | typing-only |
| `data.invoicee.vat_number` | MISSING from Invoice.invoicee type | typing-only |
| `data.invoicee.email` | MISSING from Invoice.invoicee type | typing-only |
| `data.invoicee.national_identification_number` | MISSING from Invoice.invoicee type | typing-only |
| `data.invoicee.for_attention_of` | WRONG TYPE — typed as `IdObject`, API returns `{name?:string\|null, contact?:{id,type}\|null}` | typing-only |

### InvoiceLineItem sub-type

| API path | Status | Impact |
|----------|--------|--------|
| `data.grouped_lines[].line_items[].product` | WRONG — type has `product_id: string`, API returns `product: {id, type}\|null` | typing-only |
| `data.grouped_lines[].line_items[].unit` | MISSING (IdObject\|null) | typing-only |
| `data.grouped_lines[].line_items[].unit_price` | WRONG TYPE — typed as `Money`, API returns `{amount, tax:"excluding"}` | typing-only |
| `data.grouped_lines[].line_items[].tax` | WRONG — type has `tax_rate_id: string`, API returns `tax: {id, type}` | typing-only |
| `data.grouped_lines[].line_items[].total` | MISSING (4 subtotals: tax_exclusive, _before_discount, tax_inclusive, _before_discount) | typing-only |
| `data.grouped_lines[].line_items[].product_category` | MISSING (IdObject\|null) | typing-only |
| `data.grouped_lines[].line_items[].withheld_tax` | MISSING (IdObject\|null) | typing-only |

### Invoice total sub-type

| API path | Status | Impact |
|----------|--------|--------|
| `data.total.tax_exclusive_before_discount` | MISSING | typing-only |
| `data.total.tax_inclusive_before_discount` | MISSING | typing-only |
| `data.total.withheld_taxes[]` | MISSING (`{id, taxable:{amount,currency}, withheld:{amount,currency}}[]`) | typing-only |
| `data.total.due` | MISSING (Money) | typing-only |
| `data.total.due_incasso_inclusive` | MISSING (Money, requires `includes:"late_fees"`) | typing-only |
| `data.total.fixed_late_fee` | MISSING (Money, requires `includes:"late_fees"`) | typing-only |
| `data.total.interest` | MISSING (Money, requires `includes:"late_fees"`) | typing-only |

---

## Count

| Category | Count |
|----------|-------|
| Top-level scalar missing | 8 |
| Top-level relation/object missing | 9 |
| invoicee sub-type wrong/missing | 5 |
| InvoiceLineItem wrong/missing | 7 |
| Invoice total missing | 7 |
| **Total** | **37** |

All 37 are typing-only — no data-loss since the tool is a raw pass-through.

---

## Backlog items

→ B3.2.1 through B3.2.5 added to BACKLOG.md (grouped by sub-type for manageable fix scope).
