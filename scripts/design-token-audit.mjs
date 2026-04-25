#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const tokenContractPath = path.resolve("contracts/design-tokens.contract.json");
const prototypePath = path.resolve("xAI_LMS_Prototype.html");

const tokenContract = JSON.parse(fs.readFileSync(tokenContractPath, "utf8"));
const prototypeHtml = fs.readFileSync(prototypePath, "utf8");
const prototypeRootTokens = parseRootTokens(prototypeHtml);
const contractTokens = flattenContractTokens(tokenContract.rootTokens);
const contractVariables = new Set(contractTokens.map((token) => token.cssVariable));
const prototypeVariables = new Set(Object.keys(prototypeRootTokens));

let failureCount = 0;

check(tokenContract.source === "xAI_LMS_Prototype.html", "design token contract points to prototype source");
check(
  tokenContract.principle === "Conserve existing prototype tokens. Do not introduce a new palette during migration.",
  "design token contract preserves visual conservation principle",
);
check(contractTokens.length > 0, "design token contract has root tokens");

for (const token of contractTokens) {
  check(Boolean(token.role), `${token.cssVariable} has product role`);
  check(prototypeVariables.has(token.cssVariable), `${token.cssVariable} exists in prototype :root`);

  const prototypeValue = prototypeRootTokens[token.cssVariable];
  if (prototypeValue) {
    check(
      normalizeCssValue(prototypeValue) === normalizeCssValue(token.value),
      `${token.cssVariable} value matches prototype (${token.value})`,
    );
  }
}

for (const prototypeVariable of prototypeVariables) {
  check(contractVariables.has(prototypeVariable), `${prototypeVariable} is documented in design token contract`);
}

for (const [ruleName, variables] of Object.entries(tokenContract.semanticRules || {})) {
  check(Array.isArray(variables) && variables.length > 0, `${ruleName} semantic rule declares variables`);
  for (const variable of variables) {
    check(contractVariables.has(variable), `${ruleName} references documented token ${variable}`);
  }
}

for (const [name, override] of Object.entries(tokenContract.componentOverrides || {})) {
  check(Boolean(override.value), `${name} component override has value`);
  check(Boolean(override.reason), `${name} component override has reason`);
}

if (failureCount > 0) {
  console.error(`Design token audit failed with ${failureCount} issue(s).`);
  process.exit(1);
}

console.log("Design token audit passed.");

function parseRootTokens(html) {
  const match = html.match(/:root\s*\{([\s\S]*?)\n\}/u);
  if (!match) {
    throw new Error("Could not find :root block in prototype.");
  }

  const tokens = {};
  const tokenPattern = /(--[a-z0-9-]+)\s*:\s*([^;]+);/giu;
  let tokenMatch;

  while ((tokenMatch = tokenPattern.exec(match[1])) !== null) {
    tokens[tokenMatch[1]] = tokenMatch[2].trim();
  }

  return tokens;
}

function flattenContractTokens(value, tokens = []) {
  if (!value || typeof value !== "object") return tokens;

  if (typeof value.cssVariable === "string" && typeof value.value === "string") {
    tokens.push(value);
    return tokens;
  }

  for (const nested of Object.values(value)) {
    flattenContractTokens(nested, tokens);
  }

  return tokens;
}

function normalizeCssValue(value) {
  return value.replace(/\s+/gu, " ").trim();
}

function check(condition, label) {
  if (condition) {
    console.log(`ok: ${label}`);
    return;
  }

  console.error(`fail: ${label}`);
  failureCount += 1;
}
