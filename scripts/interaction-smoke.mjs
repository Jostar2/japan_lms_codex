#!/usr/bin/env node

import path from "node:path";
import process from "node:process";
import { pathToFileURL } from "node:url";
import { chromium } from "playwright";

const targetFile = process.argv[2] || "xAI_LMS_Prototype.html";
const fileUrl = pathToFileURL(path.resolve(targetFile)).href;

const browser = await chromium.launch();
const pageErrors = [];
const consoleErrors = [];

try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  page.on("pageerror", (error) => pageErrors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") consoleErrors.push(message.text());
  });

  await page.goto(fileUrl, { waitUntil: "domcontentloaded" });
  await page.waitForSelector("#mainContent");

  await goToRoute(page, "student", "lecture");
  await page.locator(".seg-callout").focus();
  await page.keyboard.press("Enter");
  await page.waitForTimeout(80);
  await expectPrototypeState(page, "student lecture keyboard AI target", {
    persona: "student",
    page: "lecture",
    navCollapsed: true,
    targetId: "seg-22pct",
  });

  await goToRoute(page, "student", "lecture");
  await page.locator(".transcript-row.active").focus();
  await page.keyboard.press("Space");
  await page.waitForTimeout(80);
  await expectPrototypeState(page, "student lecture transcript keyboard AI target", {
    persona: "student",
    page: "lecture",
    navCollapsed: true,
    targetId: "transcript-18m12",
  });

  await goToRoute(page, "student", "lecture");
  await page.locator("button").filter({ hasText: "같은 패턴" }).click();
  await page.waitForTimeout(80);
  await expectPrototypeState(page, "student lecture cross-surface action", {
    persona: "instructor",
    page: "dashboard",
    navCollapsed: true,
    targetId: "decision-w7-cocreation",
  });

  await goToRoute(page, "instructor", "cocreation");
  await page.locator("button").filter({ hasText: "승인 후 공개" }).click();
  await page.waitForTimeout(80);
  await expectPrototypeState(page, "cocreation publish action", {
    persona: "instructor",
    page: "cocreation",
    navCollapsed: true,
    targetId: "step4-ab-settings",
  });

  await goToRoute(page, "instructor", "cocreation");
  await page.locator("button").filter({ hasText: "클래스 영향 보기" }).click();
  await page.waitForTimeout(80);
  await expectPrototypeState(page, "cocreation class health action", {
    persona: "instructor",
    page: "classhealth",
    navCollapsed: true,
    targetId: "impact-ledger-entry",
  });

  if (pageErrors.length || consoleErrors.length) {
    for (const error of pageErrors) console.error(`pageerror: ${error}`);
    for (const error of consoleErrors) console.error(`console error: ${error}`);
    process.exit(1);
  }

  console.log("Interaction smoke checks passed.");
} finally {
  await browser.close();
}

async function goToRoute(page, persona, route) {
  await page.evaluate(
    ([nextPersona, nextRoute]) => {
      state.persona = nextPersona;
      state.page = nextRoute;
      state.navCollapsed = false;
      state.demo.targetId = null;
      document.body.classList.toggle("s-mode", nextPersona === "student");
      document.body.classList.toggle("i-mode", nextPersona === "instructor");
      document.querySelectorAll(".view-switch button").forEach((button) => {
        button.classList.toggle("active", button.dataset.persona === nextPersona);
      });
      syncShellMode();
      renderNav();
      renderPage();
    },
    [persona, route],
  );
}

async function expectPrototypeState(page, label, expected) {
  const actual = await page.evaluate(() => ({
    persona: state.persona,
    page: state.page,
    navCollapsed: state.navCollapsed,
    targetId: state.demo.targetId,
  }));

  const mismatches = Object.entries(expected).filter(([key, value]) => actual[key] !== value);
  if (!mismatches.length) return;

  const details = mismatches.map(([key, value]) => `${key}: expected ${value}, got ${actual[key]}`).join("; ");
  throw new Error(`${label} failed: ${details}`);
}
