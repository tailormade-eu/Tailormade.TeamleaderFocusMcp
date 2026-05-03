import { describe, it, expect, vi } from "vitest";
import { registerTaskTools } from "../src/tools/tasks.js";

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

describe("registerTaskTools — registration", () => {
  it("registers teamleader_list_tasks", () => {
    const { server, tools } = makeMockServer();
    registerTaskTools(server as any, makeMockClient() as any);
    expect(tools["teamleader_list_tasks"]).toBeDefined();
  });

  it("registers teamleader_create_task", () => {
    const { server, tools } = makeMockServer();
    registerTaskTools(server as any, makeMockClient() as any);
    expect(tools["teamleader_create_task"]).toBeDefined();
  });

  it("registers complete and reopen task tools", () => {
    const { server, tools } = makeMockServer();
    registerTaskTools(server as any, makeMockClient() as any);
    expect(tools["teamleader_complete_task"]).toBeDefined();
    expect(tools["teamleader_reopen_task"]).toBeDefined();
  });

  it("all registered tools have non-empty descriptions", () => {
    const { server, tools } = makeMockServer();
    registerTaskTools(server as any, makeMockClient() as any);
    for (const [, entry] of Object.entries(tools)) {
      expect(entry.description.length).toBeGreaterThan(0);
    }
  });
});

describe("teamleader_list_tasks — handler", () => {
  it("calls tasks.list endpoint", async () => {
    const { server, tools } = makeMockServer();
    const client = makeMockClient();
    registerTaskTools(server as any, client as any);
    await tools["teamleader_list_tasks"].handler({});
    expect(client.request).toHaveBeenCalledWith(
      expect.objectContaining({ endpoint: "tasks.list" })
    );
  });

  it("maps customer_type + customer_id to filter.customer", async () => {
    const { server, tools } = makeMockServer();
    const client = makeMockClient();
    registerTaskTools(server as any, client as any);
    await tools["teamleader_list_tasks"].handler({ customer_type: "contact", customer_id: "ct-1" });
    const [call] = client.request.mock.calls;
    expect(call[0].body.filter?.customer).toEqual({ type: "contact", id: "ct-1" });
  });
});

describe("teamleader_complete_task — handler", () => {
  it("calls tasks.complete endpoint", async () => {
    const { server, tools } = makeMockServer();
    const client = makeMockClient({});
    registerTaskTools(server as any, client as any);
    await tools["teamleader_complete_task"].handler({ id: "task-1" });
    expect(client.request).toHaveBeenCalledWith(
      expect.objectContaining({ endpoint: "tasks.complete" })
    );
  });
});
