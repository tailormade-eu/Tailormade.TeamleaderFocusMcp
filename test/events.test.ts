import { describe, it, expect, vi } from "vitest";
import { registerEventTools } from "../src/tools/events.js";

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

describe("registerEventTools — registration", () => {
  it("registers teamleader_list_events", () => {
    const { server, tools } = makeMockServer();
    registerEventTools(server as any, makeMockClient() as any);
    expect(tools["teamleader_list_events"]).toBeDefined();
  });

  it("registers teamleader_create_event", () => {
    const { server, tools } = makeMockServer();
    registerEventTools(server as any, makeMockClient() as any);
    expect(tools["teamleader_create_event"]).toBeDefined();
  });

  it("all registered tools have non-empty descriptions", () => {
    const { server, tools } = makeMockServer();
    registerEventTools(server as any, makeMockClient() as any);
    for (const [, entry] of Object.entries(tools)) {
      expect(entry.description.length).toBeGreaterThan(0);
    }
  });
});

describe("teamleader_list_events — handler", () => {
  it("calls events.list endpoint", async () => {
    const { server, tools } = makeMockServer();
    const client = makeMockClient();
    registerEventTools(server as any, client as any);
    await tools["teamleader_list_events"].handler({});
    expect(client.request).toHaveBeenCalledWith(
      expect.objectContaining({ endpoint: "events.list" })
    );
  });
});

describe("teamleader_cancel_event — handler", () => {
  it("calls events.cancel endpoint", async () => {
    const { server, tools } = makeMockServer();
    const client = makeMockClient({});
    registerEventTools(server as any, client as any);
    await tools["teamleader_cancel_event"].handler({ id: "evt-1" });
    expect(client.request).toHaveBeenCalledWith(
      expect.objectContaining({ endpoint: "events.cancel" })
    );
  });
});
