import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';
import { parse } from 'svelte/compiler';

export interface BoundaryViolation {
	source: string;
	target: string;
	rule: string;
}
interface Workspace {
	name: string;
	directory: string;
}
const ignored = new Set([
	'node_modules',
	'dist',
	'build',
	'.svelte-kit',
	'paraglide',
	'tests',
	'test-utils',
	'android'
]);
function files(directory: string): string[] {
	if (!existsSync(directory)) return [];
	return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
		const path = join(directory, entry.name);
		if (entry.isDirectory()) return ignored.has(entry.name) ? [] : files(path);
		return /\.(?:ts|js|svelte)$/.test(path) && !/\.(?:test|spec|generated)\.ts$/.test(path)
			? [path]
			: [];
	});
}
function scripts(path: string): string[] {
	const text = readFileSync(path, 'utf8');
	if (!path.endsWith('.svelte')) return [text];
	const ast = parse(text);
	return [ast.instance, ast.module].flatMap((script) =>
		script ? [text.slice(script.content.start, script.content.end)] : []
	);
}
function imports(text: string, path: string): string[] {
	const source = ts.createSourceFile(path, text, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
	const values: string[] = [];
	function visit(node: ts.Node) {
		if (
			(ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) &&
			node.moduleSpecifier &&
			ts.isStringLiteral(node.moduleSpecifier)
		)
			values.push(node.moduleSpecifier.text);
		if (
			ts.isImportTypeNode(node) &&
			ts.isLiteralTypeNode(node.argument) &&
			ts.isStringLiteral(node.argument.literal)
		)
			values.push(node.argument.literal.text);
		if (
			ts.isCallExpression(node) &&
			(node.expression.kind === ts.SyntaxKind.ImportKeyword ||
				(ts.isIdentifier(node.expression) && node.expression.text === 'require')) &&
			node.arguments[0] &&
			ts.isStringLiteralLike(node.arguments[0])
		)
			values.push(node.arguments[0].text);
		ts.forEachChild(node, visit);
	}
	visit(source);
	return values;
}

export function checkBoundaries(
	root: string,
	target: 'web' | 'mobile' = 'web'
): BoundaryViolation[] {
	root = resolve(root);
	const directories = [
		'apps/web',
		'apps/mobile',
		...['packages', 'packages/plugins'].flatMap((path) =>
			existsSync(join(root, path))
				? readdirSync(join(root, path)).map((name) => `${path}/${name}`)
				: []
		)
	];
	const workspaces: Workspace[] = directories
		.filter((path) => existsSync(join(root, path, 'package.json')))
		.map((path) => ({
			directory: join(root, path),
			name: JSON.parse(readFileSync(join(root, path, 'package.json'), 'utf8')).name
		}));
	const violations: BoundaryViolation[] = [];
	const owner = (path: string) =>
		workspaces
			.filter(
				(workspace) => path === workspace.directory || path.startsWith(workspace.directory + '/')
			)
			.sort((a, b) => b.directory.length - a.directory.length)[0];
	const category = (workspace?: Workspace) =>
		workspace ? relative(root, workspace.directory).replaceAll('\\', '/') : '';
	const check = (workspace: Workspace, source: string, specifier: string) => {
		let destination: Workspace | undefined;
		if (specifier.startsWith('.')) destination = owner(resolve(dirname(source), specifier));
		else if (specifier === '$lib' || specifier.startsWith('$lib/'))
			destination = { name: '@chronos/web', directory: join(root, 'apps/web') };
		else if (specifier === '$chronos-platform-adapter')
			destination = workspaces.find((item) => category(item) === `apps/${target}`);
		else
			destination = workspaces.find(
				(item) => specifier === item.name || specifier.startsWith(item.name + '/')
			);
		const from = category(workspace),
			to = category(destination);
		let rule = '';
		if (
			from === 'packages/core' &&
			((to && to !== from) ||
				/^(?:svelte(?:\/|$)|\$app(?:\/|$)|\$env(?:\/|$)|@sveltejs\/|@capacitor\/)/.test(specifier))
		)
			rule = 'core 只依赖平台无关的共享能力';
		if (
			from === 'packages/ui-kit' &&
			(to.startsWith('apps/') || to.startsWith('packages/plugins/'))
		)
			rule = 'ui-kit 不依赖宿主或业务插件';
		if (
			from.startsWith('packages/plugins/') &&
			(to.startsWith('apps/') ||
				(to.startsWith('packages/plugins/') && to !== from) ||
				/^(?:\$app\/|\$env\/|@capacitor\/)/.test(specifier))
		)
			rule = '插件通过公共契约使用宿主能力';
		if (
			from === 'apps/web' &&
			target === 'web' &&
			(to === 'apps/mobile' || specifier.startsWith('@capacitor/'))
		)
			rule = '纯 Web 不依赖原生适配器';
		if (rule) violations.push({ source: relative(root, source), target: specifier, rule });
	};
	for (const workspace of workspaces) {
		const manifestPath = join(workspace.directory, 'package.json');
		const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
		for (const specifier of Object.keys({
			...manifest.dependencies,
			...manifest.peerDependencies,
			...manifest.optionalDependencies
		}))
			check(workspace, manifestPath, specifier);
		for (const path of files(workspace.directory))
			for (const script of scripts(path))
				for (const specifier of imports(script, path)) check(workspace, path, specifier);
	}
	// Type symbols distinguish DOM globals and style members from local names and contract types.
	const core = workspaces.find((item) => category(item) === 'packages/core');
	if (core) {
		const program = ts.createProgram(
			files(join(core.directory, 'src')).filter((path) => path.endsWith('.ts')),
			{ target: ts.ScriptTarget.ES2022, skipLibCheck: true, noEmit: true }
		);
		const checker = program.getTypeChecker();
		for (const source of program
			.getSourceFiles()
			.filter((file) => file.fileName.startsWith(core.directory + '/src/'))) {
			function visit(node: ts.Node) {
				if (ts.isTypeNode(node)) return;
				if (
					ts.isIdentifier(node) &&
					[
						'window',
						'document',
						'navigator',
						'localStorage',
						'sessionStorage',
						'HTMLElement',
						'Element',
						'Document',
						'style'
					].includes(node.text)
				) {
					const symbol = checker.getSymbolAtLocation(node);
					if (
						symbol?.declarations?.some((declaration) =>
							declaration.getSourceFile().fileName.endsWith('/lib.dom.d.ts')
						)
					)
						violations.push({
							source: relative(root, source.fileName),
							target: node.text,
							rule: 'core 不访问 DOM；由宿主适配器执行'
						});
				}
				if (ts.isPropertyAccessExpression(node) || ts.isElementAccessExpression(node)) {
					const name = ts.isPropertyAccessExpression(node)
						? node.name.text
						: node.argumentExpression && ts.isStringLiteralLike(node.argumentExpression)
							? node.argumentExpression.text
							: undefined;
					const symbol = name
						? checker.getTypeAtLocation(node.expression).getProperty(name)
						: undefined;
					if (
						symbol?.declarations?.some((declaration) => {
							const parent = declaration.parent;
							return (
								declaration.getSourceFile().fileName.endsWith('/lib.dom.d.ts') &&
								ts.isInterfaceDeclaration(parent) &&
								/^(?:HTML|SVG|Document|Element|Node|Window|Navigator|Storage|CSSStyle)/.test(
									parent.name.text
								)
							);
						})
					)
						violations.push({
							source: relative(root, source.fileName),
							target: name!,
							rule: 'core 不操作 DOM 对象；由宿主适配器执行'
						});
				}
				ts.forEachChild(node, visit);
			}
			visit(source);
		}
	}
	return violations;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
	const root = fileURLToPath(new URL('../..', import.meta.url));
	const violations = [...checkBoundaries(root), ...checkBoundaries(root, 'mobile')];
	const lines = [
		...new Set(violations.map((entry) => `${entry.source} → ${entry.target}: ${entry.rule}`))
	];
	if (lines.length) {
		console.error(lines.join('\n'));
		process.exitCode = 1;
	} else console.log('Workspace boundaries verified (Web / Mobile).');
}
