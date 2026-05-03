import { describe, it, expect, vi } from "vitest";
import { registerProductTools } from "../src/tools/products.js";

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

describe("registerProductTools — registration", () => {
  it("registers teamleader_list_products", () => {
    const { server, tools } = makeMockServer();
    registerProductTools(server as any, makeMockClient() as any);
    expect(tools["teamleader_list_products"]).toBeDefined();
  });

  it("registers teamleader_add_product", () => {
    const { server, tools } = makeMockServer();
    registerProductTools(server as any, makeMockClient() as any);
    expect(tools["teamleader_add_product"]).toBeDefined();
  });

  it("all registered tools have non-empty descriptions", () => {
    const { server, tools } = makeMockServer();
    registerProductTools(server as any, makeMockClient() as any);
    for (const [, entry] of Object.entries(tools)) {
      expect(entry.description.length).toBeGreaterThan(0);
    }
  });
});

describe("teamleader_list_products — handler", () => {
  it("calls products.list endpoint", async () => {
    const { server, tools } = makeMockServer();
    const client = makeMockClient();
    registerProductTools(server as any, client as any);
    await tools["teamleader_list_products"].handler({});
    expect(client.request).toHaveBeenCalledWith(
      expect.objectContaining({ endpoint: "products.list" })
    );
  });
});

describe("teamleader_delete_product — handler", () => {
  it("calls products.delete endpoint", async () => {
    const { server, tools } = makeMockServer();
    const client = makeMockClient({});
    registerProductTools(server as any, client as any);
    await tools["teamleader_delete_product"].handler({ id: "prod-1" });
    expect(client.request).toHaveBeenCalledWith(
      expect.objectContaining({ endpoint: "products.delete" })
    );
  });
});
