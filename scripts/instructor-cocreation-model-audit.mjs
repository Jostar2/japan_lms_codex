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
  const { getInstructorCocreationViewModel } = await server.ssrLoadModule("/src/instructor/cocreation/view-model.ts");
  const vm = getInstructorCocreationViewModel();

  assert(vm.routeKey === "instructor.cocreation", "route key is instructor.cocreation");
  assert(vm.sourceRoute === "instructor.dashboard", "dashboard source route is preserved");
  assert(vm.classHealthRoute === "instructor.classhealth", "class health destination route is preserved");
  assert(vm.incidentInput.targetId === "step1-input", "step 1 input target is preserved");
  assert(vm.incidentInput.sourceCopy.includes("student.lecture 22%"), "student incident source copy is preserved");
  assert(vm.incidentInput.segmentMetric.includes("P(struggle) 0.82"), "segment struggle probability is preserved");
  assert(vm.generationConstraints.length === 3, "generation constraints have 3 metrics");
  assert(vm.variants.length === 3, "three cocreation variants exist");

  const selected = vm.variants.filter((variant) => variant.selected);
  assert(selected.length === 1, "exactly one variant is selected");
  assert(selected[0]?.targetId === "step2-variant-b", "variant B is selected");
  assert(
    selected[0]?.metrics.some((metric) => metric.value === "-22%"),
    "variant B expected rewatch effect is preserved",
  );
  assert(vm.selectionRationale.targetId === "step2-selection-rationale", "selection rationale target is preserved");
  assert(vm.draft.targetId === "step3-governance-gates", "governance gate target is preserved");
  assert(vm.draft.gates.length === 3, "three governance gates exist");
  assert(
    vm.draft.gates.every((gate) => gate.status === "pass"),
    "all governance gates pass",
  );
  assert(vm.approval.targetId === "step4-ab-settings", "approval target is preserved");
  assert(vm.approval.abSplit === "AB 50:50", "AB split is preserved");
  assert(vm.approval.registeredOutcomes.length === 4, "registered outcomes include guardrail");
  assert(vm.effect.targetId === "step5-effect", "effect target is preserved");
  assert(vm.effect.summary.includes("-22%"), "measured effect is preserved");
  assert(vm.classHealthBridge.targetId === "impact-ledger-entry", "class health bridge target is preserved");
  assert(vm.measurementPlan.targetId === "measurement-plan", "measurement plan target is preserved");
  assert(vm.aside.xaiPlan.modelVersion === "course_cocreation_planner.v0.9", "cocreation model version is preserved");

  const targetIds = new Set([
    vm.incidentInput.targetId,
    ...vm.variants.map((variant) => variant.targetId),
    vm.selectionRationale.targetId,
    vm.draft.targetId,
    vm.approval.targetId,
    vm.effect.targetId,
    vm.measurementPlan.targetId,
    vm.classHealthBridge.targetId,
  ]);

  for (const expectedTarget of [
    "step1-input",
    "step2-variant-a",
    "step2-variant-b",
    "step2-variant-c",
    "step2-selection-rationale",
    "step3-governance-gates",
    "step4-ab-settings",
    "step5-effect",
    "measurement-plan",
    "impact-ledger-entry",
  ]) {
    assert(targetIds.has(expectedTarget), `cocreation target ${expectedTarget} exists`);
  }

  console.log("Instructor cocreation model audit passed.");
} finally {
  await server.close();
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(`Instructor cocreation model audit failed: ${message}`);
  }
  console.log(`ok: ${message}`);
}
