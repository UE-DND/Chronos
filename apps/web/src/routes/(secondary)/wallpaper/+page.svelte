<script lang="ts">
	import { getContext } from 'svelte';
	import type { AppShellController } from '#lib/app/app-shell.svelte.ts';
	import { hostT } from '#lib/i18n/host-i18n.svelte.ts';
	import SecondaryPageShell from '#lib/components/SecondaryPageShell.svelte';
	import WallpaperSettingsScreen from '#lib/wallpaper/WallpaperSettingsScreen.svelte';
	const shell = getContext<AppShellController>('appShell');
</script>

<SecondaryPageShell title={hostT('wallpaper.item')} backFallback={{ kind: 'shell', tab: 'mine' }}>
	<WallpaperSettingsScreen {shell} />
</SecondaryPageShell>
