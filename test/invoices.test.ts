import { describe, it, expect } from "vitest";
import {
  buildListInvoicesBody,
  buildRegisterPaymentBody,
  buildCreditPartiallyBody,
  buildUpdateInvoiceBody,
  buildCreateInvoiceBody,
} from "../src/tools/invoices.js";
import type { Invoice } from "../src/types/index.js";
import { z } from "zod";

describe("buildListInvoicesBody", () => {
  it("returns empty body when no params", () => {
    const body = buildListInvoicesBody({});
    expect(body).toEqual({});
    expect(body).not.toHaveProperty("filter");
  });

  it("maps customer to {type, id} object (NOT flat)", () => {
    const body = buildListInvoicesBody({
      customer_type: "company",
      customer_id: "abc-123",
    });
    expect(body.filter).toEqual({
      customer: { type: "company", id: "abc-123" },
    });
  });

  it("does NOT add customer when only customer_type (no customer_id)", () => {
    const body = buildListInvoicesBody({ customer_type: "company" });
    expect(body).not.toHaveProperty("filter");
  });

  it("maps ids to array", () => {
    const body = buildListInvoicesBody({ ids: ["id1", "id2"] });
    expect((body.filter as Record<string, unknown>).ids).toEqual(["id1", "id2"]);
  });

  it("maps sort to [{field, order}]", () => {
    const body = buildListInvoicesBody({ sort_field: "invoice_date", sort_order: "asc" });
    expect(body.sort).toEqual([{ field: "invoice_date", order: "asc" }]);
  });

  it("uses default sort field and order when only sort_field given", () => {
    const body = buildListInvoicesBody({ sort_field: "invoice_date" });
    expect(body.sort).toEqual([{ field: "invoice_date", order: "desc" }]);
  });

  it("maps includes string", () => {
    const body = buildListInvoicesBody({ includes: "late_fees" });
    expect(body.includes).toBe("late_fees");
  });

  it("maps page + page_size correctly", () => {
    const body = buildListInvoicesBody({ page: 3, page_size: 50 });
    expect(body.page).toEqual({ number: 3, size: 50 });
  });

  it("defaults page number to 1 when only page_size given", () => {
    const body = buildListInvoicesBody({ page_size: 10 });
    expect(body.page).toEqual({ number: 1, size: 10 });
  });

  it("maps all filter params correctly", () => {
    const body = buildListInvoicesBody({
      term: "test",
      invoice_number: "2024/1",
      department_id: "dep-1",
      status: ["draft", "outstanding"],
      updated_since: "2024-01-01",
      invoice_date_after: "2024-06-01",
      invoice_date_before: "2024-12-31",
      deal_id: "deal-1",
      project_id: "proj-1",
    });
    const filter = body.filter as Record<string, unknown>;
    expect(filter.term).toBe("test");
    expect(filter.invoice_number).toBe("2024/1");
    expect(filter.department_id).toBe("dep-1");
    expect(filter.status).toEqual(["draft", "outstanding"]);
    expect(filter.updated_since).toBe("2024-01-01");
    expect(filter.invoice_date_after).toBe("2024-06-01");
    expect(filter.invoice_date_before).toBe("2024-12-31");
    expect(filter.deal_id).toBe("deal-1");
    expect(filter.project_id).toBe("proj-1");
  });
});

describe("buildRegisterPaymentBody", () => {
  it("uses paid_at (NOT payment_date) and nested payment object", () => {
    const body = buildRegisterPaymentBody({
      id: "inv-1",
      amount: 100,
      currency: "EUR",
      paid_at: "2026-03-03T10:00:00+01:00",
    });
    expect(body).toEqual({
      id: "inv-1",
      payment: { amount: 100, currency: "EUR" },
      paid_at: "2026-03-03T10:00:00+01:00",
    });
    expect(body).not.toHaveProperty("payment_date");
  });

  it("includes payment_method_id when provided", () => {
    const body = buildRegisterPaymentBody({
      id: "inv-1",
      amount: 50,
      currency: "USD",
      paid_at: "2026-01-01T00:00:00Z",
      payment_method_id: "pm-1",
    });
    expect(body.payment_method_id).toBe("pm-1");
  });
});

