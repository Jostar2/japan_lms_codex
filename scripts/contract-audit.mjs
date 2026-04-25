#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { pathToFileURL } from "node:url";
import { chromium } from "playwright";

const contractPath = path.resolve("contracts/university-lms.contract.json");
const prototypeUrl = pathToFileURL(path.resolve("xAI_LMS_Prototype.html")).href;
const expectedRouteCounts = { student: 8, instructor: 9 };

const contract = JSON.parse(fs.readFileSync(contractPath, "utf8"));
let failureCount = 0;

const browser = await chromium.launch();

try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto(prototypeUrl, { waitUntil: "domcontentloaded" });
  await page.waitForSelector("#mainContent");

  const prototype = await page.evaluate(() => {
    const routes = Object.fromEntries(
      Object.entries(NAV).map(([surface, groups]) => [
        surface,
        groups.flatMap((group) =>
          group.items.map((item) => ({
            key: `${surface}.${item.id}`,
            id: item.id,
            label: item.label,
            group: group.group,
          })),
        ),
      ]),
    );

    const focusTargets = Object.fromEntries(
      Object.entries(FOCUS_CONTEXT).map(([routeKey, bucket]) => [routeKey, Object.keys(bucket?.targets || {})]),
    );

    return {
      routes,
      routeKeys: Object.values(routes)
        .flat()
        .map((route) => route.key),
      pageKeys: Object.keys(PAGES),
      focusKeys: Object.keys(FOCUS_CONTEXT),
      focusTargets,
    };
  });

  check(Boolean(contract.version), "contract has version");
  check(
    contract.product?.designSourceOfTruth === "xAI_LMS_Prototype.html",
    "contract points to prototype source of truth",
  );

  const sharedEntities = new Set(contract.sharedEntities || []);
  check(sharedEntities.size >= 10, "contract defines shared LMS entities");

  const xaiRequired = contract.xaiEvidenceContract?.requiredFields || [];
  for (const field of [
    "intent",
    "judgment",
    "evidence",
    "modelVersion",
    "confidenceOrUncertainty",
    "recommendedAction",
    "humanApprovalState",
    "measurementPlan",
  ]) {
    check(xaiRequired.includes(field), `XAI contract requires ${field}`);
  }

  const contractRoutes = [];
  for (const [surface, expectedCount] of Object.entries(expectedRouteCounts)) {
    const surfaceRoutes = contract.surfaces?.[surface]?.routes || [];
    check(
      surfaceRoutes.length === expectedCount,
      `${surface} contract route count ${surfaceRoutes.length}/${expectedCount}`,
    );

    const prototypeRoutes = prototype.routes[surface] || [];
    const prototypeRouteKeys = new Set(prototypeRoutes.map((route) => route.key));
    const prototypeLabels = new Map(prototypeRoutes.map((route) => [route.key, route.label]));
    const prototypeGroups = new Map(prototypeRoutes.map((route) => [route.key, route.group]));

    for (const route of surfaceRoutes) {
      contractRoutes.push(route);
      check(prototypeRouteKeys.has(route.key), `${route.key} exists in prototype NAV`);
      check(prototype.pageKeys.includes(route.key), `${route.key} exists in prototype PAGES`);
      check(prototype.focusKeys.includes(route.key), `${route.key} exists in prototype FOCUS_CONTEXT`);
      check(prototypeLabels.get(route.key) === route.label, `${route.key} label matches prototype`);
      check(prototypeGroups.get(route.key) === route.group, `${route.key} group matches prototype`);
      check(Number.isInteger(route.migrationPriority), `${route.key} has migrationPriority`);
      check(Array.isArray(route.entities) && route.entities.length > 0, `${route.key} declares entities`);

      for (const entity of route.entities || []) {
        check(sharedEntities.has(entity), `${route.key} entity ${entity} is shared`);
      }
    }
  }

  const uniqueRouteKeys = new Set(contractRoutes.map((route) => route.key));
  check(uniqueRouteKeys.size === contractRoutes.length, "contract route keys are unique");
  check(
    arrayEquals([...uniqueRouteKeys].sort(), [...prototype.routeKeys].sort()),
    "contract routes match prototype route set",
  );

  for (const loop of contract.closedLoops || []) {
    check(Boolean(loop.id), "closed loop has id");
    check(Array.isArray(loop.steps) && loop.steps.length >= 3, `${loop.id} has multi-step flow`);
    check(loop.studentVisible === true, `${loop.id} is student-visible`);
    check(loop.instructorVisible === true, `${loop.id} is instructor-visible`);

    for (const entity of loop.sharedEntities || []) {
      check(sharedEntities.has(entity), `${loop.id} shared entity ${entity} is valid`);
    }

    for (const step of loop.steps || []) {
      check(uniqueRouteKeys.has(step.route), `${loop.id}:${step.phase} route ${step.route} exists in contract`);
      check(step.route.startsWith(`${step.surface}.`), `${loop.id}:${step.phase} route matches surface`);
      check(sharedEntities.has(step.entity), `${loop.id}:${step.phase} entity ${step.entity} is valid`);
      if (step.targetId) {
        const routeTargets = prototype.focusTargets[step.route] || [];
        check(
          routeTargets.includes(step.targetId),
          `${loop.id}:${step.phase} target ${step.targetId} exists on ${step.route}`,
        );
      }
    }
  }
} finally {
  await browser.close();
}

if (failureCount > 0) {
  console.error(`Contract audit failed with ${failureCount} issue(s).`);
  process.exit(1);
}

console.log("Contract audit passed.");

function check(condition, label) {
  if (condition) {
    console.log(`ok: ${label}`);
    return;
  }

  console.error(`fail: ${label}`);
  failureCount += 1;
}

function arrayEquals(left, right) {
  if (left.length !== right.length) return false;
  return left.every((value, index) => value === right[index]);
}
