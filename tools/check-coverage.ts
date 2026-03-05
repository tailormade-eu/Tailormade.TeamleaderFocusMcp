import { readFileSync, readdirSync } from "fs";
import { resolve, join } from "path";

const root = resolve(__dirname, "..");

// 1. Parse INDEX.md — extract endpoint names with file numbers for dedup
//    Duplicates (legacy projects vs v2, project tasks vs standalone tasks)
//    are resolved by keeping the highest file number per endpoint name.
const index = readFileSync(join(root, "docs/api/INDEX.md"), "utf-8");
const endpointRegex = /\[([a-zA-Z][\w]*\.[\w-]+)\]\((\d+)-/g;
const endpointMap = new Map<string, number>();
for (const match of index.matchAll(endpointRegex)) {
  const [, name, fileNum] = match;
  const num = parseInt(fileNum, 10);
  const existing = endpointMap.get(name);
  if (!existing || num > existing) {
    endpointMap.set(name, num);
  }
}

// 2. Scan src/tools/*.ts — collect all registered tool names
const toolDir = join(root, "src/tools");
const toolFiles = readdirSync(toolDir).filter((f) => f.endsWith(".ts"));
const tools = new Set<string>();
const toolNameRegex = /"(teamleader_[^"]+)"/g;
for (const file of toolFiles) {
  const content = readFileSync(join(toolDir, file), "utf-8");
  for (const [, name] of content.matchAll(toolNameRegex)) {
    tools.add(name);
  }
}

// 3. Load config
const config = JSON.parse(
  readFileSync(join(root, "tools/coverage-config.json"), "utf-8")
);

// 4. Report
const endpoints = [...endpointMap.keys()].sort();
let covered = 0;
let planned = 0;
let outOfScope = 0;
let gaps = 0;

for (const endpoint of endpoints) {
  if (config.out_of_scope[endpoint]) {
    console.log(`  ⛔ ${endpoint} — ${config.out_of_scope[endpoint]}`);
    outOfScope++;
  } else if (config.mapping[endpoint]) {
    if (tools.has(config.mapping[endpoint])) {
      console.log(`  ✅ ${endpoint} → ${config.mapping[endpoint]}`);
      covered++;
    } else {
      console.log(
        `  🔨 ${endpoint} → ${config.mapping[endpoint]} (planned)`
      );
      planned++;
    }
  } else {
    console.log(`  ❌ ${endpoint} — NO TOOL, NO CONFIG`);
    gaps++;
  }
}

console.log(
  `\n  ${endpoints.length} endpoints: ${covered} ✅ covered, ${planned} 🔨 planned, ${outOfScope} ⛔ out-of-scope, ${gaps} ❌ gaps`
);
if (gaps > 0) process.exit(1);
