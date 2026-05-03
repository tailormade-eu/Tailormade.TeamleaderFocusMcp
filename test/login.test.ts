import { describe, it, expect, vi } from "vitest";
import { registerLoginTools } from "../src/tools/login.js";

function makeMockServer() {
  const tools: Record<string, { description: string; handler: (...args: any[]) => any }> = {};
  const server = {
    tool: vi.fn((name: string, description: string, _schema: unknown, handler: (...args: any[]) => any) => {
      tools[name] = { description, handler };
    }),
  };
  return { server, tools };
}

describe("registerLoginTools — registration", () => {
  it("registers teamleader_login", () => {
    const { server, tools } = makeMockServer();
    registerLoginTools(server as any);
    expect(tools["teamleader_login"]).toBeDefined();
  });

  it("teamleader_login has non-empty description", () => {
    const { server, tools } = makeMockServer();
    registerLoginTools(server as any);
    expect(tools["teamleader_login"].description.length).toBeGreaterThan(0);
  });
});

describe("teamleader_login — handler without env vars", () => {
  it("returns error message when env vars are missing", async () => {
    const savedClientId = process.env.TEAMLEADER_CLIENT_ID;
    const savedClientSecret = process.env.TEAMLEADER_CLIENT_SECRET;

    delete process.env.TEAMLEADER_CLIENT_ID;
    delete process.env.TEAMLEADER_CLIENT_SECRET;

    try {
      const { server, tools } = makeMockServer();
      registerLoginTools(server as any);
      const result = await tools["teamleader_login"].handler({});
      const text = result.content[0].text as string;
      expect(text).toContain("TEAMLEADER_CLIENT_ID");
    } finally {
      if (savedClientId !== undefined) process.env.TEAMLEADER_CLIENT_ID = savedClientId;
      if (savedClientSecret !== undefined) process.env.TEAMLEADER_CLIENT_SECRET = savedClientSecret;
    }
  });
});
