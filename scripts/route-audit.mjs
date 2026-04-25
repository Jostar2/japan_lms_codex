#!/usr/bin/env node

import path from "node:path";
import process from "node:process";
import { pathToFileURL } from "node:url";
import { chromium } from "playwright";

const targetFile = process.argv[2] || "xAI_LMS_Prototype.html";
const fileUrl = pathToFileURL(path.resolve(targetFile)).href;
const expectedRouteCounts = { student: 8, instructor: 9 };

const browser = await chromium.launch();
let failureCount = 0;

try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const consoleErrors = [];
  const pageErrors = [];

  page.on("console", (message) => {
    if (message.type() === "error") consoleErrors.push(message.text());
  });
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto(fileUrl, { waitUntil: "domcontentloaded" });
  await page.waitForSelector("#mainContent");

  const staticAudit = await page.evaluate(() => {
    const routes = Object.fromEntries(
      Object.entries(NAV).map(([persona, groups]) => [
        persona,
        groups.flatMap((group) =>
          group.items.map((item) => ({
            key: `${persona}.${item.id}`,
            persona,
            id: item.id,
            label: item.label,
            group: group.group,
          })),
        ),
      ]),
    );

    const routeKeys = Object.values(routes)
      .flat()
      .map((route) => route.key);

    return {
      routes,
      routeKeys,
      pageKeys: Object.keys(PAGES),
      focusKeys: Object.keys(FOCUS_CONTEXT),
      targetOwners: Object.fromEntries(
        Object.entries(FOCUS_CONTEXT).flatMap(([routeKey, bucket]) =>
          Object.keys(bucket?.targets || {}).map((targetId) => [targetId, routeKey]),
        ),
      ),
    };
  });

  for (const [persona, expected] of Object.entries(expectedRouteCounts)) {
    const actual = staticAudit.routes[persona]?.length || 0;
    check(actual === expected, `${persona} route count ${actual}/${expected}`);
  }

  for (const routeKey of staticAudit.routeKeys) {
    check(staticAudit.pageKeys.includes(routeKey), `${routeKey} has page template`);
    check(staticAudit.focusKeys.includes(routeKey), `${routeKey} has focus context`);
  }

  const routeTargetAudit = [];
  for (const route of Object.values(staticAudit.routes).flat()) {
    const result = await page.evaluate(({ persona, id, key }) => {
      state.persona = persona;
      state.page = id;
      state.navCollapsed = false;
      state.demo.targetId = null;
      document.body.classList.toggle("s-mode", persona === "student");
      document.body.classList.toggle("i-mode", persona === "instructor");
      syncShellMode();
      renderNav();
      renderPage();

      const bucket = FOCUS_CONTEXT[key];
      const supportedTargets = bucket?.targets ? Object.keys(bucket.targets) : [];
      const domTargets = Array.from(document.querySelectorAll("[data-ai-target]"))
        .map((node) => node.getAttribute("data-ai-target"))
        .filter(Boolean);

      return {
        key,
        domTargets: Array.from(new Set(domTargets)).sort(),
        supportedTargets: supportedTargets.sort(),
      };
    }, route);

    routeTargetAudit.push(result);
  }

  const linkage = await page.evaluate(() => {
    state.persona = "student";
    state.page = "lecture";
    state.navCollapsed = false;
    state.demo.targetId = null;
    document.body.classList.add("s-mode");
    document.body.classList.remove("i-mode");
    syncShellMode();
    renderNav();
    renderPage();

    const bridgeButton = Array.from(document.querySelectorAll("button")).find((button) =>
      button.textContent.includes("교수자 집계"),
    );

    return {
      studentLectureHasInstructorBridge: Boolean(bridgeButton),
      bridgeTarget: bridgeButton?.dataset.aiTarget || null,
      instructorDashboardHasTarget: Boolean(FOCUS_CONTEXT["instructor.dashboard"]?.targets?.["decision-w7-cocreation"]),
      instructorCocreationMentionsStudentIncident: JSON.stringify(
        FOCUS_CONTEXT["instructor.cocreation"] || {},
      ).includes("student.lecture"),
    };
  });

  check(linkage.studentLectureHasInstructorBridge, "student.lecture has instructor bridge");
  check(linkage.bridgeTarget === "decision-w7-cocreation", "student.lecture bridge targets instructor decision");
  check(linkage.instructorDashboardHasTarget, "instructor.dashboard supports linked decision target");
  check(linkage.instructorCocreationMentionsStudentIncident, "instructor.cocreation keeps student incident evidence");

  for (const route of routeTargetAudit) {
    const localTargets = route.domTargets.filter((target) => route.supportedTargets.includes(target));
    const linkedTargets = route.domTargets.filter(
      (target) => !route.supportedTargets.includes(target) && staticAudit.targetOwners[target],
    );
    const unresolvedTargets = route.domTargets.filter(
      (target) => !route.supportedTargets.includes(target) && !staticAudit.targetOwners[target],
    );
    const linkedText = linkedTargets.length
      ? `; linked target(s): ${linkedTargets
          .map((target) => `${target}->${staticAudit.targetOwners[target]}`)
          .join(", ")}`
      : "";
    const unresolvedText = unresolvedTargets.length ? `; unresolved target(s): ${unresolvedTargets.join(", ")}` : "";

    console.log(
      `${route.key}: ${route.domTargets.length} AI target(s), ${localTargets.length} local context target(s)${linkedText}${unresolvedText}`,
    );
    check(unresolvedTargets.length === 0, `${route.key} has no unresolved AI targets`);
  }

  for (const error of pageErrors) {
    console.error(`pageerror: ${error}`);
    failureCount += 1;
  }
  for (const error of consoleErrors) {
    console.error(`console error: ${error}`);
    failureCount += 1;
  }
} finally {
  await browser.close();
}

if (failureCount > 0) {
  console.error(`Route audit failed with ${failureCount} issue(s).`);
  process.exit(1);
}

console.log("Route audit passed.");

function check(condition, label) {
  if (condition) {
    console.log(`ok: ${label}`);
    return;
  }

  console.error(`fail: ${label}`);
  failureCount += 1;
}
