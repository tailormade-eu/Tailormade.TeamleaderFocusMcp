/**
 * Shared MCP response helper with 50KB output cap.
 *
 * When the response text exceeds 50KB the full content is written to a
 * temporary file and the caller receives a truncated excerpt with the path.
 */

import { writeFileSync } from "fs";
import { tmpdir } from "os";
import { join } from "path";

const RESPONSE_CAP_BYTES = 50 * 1024; // 50 KB

export function respond(text: string) {
  const bytes = Buffer.byteLength(text, "utf8");
  if (bytes <= RESPONSE_CAP_BYTES) {
    return { content: [{ type: "text" as const, text }] };
  }

  const tmpFile = join(tmpdir(), `tl-mcp-response-${Date.now()}.txt`);
  try {
    writeFileSync(tmpFile, text, "utf8");
  } catch (_) {
    // If write fails, return truncated text without file reference
    const excerpt = text.slice(0, RESPONSE_CAP_BYTES);
    return { content: [{ type: "text" as const, text: `Response truncated to 50KB (temp file write failed).\n\nExcerpt:\n${excerpt}` }] };
  }

  // Byte-safe slice: find char boundary within 50KB
  let end = RESPONSE_CAP_BYTES;
  while (end > 0 && (text.charCodeAt(end) & 0xc0) === 0x80) end--;
  const excerpt = text.slice(0, end);

  return {
    content: [
      {
        type: "text" as const,
        text: `Response truncated to 50KB. Full response written to: ${tmpFile}\n\nExcerpt:\n${excerpt}`,
      },
    ],
  };
}
