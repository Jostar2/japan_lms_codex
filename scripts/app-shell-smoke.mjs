#!/usr/bin/env node

import process from "node:process";
import { AxeBuilder } from "@axe-core/playwright";
import { chromium } from "playwright";
import { createServer } from "vite";

const server = await createServer({
  configFile: "vite.config.mjs",
  logLevel: "error",
  server: {
    host: "127.0.0.1",
    port: 4173,
    strictPort: false,
    open: false,
  },
});

let browser;
let context;
const pageErrors = [];
const consoleErrors = [];

try {
  await server.listen();
  const baseUrl =
    server.resolvedUrls?.local?.find((url) => url.includes("127.0.0.1")) ?? server.resolvedUrls?.local?.[0];

  if (!baseUrl) {
    throw new Error("Vite did not expose a local URL for app shell smoke testing.");
  }

  browser = await chromium.launch();
  context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  page.on("pageerror", (error) => pageErrors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") consoleErrors.push(message.text());
  });

  await page.goto(new URL("app.html", baseUrl).href, { waitUntil: "domcontentloaded" });
  await page.waitForSelector(".claritas-shell");

  await expectAttribute(page, ".claritas-shell", "data-surface", "student", "default surface");
  await expectCount(page, ".nav-item", 8, "student route count");
  await expectText(page, ".page-head h1", "의사결정 트리", "student lecture route");
  await expectText(page, ".lecture-video", "Lec 2", "student lecture player");
  await expectText(page, ".seg-callout", "동료 정지/반복 42%", "student struggle callout");
  await expectText(page, ".cohort-bridge", "교수자 집계", "student-to-instructor bridge");
  await expectCount(page, ".summary-bullet", 5, "student summary bullet count");
  await expectCount(page, ".transcript-row", 4, "student transcript row count");
  await expectText(page, ".ai-interaction-panel", "현재 구간을 설명합니다", "default student AI context");
  await page.locator(".learning-plan-actions .btn-student").click();
  await expectText(page, ".ai-interaction-panel", "짧은 회복 경로", "student AI target switch");
  await page.locator(".ai-prompt-row button").filter({ hasText: "쉬운 예시" }).click();
  await expectText(page, ".ai-response-user", "쉬운 예시", "student AI prompt interaction");
  await expectNoA11yViolations(page, "student lecture app shell");

  await page.locator(".view-switch button").filter({ hasText: "교수자" }).click();
  await expectAttribute(page, ".claritas-shell", "data-surface", "instructor", "instructor surface switch");
  await expectCount(page, ".nav-item", 9, "instructor route count");
  await expectText(page, ".dash-hero-react h1", "오늘 처리할 결정", "instructor dashboard route");
  await expectCount(page, ".situation-item-react", 3, "instructor situation count");
  await expectCount(page, ".stat-card", 4, "instructor metric count");
  await expectCount(page, ".decision-card-react", 3, "instructor decision queue count");
  await expectText(page, ".decision-card-react.high", "W7/Lec2 자료 개선", "primary instructor decision");
  await expectText(page, ".question-trends-card", "지니 vs 엔트로피", "instructor question trend");
  await expectText(page, ".ai-interaction-panel", "자료 개선 결정을 설명합니다", "default instructor AI context");
  await page.locator(".question-trends-card .source-item").first().click();
  await expectText(page, ".ai-interaction-panel", "반복 질문", "instructor AI target switch");
  await expectNoA11yViolations(page, "instructor dashboard app shell");

  await page.locator(".decision-card-react.high .btn-instructor").click();
  await expectText(page, ".page-head h1", "Co-Creation Studio", "instructor route navigation");
  await expectText(page, ".cocreation-page", "학생 막힘 입력", "cocreation incident input");
  await expectCount(page, ".variant-card", 3, "cocreation variant count");
  await expectText(page, ".ai-interaction-panel", "입력 신호", "default cocreation AI context");
  await page.locator(".variant-card.selected").click();
  await expectText(page, ".ai-interaction-panel", "선택된 보완안", "cocreation selected variant AI context");
  await page.locator(".cocreation-rationale-band").click();
  await expectText(page, ".ai-interaction-panel", "대안 선택 이유", "cocreation rationale AI context");
  await expectNoA11yViolations(page, "instructor cocreation app shell");
  await page.locator(".cocreation-effect-panel .btn-instructor").click();
  await expectText(page, ".classhealth-page", "반 전체에 효과", "class health bridge navigation");
  await expectText(page, ".ai-interaction-panel", "폐루프 결과", "default class health AI context");
  await page.locator(".clo-trend-card").click();
  await expectText(page, ".ai-interaction-panel", "학습성과 회복", "class health CLO AI context");
  await page.locator(".policy-memo-card .btn-instructor").click();
  await expectText(page, ".ai-interaction-panel", "Course Blueprint", "class health policy AI context");
  await page.locator(".purpose-access-box").click();
  await expectText(page, ".ai-interaction-panel", "개별 식별 접근", "class health access AI context");
  await expectNoA11yViolations(page, "instructor class health app shell");

  if (pageErrors.length || consoleErrors.length) {
    for (const error of pageErrors) console.error(`pageerror: ${error}`);
    for (const error of consoleErrors) console.error(`console error: ${error}`);
    process.exit(1);
  }

  console.log("App shell smoke checks passed.");
} finally {
  if (context) {
    await context.close();
  }
  if (browser) {
    await browser.close();
  }
  await server.close();
}

async function expectText(page, selector, expectedText, label) {
  const text = await page.locator(selector).first().textContent();
  if (text?.includes(expectedText)) return;

  throw new Error(`${label} failed: expected ${selector} to include "${expectedText}", got "${text ?? ""}".`);
}

async function expectAttribute(page, selector, name, expectedValue, label) {
  const actualValue = await page.locator(selector).first().getAttribute(name);
  if (actualValue === expectedValue) return;

  throw new Error(`${label} failed: expected ${selector}[${name}] to be "${expectedValue}", got "${actualValue}".`);
}

async function expectCount(page, selector, expectedCount, label) {
  const actualCount = await page.locator(selector).count();
  if (actualCount === expectedCount) return;

  throw new Error(`${label} failed: expected ${expectedCount} matches for ${selector}, got ${actualCount}.`);
}

async function expectNoA11yViolations(page, label) {
  const results = await new AxeBuilder({ page }).analyze();
  if (!results.violations.length) return;

  const details = results.violations
    .map((violation) => `${violation.id}: ${violation.nodes.map((node) => node.target.join(" ")).join(", ")}`)
    .join("; ");
  throw new Error(`${label} accessibility failed: ${details}`);
}
