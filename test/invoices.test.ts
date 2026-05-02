import { describe, it, expect } from "vitest";
import {
  buildListInvoicesBody,
  buildRegisterPaymentBody,
  buildCreditPartiallyBody,
  buildUpdateInvoiceBody,
} from "../src/tools/invoices.js";
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