describe("buildUpdateInvoiceBody", () => {
  const baseLine = { quantity: 1, description: "Test", unit_price_amount: 100, tax_rate_id: "tr-1" };

  it("maps discount_value 30 to { value: 30, type: 'percentage' }", () => {
    const body = buildUpdateInvoiceBody({
      id: "inv-1",
      line_items: [{ ...baseLine, discount_value: 30 }],
    });
    const lines = (body.grouped_lines as any)[0].line_items;
    expect(lines[0].discount).toEqual({ value: 30, type: "percentage" });
  });

  it("maps discount_value 0 to { value: 0, type: 'percentage' }", () => {
    const body = buildUpdateInvoiceBody({
      id: "inv-1",
      line_items: [{ ...baseLine, discount_value: 0 }],
    });
    const lines = (body.grouped_lines as any)[0].line_items;
    expect(lines[0].discount).toEqual({ value: 0, type: "percentage" });
  });

  it("maps discount_value 100 to { value: 100, type: 'percentage' }", () => {
    const body = buildUpdateInvoiceBody({
      id: "inv-1",
      line_items: [{ ...baseLine, discount_value: 100 }],
    });
    const lines = (body.grouped_lines as any)[0].line_items;
    expect(lines[0].discount).toEqual({ value: 100, type: "percentage" });
  });

  it("omits discount field when discount_value is undefined", () => {
    const body = buildUpdateInvoiceBody({
      id: "inv-1",
      line_items: [baseLine],
    });
    const lines = (body.grouped_lines as any)[0].line_items;
    expect(lines[0]).not.toHaveProperty("discount");
  });

  it("does not include grouped_lines when no line_items", () => {
    const body = buildUpdateInvoiceBody({ id: "inv-1" });
    expect(body).not.toHaveProperty("grouped_lines");
  });

  it("auto-wraps line_items in single group without section title", () => {
    const body = buildUpdateInvoiceBody({ id: "inv-1", line_items: [baseLine] });
    const groups = body.grouped_lines as any[];
    expect(groups).toHaveLength(1);
    expect(groups[0]).not.toHaveProperty("section");
    expect(groups[0].line_items).toHaveLength(1);
  });

  it("grouped_lines with section title is passed as-is", () => {
    const body = buildUpdateInvoiceBody({
      id: "inv-1",
      grouped_lines: [{ section: { title: "Service Agreement JaRa-Tailormade_202605 (70%)" }, line_items: [baseLine] }],
    });
    const groups = body.grouped_lines as any[];
    expect(groups).toHaveLength(1);
    expect(groups[0].section).toEqual({ title: "Service Agreement JaRa-Tailormade_202605 (70%)" });
    expect(groups[0].line_items[0].description).toBe("Test");
  });

  it("grouped_lines with multiple sections sends all groups correctly", () => {
    const body = buildUpdateInvoiceBody({
      id: "inv-1",
      grouped_lines: [
        { section: { title: "Section A" }, line_items: [baseLine] },
        { section: { title: "Section B" }, line_items: [{ ...baseLine, description: "Item B" }] },
      ],
    });
    const groups = body.grouped_lines as any[];
    expect(groups).toHaveLength(2);
    expect(groups[0].section.title).toBe("Section A");
    expect(groups[1].section.title).toBe("Section B");
    expect(groups[1].line_items[0].description).toBe("Item B");
  });

  it("grouped_lines takes precedence over line_items when both provided", () => {
    const body = buildUpdateInvoiceBody({
      id: "inv-1",
      line_items: [baseLine],
      grouped_lines: [{ section: { title: "X" }, line_items: [{ ...baseLine, description: "From grouped" }] }],
    });
    const groups = body.grouped_lines as any[];
    expect(groups[0].section.title).toBe("X");
    expect(groups[0].line_items[0].description).toBe("From grouped");
  });

  it("grouped_lines maps line items with correct unit_price structure", () => {
    const body = buildUpdateInvoiceBody({
      id: "inv-1",
      grouped_lines: [{ line_items: [baseLine] }],
    });
    const groups = body.grouped_lines as any[];
    expect(groups[0].line_items[0].unit_price).toEqual({ amount: 100, tax: "excluding" });
  });

  it("omits discounts when not provided", () => {
    const body = buildUpdateInvoiceBody({ id: "inv-1" });
    expect(body).not.toHaveProperty("discounts");
  });

  it("includes invoice-level discounts array at top level", () => {
    const body = buildUpdateInvoiceBody({
      id: "inv-1",
      discounts: [{ type: "percentage", value: 15.5, description: "winter promotion" }],
    });
    expect(body.discounts).toEqual([{ type: "percentage", value: 15.5, description: "winter promotion" }]);
  });

  it("discounts is at top level, not inside grouped_lines", () => {
    const body = buildUpdateInvoiceBody({
      id: "inv-1",
      discounts: [{ type: "percentage", value: 10 }],
      line_items: [baseLine],
    });
    expect(body).toHaveProperty("discounts");
    const lines = (body.grouped_lines as any)[0].line_items;
    expect(lines[0]).not.toHaveProperty("discounts");
  });

  it("maps invoicee correctly", () => {
    const body = buildUpdateInvoiceBody({
      id: "inv-1",
      customer_type: "company",
      customer_id: "comp-1",
    });
    expect(body.invoicee).toEqual({ customer: { type: "company", id: "comp-1" } });
  });

  it("omits for_attention_of from body when not provided", () => {
    const body = buildUpdateInvoiceBody({
      id: "inv-1",
      customer_type: "company",
      customer_id: "comp-1",
    });
    expect((body.invoicee as any).for_attention_of).toBeUndefined();
  });

  it("includes for_attention_of.name when provided by name", () => {
    const body = buildUpdateInvoiceBody({
      id: "inv-1",
      customer_type: "company",
      customer_id: "comp-1",
      for_attention_of: { name: "Finance Dept." },
    });
    expect((body.invoicee as any).for_attention_of).toEqual({ name: "Finance Dept." });
  });

  it("includes for_attention_of.contact_id when provided by contact", () => {
    const body = buildUpdateInvoiceBody({
      id: "inv-1",
      customer_type: "contact",
      customer_id: "cust-1",
      for_attention_of: { contact_id: "abc-123" },
    });
    expect((body.invoicee as any).for_attention_of).toEqual({ contact_id: "abc-123" });
  });

  it("includes extended_description when provided", () => {
    const body = buildUpdateInvoiceBody({
      id: "inv-1",
      line_items: [{ ...baseLine, extended_description: "Period: 2026-04, ref INV-042" }],
    });
    const lines = (body.grouped_lines as any)[0].line_items;
    expect(lines[0].extended_description).toBe("Period: 2026-04, ref INV-042");
  });

  it("omits extended_description when not provided", () => {
    const body = buildUpdateInvoiceBody({
      id: "inv-1",
      line_items: [baseLine],
    });
    const lines = (body.grouped_lines as any)[0].line_items;
    expect(lines[0]).not.toHaveProperty("extended_description");
  });

  it("includes unit_of_measure_id when provided", () => {
    const body = buildUpdateInvoiceBody({
      id: "inv-1",
      line_items: [{ ...baseLine, unit_of_measure_id: "abc-123" }],
    });
    const lines = (body.grouped_lines as any)[0].line_items;
    expect(lines[0].unit_of_measure_id).toBe("abc-123");
  });

  it("omits unit_of_measure_id when not provided", () => {
    const body = buildUpdateInvoiceBody({
      id: "inv-1",
      line_items: [baseLine],
    });
    const lines = (body.grouped_lines as any)[0].line_items;
    expect(lines[0]).not.toHaveProperty("unit_of_measure_id");
  });

  it("includes withholding_tax_rate_id when provided", () => {
    const body = buildUpdateInvoiceBody({
      id: "inv-1",
      line_items: [{ ...baseLine, withholding_tax_rate_id: "abc-123" }],
    });
    const lines = (body.grouped_lines as any)[0].line_items;
    expect(lines[0].withholding_tax_rate_id).toBe("abc-123");
  });

  it("omits withholding_tax_rate_id when not provided", () => {
    const body = buildUpdateInvoiceBody({
      id: "inv-1",
      line_items: [baseLine],
    });
    const lines = (body.grouped_lines as any)[0].line_items;
    expect(lines[0]).not.toHaveProperty("withholding_tax_rate_id");
  });

  it("includes product_category_id when provided", () => {
    const body = buildUpdateInvoiceBody({
      id: "inv-1",
      line_items: [{ ...baseLine, product_category_id: "abc-123" }],
    });
    const lines = (body.grouped_lines as any)[0].line_items;
    expect(lines[0].product_category_id).toBe("abc-123");
  });

  it("omits product_category_id when not provided", () => {
    const body = buildUpdateInvoiceBody({
      id: "inv-1",
      line_items: [baseLine],
    });
    const lines = (body.grouped_lines as any)[0].line_items;
    expect(lines[0]).not.toHaveProperty("product_category_id");
  });

  it("omits expected_payment_method when not provided", () => {
    const body = buildUpdateInvoiceBody({ id: "inv-1" });
    expect(body).not.toHaveProperty("expected_payment_method");
  });

  it("includes expected_payment_method with reference for sepa_direct_debit", () => {
    const body = buildUpdateInvoiceBody({
      id: "inv-1",
      expected_payment_method: { method: "sepa_direct_debit", reference: "AB1234" },
    });
    expect(body.expected_payment_method).toEqual({ method: "sepa_direct_debit", reference: "AB1234" });
  });

  it("includes expected_payment_method without reference for cash", () => {
    const body = buildUpdateInvoiceBody({
      id: "inv-1",
      expected_payment_method: { method: "cash" },
    });
    expect(body.expected_payment_method).toEqual({ method: "cash" });
  });

  it("sends null to clear expected_payment_method", () => {
    const body = buildUpdateInvoiceBody({
      id: "inv-1",
      expected_payment_method: null,
    });
    expect(body.expected_payment_method).toBeNull();
  });

  it("omits custom_fields when not provided", () => {
    const body = buildUpdateInvoiceBody({ id: "inv-1" });
    expect(body).not.toHaveProperty("custom_fields");
  });

  it("includes custom_fields with string value", () => {
    const body = buildUpdateInvoiceBody({
      id: "inv-1",
      custom_fields: [{ id: "abc", value: "SA JaRa-Tailormade_202604" }],
    });
    expect(body.custom_fields).toEqual([{ id: "abc", value: "SA JaRa-Tailormade_202604" }]);
  });

  it("includes custom_fields with object reference value", () => {
    const body = buildUpdateInvoiceBody({
      id: "inv-1",
      custom_fields: [{ id: "xyz", value: { id: "contact-1", type: "contact" } }],
    });
    expect(body.custom_fields).toEqual([{ id: "xyz", value: { id: "contact-1", type: "contact" } }]);
  });

  it("omits document_template_id when not provided", () => {
    const body = buildUpdateInvoiceBody({ id: "inv-1" });
    expect(body).not.toHaveProperty("document_template_id");
  });

  it("includes document_template_id when provided", () => {
    const body = buildUpdateInvoiceBody({ id: "inv-1", document_template_id: "abc-123" });
    expect(body.document_template_id).toBe("abc-123");
  });

  it("omits delivery_date when not provided", () => {
    const body = buildUpdateInvoiceBody({ id: "inv-1" });
    expect(body).not.toHaveProperty("delivery_date");
  });

  it("includes delivery_date when provided", () => {
    const body = buildUpdateInvoiceBody({ id: "inv-1", delivery_date: "2025-12-08" });
    expect(body.delivery_date).toBe("2025-12-08");
  });

  it("sends null to clear delivery_date", () => {
    const body = buildUpdateInvoiceBody({ id: "inv-1", delivery_date: null });
    expect(body.delivery_date).toBeNull();
  });

  it("omits currency when not provided", () => {
    const body = buildUpdateInvoiceBody({ id: "inv-1" });
    expect(body).not.toHaveProperty("currency");
  });

  it("includes currency with code and exchange_rate when provided", () => {
    const body = buildUpdateInvoiceBody({ id: "inv-1", currency: { code: "USD", exchange_rate: 1.0852 } });
    expect(body.currency).toEqual({ code: "USD", exchange_rate: 1.0852 });
  });

  it("includes currency with code only (no exchange_rate)", () => {
    const body = buildUpdateInvoiceBody({ id: "inv-1", currency: { code: "GBP" } });
    expect(body.currency).toEqual({ code: "GBP" });
  });
});

