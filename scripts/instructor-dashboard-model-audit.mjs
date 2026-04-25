#!/usr/bin/env node

import { createServer } from "vite";

const server = await createServer({
  appType: "custom",
  configFile: "vite.config.mjs",
  logLevel: "error",
  server: {
    middlewareMode: true,
  },
});

try {
  const { getInstructorDashboardDecisionViewModel } = await server.ssrLoadModule(
    "/src/instructor/dashboard/view-model.ts",
  );
  const vm = getInstructorDashboardDecisionViewModel();

  assert(vm.routeKey === "instructor.dashboard", "route key is instructor.dashboard");
  assert(vm.decisionId === "decision-w7-cocreation", "primary decision target is preserved");
  assert(vm.sourceStudentRoute === "student.lecture", "student source route is preserved");
  assert(vm.targetRoute === "instructor.cocreation", "cocreation target route is preserved");
  assert(vm.hero.eyebrow.includes("오늘의 결정 3건"), "hero decision count is preserved");
  assert(vm.situation.items.length === 3, "situation layer has 3 items");
  assert(vm.stats.length === 4, "dashboard has 4 stats");
  assert(vm.decisionQueue.length === 3, "decision queue has 3 cards");
  assert(vm.decisionQueue[0].targetId === "decision-w7-cocreation", "first decision is W7 cocreation");
  assert(vm.decisionQueue[0].destinationRoute === "instructor.cocreation", "first decision routes to cocreation");
  assert(vm.decisionQueue[1].targetId === "decision-grading-uncertain-8", "second decision is grading review");
  assert(vm.decisionQueue[2].targetId === "decision-intervention-6", "third decision is intervention review");
  assert(vm.aside.questionTrends.length === 3, "aside has 3 question trends");
  assert(vm.aside.questionTrends[0].targetId === "question-trend-gini", "top question trend targets gini");
  assert(vm.aside.questionTrends[0].count === 42, "top question trend count is 42");
  assert(vm.aside.sentiment.confidencePercent === 76, "sentiment confidence is 76%");
  assert(vm.aside.sentiment.privacyCopy.includes("개별 학생을 특정하지 않는"), "privacy boundary is explicit");
  assert(vm.aside.schedule.length === 2, "schedule has 2 items");
  assert(vm.evidenceSummary.includes("정지/반복"), "evidence summary keeps W7 aggregate signal");
  assert(vm.uncertainty.includes("2주"), "uncertainty keeps measurement horizon");
  assert(vm.measurementPlan.includes("재시청률"), "measurement plan keeps registered outcomes");

  const decisionTargets = new Set(vm.decisionQueue.map((decision) => decision.targetId));
  for (const expectedTarget of ["decision-w7-cocreation", "decision-grading-uncertain-8", "decision-intervention-6"]) {
    assert(decisionTargets.has(expectedTarget), `decision target ${expectedTarget} exists`);
  }

  console.log("Instructor dashboard model audit passed.");
} finally {
  await server.close();
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(`Instructor dashboard model audit failed: ${message}`);
  }
  console.log(`ok: ${message}`);
}
