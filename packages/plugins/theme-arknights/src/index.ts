import { createThemeFromColorJson, parseColorThemeJson, defineChronosPlugin } from '@chronos/core';
import colors from '../theme-arknights.colors.json';
import './theme.css';

export default defineChronosPlugin({
	id: 'theme-arknights',
	nameKey: 'name',
	messages: { en: { name: 'ArKnights' }, 'zh-cn': { name: 'ArKnights' } },
	category: 'theme',
	apply(ctx) {
		ctx.registerSlot('theme.definition', createThemeFromColorJson(parseColorThemeJson(colors)));
	}
});
