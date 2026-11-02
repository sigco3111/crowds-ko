// Packs the kit pieces the levels use into public/models/kit-town.glb and kit-castle.glb, each piece a top-level node
// with its own name. Only run again when src/levels.js needs a new piece: the two GLBs are kept in the repo.
//
//   node make-kits.mjs <folder with x-fantasy-town-kit and x-castle-kit, the two Kenney zips unpacked>
//
// Kenney's Fantasy Town Kit 2.0 and Castle Kit, CC0: https://kenney.nl/assets/fantasy-town-kit, /castle-kit
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { NodeIO } from '@gltf-transform/core';
import { KHRTextureTransform } from '@gltf-transform/extensions';
import { dedup, mergeDocuments, prune, unpartition } from '@gltf-transform/functions';

const here = path.dirname(fileURLToPath(import.meta.url));
const from = process.argv[2];
const TOWN = [
	'wall', 'wall-window-shutters', 'wall-window-glass', 'wall-window-small', 'wall-door', 'wall-doorway-square', 'wall-wood', 'wall-wood-window-shutters', 'wall-wood-window-glass', 'wall-wood-door',
	'wall-wood-detail-cross', 'wall-wood-detail-diagonal', 'roof-gable', 'roof-high-gable', 'roof-gable-detail', 'roof-point', 'roof-high-point', 'chimney', 'stall-red', 'stall-green', 'stall-bench', 'stall-stool', 'fountain-round', 'fountain-round-detail', 'cart', 'cart-high', 'lantern',
	'tree', 'tree-high', 'tree-crooked', 'tree-high-round', 'tree-high-crooked', 'rock-large', 'rock-small', 'rock-wide', 'fence', 'banner-red', 'banner-green', 'wheel',
];
const CASTLE = [
	'wall', 'wall-half', 'wall-corner', 'wall-doorway', 'wall-narrow', 'wall-narrow-stairs', 'wall-narrow-corner', 'wall-to-narrow', 'wall-pillar', 'gate', 'metal-gate', 'door', 'bridge-straight', 'bridge-straight-pillar', 'stairs-stone', 'stairs-stone-square',
	'tower-base', 'tower-top', 'tower-square', 'tower-square-base', 'tower-square-base-color', 'tower-square-mid', 'tower-square-mid-windows', 'tower-square-mid-door', 'tower-square-top', 'tower-square-top-roof', 'tower-square-top-roof-high', 'tower-square-top-roof-rounded', 'tower-square-roof', 'tower-hexagon-base', 'tower-hexagon-mid', 'tower-hexagon-top', 'tower-hexagon-roof',
	'flag', 'flag-wide', 'flag-pennant', 'flag-banner-long', 'flag-banner-short', 'siege-catapult', 'siege-ballista', 'siege-ram', 'siege-trebuchet', 'tree-large', 'tree-small', 'tree-trunk', 'tree-log', 'rocks-large', 'rocks-small',
];

const io = new NodeIO().registerExtensions([KHRTextureTransform]);
async function pack(kit, pieces, out) {
	const dir = path.join(from, kit, 'Models', 'GLB format');
	const doc = await io.read(path.join(dir, `${pieces[0]}.glb`));
	const scene = doc.getRoot().listScenes()[0];
	// Unique names: the loader renames any name it has seen, and a scene or a part may share one with a piece.
	const name = (root, piece) => {
		root.setName(piece);
		root.traverse((node) => {
			if (node !== root) node.setName(`${piece}/${node.getName()}`);
		});
	};
	scene.setName('kit');
	name(scene.listChildren()[0], pieces[0]);
	for (const piece of pieces.slice(1)) {
		const other = await io.read(path.join(dir, `${piece}.glb`));
		name(other.getRoot().listScenes()[0].listChildren()[0], piece);
		const map = mergeDocuments(doc, other);
		const added = map.get(other.getRoot().listScenes()[0]);
		for (const child of added.listChildren()) scene.addChild(child);
		added.dispose();
	}
	await doc.transform(dedup(), prune({ keepLeaves: true }), unpartition());
	// The packs reference their colour map from outside: it goes inside the GLB.
	for (const tex of doc.getRoot().listTextures()) tex.setURI('');
	await io.write(path.join(here, 'public', 'models', out), doc);
	console.log(out, `${pieces.length} pieces`);
}
await pack('x-fantasy-town-kit', TOWN, 'kit-town.glb');
await pack('x-castle-kit', CASTLE, 'kit-castle.glb');