describe("currency Zod validation", () => {
  const currencySchema = z.object({
    code: z.enum(["BAM","CAD","CHF","CLP","CNY","COP","CZK","DKK","EUR","GBP","INR","ISK","JPY","MAD","MXN","NOK","PEN","PLN","RON","SEK","TRY","USD","ZAR"]),
    exchange_rate: z.number().optional(),
  });

  it("rejects invalid currency code", () => {
    const result = currencySchema.safeParse({ code: "INVALID" });
    expect(result.success).toBe(false);
  });

  it("accepts valid currency code without exchange_rate", () => {
    const result = currencySchema.safeParse({ code: "USD" });
    expect(result.success).toBe(true);
  });

  it("accepts valid currency code with exchange_rate", () => {
    const result = currencySchema.safeParse({ code: "USD", exchange_rate: 1.0852 });
    expect(result.success).toBe(true);
  });
});

describe("discount_value Zod range validation", () => {
  const lineItemSchema = z.object({
    quantity: z.number(),
    description: z.string(),
    unit_price_amount: z.number(),
    tax_rate_id: z.string(),
    discount_value: z.number().min(0).max(100).optional(),
  });

  it("rejects discount_value 101", () => {
    const result = lineItemSchema.safeParse({
      quantity: 1, description: "X", unit_price_amount: 10, tax_rate_id: "tr-1", discount_value: 101,
    });
    expect(result.success).toBe(false);
  });

  it("rejects discount_value -1", () => {
    const result = lineItemSchema.safeParse({
      quantity: 1, description: "X", unit_price_amount: 10, tax_rate_id: "tr-1", discount_value: -1,
    });
    expect(result.success).toBe(false);
  });

  it("accepts discount_value 0", () => {
    const result = lineItemSchema.safeParse({
      quantity: 1, description: "X", unit_price_amount: 10, tax_rate_id: "tr-1", discount_value: 0,
    });
    expect(result.success).toBe(true);
  });

  it("accepts discount_value 100", () => {
    const result = lineItemSchema.safeParse({
      quantity: 1, description: "X", unit_price_amount: 10, tax_rate_id: "tr-1", discount_value: 100,
    });
    expect(result.success).toBe(true);
  });
});

