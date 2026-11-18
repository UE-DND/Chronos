import { writeFile } from 'node:fs/promises';
import { domainToASCII } from 'node:url';

const source = 'https://publicsuffix.org/list/public_suffix_list.dat';
const response = await fetch(source);
if (!response.ok) throw new Error(`Could not download Public Suffix List: HTTP ${response.status}`);
const data = await response.text();
const version = data.match(/^\/\/ VERSION: ([\d_-]+UTC)$/m)?.[1];
const commit = data.match(/^\/\/ COMMIT: ([\da-f]{40})$/m)?.[1];
if (!version || !commit || !data.includes('// ===END PRIVATE DOMAINS==='))
	throw new Error('Incomplete Public Suffix List');

const rules = new Set<string>();
for (const line of data.split('\n')) {
	const rule = line.trim().split(/\s+/, 1)[0]!;
	// Single-label suffixes are already rejected by the domain policy.
	if (rule.startsWith('//') || !rule.includes('.')) continue;
	const prefix = rule.startsWith('*.') ? '*.' : rule.startsWith('!') ? '!' : '';
	const domain = domainToASCII(rule.slice(prefix.length));
	if (!/^[a-z0-9.-]+$/.test(domain)) throw new Error(`Invalid Public Suffix List rule: ${rule}`);
	rules.add(prefix + domain);
}

const output = `// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.
//
// Public Suffix List, ICANN and PRIVATE sections, multi-label rules in ASCII.
// Source: ${source}
// Version: ${version} (${commit})
// Regenerate with: vpx scripts/update-public-suffix-rules.ts

export const PUBLIC_SUFFIX_RULES = \`${[...rules].join('\n')}\`;
`;
await writeFile(
	new URL('../packages/core/src/hosts/public-suffix-rules.generated.ts', import.meta.url),
	output
);
