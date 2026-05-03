import { z } from "zod";

export const customFieldSchema = z.object({
  id: z.string().describe("Custom field definition ID"),
  value: z.union([z.string(), z.number(), z.boolean(), z.null()]).describe("Custom field value"),
});

export const addressSchema = z.object({
  type: z.enum(["primary", "invoicing", "delivery", "visiting"]).describe("Address type"),
  address: z.object({
    line_1: z.string().nullable().describe("Street and number"),
    postal_code: z.string().nullable().describe("Postal code"),
    city: z.string().nullable().describe("City"),
    country: z.string().describe("Country code (ISO 3166-1 alpha-2, e.g. 'BE')"),
    area_level_two_id: z.string().optional().describe("Area level two ID"),
    addressee: z.string().optional().describe("Addressee name"),
  }).describe("Address details"),
});
