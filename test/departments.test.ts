import { describe, it, expect, vi } from "vitest";
import { registerDepartmentTools } from "../src/tools/departments.js";

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

describe("registerDepartmentTools — registration", () => {
  it("registers teamleader_list_departments", () => {
    const { server, tools } = makeMockServer();
    registerDepartmentTools(server as any, makeMockClient() as any);
    expect(tools["teamleader_list_departments"]).toBeDefined();
  });

  it("registers teamleader_get_department", () => {
    const { server, tools } = makeMockServer();
    registerDepartmentTools(server as any, makeMockClient() as any);
    expect(tools["teamleader_get_department"]).toBeDefined();
  });

  it("all registered tools have non-empty descriptions", () => {
    const { server, tools } = makeMockServer();
    registerDepartmentTools(server as any, makeMockClient() as any);
    for (const [, entry] of Object.entries(tools)) {
      expect(entry.description.length).toBeGreaterThan(0);
    }
  });
});

describe("teamleader_list_departments — handler", () => {
  it("calls departments.list endpoint", async () => {
    const { server, tools } = makeMockServer();
    const client = makeMockClient();
    registerDepartmentTools(server as any, client as any);
    await tools["teamleader_list_departments"].handler({});
    expect(client.request).toHaveBeenCalledWith(
      expect.objectContaining({ endpoint: "departments.list" })
    );
  });
});

describe("teamleader_get_department — handler", () => {
  it("calls departments.info endpoint", async () => {
    const { server, tools } = makeMockServer();
    const client = makeMockClient({ data: {} });
    registerDepartmentTools(server as any, client as any);
    await tools["teamleader_get_department"].handler({ id: "dep-1" });
    expect(client.request).toHaveBeenCalledWith(
      expect.objectContaining({ endpoint: "departments.info" })
    );
  });
});
