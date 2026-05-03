import { describe, it, expect, vi } from "vitest";
import { registerTicketTools } from "../src/tools/tickets.js";

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

describe("registerTicketTools — registration", () => {
  it("registers teamleader_list_tickets", () => {
    const { server, tools } = makeMockServer();
    registerTicketTools(server as any, makeMockClient() as any);
    expect(tools["teamleader_list_tickets"]).toBeDefined();
  });

  it("registers teamleader_create_ticket", () => {
    const { server, tools } = makeMockServer();
    registerTicketTools(server as any, makeMockClient() as any);
    expect(tools["teamleader_create_ticket"]).toBeDefined();
  });

  it("registers reply and message tools", () => {
    const { server, tools } = makeMockServer();
    registerTicketTools(server as any, makeMockClient() as any);
    expect(tools["teamleader_reply_ticket"]).toBeDefined();
    expect(tools["teamleader_list_ticket_messages"]).toBeDefined();
  });

  it("all registered tools have non-empty descriptions", () => {
    const { server, tools } = makeMockServer();
    registerTicketTools(server as any, makeMockClient() as any);
    for (const [, entry] of Object.entries(tools)) {
      expect(entry.description.length).toBeGreaterThan(0);
    }
  });
});

describe("teamleader_list_tickets — handler", () => {
  it("calls tickets.list endpoint", async () => {
    const { server, tools } = makeMockServer();
    const client = makeMockClient();
    registerTicketTools(server as any, client as any);
    await tools["teamleader_list_tickets"].handler({});
    expect(client.request).toHaveBeenCalledWith(
      expect.objectContaining({ endpoint: "tickets.list" })
    );
  });

  it("maps customer_type + customer_id to filter.relates_to", async () => {
    const { server, tools } = makeMockServer();
    const client = makeMockClient();
    registerTicketTools(server as any, client as any);
    await tools["teamleader_list_tickets"].handler({ customer_type: "company", customer_id: "co-1" });
    const [call] = client.request.mock.calls;
    expect(call[0].body.filter?.relates_to).toEqual({ type: "company", id: "co-1" });
  });
});

describe("teamleader_reply_ticket — handler", () => {
  it("calls tickets.addReply endpoint", async () => {
    const { server, tools } = makeMockServer();
    const client = makeMockClient({});
    registerTicketTools(server as any, client as any);
    await tools["teamleader_reply_ticket"].handler({ id: "tkt-1", body: "Hello" });
    expect(client.request).toHaveBeenCalledWith(
      expect.objectContaining({ endpoint: "tickets.addReply" })
    );
  });
});