describe("buildCreateInvoiceBody", () => {
  const baseLine = { quantity: 1, description: "Test", unit_price_amount: 100, tax_rate_id: "tr-1" };
  const baseParams = {
    customer_type: "company" as const,
    customer_id: "comp-1",
    department_id: "dep-1",
    payment_term_type: "cash",
    line_items: [baseLine],
  };

  it("omits for_attention_of from body when not provided", () => {
    const body = buildCreateInvoiceBody(baseParams);
    expect((body.invoicee as any).for_attention_of).toBeUndefined();
  });

  it("includes for_attention_of.name when provided by name", () => {
    const body = buildCreateInvoiceBody({
      ...baseParams,
      for_attention_of: { name: "Finance Dept." },
    });
    expect((body.invoicee as any).for_attention_of).toEqual({ name: "Finance Dept." });
  });

  it("includes for_attention_of.contact_id when provided by contact", () => {
    const body = buildCreateInvoiceBody({
      ...baseParams,
      for_attention_of: { contact_id: "abc-123" },
    });
    expect((body.invoicee as any).for_attention_of).toEqual({ contact_id: "abc-123" });
  });

  it("for_attention_of is nested inside invoicee (not top-level)", () => {
    const body = buildCreateInvoiceBody({
      ...baseParams,
      for_attention_of: { name: "Finance" },
    });
    expect(body).not.toHaveProperty("for_attention_of");
    expect((body.invoicee as any)).toHaveProperty("for_attention_of");
  });

  it("maps customer to invoicee.customer object", () => {
    const body = buildCreateInvoiceBody(baseParams);
    expect((body.invoicee as any).customer).toEqual({ type: "company", id: "comp-1" });
  });

  it("omits currency from body when not provided", () => {
    const body = buildCreateInvoiceBody(baseParams);
    expect(body.currency).toBeUndefined();
  });

  it("includes currency object when provided", () => {
    const body = buildCreateInvoiceBody({
      ...baseParams,
      currency: { code: "USD", exchange_rate: 1.0852 },
    });
    expect(body.currency).toEqual({ code: "USD", exchange_rate: 1.0852 });
  });

  it("includes currency without exchange_rate when only code provided", () => {
    const body = buildCreateInvoiceBody({
      ...baseParams,
      currency: { code: "GBP" },
    });
    expect(body.currency).toEqual({ code: "GBP" });
  });

  it("auto-wraps line_items in single group without section title", () => {
    const body = buildCreateInvoiceBody(baseParams);
    const groups = body.grouped_lines as any[];
    expect(groups).toHaveLength(1);
    expect(groups[0]).not.toHaveProperty("section");
    expect(groups[0].line_items).toHaveLength(1);
  });

  it("line_items maps unit_price correctly", () => {
    const body = buildCreateInvoiceBody(baseParams);
    const lines = (body.grouped_lines as any)[0].line_items;
    expect(lines[0].unit_price).toEqual({ amount: 100, tax: "excluding" });
  });

  it("grouped_lines with section title passed as-is", () => {
    const body = buildCreateInvoiceBody({
      customer_type: "company",
      customer_id: "comp-1",
      department_id: "dep-1",
      payment_term_type: "cash",
      grouped_lines: [{ section: { title: "Service Agreement JaRa-Tailormade_202605 (70%)" }, line_items: [baseLine] }],
    });
    const groups = body.grouped_lines as any[];
    expect(groups).toHaveLength(1);
    expect(groups[0].section).toEqual({ title: "Service Agreement JaRa-Tailormade_202605 (70%)" });
    expect(groups[0].line_items[0].description).toBe("Test");
  });

  it("grouped_lines without section omits section key", () => {
    const body = buildCreateInvoiceBody({
      customer_type: "company",
      customer_id: "comp-1",
      department_id: "dep-1",
      payment_term_type: "cash",
      grouped_lines: [{ line_items: [baseLine] }],
    });
    const groups = body.grouped_lines as any[];
    expect(groups[0]).not.toHaveProperty("section");
  });

  it("grouped_lines with multiple sections sends all groups", () => {
    const body = buildCreateInvoiceBody({
      customer_type: "company",
      customer_id: "comp-1",
      department_id: "dep-1",
      payment_term_type: "cash",
      grouped_lines: [
        { section: { title: "Section A" }, line_items: [baseLine] },
        { section: { title: "Section B" }, line_items: [{ ...baseLine, description: "Item B" }] },
      ],
    });
    const groups = body.grouped_lines as any[];
    expect(groups).toHaveLength(2);
    expect(groups[0].section.title).toBe("Section A");
    expect(groups[1].section.title).toBe("Section B");
    expect(groups[1].line_items[0].description).toBe("Item B");
  });

  it("grouped_lines takes precedence over line_items when both provided", () => {
    const body = buildCreateInvoiceBody({
      ...baseParams,
      grouped_lines: [{ section: { title: "X" }, line_items: [{ ...baseLine, description: "From grouped" }] }],
    });
    const groups = body.grouped_lines as any[];
    expect(groups[0].section.title).toBe("X");
    expect(groups[0].line_items[0].description).toBe("From grouped");
  });

  it("grouped_lines maps discount_value to { value, type: 'percentage' }", () => {
    const body = buildCreateInvoiceBody({
      customer_type: "company",
      customer_id: "comp-1",
      department_id: "dep-1",
      payment_term_type: "cash",
      grouped_lines: [{ line_items: [{ ...baseLine, discount_value: 20 }] }],
    });
    const lines = (body.grouped_lines as any)[0].line_items;
    expect(lines[0].discount).toEqual({ value: 20, type: "percentage" });
  });

  it("grouped_lines omits discount when discount_value not provided", () => {
    const body = buildCreateInvoiceBody({
      customer_type: "company",
      customer_id: "comp-1",
      department_id: "dep-1",
      payment_term_type: "cash",
      grouped_lines: [{ line_items: [baseLine] }],
    });
    const lines = (body.grouped_lines as any)[0].line_items;
    expect(lines[0]).not.toHaveProperty("discount");
  });

  it("does not include grouped_lines when neither line_items nor grouped_lines provided", () => {
    const body = buildCreateInvoiceBody({
      customer_type: "company",
      customer_id: "comp-1",
      department_id: "dep-1",
      payment_term_type: "cash",
    });
    expect(body).not.toHaveProperty("grouped_lines");
  });

  it("includes unit_of_measure_id in line_items when provided", () => {
    const body = buildCreateInvoiceBody({
      ...baseParams,
      line_items: [{ ...baseLine, unit_of_measure_id: "uom-42" }],
    });
    const lines = (body.grouped_lines as any)[0].line_items;
    expect(lines[0].unit_of_measure_id).toBe("uom-42");
  });

  it("omits unit_of_measure_id from line_items when not provided", () => {
    const body = buildCreateInvoiceBody(baseParams);
    const lines = (body.grouped_lines as any)[0].line_items;
    expect(lines[0]).not.toHaveProperty("unit_of_measure_id");
  });

  it("includes unit_of_measure_id in grouped_lines when provided", () => {
    const body = buildCreateInvoiceBody({
      customer_type: "company",
      customer_id: "comp-1",
      department_id: "dep-1",
      payment_term_type: "cash",
      grouped_lines: [{ line_items: [{ ...baseLine, unit_of_measure_id: "uom-99" }] }],
    });
    const lines = (body.grouped_lines as any)[0].line_items;
    expect(lines[0].unit_of_measure_id).toBe("uom-99");
  });

  it("omits discounts when not provided", () => {
    const body = buildCreateInvoiceBody(baseParams);
    expect(body).not.toHaveProperty("discounts");
  });

  it("includes invoice-level discounts at top level when provided", () => {
    const body = buildCreateInvoiceBody({
      ...baseParams,
      discounts: [{ type: "percentage", value: 15.5, description: "winter promotion" }],
    });
    expect(body.discounts).toEqual([{ type: "percentage", value: 15.5, description: "winter promotion" }]);
  });

  it("omits expected_payment_method when not provided", () => {
    const body = buildCreateInvoiceBody(baseParams);
    expect(body).not.toHaveProperty("expected_payment_method");
  });

  it("includes expected_payment_method for bank_transfer", () => {
    const body = buildCreateInvoiceBody({
      ...baseParams,
      expected_payment_method: { method: "bank_transfer" },
    });
    expect(body.expected_payment_method).toEqual({ method: "bank_transfer" });
  });

  it("includes expected_payment_method with reference for sepa_direct_debit", () => {
    const body = buildCreateInvoiceBody({
      ...baseParams,
      expected_payment_method: { method: "sepa_direct_debit", reference: "AB1234" },
    });
    expect(body.expected_payment_method).toEqual({ method: "sepa_direct_debit", reference: "AB1234" });
  });

  it("sends null for expected_payment_method when explicitly set to null", () => {
    const body = buildCreateInvoiceBody({
      ...baseParams,
      expected_payment_method: null,
    });
    expect(body.expected_payment_method).toBeNull();
  });

  it("omits custom_fields when not provided", () => {
    const body = buildCreateInvoiceBody(baseParams);
    expect(body).not.toHaveProperty("custom_fields");
  });

  it("includes custom_fields at top level when provided", () => {
    const body = buildCreateInvoiceBody({
      ...baseParams,
      custom_fields: [{ id: "cf-1", value: "some value" }],
    });
    expect(body.custom_fields).toEqual([{ id: "cf-1", value: "some value" }]);
  });

  it("omits document_template_id when not provided", () => {
    const body = buildCreateInvoiceBody(baseParams);
    expect(body).not.toHaveProperty("document_template_id");
  });

  it("includes document_template_id at top level when provided", () => {
    const body = buildCreateInvoiceBody({
      ...baseParams,
      document_template_id: "tmpl-abc-123",
    });
    expect(body.document_template_id).toBe("tmpl-abc-123");
  });

  it("omits delivery_date when not provided", () => {
    const body = buildCreateInvoiceBody(baseParams);
    expect(body).not.toHaveProperty("delivery_date");
  });

  it("includes delivery_date when provided", () => {
    const body = buildCreateInvoiceBody({ ...baseParams, delivery_date: "2025-12-08" });
    expect(body.delivery_date).toBe("2025-12-08");
  });

  it("sends null to clear delivery_date", () => {
    const body = buildCreateInvoiceBody({ ...baseParams, delivery_date: null });
    expect(body.delivery_date).toBeNull();
  });
});

