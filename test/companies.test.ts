import { describe, it, expect, vi } from "vitest";
import { registerCompanyTools } from "../src/tools/companies.js";

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

describe("registerCompanyTools — registration", () => {
  it("registers teamleader_list_companies", () => {
    const { server, tools } = makeMockServer();
    registerCompanyTools(server as any, makeMockClient() as any);
    expect(tools["teamleader_list_companies"]).toBeDefined();
  });

  it("registers teamleader_create_company", () => {
    const { server, tools } = makeMockServer();
    registerCompanyTools(server as any, makeMockClient() as any);
    expect(tools["teamleader_create_company"]).toBeDefined();
  });

  it("all registered tools have non-empty descriptions", () => {
    const { server, tools } = makeMockServer();
    registerCompanyTools(server as any, makeMockClient() as any);
    for (const [, entry] of Object.entries(tools)) {
      expect(entry.description.length).toBeGreaterThan(0);
    }
  });
});

describe("teamleader_list_companies — handler", () => {
  it("calls companies.list endpoint", async () => {
    const { server, tools } = makeMockServer();
    const client = makeMockClient();
    registerCompanyTools(server as any, client as any);
    await tools["teamleader_list_companies"].handler({});
    expect(client.request).toHaveBeenCalledWith(
      expect.objectContaining({ endpoint: "companies.list" })
    );
  });

  it("passes term filter when provided", async () => {
    const { server, tools } = makeMockServer();
    const client = makeMockClient();
    registerCompanyTools(server as any, client as any);
    await tools["teamleader_list_companies"].handler({ term: "Acme" });
    const [call] = client.request.mock.calls;
    expect(call[0].body.filter?.term).toBe("Acme");
  });
});

describe("teamleader_create_company — handler", () => {
  it("calls companies.create endpoint", async () => {
    const { server, tools } = makeMockServer();
    const client = makeMockClient({ data: { type: "company", id: "co-1" } });
    registerCompanyTools(server as any, client as any);
    await tools["teamleader_create_company"].handler({ name: "Acme Corp" });
    expect(client.request).toHaveBeenCalledWith(
      expect.objectContaining({ endpoint: "companies.add" })
    );
  });
});
