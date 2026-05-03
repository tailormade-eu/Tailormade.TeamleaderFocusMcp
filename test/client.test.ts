import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { TeamleaderClient, getRetryDelay } from "../src/api/client.js";

// ── getRetryDelay unit tests ──────────────────────────────────────────────────

describe("getRetryDelay", () => {
  it("uses numeric Retry-After header (seconds → ms)", () => {
    expect(getRetryDelay(1, "5")).toBe(5000);
    expect(getRetryDelay(2, "0")).toBe(0);
  });

  it("falls back to exponential when header is null", () => {
    expect(getRetryDelay(1, null)).toBe(1000);
    expect(getRetryDelay(2, null)).toBe(2000);
    expect(getRetryDelay(3, null)).toBe(4000);
  });

  it("falls back to exponential when header is non-numeric non-date", () => {
    expect(getRetryDelay(1, "bogus")).toBe(1000);
  });

  it("parses HTTP-date Retry-After header", () => {
    const future = new Date(Date.now() + 3000).toUTCString();
    const delay = getRetryDelay(1, future);
    expect(delay).toBeGreaterThan(2000);
    expect(delay).toBeLessThan(4000);
  });
});

// ── TeamleaderClient retry integration tests ─────────────────────────────────

function makeMockAuth() {
  return { getAccessToken: async () => "test-token" };
}

function makeResponse(status: number, body: unknown, headers: Record<string, string> = {}): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", ...headers },
  });
}

describe("TeamleaderClient.request — retry behaviour", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it("returns data immediately on 200", async () => {
    const fetchMock = vi.fn().mockResolvedValue(makeResponse(200, { data: [1, 2] }));
    vi.stubGlobal("fetch", fetchMock);

    const client = new TeamleaderClient(makeMockAuth() as never);
    const result = await client.request({ endpoint: "contacts.list" });

    expect(result).toEqual({ data: [1, 2] });
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("retries on 429 with Retry-After header, succeeds on 2nd attempt", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(makeResponse(429, { message: "rate limited" }, { "Retry-After": "1" }))
      .mockResolvedValueOnce(makeResponse(200, { data: "ok" }));
    vi.stubGlobal("fetch", fetchMock);

    const client = new TeamleaderClient(makeMockAuth() as never);
    const resultPromise = client.request<{ data: string }>({ endpoint: "contacts.list" });

    await vi.runAllTimersAsync();
    const result = await resultPromise;

    expect(result).toEqual({ data: "ok" });
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it("retries on 429 without Retry-After using exponential backoff", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(makeResponse(429, {}))
      .mockResolvedValueOnce(makeResponse(429, {}))
      .mockResolvedValueOnce(makeResponse(200, { data: "eventually" }));
    vi.stubGlobal("fetch", fetchMock);

    const client = new TeamleaderClient(makeMockAuth() as never);
    const resultPromise = client.request<{ data: string }>({ endpoint: "contacts.list" });

    await vi.runAllTimersAsync();
    const result = await resultPromise;

    expect(result).toEqual({ data: "eventually" });
    expect(fetchMock).toHaveBeenCalledTimes(3);
  });

  it("throws after 3 retries of 429", async () => {
    const fetchMock = vi.fn().mockResolvedValue(makeResponse(429, { message: "rate limited" }));
    vi.stubGlobal("fetch", fetchMock);

    const client = new TeamleaderClient(makeMockAuth() as never);
    // Attach rejection handler BEFORE running timers to avoid unhandled rejection
    const assertion = expect(client.request({ endpoint: "contacts.list" })).rejects.toThrow("429");
    await vi.runAllTimersAsync();
    await assertion;

    // 3 retries + 1 final attempt that throws
    expect(fetchMock).toHaveBeenCalledTimes(4);
  });

  it("does not retry on other 4xx errors", async () => {
    const fetchMock = vi.fn().mockResolvedValue(makeResponse(400, { message: "bad request" }));
    vi.stubGlobal("fetch", fetchMock);

    const client = new TeamleaderClient(makeMockAuth() as never);
    await expect(client.request({ endpoint: "contacts.list" })).rejects.toThrow("400");
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});
