/**
 * HTTP Client for Teamleader Focus API
 *
 * All Teamleader API endpoints use POST with JSON body.
 * Base URL: https://api.focus.teamleader.eu
 */

import { TeamleaderAuth } from "./auth.js";

const BASE_URL = "https://api.focus.teamleader.eu";
const MAX_RETRIES = 3;

export interface ApiRequestOptions {
  /** Endpoint path, e.g. "contacts.list" */
  endpoint: string;
  /** JSON body to send */
  body?: Record<string, unknown>;
}

const MAX_RETRY_AFTER_MS = 30_000;

/** Exported for testing. Returns delay in ms for a given retry attempt (1-indexed). */
export function getRetryDelay(attempt: number, retryAfterHeader: string | null): number {
  if (retryAfterHeader) {
    const trimmed = retryAfterHeader.trim();
    const numeric = Number(trimmed);
    if (trimmed.length > 0 && !isNaN(numeric) && numeric >= 0) return Math.min(numeric * 1000, MAX_RETRY_AFTER_MS);
    const date = new Date(retryAfterHeader);
    if (!isNaN(date.getTime())) return Math.min(Math.max(0, date.getTime() - Date.now()), MAX_RETRY_AFTER_MS);
  }
  // Exponential backoff: 1s, 2s, 4s
  return Math.pow(2, attempt - 1) * 1000;
}

export class TeamleaderClient {
  private auth: TeamleaderAuth;

  constructor(auth: TeamleaderAuth) {
    this.auth = auth;
  }

  /**
   * Make an authenticated POST request to the Teamleader Focus API.
   * Retries up to 3 times on HTTP 429, respecting Retry-After header.
   */
  async request<T = unknown>(options: ApiRequestOptions): Promise<T> {
    const url = `${BASE_URL}/${options.endpoint}`;

    for (let attempt = 1; attempt <= MAX_RETRIES + 1; attempt++) {
      const accessToken = await this.auth.getAccessToken();
      const response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: options.body ? JSON.stringify(options.body) : undefined,
      });

      if (response.status === 429 && attempt <= MAX_RETRIES) {
        const delay = getRetryDelay(attempt, response.headers.get("Retry-After"));
        console.warn(`Teamleader rate limit [${options.endpoint}]: attempt ${attempt}/${MAX_RETRIES}, retrying in ${delay}ms`);
        await new Promise((resolve) => setTimeout(resolve, delay));
        continue;
      }

      if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(
          `Teamleader API error [${options.endpoint}]: ${response.status} ${response.statusText} - ${errorBody}`
        );
      }

      // Some endpoints return 204 No Content
      if (response.status === 204) {
        return {} as T;
      }

      return (await response.json()) as T;
    }

    // Should not reach here, but TypeScript requires it
    throw new Error(`Teamleader API error [${options.endpoint}]: max retries exceeded`);
  }
}
