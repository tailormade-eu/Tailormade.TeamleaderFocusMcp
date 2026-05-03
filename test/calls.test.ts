import { describe, it, expect, vi } from "vitest";
import { registerCallTools } from "../src/tools/calls.js";

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

describe("registerCallTools — registration", () => {
  it("registers teamleader_list_calls", () => {
    const { server, tools } = makeMockServer();
    registerCallTools(server as any, makeMockClient() as any);
    expect(tools["teamleader_list_calls"]).toBeDefined();
  });

  it("registers teamleader_add_call", () => {
    const { server, tools } = makeMockServer();
    registerCallTools(server as any, makeMockClient() as any);
    expect(tools["teamleader_add_call"]).toBeDefined();
  });

  it("all registered tools have non-empty descriptions", () => {
    const { server, tools } = makeMockServer();
    registerCallTools(server as any, makeMockClient() as any);
    for (const [, entry] of Object.entries(tools)) {
      expect(entry.description.length).toBeGreaterThan(0);
    }
  });
});

describe("teamleader_list_calls — handler", () => {
  it("calls calls.list endpoint", async () => {
    const { server, tools } = makeMockServer();
    const client = makeMockClient();
    registerCallTools(server as any, client as any);
    await tools["teamleader_list_calls"].handler({});
    expect(client.request).toHaveBeenCalledWith(
      expect.objectContaining({ endpoint: "calls.list" })
    );
  });
});

describe("teamleader_add_call — handler", () => {
  it("calls calls.add endpoint with required params", async () => {
    const { server, tools } = makeMockServer();
    const client = makeMockClient({ data: { type: "call", id: "call-1" } });
    registerCallTools(server as any, client as any);
    await tools["teamleader_add_call"].handler({
      subject: "Test call",
      started_at: "2026-05-01T10:00:00+02:00",
      duration: 30,
    });
    expect(client.request).toHaveBeenCalledWith(
      expect.objectContaining({ endpoint: "calls.add" })
    );
  });
});
