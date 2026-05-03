import { describe, it, expect, vi } from "vitest";
import { registerProjectTools } from "../src/tools/projects.js";

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

describe("registerProjectTools — registration", () => {
  it("registers teamleader_list_projects_v2", () => {
    const { server, tools } = makeMockServer();
    registerProjectTools(server as any, makeMockClient() as any);
    expect(tools["teamleader_list_projects_v2"]).toBeDefined();
  });

  it("registers teamleader_create_project_v2", () => {
    const { server, tools } = makeMockServer();
    registerProjectTools(server as any, makeMockClient() as any);
    expect(tools["teamleader_create_project_v2"]).toBeDefined();
  });

  it("registers project group and task tools", () => {
    const { server, tools } = makeMockServer();
    registerProjectTools(server as any, makeMockClient() as any);
    expect(tools["teamleader_list_project_groups"]).toBeDefined();
    expect(tools["teamleader_list_project_tasks_v2"]).toBeDefined();
    expect(tools["teamleader_create_project_task_v2"]).toBeDefined();
  });

  it("all registered tools have non-empty descriptions", () => {
    const { server, tools } = makeMockServer();
    registerProjectTools(server as any, makeMockClient() as any);
    for (const [, entry] of Object.entries(tools)) {
      expect(entry.description.length).toBeGreaterThan(0);
    }
  });
});

describe("teamleader_list_projects_v2 — handler", () => {
  it("calls projects-v2/projects.list endpoint", async () => {
    const { server, tools } = makeMockServer();
    const client = makeMockClient();
    registerProjectTools(server as any, client as any);
    await tools["teamleader_list_projects_v2"].handler({});
    expect(client.request).toHaveBeenCalledWith(
      expect.objectContaining({ endpoint: "projects-v2/projects.list" })
    );
  });
});

describe("teamleader_close_project_v2 — handler", () => {
  it("calls projects-v2/projects.close endpoint", async () => {
    const { server, tools } = makeMockServer();
    const client = makeMockClient({});
    registerProjectTools(server as any, client as any);
    await tools["teamleader_close_project_v2"].handler({
      id: "proj-1",
      closing_strategy: "none",
    });
    expect(client.request).toHaveBeenCalledWith(
      expect.objectContaining({ endpoint: "projects-v2/projects.close" })
    );
  });
});

describe("teamleader_list_project_tasks_v2 — handler", () => {
  it("calls projects-v2/projectLines.list endpoint", async () => {
    const { server, tools } = makeMockServer();
    const client = makeMockClient();
    registerProjectTools(server as any, client as any);
    await tools["teamleader_list_project_tasks_v2"].handler({ project_id: "proj-1" });
    expect(client.request).toHaveBeenCalledWith(
      expect.objectContaining({ endpoint: "projects-v2/projectLines.list" })
    );
  });
});
