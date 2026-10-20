import { expect, it } from 'vite-plus/test';
import { parseKeywordList } from '../src/plugin/parse-keyword-list';

it('parses trimmed, non-empty keywords from a comma-separated message', () => {
	expect(parseKeywordList(' 时间, 日期 ,, 冻结 ')).toEqual(['时间', '日期', '冻结']);
	expect(parseKeywordList('')).toEqual([]);
});
