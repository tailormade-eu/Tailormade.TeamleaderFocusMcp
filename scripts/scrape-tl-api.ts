#!/usr/bin/env tsx
/**
 * Playwright scraper for developer.focus.teamleader.eu
 *
 * Usage:
 *   tsx scripts/scrape-tl-api.ts                  # full scrape (overwrite all)
 *   tsx scripts/scrape-tl-api.ts --discover-only  # list endpoints, no write
 *   tsx scripts/scrape-tl-api.ts --diff           # only scrape missing endpoints
 */

import { chromium, type Page } from "playwright";
import TurndownService from "turndown";
import * as fs from "fs";
import * as path from "path";

const BASE_URL = "https://developer.focus.teamleader.eu";
const DOCS_DIR = path.join(process.cwd(), "docs/api");
const INDEX_FILE = path.join(DOCS_DIR, "INDEX.md");

const args = process.argv.slice(2);
const DISCOVER_ONLY = args.includes("--discover-only");
const DIFF_MODE = args.includes("--diff");

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
  await page.waitForLoadState("networkidle", { timeout: 15000 }).catch(() => {});
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

async function discoverEndpoints(page: Page): Promise<Endpoint[]> {
  console.log("Phase 1: Discovering top-level categories...");
  await page.goto(`${BASE_URL}/docs/api`, { waitUntil: "domcontentloaded" });
  await waitForContent(page);

  const allRawLinks = await getLinksFromPage(page);
  const topLevel = extractApiLinks(allRawLinks, BASE_URL);
  console.log(`  Found ${topLevel.length} top-level categories`);

  // Phase 2: visit each category page to find method links in sidebar
  const allLinks = new Map<string, string>(); // url → title
  for (const tl of topLevel) {
    allLinks.set(tl.href, tl.text);
  }

  console.log("Phase 2: Visiting each category to collect method links...");
  for (let i = 0; i < topLevel.length; i++) {
    const cat = topLevel[i];
    process.stdout.write(`\r  [${i + 1}/${topLevel.length}] ${cat.href.split("/").pop()?.padEnd(40)}`);

    try {
      await page.goto(cat.href, { waitUntil: "domcontentloaded" });
      await waitForContent(page);

      const rawLinks = await getLinksFromPage(page);
      const methodLinks = extractApiLinks(rawLinks, BASE_URL);

      for (const ml of methodLinks) {
        if (!allLinks.has(ml.href)) {
          allLinks.set(ml.href, ml.text);
        }
      }
    } catch {
      // skip failed pages
    }
  }
  console.log(`\n  Total unique links after phase 2: ${allLinks.size}`);

  // Sort and assign filenames
  const sorted = Array.from(allLinks.entries()).sort(([a], [b]) => a.localeCompare(b));

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
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1280, height: 900 });

  try {
    const endpoints = await discoverEndpoints(page);
    console.log(`\nDiscovered ${endpoints.length} endpoints`);

    if (endpoints.length < 50) {
      console.warn(`Warning: expected >50 endpoints, found ${endpoints.length}. SPA may not have rendered fully.`);
    }

    if (DISCOVER_ONLY) {
      console.log("\nEndpoints:");
      for (const e of endpoints) {
        console.log(`  ${e.filename.padEnd(55)} ${e.url}`);
      }
      return;
    }

    fs.mkdirSync(DOCS_DIR, { recursive: true });

    const td = buildTurndown();
    let written = 0;
    let skipped = 0;

    for (let i = 0; i < endpoints.length; i++) {
      const endpoint = endpoints[i];
      const outPath = path.join(DOCS_DIR, endpoint.filename);

      if (DIFF_MODE && fs.existsSync(outPath)) {
        skipped++;
        continue;
      }

      try {
        const content = await scrapeEndpoint(page, endpoint, td);
        fs.writeFileSync(outPath, content, "utf-8");
        written++;
        process.stdout.write(`\r[${i + 1}/${endpoints.length}] ${endpoint.slug.padEnd(50)}`);
      } catch (err) {
        console.error(`\nFailed ${endpoint.url}: ${err}`);
      }
    }

    console.log(`\nDone: ${written} written, ${skipped} skipped`);
    writeIndex(endpoints);
  } finally {
    await browser.close();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
