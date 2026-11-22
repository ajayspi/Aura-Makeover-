import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

async function runAudit() {
  const outputDir = path.resolve(process.cwd(), 'test-results', 'styler');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  console.log('Launching Chromium for Playwright test audit...');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2,
  });

  const page = await context.newPage();

  // Collect console logs and errors
  const consoleLogs = [];
  const pageErrors = [];
  page.on('console', (msg) => consoleLogs.push(`[${msg.type()}] ${msg.text()}`));
  page.on('pageerror', (err) => pageErrors.push(err.message));

  const targetUrl = process.env.TEST_URL || process.argv[2] || 'http://localhost:3000/kit/styler/kitchen_5';
  console.log(`Navigating to ${targetUrl} ...`);
  const response = await page.goto(targetUrl, {
    waitUntil: 'networkidle',
    timeout: 30000,
  });

  console.log('HTTP Status:', response.status());

  // 1. Initial State
  await page.waitForTimeout(2000);
  await page.screenshot({ path: path.join(outputDir, '01_initial_load.png'), fullPage: false });
  console.log('Captured 01_initial_load.png');

  // Inspect Canvas State
  const canvasStatus = await page.evaluate(() => {
    const canvas = document.querySelector('canvas');
    if (!canvas) return { found: false };
    const ctx = canvas.getContext('2d');
    const w = canvas.width;
    const h = canvas.height;
    // Sample pixels in center of lower cabinet region (roughly 50% x, 75% y)
    const pixel = ctx.getImageData(Math.floor(w * 0.5), Math.floor(h * 0.75), 1, 1).data;
    return {
      found: true,
      width: w,
      height: h,
      pixelAtCenterCabinet: [pixel[0], pixel[1], pixel[2], pixel[3]],
    };
  });
  console.log('Initial Canvas Status:', canvasStatus);

  // 2. Camera Angle 2
  console.log('Testing Camera Angles...');
  const nextBtn = page.locator('button[aria-label="Next Camera Angle"]');
  if (await nextBtn.isVisible()) {
    await nextBtn.click();
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(outputDir, '02_angle_2.png') });
    console.log('Captured 02_angle_2.png');

    await nextBtn.click();
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(outputDir, '03_angle_3.png') });
    console.log('Captured 03_angle_3.png');

    // Go back to Angle 1
    await nextBtn.click();
    await page.waitForTimeout(1000);
  }

  // 3. Color Swapping Tests
  console.log('Testing Color Swatching...');
  // Click Sage Whisper
  const sageBtn = page.locator('button[title*="Sage Whisper"]').first();
  if (await sageBtn.isVisible()) {
    await sageBtn.click();
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(outputDir, '04_color_sage.png') });
    console.log('Captured 04_color_sage.png');
  }

  // Click Midnight Navy
  const navyBtn = page.locator('button[title*="Midnight Navy"]').first();
  if (await navyBtn.isVisible()) {
    await navyBtn.click();
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(outputDir, '05_color_navy.png') });
    console.log('Captured 05_color_navy.png');
  }

  // Click Terracotta Rust
  const terraBtn = page.locator('button[title*="Terracotta Rust"]').first();
  if (await terraBtn.isVisible()) {
    await terraBtn.click();
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(outputDir, '06_color_terracotta.png') });
    console.log('Captured 06_color_terracotta.png');
  }

  // Sample pixel color on Navy vs Terracotta
  const colorDiffData = await page.evaluate(() => {
    const canvas = document.querySelector('canvas');
    if (!canvas) return null;
    const ctx = canvas.getContext('2d');
    const w = canvas.width;
    const h = canvas.height;
    const pixel = ctx.getImageData(Math.floor(w * 0.5), Math.floor(h * 0.75), 1, 1).data;
    return [pixel[0], pixel[1], pixel[2], pixel[3]];
  });
  console.log('Terracotta Pixel at Center Cabinet:', colorDiffData);

  // 4. Test Profiles & Finishes
  console.log('Testing Profiles & Finishes...');
  const canneleBtn = page.getByRole('button', { name: /Cannelé/i }).first();
  if (await canneleBtn.isVisible()) {
    await canneleBtn.click();
    await page.waitForTimeout(500);
  }

  const woodBtn = page.getByRole('button', { name: /Natural Oak/i }).first();
  if (await woodBtn.isVisible()) {
    await woodBtn.click();
    await page.waitForTimeout(500);
  }

  // 5. Test Handles Tab
  console.log('Testing Handles Tab...');
  const handlesTab = page.getByRole('tab', { name: /Handles/i });
  if (await handlesTab.isVisible()) {
    await handlesTab.click();
    await page.waitForTimeout(500);
    const liseretBtn = page.getByRole('button', { name: /Liseret/i }).first();
    if (await liseretBtn.isVisible()) await liseretBtn.click();

    const blackMetalBtn = page.getByRole('button', { name: /Matte Black/i }).first();
    if (await blackMetalBtn.isVisible()) await blackMetalBtn.click();
  }

  // 6. Test Worktop Tab
  console.log('Testing Worktop Tab...');
  const worktopTab = page.getByRole('tab', { name: /Worktop/i });
  if (await worktopTab.isVisible()) {
    await worktopTab.click();
    await page.waitForTimeout(500);
    const basaltBtn = page.getByRole('button', { name: /Volcanic Basalt/i }).first();
    if (await basaltBtn.isVisible()) await basaltBtn.click();
  }

  // 7. Test Itemized BOM Modal
  console.log('Testing BOM Modal...');
  const bomBtn = page.getByRole('button', { name: /BOM/i }).first();
  if (await bomBtn.isVisible()) {
    await bomBtn.click();
    await page.waitForTimeout(800);
    await page.screenshot({ path: path.join(outputDir, '07_bom_dialog.png') });
    console.log('Captured 07_bom_dialog.png');
    // Close modal
    await page.keyboard.press('Escape');
    await page.waitForTimeout(500);
  }

  // 8. Test Sample Swatch Box Addition
  console.log('Testing Swatch Box Action...');
  const sampleBtn = page.getByRole('button', { name: /Sample Finish/i }).first();
  if (await sampleBtn.isVisible()) {
    await sampleBtn.click();
    await page.waitForTimeout(800);
    await page.screenshot({ path: path.join(outputDir, '08_swatch_bar_active.png') });
    console.log('Captured 08_swatch_bar_active.png');
  }

  // 9. Test Instant Quote Modal
  console.log('Testing Instant Quote Modal...');
  const quoteBtn = page.getByRole('button', { name: /Get Instant Quote/i }).first();
  if (await quoteBtn.isVisible()) {
    await quoteBtn.click();
    await page.waitForTimeout(800);
    await page.screenshot({ path: path.join(outputDir, '09_quote_modal.png') });
    console.log('Captured 09_quote_modal.png');
    await page.keyboard.press('Escape');
    await page.waitForTimeout(500);
  }

  const resultReport = {
    status: response.status(),
    canvasStatus,
    colorDiffData,
    consoleLogsCount: consoleLogs.length,
    pageErrorsCount: pageErrors.length,
    pageErrors,
    screenshots: [
      '01_initial_load.png',
      '02_angle_2.png',
      '03_angle_3.png',
      '04_color_sage.png',
      '05_color_navy.png',
      '06_color_terracotta.png',
      '07_bom_dialog.png',
      '08_swatch_bar_active.png',
      '09_quote_modal.png',
    ],
  };

  fs.writeFileSync(
    path.join(outputDir, 'audit_report.json'),
    JSON.stringify(resultReport, null, 2)
  );

  console.log('Audit completed successfully! Report written to audit_report.json');
  await browser.close();
}

runAudit().catch((err) => {
  console.error('Audit failed:', err);
  process.exit(1);
});
