import { describe, it, expect, vi } from "vitest";
import { registerQuotationTools } from "../src/tools/quotations.js";

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

describe("registerQuotationTools — registration", () => {
  it("registers teamleader_list_quotations", () => {
    const { server, tools } = makeMockServer();
    registerQuotationTools(server as any, makeMockClient() as any);
    expect(tools["teamleader_list_quotations"]).toBeDefined();
  });

  it("registers teamleader_create_quotation", () => {
    const { server, tools } = makeMockServer();
    registerQuotationTools(server as any, makeMockClient() as any);
    expect(tools["teamleader_create_quotation"]).toBeDefined();
  });

  it("registers accept and send tools", () => {
    const { server, tools } = makeMockServer();
    registerQuotationTools(server as any, makeMockClient() as any);
    expect(tools["teamleader_accept_quotation"]).toBeDefined();
    expect(tools["teamleader_send_quotation"]).toBeDefined();
  });

  it("all registered tools have non-empty descriptions", () => {
    const { server, tools } = makeMockServer();
    registerQuotationTools(server as any, makeMockClient() as any);
    for (const [, entry] of Object.entries(tools)) {
      expect(entry.description.length).toBeGreaterThan(0);
    }
  });
});

describe("teamleader_list_quotations — handler", () => {
  it("calls quotations.list endpoint", async () => {
    const { server, tools } = makeMockServer();
    const client = makeMockClient();
    registerQuotationTools(server as any, client as any);
    await tools["teamleader_list_quotations"].handler({});
    expect(client.request).toHaveBeenCalledWith(
      expect.objectContaining({ endpoint: "quotations.list" })
    );
  });
});

describe("teamleader_delete_quotation — handler", () => {
  it("calls quotations.delete endpoint", async () => {
    const { server, tools } = makeMockServer();
    const client = makeMockClient({});
    registerQuotationTools(server as any, client as any);
    await tools["teamleader_delete_quotation"].handler({ id: "quot-1" });
    expect(client.request).toHaveBeenCalledWith(
      expect.objectContaining({ endpoint: "quotations.delete" })
    );
  });
});
