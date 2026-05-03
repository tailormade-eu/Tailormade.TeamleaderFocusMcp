import { describe, it, expect } from "vitest";
import { existsSync, readFileSync, unlinkSync } from "fs";
import { respond } from "../src/tools/helpers.js";

describe("respond — output cap", () => {
  it("returns text unchanged when below 50KB", () => {
    const text = "hello world";
    const result = respond(text);
    expect(result.content[0].text).toBe(text);
    expect(result.content[0].text).not.toContain("truncated");
  });

  it("exact boundary: 50KB (51200 bytes) is NOT truncated", () => {
    const text = "a".repeat(50 * 1024); // exactly 50KB in ASCII
    const result = respond(text);
    expect(result.content[0].text).toBe(text);
    expect(result.content[0].text).not.toContain("truncated");
  });

  it("51KB text IS truncated and written to temp file", () => {
    const text = "b".repeat(51 * 1024);
    const result = respond(text);
    const responseText = result.content[0].text;

    expect(responseText).toContain("Response truncated to 50KB");
    expect(responseText).toContain("Full response written to:");
    expect(responseText).toContain("Excerpt:");

    // Extract file path and verify the file was written
    const match = responseText.match(/Full response written to: (.+)\n/);
    expect(match).not.toBeNull();
    const filePath = match![1].trim();
    expect(existsSync(filePath)).toBe(true);

    // File should contain the full content
    const written = readFileSync(filePath, "utf-8");
    expect(written).toBe(text);

    // Clean up
    unlinkSync(filePath);
  });

  it("100KB text is truncated, excerpt is ≤50KB", () => {
    const text = "c".repeat(100 * 1024);
    const result = respond(text);
    const responseText = result.content[0].text;

    expect(responseText).toContain("truncated");

    // Verify excerpt doesn't contain the full input
    expect(responseText.length).toBeLessThan(text.length);

    // Clean up written file
    const match = responseText.match(/Full response written to: (.+)\n/);
    if (match) {
      try { unlinkSync(match[1].trim()); } catch (_) {}
    }
  });

  it("returns object with correct MCP content structure", () => {
    const result = respond("test");
    expect(result).toHaveProperty("content");
    expect(Array.isArray(result.content)).toBe(true);
    expect(result.content[0]).toHaveProperty("type", "text");
    expect(result.content[0]).toHaveProperty("text");
  });
});
