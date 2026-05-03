#!/usr/bin/env tsx
/**
 * Playwright scraper for developer.focus.teamleader.eu
 *
 * Usage:
 *   tsx scripts/scrape-tl-api.ts                  # full scrape (overwrite all)
 *   tsx scripts/scrape-tl-api.ts --discover-only  # list endpoints, no write
 *   tsx scripts/scrape-tl-api.ts --diff           # only scrape missing endpoints
 *   tsx scripts/scrape-tl-api.ts --no-delete      # skip auto-delete of obsolete files
 */

import { chromium, type Browser, type Page } from "playwright";
import TurndownService from "turndown";
import * as fs from "fs";
import * as path from "path";

const BASE_URL = "https://developer.focus.teamleader.eu";
const DOCS_DIR = path.join(process.cwd(), "docs/api");
const INDEX_FILE = path.join(DOCS_DIR, "INDEX.md");
const LAST_SCRAPE_FILE = path.join(DOCS_DIR, ".last-scrape.md");

// Files that must never be auto-deleted
const PROTECTED_FILES = new Set([".method.md", ".last-scrape.md", ".diff-report.md"]);

const args = process.argv.slice(2);
const DISCOVER_ONLY = args.includes("--discover-only");
const DIFF_MODE = args.includes("--diff");
const NO_DELETE = args.includes("--no-delete");

interface Endpoint {
  title: string;
  url: string;
  slug: string;
  filename: string;
}

