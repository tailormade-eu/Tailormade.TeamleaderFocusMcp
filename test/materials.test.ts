import { describe, it, expect, vi } from "vitest";
import { registerMaterialTools } from "../src/tools/materials.js";

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

describe("registerMaterialTools — registration", () => {
  it("registers teamleader_list_materials", () => {
    const { server, tools } = makeMockServer();
    registerMaterialTools(server as any, makeMockClient() as any);
    expect(tools["teamleader_list_materials"]).toBeDefined();
  });

  it("registers teamleader_create_material", () => {
    const { server, tools } = makeMockServer();
    registerMaterialTools(server as any, makeMockClient() as any);
    expect(tools["teamleader_create_material"]).toBeDefined();
  });

  it("registers assign/unassign tools", () => {
    const { server, tools } = makeMockServer();
    registerMaterialTools(server as any, makeMockClient() as any);
    expect(tools["teamleader_assign_material"]).toBeDefined();
    expect(tools["teamleader_unassign_material"]).toBeDefined();
  });

  it("all registered tools have non-empty descriptions", () => {
    const { server, tools } = makeMockServer();
    registerMaterialTools(server as any, makeMockClient() as any);
    for (const [, entry] of Object.entries(tools)) {
      expect(entry.description.length).toBeGreaterThan(0);
    }
  });
});

describe("teamleader_list_materials — handler", () => {
  it("calls projects-v2/materials.list endpoint", async () => {
    const { server, tools } = makeMockServer();
    const client = makeMockClient();
    registerMaterialTools(server as any, client as any);
    await tools["teamleader_list_materials"].handler({ project_id: "proj-1" });
    expect(client.request).toHaveBeenCalledWith(
      expect.objectContaining({ endpoint: "projects-v2/materials.list" })
    );
  });
});

describe("teamleader_delete_material — handler", () => {
  it("calls projects-v2/materials.delete endpoint", async () => {
    const { server, tools } = makeMockServer();
    const client = makeMockClient({});
    registerMaterialTools(server as any, client as any);
    await tools["teamleader_delete_material"].handler({ id: "mat-1" });
    expect(client.request).toHaveBeenCalledWith(
      expect.objectContaining({ endpoint: "projects-v2/materials.delete" })
    );
  });
});
