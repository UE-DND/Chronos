<script lang="ts">
	import {
		attachWallpaperImageDecode,
		shouldOverscanWallpaperImage,
		type TimetableWallpaperFit
	} from './timetable-wallpaper-layer';

	let {
		uri,
		fit = 'cover',
		overscan = false,
		class: className = ''
	}: {
		uri: string;
		fit?: TimetableWallpaperFit;
		/** Extend a blurred cover image beyond its viewport to avoid translucent filter edges. */
		overscan?: boolean;
		class?: string;
	} = $props();
</script>

<img
	alt=""
	class={[
		'wallpaper-image',
		shouldOverscanWallpaperImage(fit, overscan) && 'wallpaper-image--overscan',
		className
	]}
	decoding="async"
	src={uri}
	style:object-fit={fit}
	{@attach attachWallpaperImageDecode(uri)}
/>

<style>
	.wallpaper-image {
		pointer-events: none;
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		max-width: none;
		object-position: center;
	}

	.wallpaper-image--overscan {
		inset: -24px;
		width: calc(100% + 48px);
		height: calc(100% + 48px);
	}
</style>
