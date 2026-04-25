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
  const { getInstructorClassHealthViewModel } = await server.ssrLoadModule("/src/instructor/classhealth/view-model.ts");
  const vm = getInstructorClassHealthViewModel();

  assert(vm.routeKey === "instructor.classhealth", "route key is instructor.classhealth");
  assert(vm.sourceCocreationRoute === "instructor.cocreation", "cocreation source route is preserved");
  assert(vm.interventionRoute === "instructor.intervention", "intervention route is preserved");
  assert(vm.closedLoop.targetId === "impact-ledger-entry", "impact ledger target is preserved");
  assert(vm.closedLoop.nodes.length === 5, "closed loop has 5 nodes");
  assert(vm.closedLoop.nodes.filter((node) => node.status === "done").length === 4, "four closed-loop nodes are done");
  assert(vm.closedLoop.nodes.at(-1)?.status === "active", "policy node is active");
  assert(vm.metrics.length === 4, "four class health metrics exist");
  assert(vm.masteryTrend.targetId === "clo-3-mastery-trend", "CLO target is preserved");
  assert(vm.masteryTrend.series.length === 8, "CLO trend has 8 weeks");
  assert(vm.masteryTrend.series[vm.masteryTrend.dipIndex] === 58, "W7 dip is preserved");
  assert(vm.masteryTrend.series[vm.masteryTrend.recoveryIndex] === 64, "W8 recovery is preserved");
  assert(
    vm.impactLedger.rows.some((row) => row.value.includes("-22%")),
    "impact ledger keeps measured effect",
  );
  assert(vm.policyMemo.targetId === "policy-memo-draft", "policy memo target is preserved");
  assert(vm.policyMemo.nextActionTargetId === "next-semester-policy", "next policy target is preserved");
  assert(vm.outcomes.length === 4, "registered outcomes include guardrail");
  assert(
    vm.outcomes.some((outcome) => outcome.role === "guardrail"),
    "guardrail outcome exists",
  );
  assert(vm.supportActions.length === 3, "three support actions exist");
  assert(vm.engagement.targetId === "engagement-drop-w6", "engagement anomaly target is preserved");
  assert(vm.engagement.currentSeries.includes(42), "W6 engagement drop is preserved");
  assert(vm.accessGate.targetId === "purpose-access-log", "purpose access target is preserved");
  assert(vm.accessGate.guardrails.length >= 4, "access guardrails are preserved");
  assert(vm.aside.model.targetId === "model-risk-factors", "model factor target is preserved");
  assert(vm.aside.model.factors.length === 5, "five risk model factors exist");

  const targetIds = new Set([
    vm.closedLoop.targetId,
    vm.masteryTrend.targetId,
    vm.policyMemo.targetId,
    vm.policyMemo.nextActionTargetId,
    ...vm.outcomes.map((outcome) => outcome.targetId).filter(Boolean),
    ...vm.supportActions.map((action) => action.targetId),
    vm.engagement.targetId,
    vm.accessGate.targetId,
    vm.aside.model.targetId,
  ]);

  for (const expectedTarget of [
    "impact-ledger-entry",
    "clo-3-mastery-trend",
    "policy-memo-draft",
    "next-semester-policy",
    "support-start-block",
    "support-entropy-card",
    "support-pace-agent",
    "engagement-drop-w6",
    "purpose-access-log",
    "model-risk-factors",
  ]) {
    assert(targetIds.has(expectedTarget), `class health target ${expectedTarget} exists`);
  }

  console.log("Instructor class health model audit passed.");
} finally {
  await server.close();
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(`Instructor class health model audit failed: ${message}`);
  }
  console.log(`ok: ${message}`);
}
