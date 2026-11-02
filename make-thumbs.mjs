// Writes the Level choice's pictures, thumbs/levels/<id>.webp: each level with its crowd, in its square, 112 x 112 (the
// block page draws them at 56 x 56), captured from the demo in headless Chromium, muted.
//
//   npm run dev   (in another terminal), then: node make-thumbs.mjs [url, default http://127.0.0.1:5381/]
//
// Needs Playwright's Chromium (CHROME=<path to chrome.exe> to use another) and ffmpeg (with libwebp) on PATH.
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';
import { levels } from './make-recipe.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const url = process.argv[2] ?? 'http://127.0.0.1:5381/';
const out = path.join(here, 'thumbs', 'levels');
fs.mkdirSync(out, { recursive: true });
const POSE = {
	market: { distance: 40, pitch: 0.78, yaw: 0.46, target: [0, 0, -1] },
	castle: { distance: 44, pitch: 0.82, yaw: 0.42, target: [0, 0, 0] },
	maze: { distance: 44, pitch: 1.0, yaw: 0.36, target: [0, 0, 0] },
};
const browser = await chromium.launch({
	executablePath: process.env.CHROME || undefined,
	headless: true,
	args: ['--mute-audio', '--ignore-gpu-blocklist', '--use-angle=d3d11'],
});
const page = await browser.newPage({ viewport: { width: 448, height: 448 } });
await page.goto(url);
await page.waitForFunction(() => window.__block?.app, null, { timeout: 60000 });
for (const [id] of levels) {
	await page.evaluate(
		async ([level, pose]) => {
			const a = window.__block.app;
			a.still(true);
			a.set('level', level);
			const o = a.orbit;
			o.want.target.set(...pose.target);
			Object.assign(o.want, { distance: pose.distance, pitch: pose.pitch, yaw: pose.yaw });
			o.target.copy(o.want.target);
			Object.assign(o, { distance: pose.distance, pitch: pose.pitch, yaw: pose.yaw });
			await new Promise((r) => setTimeout(r, 1500));
		},
		[id, POSE[id]],
	);
	const png = path.join(out, `${id}.png`);
	await page.screenshot({ path: png });
	const webp = path.join(out, `${id}.webp`);
	execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', png, '-vf', 'scale=112:112:flags=lanczos', '-c:v', 'libwebp', '-quality', '86', webp]);
	fs.rmSync(png);
	console.log(`${id}: ${fs.statSync(webp).size} bytes`);
}
await browser.close();
