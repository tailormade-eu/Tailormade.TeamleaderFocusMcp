import { describe, it, expect, vi } from "vitest";
import { registerLookupTools } from "../src/tools/lookups.js";

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

describe("registerLookupTools — registration", () => {
  it("registers teamleader_list_activity_types", () => {
    const { server, tools } = makeMockServer();
    registerLookupTools(server as any, makeMockClient() as any);
    expect(tools["teamleader_list_activity_types"]).toBeDefined();
  });

  it("registers teamleader_list_tax_rates", () => {
    const { server, tools } = makeMockServer();
    registerLookupTools(server as any, makeMockClient() as any);
    expect(tools["teamleader_list_tax_rates"]).toBeDefined();
  });

  it("registers teamleader_list_work_types", () => {
    const { server, tools } = makeMockServer();
    registerLookupTools(server as any, makeMockClient() as any);
    expect(tools["teamleader_list_work_types"]).toBeDefined();
  });

  it("all registered tools have non-empty descriptions", () => {
    const { server, tools } = makeMockServer();
    registerLookupTools(server as any, makeMockClient() as any);
    for (const [, entry] of Object.entries(tools)) {
      expect(entry.description.length).toBeGreaterThan(0);
    }
  });
});

describe("teamleader_list_activity_types — handler", () => {
  it("calls activityTypes.list endpoint", async () => {
    const { server, tools } = makeMockServer();
    const client = makeMockClient();
    registerLookupTools(server as any, client as any);
    await tools["teamleader_list_activity_types"].handler({});
    expect(client.request).toHaveBeenCalledWith(
      expect.objectContaining({ endpoint: "activityTypes.list" })
    );
  });
});

describe("teamleader_list_tax_rates — handler", () => {
  it("calls taxRates.list endpoint", async () => {
    const { server, tools } = makeMockServer();
    const client = makeMockClient();
    registerLookupTools(server as any, client as any);
    await tools["teamleader_list_tax_rates"].handler({});
    expect(client.request).toHaveBeenCalledWith(
      expect.objectContaining({ endpoint: "taxRates.list" })
    );
  });
});
