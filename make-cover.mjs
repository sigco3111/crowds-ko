// Takes candidate cover pictures: the crowd pouring across the market square, 1920 x 1080 in headless Chromium, muted.
// Writes shots/cover-<n>.png; the chosen one becomes cover.jpg (1280 x 720).
//
//   npm run dev   (in another terminal), then: node make-cover.mjs [url, default http://127.0.0.1:5381/]
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const here = path.dirname(fileURLToPath(import.meta.url));
const url = process.argv[2] ?? 'http://127.0.0.1:5381/';
const out = path.join(here, 'shots');
fs.mkdirSync(out, { recursive: true });
const browser = await chromium.launch({
	executablePath: process.env.CHROME || undefined,
	headless: true,
	args: ['--mute-audio', '--ignore-gpu-blocklist', '--use-angle=d3d11'],
});
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
await page.goto(url);
await page.waitForFunction(() => window.__block?.app, null, { timeout: 60000 });
await page.evaluate(async () => {
	const a = window.__block.app;
	const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
	a.still(true);
	a.set('crowd', 130);
	const o = a.orbit;
	Object.assign(o.want, { distance: 48, pitch: 0.62, yaw: 0.55 });
	o.want.target.set(0.5, 0, 1.5);
	o.target.copy(o.want.target);
	Object.assign(o, { distance: 48, pitch: 0.62, yaw: 0.55 });
	await sleep(4000);
	a.stage.crowd.goTo({ x: 7, y: 0, z: -3.5 });
	await sleep(2200);
});
for (let k = 0; k < 6; k++) {
	await page.waitForTimeout(350);
	await page.screenshot({ path: path.join(out, `cover-${k}.png`) });
}
await browser.close();
console.log('shots/cover-0..5.png');
