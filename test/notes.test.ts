import { describe, it, expect, vi } from "vitest";
import { registerNoteTools } from "../src/tools/notes.js";

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

describe("registerNoteTools — registration", () => {
  it("registers teamleader_list_notes", () => {
    const { server, tools } = makeMockServer();
    registerNoteTools(server as any, makeMockClient() as any);
    expect(tools["teamleader_list_notes"]).toBeDefined();
  });

  it("registers teamleader_create_note", () => {
    const { server, tools } = makeMockServer();
    registerNoteTools(server as any, makeMockClient() as any);
    expect(tools["teamleader_create_note"]).toBeDefined();
  });

  it("all registered tools have non-empty descriptions", () => {
    const { server, tools } = makeMockServer();
    registerNoteTools(server as any, makeMockClient() as any);
    for (const [, entry] of Object.entries(tools)) {
      expect(entry.description.length).toBeGreaterThan(0);
    }
  });
});

describe("teamleader_list_notes — handler", () => {
  it("calls notes.list endpoint", async () => {
    const { server, tools } = makeMockServer();
    const client = makeMockClient();
    registerNoteTools(server as any, client as any);
    await tools["teamleader_list_notes"].handler({ subject_type: "company", subject_id: "co-1" });
    expect(client.request).toHaveBeenCalledWith(
      expect.objectContaining({ endpoint: "notes.list" })
    );
  });

  it("passes subject as {type, id} filter object", async () => {
    const { server, tools } = makeMockServer();
    const client = makeMockClient();
    registerNoteTools(server as any, client as any);
    await tools["teamleader_list_notes"].handler({ subject_type: "deal", subject_id: "deal-5" });
    const [call] = client.request.mock.calls;
    expect(call[0].body.filter?.subject).toEqual({ type: "deal", id: "deal-5" });
  });
});

describe("teamleader_create_note — handler", () => {
  it("calls notes.create endpoint", async () => {
    const { server, tools } = makeMockServer();
    const client = makeMockClient({ data: { type: "note", id: "note-1" } });
    registerNoteTools(server as any, client as any);
    await tools["teamleader_create_note"].handler({
      subject_type: "company",
      subject_id: "co-1",
      content: "A test note",
    });
    expect(client.request).toHaveBeenCalledWith(
      expect.objectContaining({ endpoint: "notes.create" })
    );
  });
});