describe("buildCreditPartiallyBody", () => {
  it("uses unit_price.tax = 'excluding' (NOT a currency)", () => {
    const body = buildCreditPartiallyBody({
      id: "inv-1",
      line_items: [
        { quantity: 1, description: "Test", unit_price_amount: 100, tax_rate_id: "tr-1" },
      ],
    });
    const lines = (body.grouped_lines as any)[0].line_items;
    expect(lines[0].unit_price).toEqual({ amount: 100, tax: "excluding" });
  });

  it("includes discount as percentage object", () => {
    const body = buildCreditPartiallyBody({
      id: "inv-1",
      line_items: [
        { quantity: 2, description: "Discount item", unit_price_amount: 50, tax_rate_id: "tr-1", discount_value: 10 },
      ],
    });
    const lines = (body.grouped_lines as any)[0].line_items;
    expect(lines[0].discount).toEqual({ value: 10, type: "percentage" });
  });

  it("adds credit_note_date when provided", () => {
    const body = buildCreditPartiallyBody({
      id: "inv-1",
      credit_note_date: "2026-03-01",
      line_items: [
        { quantity: 1, description: "Test", unit_price_amount: 100, tax_rate_id: "tr-1" },
      ],
    });
    expect(body.credit_note_date).toBe("2026-03-01");
  });
});

