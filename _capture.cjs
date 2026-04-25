// Visual self-verify: open prototype in headless chromium, navigate every nav route,
// take screenshot per route. Output to review/visual_checks/round3/.
const { chromium } = require("playwright");
const path = require("path");
const fs = require("fs");

const fileUrl = "file:///" + path.resolve("xAI_LMS_Prototype.html").replace(/\\/g, "/");
const outDir = path.resolve("review/visual_checks/round3");
fs.mkdirSync(outDir, { recursive: true });

(async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  let issueCount = 0;
  const manifest = [];
  page.on("pageerror", (e) => {
    issueCount++;
    console.log("  pageerror:", e.message);
  });
  page.on("console", (m) => {
    if (m.type() === "error") {
      issueCount++;
      console.log("  console err:", m.text());
    }
  });
  await page.goto(fileUrl, { waitUntil: "domcontentloaded" });
  await page.waitForSelector("#mainContent");

  // Read NAV from page (NAV is a top-level const, accessible inside evaluate without window prefix)
  const nav = await page.evaluate(() => {
    if (typeof NAV === "undefined") return null;
    return Object.fromEntries(
      Object.entries(NAV).map(([persona, groups]) => [
        persona,
        groups.flatMap((g) => g.items.map((it) => ({ id: it.id, label: it.label }))),
      ]),
    );
  });
  if (!nav) {
    console.log("FATAL: NAV not visible from evaluate scope");
    process.exit(2);
  }

  let count = 0;
  for (const persona of ["student", "instructor"]) {
    for (const item of nav[persona]) {
      await page.evaluate(
        ([p, id]) => {
          if (state.persona !== p) {
            state.persona = p;
            document.body.classList.toggle("s-mode", p === "student");
            document.body.classList.toggle("i-mode", p === "instructor");
          }
          state.page = id;
          renderNav();
          renderPage();
        },
        [persona, item.id],
      );
      await page.waitForTimeout(200);
      const mainTextLength = await page.evaluate(
        () => document.getElementById("mainContent")?.innerText.trim().length || 0,
      );
      if (mainTextLength < 20) {
        issueCount++;
        console.log(`  empty route warning: ${persona}.${item.id}`);
      }
      const file = path.join(outDir, `${persona}--${item.id}.png`);
      await page.screenshot({ path: file, fullPage: true });
      manifest.push({
        persona,
        route: item.id,
        key: `${persona}.${item.id}`,
        label: item.label,
        screenshot: path.relative(process.cwd(), file).replace(/\\/g, "/"),
      });
      count++;
      console.log(`  ${persona}.${item.id} → ${path.basename(file)}`);
    }
  }
  await browser.close();
  fs.writeFileSync(path.join(outDir, "manifest.json"), JSON.stringify(manifest, null, 2) + "\n");
  console.log(`captured ${count} routes → ${outDir}`);
  if (issueCount > 0) {
    console.log(`capture completed with ${issueCount} issue(s)`);
    process.exit(1);
  }
})().catch((e) => {
  console.log("FATAL:", e.message);
  process.exit(1);
});
