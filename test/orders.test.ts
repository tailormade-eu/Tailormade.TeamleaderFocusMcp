import { describe, it, expect, vi } from "vitest";
import { registerOrderTools } from "../src/tools/orders.js";

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

describe("registerOrderTools — registration", () => {
  it("registers teamleader_list_orders", () => {
    const { server, tools } = makeMockServer();
    registerOrderTools(server as any, makeMockClient() as any);
    expect(tools["teamleader_list_orders"]).toBeDefined();
  });

  it("registers teamleader_get_order", () => {
    const { server, tools } = makeMockServer();
    registerOrderTools(server as any, makeMockClient() as any);
    expect(tools["teamleader_get_order"]).toBeDefined();
  });

  it("all registered tools have non-empty descriptions", () => {
    const { server, tools } = makeMockServer();
    registerOrderTools(server as any, makeMockClient() as any);
    for (const [, entry] of Object.entries(tools)) {
      expect(entry.description.length).toBeGreaterThan(0);
    }
  });
});

describe("teamleader_list_orders — handler", () => {
  it("calls orders.list endpoint", async () => {
    const { server, tools } = makeMockServer();
    const client = makeMockClient();
    registerOrderTools(server as any, client as any);
    await tools["teamleader_list_orders"].handler({});
    expect(client.request).toHaveBeenCalledWith(
      expect.objectContaining({ endpoint: "orders.list" })
    );
  });
});

describe("teamleader_get_order — handler", () => {
  it("calls orders.info endpoint", async () => {
    const { server, tools } = makeMockServer();
    const client = makeMockClient({ data: {} });
    registerOrderTools(server as any, client as any);
    await tools["teamleader_get_order"].handler({ id: "ord-1" });
    expect(client.request).toHaveBeenCalledWith(
      expect.objectContaining({ endpoint: "orders.info" })
    );
  });
});