function urlToSlug(url: string): string {
  return url.replace(/.*\/docs\/api\//, "").replace(/\//g, "-").replace(/[^a-z0-9-]/gi, "").toLowerCase();
}

function slugToFilename(index: number, slug: string): string {
  return `${String(index).padStart(3, "0")}-${slug}.md`;
}

function buildTurndown(): TurndownService {
  const td = new TurndownService({
    headingStyle: "atx",
    codeBlockStyle: "fenced",
    bulletListMarker: "-",
  });
  return td;
}

async function waitForContent(page: Page): Promise<void> {
  await page.waitForLoadState("networkidle", { timeout: 15000 }).catch((err) => {
    console.warn(`waitForContent: networkidle timeout — continuing anyway (${String(err).split("\n")[0]})`);
  });
}

function extractApiLinks(anchors: Array<{ href: string; text: string }>, baseUrl: string): Array<{ href: string; text: string }> {
  const seen = new Set<string>();
  const results: Array<{ href: string; text: string }> = [];
  const indexUrl = `${baseUrl}/docs/api`;

  for (const a of anchors) {
    if (!a.href.includes("/docs/api/")) continue;
    const clean = a.href.split("#")[0].replace(/\/$/, "");
    if (clean === indexUrl) continue;
    if (seen.has(clean)) continue;
    seen.add(clean);
    results.push({ href: clean, text: a.text });
  }
  return results;
}

async function getLinksFromPage(page: Page): Promise<Array<{ href: string; text: string }>> {
  return page.evaluate(() => {
    return Array.from(document.querySelectorAll("a[href]")).map((a) => ({
      href: (a as HTMLAnchorElement).href,
      text: (a as HTMLAnchorElement).textContent?.trim() || "",
    }));
  });
}

const CONCURRENCY = 5;
const MIN_WARN = 300;
const MIN_FAIL = 150;

async function discoverEndpoints(browser: Browser): Promise<Endpoint[]> {
  const indexUrl = `${BASE_URL}/docs/api`;
  const queue: string[] = [indexUrl];
  const queued = new Set<string>([indexUrl]); // dedup: prevents any URL from entering queue twice
  const found = new Map<string, string>(); // url → title

  console.log("Transitive BFS crawl starting...");

  while (queue.length > 0) {
    const batch = queue.splice(0, CONCURRENCY);

    await Promise.all(
      batch.map(async (url) => {
        const page = await browser.newPage();
        try {
          await page.goto(url, { waitUntil: "domcontentloaded" });
          await waitForContent(page);

          const titleText = await page.evaluate(() => {
            const h1 = document.querySelector("h1");
            return h1?.textContent?.trim() || document.title;
          });

          // The index page itself is not an endpoint
          if (url !== indexUrl) {
            found.set(url, titleText);
            process.stdout.write(`\r  Discovered: ${found.size} endpoints (queue: ${queue.length})   `);
          }

          const rawLinks = await getLinksFromPage(page);
          const apiLinks = extractApiLinks(rawLinks, BASE_URL);

          for (const link of apiLinks) {
            if (!queued.has(link.href)) {
              queued.add(link.href);
              queue.push(link.href);
            }
          }
        } catch (err) {
          console.warn(`\nFailed: ${url} — ${String(err).split("\n")[0]}`);
        } finally {
          await page.close();
        }
      })
    );
  }

  console.log(`\n  BFS complete: ${found.size} unique endpoints found (${queued.size} pages queued)`);

  if (found.size < MIN_FAIL) {
    throw new Error(`ABORT: only ${found.size} endpoints found — expected >= ${MIN_FAIL}. Scraper may be broken.`);
  }
  if (found.size < MIN_WARN) {
    console.warn(`Warning: only ${found.size} endpoints found — expected >= ${MIN_WARN}. Check if SPA rendered correctly.`);
  }

  // Sort and assign filenames
  const sorted = Array.from(found.entries()).sort(([a], [b]) => a.localeCompare(b));

  const endpoints: Endpoint[] = sorted.map(([url, title], i) => {
    const slug = urlToSlug(url);
    return {
      title: title || slug,
      url,
      slug,
      filename: slugToFilename(i + 1, slug),
    };
  });

  return endpoints;
}

async function scrapeEndpoint(page: Page, endpoint: Endpoint, td: TurndownService): Promise<string> {
  await page.goto(endpoint.url, { waitUntil: "domcontentloaded" });
  await waitForContent(page);

  const result = await page.evaluate(() => {
    const h1 = document.querySelector("h1");
    const title = h1?.textContent?.trim() || document.title;
    const main = document.querySelector("main") || document.querySelector("article") || document.body;
    const html = main?.innerHTML || "";
    return { title, html };
  });

  const markdown = td.turndown(result.html);
  return `# ${result.title}\n\n> Source: ${endpoint.url}\n\n${markdown}`;
}

function writeLastScrapeReport(preScrapeCount: number, total: number, written: number, skipped: number, removed: string[]): void {
  const now = new Date().toISOString().replace("T", " ").slice(0, 16);
  const removedSection =
    removed.length > 0
      ? `- **Obsolete deleted: ${removed.length}**\n${removed.map((f) => `  - ${f}`).join("\n")}`
      : `- Obsolete deleted: 0`;
  const lines = [
    `# Last scrape — ${now}`,
    ``,
    `- Pre-scrape files: ${preScrapeCount}`,
    `- Endpoints scraped: ${total}`,
    `- New/updated files: ${written}`,
    `- Skipped (--diff): ${skipped}`,
    removedSection,
    ``,
  ];
  fs.writeFileSync(LAST_SCRAPE_FILE, lines.join("\n"), "utf-8");
  console.log(`Wrote .last-scrape.md`);
}

function writeIndex(endpoints: Endpoint[]): void {
  const lines = [
    `# Teamleader Focus API — Documentation Index`,
    ``,
    `Scraped: ${endpoints.length} pages`,
    ``,
    ...endpoints.map((e) => `- [${e.title}](${e.filename})`),
    ``,
  ];
  fs.writeFileSync(INDEX_FILE, lines.join("\n"), "utf-8");
  console.log(`Wrote INDEX.md with ${endpoints.length} entries`);
}

async function main(): Promise<void> {
  const browser = await chromium.launch({ headless: true });

  try {
    const endpoints = await discoverEndpoints(browser);
    console.log(`\nDiscovered ${endpoints.length} endpoints`);

    if (DISCOVER_ONLY) {
      console.log("\nEndpoints:");
      for (const e of endpoints) {
        console.log(`  ${e.filename.padEnd(55)} ${e.url}`);
      }
      return;
    }

    fs.mkdirSync(DOCS_DIR, { recursive: true });

    // Bewaar pre-scrape file count voor safety-drempel (B5.4 fix)
    const preScrapeFiles = fs.existsSync(DOCS_DIR)
      ? fs.readdirSync(DOCS_DIR).filter(
          (f) => f.endsWith(".md") && !PROTECTED_FILES.has(f) && f !== "INDEX.md"
        )
      : [];
    const preScrapeCount = preScrapeFiles.length;

    const td = buildTurndown();
    let written = 0;
    let skipped = 0;
    const scrapePage = await browser.newPage();
    await scrapePage.setViewportSize({ width: 1280, height: 900 });

    try {
      for (let i = 0; i < endpoints.length; i++) {
        const endpoint = endpoints[i];
        const outPath = path.join(DOCS_DIR, endpoint.filename);

        if (DIFF_MODE && fs.existsSync(outPath)) {
          skipped++;
          continue;
        }

        try {
          const content = await scrapeEndpoint(scrapePage, endpoint, td);
          fs.writeFileSync(outPath, content, "utf-8");
          written++;
          process.stdout.write(`\r[${i + 1}/${endpoints.length}] ${endpoint.slug.padEnd(50)}`);
        } catch (err) {
          console.error(`\nFailed ${endpoint.url}:`, err);
        }
      }
    } finally {
      await scrapePage.close();
    }

    console.log(`\nDone: ${written} written, ${skipped} skipped`);
    writeIndex(endpoints);

    // Cleanup phase: delete obsolete files
    const removed: string[] = [];
    if (!NO_DELETE) {
      const scrapedFilenames = new Set(endpoints.map((e) => e.filename));
      const existingFiles = fs.readdirSync(DOCS_DIR).filter(
        (f) => f.endsWith(".md") && !PROTECTED_FILES.has(f) && f !== "INDEX.md"
      );

      const obsolete = existingFiles.filter((f) => !scrapedFilenames.has(f));

      // Safety: don't mass-delete if scraped result is less than 50% of PRE-scrape file count.
      // B5.4 fix: gebruik preScrapeCount (vooraf gemeten) ipv existingFiles.length (post-scrape, bevat oude+nieuwe samen).
      if (preScrapeCount > 0 && endpoints.length < preScrapeCount * 0.5) {
        console.warn(`\nSafety: scraped ${endpoints.length} endpoints but ${preScrapeCount} files existed pre-scrape. Skipping auto-delete to prevent mass-delete on scrape failure.`);
      } else {
        for (const f of obsolete) {
          fs.unlinkSync(path.join(DOCS_DIR, f));
          console.log(`Deleted obsolete: ${f}`);
          removed.push(f);
        }
        if (removed.length === 0) {
          console.log("No obsolete files to delete.");
        }
      }
    } else {
      console.log("--no-delete: skipping obsolete file cleanup.");
    }

    writeLastScrapeReport(preScrapeCount, endpoints.length, written, skipped, removed);
  } finally {
    await browser.close();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
