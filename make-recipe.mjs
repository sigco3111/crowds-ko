// Writes recipe.json, the crowds block's demo recipe (mode browser + block): `node make-recipe.mjs`.
// demo.js reads its controls from that file.
//
// For people (blendi's standards, 2026-10-31): one way to choose (the level, each with its picture), a few plain
// essentials (crowd size, speed, show the walkable area) and Scatter; a left click sends them and a right click places
// a block, so neither needs a button or a mode. The rest is for agents, in this recipe with its range and default.
//
// Every level has its picture, thumbs/levels/<id>.webp: a still of it, captured from the built demo (make-thumbs.mjs)
// and kept in this repo. `--no-images` leaves them out.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const images = !process.argv.includes('--no-images');
export const levels = [
	['market', 'Market square'],
	['castle', 'Castle walls'],
	['maze', 'Hedge maze'],
];

const recipe = {
	mode: 'browser',
	block: {
		controls: [
			{
				id: 'level',
				label: 'Level',
				hint: 'Where the crowd is: a market square with alleys behind the houses, a castle with ramps up to its walls, or a hedge maze with more than one way through.',
				type: 'choice',
				options: levels.map(([value, label]) => ({ value, label, ...(images ? { image: `thumbs/levels/${value}.webp` } : {}) })),
				default: 'market',
				essential: true,
			},
			{ id: 'crowd', label: 'Crowd size', hint: 'How many people are on the level.', type: 'number', min: 10, max: 200, step: 5, default: 70, essential: true },
			{ id: 'speed', label: 'Speed', hint: 'How fast they go when you send them: a brisk walk at the low end, a sprint at the high end.', type: 'number', min: 1, max: 6, step: 0.1, default: 2.8, unit: 'm/s', essential: true },
			{ id: 'walkable', label: 'Show walkable area', hint: 'Draws the navmesh: the floor Recast worked out from the level, which re-cuts around every block you drop.', type: 'toggle', default: false, essential: true },
			{ id: 'spacing', label: 'Personal space', hint: 'How hard people keep apart from each other. At 0 they brush past; at 4 they give each other room.', type: 'number', min: 0, max: 4, step: 0.1, default: 2 },
			{ id: 'wander', label: 'Mill about', hint: 'Whether people walk on their own: round the level until someone sends them, and off for a stroll a few seconds after arriving. Off, they stand.', type: 'toggle', default: true },
		],
		presets: [],
		// A left click sends them and a right click places or lifts a block, so these two are the only buttons.
		triggers: [
			{ id: 'scatter', label: 'Scatter', hint: 'Everyone runs somewhere of their own.' },
			{ id: 'clear', label: 'Clear blocks', hint: 'Takes away every stone block you dropped, and the crowd gets those ways back.' },
		],
	},
	credits: [
		{ files: 'assets/', license: 'Zlib', source: 'https://github.com/recastnavigation/recastnavigation', author: 'Mikko Mononen and contributors (Recast and Detour, the navigation)' },
		{ files: 'assets/', license: 'MIT', source: 'https://github.com/isaac-mason/recast-navigation-js', author: 'Isaac Mason (recast-navigation-js, 0.44.0, the browser build)' },
		{ files: 'assets/', license: 'MIT', source: 'https://github.com/N8python/n8ao', author: 'N8python (N8AO, the ambient occlusion)' },
		{ files: 'assets/', license: 'Zlib', source: 'https://github.com/pmndrs/postprocessing', author: 'Raoul van Rüschen (postprocessing, which N8AO imports)' },
		{ files: 'assets/', license: 'MIT', source: 'https://github.com/mrdoob/three.js', author: 'three.js authors' },
		{ files: 'models/kit-town.glb', license: 'CC0-1.0', source: 'https://kenney.nl/assets/fantasy-town-kit', author: 'Kenney (Fantasy Town Kit 2.0)' },
		{ files: 'models/kit-castle.glb', license: 'CC0-1.0', source: 'https://kenney.nl/assets/castle-kit', author: 'Kenney (Castle Kit)' },
		{ files: 'models/mannequin.glb', license: 'CC0-1.0', author: "Patch (the mannequin: Patch's 1.8 m scale figure, with one rigid shell per bone)" },
		{ files: 'models/mannequin.glb', license: 'CC0-1.0', source: 'https://quaternius.com/packs/universalanimationlibrary.html', author: "Quaternius (the mannequin's clips, retargeted from the Universal Animation Library 1 and 2)" },
		{ files: 'thumbs/', license: 'CC0-1.0', author: 'Patch (stills of this demo)' },
	],
};
// (Written only when run, not when make-thumbs.mjs imports the levels from here)
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
	fs.writeFileSync(path.join(here, 'recipe.json'), `${JSON.stringify(recipe, null, '\t')}\n`);
	const c = recipe.block.controls;
	console.log(`recipe.json: ${c.length} controls (${c.filter((x) => x.essential).length} essential), ${recipe.block.presets.length} presets, ${recipe.block.triggers.length} triggers`);
}
