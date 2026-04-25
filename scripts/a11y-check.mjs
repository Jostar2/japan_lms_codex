#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import process from "node:process";
import { AxeBuilder } from "@axe-core/playwright";
import { chromium } from "playwright";

const targets = process.argv.slice(2);

if (targets.includes("--help") || targets.includes("-h")) {
  printUsage();
  process.exit(0);
}

const pages = targets.length ? targets : ["xAI_LMS_Prototype.html"];
const browser = await chromium.launch();
let violationCount = 0;

try {
  for (const target of pages) {
    const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
    const page = await context.newPage();
    const url = toUrl(target);

    await page.goto(url, { waitUntil: "domcontentloaded" });

    const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"]).analyze();

    console.log(`\n${target}`);
    console.log(`${results.violations.length} accessibility violation group(s)`);

    for (const violation of results.violations) {
      violationCount += violation.nodes.length;
      console.log(`- ${violation.id} [${violation.impact || "unknown"}]: ${violation.help}`);
      console.log(`  nodes: ${violation.nodes.length}`);
      for (const node of violation.nodes.slice(0, 3)) {
        console.log(`  target: ${node.target.join(", ")}`);
      }
    }

    await context.close();
  }
} finally {
  await browser.close();
}

if (violationCount > 0) {
  console.error(`\nFound ${violationCount} accessibility issue node(s).`);
  process.exit(1);
}

console.log("\nNo accessibility violations found.");

function toUrl(target) {
  if (/^https?:\/\//i.test(target)) {
    return target;
  }

  const absolutePath = path.resolve(target);
  if (!fs.existsSync(absolutePath)) {
    console.error(`Target not found: ${absolutePath}`);
    process.exit(1);
  }

  return pathToFileURL(absolutePath).href;
}

function printUsage() {
  console.log(`
Usage:
  npm run design:a11y
  npm run design:a11y -- xAI_LMS_Prototype.html reference_html_screens/lms_student_all_screens_260423_post_meeting_update.html
`);
}
