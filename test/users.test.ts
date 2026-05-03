import { describe, it, expect, vi } from "vitest";
import { registerUserTools } from "../src/tools/users.js";

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

describe("registerUserTools — registration", () => {
  it("registers teamleader_list_users", () => {
    const { server, tools } = makeMockServer();
    registerUserTools(server as any, makeMockClient() as any);
    expect(tools["teamleader_list_users"]).toBeDefined();
  });

  it("registers teamleader_get_user", () => {
    const { server, tools } = makeMockServer();
    registerUserTools(server as any, makeMockClient() as any);
    expect(tools["teamleader_get_user"]).toBeDefined();
  });

  it("all registered tools have non-empty descriptions", () => {
    const { server, tools } = makeMockServer();
    registerUserTools(server as any, makeMockClient() as any);
    for (const [, entry] of Object.entries(tools)) {
      expect(entry.description.length).toBeGreaterThan(0);
    }
  });
});

describe("teamleader_list_users — handler", () => {
  it("calls users.list endpoint", async () => {
    const { server, tools } = makeMockServer();
    const client = makeMockClient();
    registerUserTools(server as any, client as any);
    await tools["teamleader_list_users"].handler({});
    expect(client.request).toHaveBeenCalledWith(
      expect.objectContaining({ endpoint: "users.list" })
    );
  });
});

describe("teamleader_get_user — handler", () => {
  it("calls users.info endpoint", async () => {
    const { server, tools } = makeMockServer();
    const client = makeMockClient({ data: {} });
    registerUserTools(server as any, client as any);
    await tools["teamleader_get_user"].handler({ id: "usr-1" });
    expect(client.request).toHaveBeenCalledWith(
      expect.objectContaining({ endpoint: "users.info" })
    );
  });
});
