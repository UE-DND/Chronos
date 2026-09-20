import { tick } from 'svelte';
import { ImageRepository, CUSTOM_WALLPAPER_KEY } from '$lib/storage/image-repository';
import { resolveWallpaper } from './wallpaper-policy';
import type { WallpaperSource } from '@chronos/core';

export function createWallpaperController(images = new ImageRepository()) {
	let custom = $state.raw<Blob | null>(null);
	let uri = $state<string | null>(null);
	let source: WallpaperSource = 'theme';
	let theme: Blob | undefined;
	let current: Blob | null = null;
	let subscription: { unsubscribe(): void } | undefined;
	let active = false;
	let generation = 0;

	function refresh() {
		const image = resolveWallpaper(source, custom, theme);
		if (image === current) return;
		const previous = uri;
		current = image;
		uri = image ? URL.createObjectURL(image) : null;
		// Let every view switch to the new URI before releasing the previous one.
		if (previous) void tick().then(() => URL.revokeObjectURL(previous));
	}
	return {
		get state() {
			return { uri, hasCustom: custom !== null };
		},
		init(onError: (error: unknown) => void) {
			if (active) return;
			active = true;
			subscription = images.watchCustom((blob) => {
				if (!active) return;
				custom = blob;
				refresh();
			}, onError);
		},
		select(nextSource: WallpaperSource, nextTheme?: Blob) {
			source = nextSource;
			theme = nextTheme;
			refresh();
		},
		async save(blob: Blob) {
			const task = generation;
			await images.put(CUSTOM_WALLPAPER_KEY, blob);
			if (task !== generation) return;
			custom = blob;
			refresh();
		},
		async clear() {
			const task = generation;
			await images.delete(CUSTOM_WALLPAPER_KEY);
			if (task !== generation) return;
			custom = null;
			refresh();
		},
		destroy() {
			active = false;
			generation++;
			subscription?.unsubscribe();
			subscription = undefined;
			if (uri) URL.revokeObjectURL(uri);
			uri = null;
			current = null;
			custom = null;
		}
	};
}