describe("Invoice type — top-level objects/relations", () => {
  it("accepts currency_exchange_rate object", () => {
    const inv: Invoice = {
      id: "inv-1",
      currency_exchange_rate: { from: "USD", to: "EUR", rate: 1.1234 },
    };
    expect(inv.currency_exchange_rate).toEqual({ from: "USD", to: "EUR", rate: 1.1234 });
  });

  it("accepts deal relation as IdObject", () => {
    const inv: Invoice = { id: "inv-1", deal: { id: "deal-1", type: "deal" } };
    expect(inv.deal).toEqual({ id: "deal-1", type: "deal" });
  });

  it("accepts deal as null", () => {
    const inv: Invoice = { id: "inv-1", deal: null };
    expect(inv.deal).toBeNull();
  });

  it("accepts project relation as IdObject", () => {
    const inv: Invoice = { id: "inv-1", project: { id: "proj-1", type: "project" } };
    expect(inv.project).toEqual({ id: "proj-1", type: "project" });
  });

  it("accepts project as null", () => {
    const inv: Invoice = { id: "inv-1", project: null };
    expect(inv.project).toBeNull();
  });

  it("accepts file relation as IdObject", () => {
    const inv: Invoice = { id: "inv-1", file: { id: "file-1", type: "file" } };
    expect(inv.file).toEqual({ id: "file-1", type: "file" });
  });

  it("accepts file as null", () => {
    const inv: Invoice = { id: "inv-1", file: null };
    expect(inv.file).toBeNull();
  });

  it("accepts document_template relation as IdObject", () => {
    const inv: Invoice = { id: "inv-1", document_template: { id: "tmpl-1", type: "documentTemplate" } };
    expect(inv.document_template).toEqual({ id: "tmpl-1", type: "documentTemplate" });
  });

  it("accepts discounts array", () => {
    const inv: Invoice = {
      id: "inv-1",
      discounts: [{ type: "percentage", value: 15.5, description: "winter promotion" }],
    };
    expect(inv.discounts).toHaveLength(1);
    expect(inv.discounts![0].value).toBe(15.5);
  });

  it("accepts payment_term object", () => {
    const inv: Invoice = { id: "inv-1", payment_term: { type: "after_invoice_date", days: 30 } };
    expect(inv.payment_term).toEqual({ type: "after_invoice_date", days: 30 });
  });

  it("accepts payments array", () => {
    const inv: Invoice = {
      id: "inv-1",
      payments: [{ paid_at: "2016-03-03T16:44:33+00:00", payment: { amount: 123.3, currency: "EUR" } }],
    };
    expect(inv.payments).toHaveLength(1);
    expect(inv.payments![0].payment.amount).toBe(123.3);
  });

  it("accepts expected_payment_method with method and reference", () => {
    const inv: Invoice = {
      id: "inv-1",
      expected_payment_method: { method: "sepa_direct_debit", reference: "AB1234" },
    };
    expect(inv.expected_payment_method?.method).toBe("sepa_direct_debit");
  });

  it("accepts expected_payment_method as null", () => {
    const inv: Invoice = { id: "inv-1", expected_payment_method: null };
    expect(inv.expected_payment_method).toBeNull();
  });

  it("accepts custom_fields array with string value", () => {
    const inv: Invoice = {
      id: "inv-1",
      custom_fields: [
        { definition: { type: "customFieldDefinition", id: "cf-1" }, value: "some text" },
      ],
    };
    expect(inv.custom_fields).toHaveLength(1);
    expect(inv.custom_fields![0].value).toBe("some text");
  });

  it("accepts custom_fields with object reference value", () => {
    const inv: Invoice = {
      id: "inv-1",
      custom_fields: [
        { definition: { type: "customFieldDefinition", id: "cf-2" }, value: { id: "comp-1", type: "company" } },
      ],
    };
    expect((inv.custom_fields![0].value as any).type).toBe("company");
  });

  it("object/relation fields are absent when not present", () => {
    const inv: Invoice = { id: "inv-3" };
    expect(inv.currency_exchange_rate).toBeUndefined();
    expect(inv.deal).toBeUndefined();
    expect(inv.project).toBeUndefined();
    expect(inv.file).toBeUndefined();
    expect(inv.document_template).toBeUndefined();
    expect(inv.discounts).toBeUndefined();
    expect(inv.payment_term).toBeUndefined();
    expect(inv.payments).toBeUndefined();
    expect(inv.expected_payment_method).toBeUndefined();
    expect(inv.custom_fields).toBeUndefined();
  });
});

