import type { Plugin } from 'vite';

const WEIGHT_700 = /"700":\s*("(?:\\.|[^"\\])*")/g;

export function stripMaterialSymbolIconWeights(code: string): string | null {
	const start = code.indexOf('const pathData = ');
	const end = code.indexOf('\nconst metadata', start);
	if (start < 0 || end < 0) return null;

	const source = code.slice(start, end);
	const readWeights = (section: string | undefined) =>
		[...(section ?? '').matchAll(WEIGHT_700)].map((entry) => `        "700": ${entry[1]}`);
	const regular = readWeights(source.match(/regular:\s*\{([\s\S]*?)\}/)?.[1]);
	const filled = readWeights(source.match(/filled:\s*\{([\s\S]*?)\}/)?.[1]);
	if (regular.length === 0) return null;
	const variants = [`    regular: {\n${regular.join(',\n')}\n    }`];
	if (filled.length > 0) variants.push(`    filled: {\n${filled.join(',\n')}\n    }`);
	const pathData = `const pathData = {\n${variants.join(',\n')}\n};`;

	return `${code.slice(0, start)}${pathData}${code.slice(end)}`;
}

export function materialSymbolsWeightPlugin(): Plugin {
	return {
		name: 'chronos-material-symbols-weight',
		enforce: 'pre',
		transform(code, id) {
			const modulePath = id.split('?')[0]!.replaceAll('\\', '/');
			if (
				!modulePath.includes('@material-symbols-svg/svelte/') ||
				!/\/icons\/[^/]+\.js$/.test(modulePath)
			) {
				return;
			}
			const next = stripMaterialSymbolIconWeights(code);
			if (!next) return;
			return { code: next, map: null };
		}
	};
}
