#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import pixelmatch from "pixelmatch";
import { PNG } from "pngjs";

const args = parseArgs(process.argv.slice(2));

if (args.help || !args.baseline || !args.actual) {
  printUsage();
  process.exit(args.help ? 0 : 1);
}

const baselinePath = path.resolve(args.baseline);
const actualPath = path.resolve(args.actual);
const outputPath = path.resolve(args.out || "review/visual_checks/diff.png");
const threshold = args.threshold === undefined ? 0.1 : Number(args.threshold);

if (!Number.isFinite(threshold) || threshold < 0 || threshold > 1) {
  console.error("--threshold must be a number from 0 to 1.");
  process.exit(1);
}

const baseline = readPng(baselinePath);
const actual = readPng(actualPath);

if (baseline.width !== actual.width || baseline.height !== actual.height) {
  console.error(`Image sizes differ: ${baseline.width}x${baseline.height} vs ${actual.width}x${actual.height}`);
  process.exit(1);
}

const diff = new PNG({ width: baseline.width, height: baseline.height });
const diffPixels = pixelmatch(baseline.data, actual.data, diff.data, baseline.width, baseline.height, { threshold });
const totalPixels = baseline.width * baseline.height;
const diffRatio = diffPixels / totalPixels;

fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, PNG.sync.write(diff));

console.log(`Diff pixels: ${diffPixels} / ${totalPixels} (${(diffRatio * 100).toFixed(3)}%)`);
console.log(outputPath);

if (args.maxDiffRatio !== undefined && diffRatio > Number(args.maxDiffRatio)) {
  console.error(`Diff ratio exceeded --max-diff-ratio=${args.maxDiffRatio}.`);
  process.exit(1);
}

function readPng(filePath) {
  if (!fs.existsSync(filePath)) {
    console.error(`File not found: ${filePath}`);
    process.exit(1);
  }

  return PNG.sync.read(fs.readFileSync(filePath));
}

function parseArgs(argv) {
  const parsed = {};

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];

    if (arg === "--help" || arg === "-h") {
      parsed.help = true;
      continue;
    }

    if (!arg.startsWith("--")) {
      continue;
    }

    const [key, inlineValue] = arg.slice(2).split("=", 2);
    if (inlineValue !== undefined) {
      parsed[toCamel(key)] = inlineValue;
      continue;
    }

    const next = argv[i + 1];
    if (next && !next.startsWith("--")) {
      parsed[toCamel(key)] = next;
      i += 1;
    } else {
      parsed[toCamel(key)] = true;
    }
  }

  return parsed;
}

function toCamel(value) {
  return value.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
}

function printUsage() {
  console.log(`
Usage:
  npm run design:diff -- --baseline before.png --actual after.png --out review/visual_checks/diff.png

Options:
  --baseline         Baseline PNG path.
  --actual           Actual PNG path.
  --out              Diff PNG path. Default: review/visual_checks/diff.png
  --threshold        Pixelmatch threshold from 0 to 1. Default: 0.1
  --max-diff-ratio   Optional failure threshold, for example 0.01.
`);
}
