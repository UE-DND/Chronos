import { describe, expect, it } from 'vite-plus/test';
import { parseDistributionsConfig } from './distributions.ts';

describe('distribution configuration', () => {
	it('parses all standard combinations and target defaults', () => {
		const config = parseDistributionsConfig(`
[defaults]
vercel = "default"
pages = "pages"
mobile = "mobile"

[distributions.default]
profile = "chronos-default"
deployment = "chronos-default"

[distributions.pages]
profile = "chronos-default"
deployment = "pages"

[distributions.mobile]
profile = "chronos-default"
deployment = "mobile"
`);

		expect(config.defaults.vercel).toBe('default');
		expect(config.distributions.pages).toEqual({
			profile: 'chronos-default',
			deployment: 'pages'
		});
	});

	it('rejects a distribution with a missing field', () => {
		expect(() =>
			parseDistributionsConfig(`
[defaults]
vercel = "incomplete"
pages = "incomplete"
mobile = "incomplete"

[distributions.incomplete]
profile = "chronos-default"
`)
		).toThrowError(/distributions\.incomplete\.deployment/);
	});

	it('rejects a default that references an unknown distribution', () => {
		expect(() =>
			parseDistributionsConfig(`
[defaults]
vercel = "missing"
pages = "pages"
mobile = "mobile"

[distributions.pages]
profile = "chronos-default"
deployment = "pages"

[distributions.mobile]
profile = "chronos-default"
deployment = "mobile"
`)
		).toThrowError(/defaults\.vercel references unknown distribution "missing"/);
	});
});
