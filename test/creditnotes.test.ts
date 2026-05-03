import { describe, it, expect, vi } from "vitest";
import { registerCreditNoteTools } from "../src/tools/creditnotes.js";

function makeMockServer() {
  const tools: Record<string, { description: string; handler: (...args: any[]) => any }> = {};
  const server = {
    tool: vi.fn((name: string, description: string, _schema: unknown, handler: (...args: any[]) => any) => {
      tools[name] = { description, handler };
    }),
  };
  return { server, tools };
}

function makeMockClient(data: unknown = { data: [] }) {
  return { request: vi.fn().mockResolvedValue(data) };
}

describe("registerCreditNoteTools — registration", () => {
  it("registers teamleader_list_credit_notes", () => {
    const { server, tools } = makeMockServer();
    registerCreditNoteTools(server as any, makeMockClient() as any);
    expect(tools["teamleader_list_credit_notes"]).toBeDefined();
  });

  it("registers teamleader_get_credit_note", () => {
    const { server, tools } = makeMockServer();
    registerCreditNoteTools(server as any, makeMockClient() as any);
    expect(tools["teamleader_get_credit_note"]).toBeDefined();
  });

  it("all registered tools have non-empty descriptions", () => {
    const { server, tools } = makeMockServer();
    registerCreditNoteTools(server as any, makeMockClient() as any);
    for (const [, entry] of Object.entries(tools)) {
      expect(entry.description.length).toBeGreaterThan(0);
    }
  });
});

describe("teamleader_list_credit_notes — handler", () => {
  it("calls creditNotes.list endpoint", async () => {
    const { server, tools } = makeMockServer();
    const client = makeMockClient();
    registerCreditNoteTools(server as any, client as any);
    await tools["teamleader_list_credit_notes"].handler({});
    expect(client.request).toHaveBeenCalledWith(
      expect.objectContaining({ endpoint: "creditNotes.list" })
    );
  });
});

describe("teamleader_get_credit_note — handler", () => {
  it("calls creditNotes.info endpoint", async () => {
    const { server, tools } = makeMockServer();
    const client = makeMockClient({ data: {} });
    registerCreditNoteTools(server as any, client as any);
    await tools["teamleader_get_credit_note"].handler({ id: "cn-1" });
    expect(client.request).toHaveBeenCalledWith(
      expect.objectContaining({ endpoint: "creditNotes.info" })
    );
  });
});
