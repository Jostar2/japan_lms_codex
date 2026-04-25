#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import OpenAI from "openai";

loadDotEnv();

const args = parseArgs(process.argv.slice(2));

if (args.help) {
  printUsage();
  process.exit(0);
}

const prompt = args.prompt || args._.join(" ").trim();

if (!prompt) {
  console.error("Missing prompt.");
  printUsage();
  process.exit(1);
}

if (!process.env.OPENAI_API_KEY) {
  console.error("Missing OPENAI_API_KEY. Set it as an environment variable or add it to a local .env file.");
  process.exit(1);
}

const output = path.resolve(args.out || args.output || "generated/gpt-image-2.png");
const outputFormat = normalizeOutputFormat(args.format || inferFormat(output));
const sourceImages = listArg(args.image).map((file) => path.resolve(file));
const request = {
  model: args.model || "gpt-image-2",
  prompt,
  output_format: outputFormat,
};

addOptional(request, "size", args.size);
addOptional(request, "quality", args.quality);
addOptional(request, "background", args.background);
if (sourceImages.length) {
  addOptional(request, "input_fidelity", args.inputFidelity);
} else {
  addOptional(request, "moderation", args.moderation);
}

if (args.n) {
  const n = Number(args.n);
  if (!Number.isInteger(n) || n < 1 || n > 10) {
    console.error("--n must be an integer from 1 to 10.");
    process.exit(1);
  }
  request.n = n;
}

try {
  for (const sourceImage of sourceImages) {
    if (!fs.existsSync(sourceImage)) {
      throw new Error(`Input image not found: ${sourceImage}`);
    }
  }
  if (args.mask && !fs.existsSync(path.resolve(args.mask))) {
    throw new Error(`Mask image not found: ${path.resolve(args.mask)}`);
  }

  const client = new OpenAI();
  const result = sourceImages.length
    ? await client.images.edit({
        ...request,
        image: sourceImages.map((sourceImage) => fs.createReadStream(sourceImage)),
        ...(args.mask ? { mask: fs.createReadStream(path.resolve(args.mask)) } : {}),
      })
    : await client.images.generate(request);

  if (!result.data?.length) {
    throw new Error("The API returned no images.");
  }

  fs.mkdirSync(path.dirname(output), { recursive: true });
  const savedFiles = [];

  for (const [index, image] of result.data.entries()) {
    if (!image.b64_json) {
      throw new Error("The API response did not include base64 image data.");
    }

    const imagePath = result.data.length === 1 ? output : numberedPath(output, index + 1);
    fs.writeFileSync(imagePath, Buffer.from(image.b64_json, "base64"));
    savedFiles.push(imagePath);
  }

  console.log(`${sourceImages.length ? "Edited" : "Generated"} ${savedFiles.length} image(s) with ${request.model}.`);
  for (const file of savedFiles) {
    console.log(file);
  }
} catch (error) {
  console.error("Image generation failed.");
  console.error(error?.message || error);
  process.exit(1);
}

function parseArgs(argv) {
  const parsed = { _: [] };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];

    if (arg === "--help" || arg === "-h") {
      parsed.help = true;
      continue;
    }

    if (!arg.startsWith("--")) {
      parsed._.push(arg);
      continue;
    }

    const [rawKey, inlineValue] = arg.slice(2).split("=", 2);
    const key = rawKey.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());

    if (inlineValue !== undefined) {
      setArg(parsed, key, inlineValue);
      continue;
    }

    const next = argv[i + 1];
    if (next && !next.startsWith("--")) {
      setArg(parsed, key, next);
      i += 1;
    } else {
      setArg(parsed, key, true);
    }
  }

  return parsed;
}

function setArg(parsed, key, value) {
  if (parsed[key] === undefined) {
    parsed[key] = value;
  } else if (Array.isArray(parsed[key])) {
    parsed[key].push(value);
  } else {
    parsed[key] = [parsed[key], value];
  }
}

function addOptional(target, key, value) {
  if (value !== undefined && value !== true && value !== "") {
    target[key] = value;
  }
}

function listArg(value) {
  if (!value) return [];
  const values = Array.isArray(value) ? value : [value];
  return values
    .flatMap((item) => String(item).split(","))
    .map((item) => item.trim())
    .filter(Boolean);
}

function inferFormat(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  if (ext === ".jpg" || ext === ".jpeg") return "jpeg";
  if (ext === ".webp") return "webp";
  return "png";
}

function normalizeOutputFormat(format) {
  if (format === "jpg") return "jpeg";
  if (["png", "jpeg", "webp"].includes(format)) return format;

  console.error("--format must be one of: png, jpeg, jpg, webp.");
  process.exit(1);
}

function numberedPath(filePath, number) {
  const dir = path.dirname(filePath);
  const ext = path.extname(filePath);
  const base = path.basename(filePath, ext);
  return path.join(dir, `${base}-${number}${ext}`);
}

function loadDotEnv() {
  const envPath = path.resolve(".env");

  if (!fs.existsSync(envPath)) {
    return;
  }

  const lines = fs.readFileSync(envPath, "utf8").split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;

    const separator = trimmed.indexOf("=");
    if (separator === -1) continue;

    const key = trimmed.slice(0, separator).trim();
    let value = trimmed.slice(separator + 1).trim();

    if (!key || process.env[key] !== undefined) continue;

    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }

    process.env[key] = value;
  }
}

function printUsage() {
  console.log(`
Usage:
  npm run image:generate -- --prompt "A clean LMS dashboard hero image"
  npm run image:generate -- "A clean LMS dashboard hero image"

Options:
  --prompt       Text prompt. Positional text is also accepted.
  --out          Output file path. Default: generated/gpt-image-2.png
  --model        Image model. Default: gpt-image-2
  --size         auto, 1024x1024, 1536x1024, or 1024x1536
  --quality      auto, low, medium, or high
  --format       png, jpeg, jpg, or webp
  --background   auto, transparent, or opaque
  --moderation   auto or low
  --n            Number of images, 1-10

Editing:
  --image        Input image path. Repeat or comma-separate for multiple references.
  --mask         Optional PNG mask path for the first input image.
  --input-fidelity high or low
`);
}
