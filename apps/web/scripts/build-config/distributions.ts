import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { parse, type TomlTable, type TomlValue } from 'smol-toml';
import type { DeployTarget } from './deploy-targets.ts';

export interface DistributionDefinition {
	profile: string;
	deployment: string;
}

export interface DistributionConfig {
	defaults: Record<DeployTarget, string>;
	distributions: Record<string, DistributionDefinition>;
}

const DISTRIBUTION_CONFIG_PATH = fileURLToPath(
	new URL('../../config/distributions.toml', import.meta.url)
);
const DEPLOY_TARGETS: DeployTarget[] = ['vercel', 'pages', 'mobile'];

function asTable(value: TomlValue | undefined, field: string): TomlTable {
	if (!value || typeof value !== 'object' || Array.isArray(value)) {
		throw new Error(`Invalid distribution config: ${field} must be a table`);
	}
	return value as TomlTable;
}

function requiredString(table: TomlTable, key: string, field: string): string {
	const value = table[key];
	if (typeof value !== 'string' || !value.trim()) {
		throw new Error(`Invalid distribution config: ${field} must be a non-empty string`);
	}
	return value;
}

function assertOnlyKeys(table: TomlTable, allowedKeys: string[], field: string): void {
	for (const key of Object.keys(table)) {
		if (!allowedKeys.includes(key)) {
			throw new Error(`Invalid distribution config: unknown key "${field}.${key}"`);
		}
	}
}

export function parseDistributionsConfig(source: string): DistributionConfig {
	let parsed: TomlTable;
	try {
		parsed = parse(source);
	} catch (error) {
		throw new Error(
			`Invalid distribution config TOML: ${error instanceof Error ? error.message : String(error)}`
		);
	}
	assertOnlyKeys(parsed, ['defaults', 'distributions'], 'root');

	const defaultsTable = asTable(parsed.defaults, 'defaults');
	assertOnlyKeys(defaultsTable, DEPLOY_TARGETS, 'defaults');
	const rawDistributions = asTable(parsed.distributions, 'distributions');
	const distributions: Record<string, DistributionDefinition> = {};
	for (const [id, value] of Object.entries(rawDistributions)) {
		if (!id.trim())
			throw new Error('Invalid distribution config: distribution IDs must not be empty');
		const distribution = asTable(value, `distributions.${id}`);
		assertOnlyKeys(distribution, ['profile', 'deployment'], `distributions.${id}`);
		distributions[id] = {
			profile: requiredString(distribution, 'profile', `distributions.${id}.profile`),
			deployment: requiredString(distribution, 'deployment', `distributions.${id}.deployment`)
		};
	}

	const defaults = {} as Record<DeployTarget, string>;
	for (const target of DEPLOY_TARGETS) {
		defaults[target] = requiredString(defaultsTable, target, `defaults.${target}`);
		if (!distributions[defaults[target]]) {
			throw new Error(
				`Invalid distribution config: defaults.${target} references unknown distribution "${defaults[target]}"`
			);
		}
	}

	return { defaults, distributions };
}

export function loadDistributionConfig(): DistributionConfig {
	return parseDistributionsConfig(readFileSync(DISTRIBUTION_CONFIG_PATH, 'utf8'));
}
