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
  const { getStudentLectureViewModel } = await server.ssrLoadModule("/src/student/lecture/view-model.ts");
  const vm = getStudentLectureViewModel();

  assert(vm.routeKey === "student.lecture", "route key is student.lecture");
  assert(vm.courseTitle === "데이터 마이닝", "course title is preserved");
  assert(vm.player.currentTime === "18:12", "player current time is 18:12");
  assert(vm.player.duration === "52:08", "player duration is preserved");
  assert(vm.player.progressPercent === 22, "player progress is 22%");
  assert(vm.player.cues.length === 5, "player has 5 progress cues");

  const primaryCue = vm.player.cues.find((cue) => cue.emphasis === "primary");
  assert(primaryCue?.targetId === "seg-22pct", "primary cue targets seg-22pct");
  assert(primaryCue?.percent === 22, "primary cue is at 22%");

  assert(vm.summaryBullets.length === 5, "summary has 5 bullets");
  assert(vm.transcript.languageTabs.join("|") === "한|EN|日|中", "transcript language tabs are preserved");
  assert(vm.transcript.rows.length === 4, "transcript has 4 rows");

  const activeTranscript = vm.transcript.rows.find((row) => row.active);
  assert(activeTranscript?.timestamp === "18:12", "active transcript timestamp is 18:12");
  assert(activeTranscript?.targetId === "transcript-18m12", "active transcript targets transcript-18m12");

  assert(vm.metacognition.selectedValue === 3, "metacognition selected value is 3");
  assert(vm.metacognition.targetId === "metacog-check-3", "metacognition target is preserved");
  assert(vm.aside.heatmap.length === vm.player.cues.length, "aside heatmap mirrors player cues");
  assert(
    vm.aside.cards.map((card) => card.targetId).join("|") === "prereq-entropy|confirm-q-2",
    "aside cards are preserved",
  );
  assert(vm.aside.peerCluster.confidencePercent === 82, "peer cluster confidence is 82%");
  assert(
    vm.aside.peerCluster.hints.map((hint) => hint.count).join("|") === "38|27|18",
    "peer hint counts are preserved",
  );
  assert(vm.aside.companion.presets.length === 3, "companion presets are preserved");
  assert(vm.instructorBridge.routeKey === "instructor.dashboard", "instructor bridge route is preserved");
  assert(vm.instructorBridge.targetId === "decision-w7-cocreation", "instructor bridge target is preserved");
  assert(vm.instructorBridge.privacyCopy.includes("개인 식별 없음"), "student privacy boundary is explicit");

  const targetIds = new Set([
    ...vm.player.cues.map((cue) => cue.targetId),
    vm.callout.targetId,
    ...vm.transcript.rows.flatMap((row) => (row.targetId ? [row.targetId] : [])),
    vm.metacognition.targetId,
    ...vm.aside.heatmap.map((cue) => cue.targetId),
    ...vm.aside.cards.map((card) => card.targetId),
    vm.aside.peerCluster.targetId,
  ]);

  for (const expectedTarget of [
    "seg-intro",
    "seg-22pct",
    "transcript-18m12",
    "quick-review-5min",
    "peer-struggle-cluster",
    "prereq-entropy",
    "confirm-q-2",
    "metacog-check-3",
  ]) {
    assert(targetIds.has(expectedTarget), `student lecture target ${expectedTarget} exists`);
  }

  console.log("Student lecture model audit passed.");
} finally {
  await server.close();
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(`Student lecture model audit failed: ${message}`);
  }
  console.log(`ok: ${message}`);
}
