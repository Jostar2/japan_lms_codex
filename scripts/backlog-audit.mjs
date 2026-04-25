#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const backlogPath = path.resolve("contracts/productization-backlog.json");
const contractPath = path.resolve("contracts/university-lms.contract.json");
const packagePath = path.resolve("package.json");

const backlog = JSON.parse(fs.readFileSync(backlogPath, "utf8"));
const contract = JSON.parse(fs.readFileSync(contractPath, "utf8"));
const packageJson = JSON.parse(fs.readFileSync(packagePath, "utf8"));

const validSurfaces = new Set(["shared", "student", "instructor"]);
const validKinds = new Set(["verification", "ci", "architecture", "migration", "pilot"]);
const validStatuses = new Set(["planned", "next", "in-progress", "done"]);
const routeKeys = new Set(
  Object.values(contract.surfaces).flatMap((surface) => surface.routes.map((route) => route.key)),
);
const scriptNames = new Set(Object.keys(packageJson.scripts || {}));
const workUnits = backlog.workUnits || [];
const workUnitIds = new Set(workUnits.map((unit) => unit.id));

let failureCount = 0;

check(Boolean(backlog.version), "backlog has version");
check(backlog.principle === "Conserve design, replace implementation structure.", "backlog preserves design principle");
check(Array.isArray(workUnits) && workUnits.length > 0, "backlog has work units");
check(workUnitIds.size === workUnits.length, "work unit ids are unique");

for (const unit of workUnits) {
  check(typeof unit.id === "string" && unit.id.length > 0, "work unit has id");
  check(Number.isInteger(unit.phase) && unit.phase >= 0, `${unit.id} has non-negative phase`);
  check(validSurfaces.has(unit.surface), `${unit.id} has valid surface`);
  check(validKinds.has(unit.kind), `${unit.id} has valid kind`);
  check(validStatuses.has(unit.status), `${unit.id} has valid status`);
  check(typeof unit.summary === "string" && unit.summary.length >= 20, `${unit.id} has useful summary`);
  check(Array.isArray(unit.gates) && unit.gates.length > 0, `${unit.id} declares gates`);
  check(Array.isArray(unit.routeKeys), `${unit.id} has routeKeys array`);
  check(Array.isArray(unit.dependencies), `${unit.id} has dependencies array`);

  for (const gate of unit.gates || []) {
    check(scriptNames.has(gate), `${unit.id} gate ${gate} exists in package scripts`);
  }

  for (const routeKey of unit.routeKeys || []) {
    check(routeKeys.has(routeKey), `${unit.id} route ${routeKey} exists in LMS contract`);
    if (unit.surface === "student" || unit.surface === "instructor") {
      check(routeKey.startsWith(`${unit.surface}.`), `${unit.id} route ${routeKey} matches ${unit.surface} surface`);
    }
  }

  for (const dependency of unit.dependencies || []) {
    check(workUnitIds.has(dependency), `${unit.id} dependency ${dependency} exists`);
  }
}

check(
  workUnits.some((unit) => unit.id === "student.lecture.view-model"),
  "student lecture view-model work unit exists",
);
check(
  workUnits.some((unit) => unit.id === "instructor.dashboard.view-model"),
  "instructor dashboard work unit exists",
);
check(
  workUnits.some((unit) => unit.routeKeys?.includes("instructor.cocreation")),
  "instructor cocreation work unit exists",
);

if (failureCount > 0) {
  console.error(`Backlog audit failed with ${failureCount} issue(s).`);
  process.exit(1);
}

console.log("Backlog audit passed.");

function check(condition, label) {
  if (condition) {
    console.log(`ok: ${label}`);
    return;
  }

  console.error(`fail: ${label}`);
  failureCount += 1;
}