describe("Invoice type — top-level scalar fields", () => {
  it("accepts all new scalar fields on Invoice object", () => {
    const inv: Invoice = {
      id: "inv-1",
      sent: true,
      purchase_order_number: "000023",
      payment_reference: "+++084/2613/66074+++",
      note: "Some extra remarks",
      currency: "USD",
      on_hold_since: "2016-02-01",
      delivery_date: "2025-12-08",
      peppol_status: "sent",
    };
    expect(inv.sent).toBe(true);
    expect(inv.purchase_order_number).toBe("000023");
    expect(inv.payment_reference).toBe("+++084/2613/66074+++");
    expect(inv.note).toBe("Some extra remarks");
    expect(inv.currency).toBe("USD");
    expect(inv.on_hold_since).toBe("2016-02-01");
    expect(inv.delivery_date).toBe("2025-12-08");
    expect(inv.peppol_status).toBe("sent");
  });

  it("accepts null for nullable scalar fields", () => {
    const inv: Invoice = {
      id: "inv-2",
      purchase_order_number: null,
      payment_reference: null,
      note: null,
      on_hold_since: null,
      delivery_date: null,
      peppol_status: null,
    };
    expect(inv.purchase_order_number).toBeNull();
    expect(inv.payment_reference).toBeNull();
    expect(inv.note).toBeNull();
    expect(inv.on_hold_since).toBeNull();
    expect(inv.delivery_date).toBeNull();
    expect(inv.peppol_status).toBeNull();
  });

  it("fields are absent when not present (pass-through API response)", () => {
    const inv: Invoice = { id: "inv-3" };
    expect(inv.sent).toBeUndefined();
    expect(inv.purchase_order_number).toBeUndefined();
    expect(inv.payment_reference).toBeUndefined();
    expect(inv.note).toBeUndefined();
    expect(inv.currency).toBeUndefined();
    expect(inv.on_hold_since).toBeUndefined();
    expect(inv.delivery_date).toBeUndefined();
    expect(inv.peppol_status).toBeUndefined();
  });
});

