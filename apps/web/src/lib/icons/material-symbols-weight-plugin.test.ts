import { describe, expect, it } from 'vite-plus/test';
import { stripMaterialSymbolIconWeights } from './material-symbols-weight-plugin';

describe('stripMaterialSymbolIconWeights', () => {
	it('keeps only weight 700 for regular and filled variants', () => {
		const input = `const pathData = {
    regular: {
        "100": "M1",
        "400": "M4",
        "700": "M7"
    },
    filled: {
        "100": "F1",
        "400": "F4",
        "700": "F7"
    }
};
const metadata = {};
export const IconW700 = pathData.regular[700];
`;
		expect(stripMaterialSymbolIconWeights(input)).toBe(`const pathData = {
    regular: {
        "700": "M7"
    },
    filled: {
        "700": "F7"
    }
};
const metadata = {};
export const IconW700 = pathData.regular[700];
`);
	});

	it('keeps regular-only icons without synthesizing filled paths', () => {
		const input = `const pathData = {
    regular: {
        "100": "M1",
        "400": "M4",
        "700": "M7"
    }
};
const metadata = {};
`;
		expect(stripMaterialSymbolIconWeights(input)).toContain(
			'regular: {\n        "700": "M7"\n    }\n};'
		);
		expect(stripMaterialSymbolIconWeights(input)).not.toContain('filled');
	});
});
