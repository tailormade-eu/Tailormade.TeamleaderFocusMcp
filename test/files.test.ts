import { describe, it, expect, vi } from "vitest";
import { registerFileTools } from "../src/tools/files.js";

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

describe("registerFileTools — registration", () => {
  it("registers teamleader_list_files", () => {
    const { server, tools } = makeMockServer();
    registerFileTools(server as any, makeMockClient() as any);
    expect(tools["teamleader_list_files"]).toBeDefined();
  });

  it("registers teamleader_delete_file", () => {
    const { server, tools } = makeMockServer();
    registerFileTools(server as any, makeMockClient() as any);
    expect(tools["teamleader_delete_file"]).toBeDefined();
  });

  it("all registered tools have non-empty descriptions", () => {
    const { server, tools } = makeMockServer();
    registerFileTools(server as any, makeMockClient() as any);
    for (const [, entry] of Object.entries(tools)) {
      expect(entry.description.length).toBeGreaterThan(0);
    }
  });
});

describe("teamleader_list_files — handler", () => {
  it("calls files.list endpoint", async () => {
    const { server, tools } = makeMockServer();
    const client = makeMockClient();
    registerFileTools(server as any, client as any);
    await tools["teamleader_list_files"].handler({ subject_type: "deal", subject_id: "deal-1" });
    expect(client.request).toHaveBeenCalledWith(
      expect.objectContaining({ endpoint: "files.list" })
    );
  });
});

describe("teamleader_delete_file — handler", () => {
  it("calls files.delete endpoint", async () => {
    const { server, tools } = makeMockServer();
    const client = makeMockClient({});
    registerFileTools(server as any, client as any);
    await tools["teamleader_delete_file"].handler({ id: "file-1" });
    expect(client.request).toHaveBeenCalledWith(
      expect.objectContaining({ endpoint: "files.delete" })
    );
  });
});
