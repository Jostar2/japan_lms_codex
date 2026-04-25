#!/usr/bin/env node

import { spawnSync } from "node:child_process";
import process from "node:process";

const npmCommand = process.platform === "win32" ? "npm.cmd" : "npm";

const commands = [
  [npmCommand, ["run", "verify:backlog"]],
  [npmCommand, ["run", "verify:contracts"]],
  [npmCommand, ["run", "verify:design-tokens"]],
  [npmCommand, ["run", "typecheck"]],
  [npmCommand, ["run", "verify:student-lecture-model"]],
  [npmCommand, ["run", "verify:instructor-dashboard-model"]],
  [npmCommand, ["run", "verify:instructor-cocreation-model"]],
  [npmCommand, ["run", "verify:instructor-classhealth-model"]],
  [npmCommand, ["run", "verify:app-shell"]],
  [npmCommand, ["run", "verify:routes"]],
  [npmCommand, ["run", "verify:interaction"]],
  [npmCommand, ["run", "design:a11y", "--", "xAI_LMS_Prototype.html"]],
  [npmCommand, ["run", "capture"]],
];

for (const [command, args] of commands) {
  console.log(`\n> ${command} ${args.join(" ")}`);
  const result =
    process.platform === "win32"
      ? spawnSync(`${command} ${args.map(quoteWindowsArg).join(" ")}`, {
          stdio: "inherit",
          shell: true,
        })
      : spawnSync(command, args, {
          stdio: "inherit",
        });

  if (result.status !== 0) {
    process.exit(result.status || 1);
  }
}

console.log("\nPrototype verification passed.");

function quoteWindowsArg(value) {
  return /[\s"]/u.test(value) ? `"${value.replace(/"/gu, '\\"')}"` : value;
}
