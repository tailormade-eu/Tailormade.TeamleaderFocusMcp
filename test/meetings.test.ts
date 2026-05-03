import { describe, it, expect, vi } from "vitest";
import { registerMeetingTools } from "../src/tools/meetings.js";

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

describe("registerMeetingTools — registration", () => {
  it("registers teamleader_list_meetings", () => {
    const { server, tools } = makeMockServer();
    registerMeetingTools(server as any, makeMockClient() as any);
    expect(tools["teamleader_list_meetings"]).toBeDefined();
  });

  it("registers teamleader_schedule_meeting", () => {
    const { server, tools } = makeMockServer();
    registerMeetingTools(server as any, makeMockClient() as any);
    expect(tools["teamleader_schedule_meeting"]).toBeDefined();
  });

  it("all registered tools have non-empty descriptions", () => {
    const { server, tools } = makeMockServer();
    registerMeetingTools(server as any, makeMockClient() as any);
    for (const [, entry] of Object.entries(tools)) {
      expect(entry.description.length).toBeGreaterThan(0);
    }
  });
});

describe("teamleader_list_meetings — handler", () => {
  it("calls meetings.list endpoint", async () => {
    const { server, tools } = makeMockServer();
    const client = makeMockClient();
    registerMeetingTools(server as any, client as any);
    await tools["teamleader_list_meetings"].handler({});
    expect(client.request).toHaveBeenCalledWith(
      expect.objectContaining({ endpoint: "meetings.list" })
    );
  });
});

describe("teamleader_complete_meeting — handler", () => {
  it("calls meetings.complete endpoint", async () => {
    const { server, tools } = makeMockServer();
    const client = makeMockClient({});
    registerMeetingTools(server as any, client as any);
    await tools["teamleader_complete_meeting"].handler({ id: "mtg-1" });
    expect(client.request).toHaveBeenCalledWith(
      expect.objectContaining({ endpoint: "meetings.complete" })
    );
  });
});
