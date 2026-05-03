import { describe, it, expect, vi } from "vitest";
import { registerDealTools } from "../src/tools/deals.js";

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

describe("registerDealTools — registration", () => {
  it("registers teamleader_list_deals", () => {
    const { server, tools } = makeMockServer();
    registerDealTools(server as any, makeMockClient() as any);
    expect(tools["teamleader_list_deals"]).toBeDefined();
  });

  it("registers teamleader_create_deal", () => {
    const { server, tools } = makeMockServer();
    registerDealTools(server as any, makeMockClient() as any);
    expect(tools["teamleader_create_deal"]).toBeDefined();
  });

  it("registers deal pipeline tools", () => {
    const { server, tools } = makeMockServer();
    registerDealTools(server as any, makeMockClient() as any);
    expect(tools["teamleader_list_deal_pipelines"]).toBeDefined();
    expect(tools["teamleader_list_deal_phases"]).toBeDefined();
  });

  it("all registered tools have non-empty descriptions", () => {
    const { server, tools } = makeMockServer();
    registerDealTools(server as any, makeMockClient() as any);
    for (const [, entry] of Object.entries(tools)) {
      expect(entry.description.length).toBeGreaterThan(0);
    }
  });
});

describe("teamleader_list_deals — handler", () => {
  it("calls deals.list endpoint", async () => {
    const { server, tools } = makeMockServer();
    const client = makeMockClient();
    registerDealTools(server as any, client as any);
    await tools["teamleader_list_deals"].handler({});
    expect(client.request).toHaveBeenCalledWith(
      expect.objectContaining({ endpoint: "deals.list" })
    );
  });

  it("maps customer_type + customer_id to filter.customer object", async () => {
    const { server, tools } = makeMockServer();
    const client = makeMockClient();
    registerDealTools(server as any, client as any);
    await tools["teamleader_list_deals"].handler({ customer_type: "company", customer_id: "co-1" });
    const [call] = client.request.mock.calls;
    expect(call[0].body.filter?.customer).toEqual({ type: "company", id: "co-1" });
  });
});

describe("teamleader_win_deal — handler", () => {
  it("calls deals.win endpoint", async () => {
    const { server, tools } = makeMockServer();
    const client = makeMockClient({});
    registerDealTools(server as any, client as any);
    await tools["teamleader_win_deal"].handler({ id: "deal-1" });
    expect(client.request).toHaveBeenCalledWith(
      expect.objectContaining({ endpoint: "deals.win" })
    );
  });
});