describe("Invoice type — invoicee sub-type", () => {
  it("accepts invoicee with all scalar fields", () => {
    const inv: Invoice = {
      id: "inv-1",
      invoicee: {
        name: "De Rode Duivels",
        vat_number: "BE0899623035",
        customer: { id: "cust-1", type: "company" },
        email: "duivels@test.com",
        national_identification_number: "123",
      },
    };
    expect(inv.invoicee?.name).toBe("De Rode Duivels");
    expect(inv.invoicee?.vat_number).toBe("BE0899623035");
    expect(inv.invoicee?.email).toBe("duivels@test.com");
    expect(inv.invoicee?.national_identification_number).toBe("123");
  });

  it("accepts nullable scalar fields as null", () => {
    const inv: Invoice = {
      id: "inv-1",
      invoicee: {
        customer: { id: "cust-1", type: "company" },
        vat_number: null,
        email: null,
        national_identification_number: null,
      },
    };
    expect(inv.invoicee?.vat_number).toBeNull();
    expect(inv.invoicee?.email).toBeNull();
    expect(inv.invoicee?.national_identification_number).toBeNull();
  });

  it("accepts for_attention_of with name only", () => {
    const inv: Invoice = {
      id: "inv-1",
      invoicee: {
        customer: { id: "cust-1", type: "company" },
        for_attention_of: { name: "Radja Nainggolan" },
      },
    };
    expect(inv.invoicee?.for_attention_of?.name).toBe("Radja Nainggolan");
    expect(inv.invoicee?.for_attention_of?.contact).toBeUndefined();
  });

  it("accepts for_attention_of with contact IdObject", () => {
    const inv: Invoice = {
      id: "inv-1",
      invoicee: {
        customer: { id: "cust-1", type: "company" },
        for_attention_of: { contact: { id: "contact-1", type: "contact" } },
      },
    };
    expect(inv.invoicee?.for_attention_of?.contact?.id).toBe("contact-1");
  });

  it("accepts for_attention_of as null", () => {
    const inv: Invoice = {
      id: "inv-1",
      invoicee: {
        customer: { id: "cust-1", type: "company" },
        for_attention_of: null,
      },
    };
    expect(inv.invoicee?.for_attention_of).toBeNull();
  });

  it("invoicee scalar fields absent when not provided", () => {
    const inv: Invoice = {
      id: "inv-1",
      invoicee: { customer: { id: "cust-1", type: "company" } },
    };
    expect(inv.invoicee?.name).toBeUndefined();
    expect(inv.invoicee?.vat_number).toBeUndefined();
    expect(inv.invoicee?.email).toBeUndefined();
    expect(inv.invoicee?.national_identification_number).toBeUndefined();
    expect(inv.invoicee?.for_attention_of).toBeUndefined();
  });
});
