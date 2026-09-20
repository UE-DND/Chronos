<script lang="ts">
	import { getContext } from 'svelte';
	import type { AppShellController } from '$lib/app/app-shell.svelte';
	import { hostT } from '$lib/i18n/host-i18n.svelte';
	import SecondaryPageShell from '$lib/components/SecondaryPageShell.svelte';
	import WallpaperScreen from '$lib/wallpaper/WallpaperScreen.svelte';
	const shell = getContext<AppShellController>('appShell');
</script>

<SecondaryPageShell
	title={hostT('wallpaper.preview.title')}
	backFallback={{ kind: 'route', href: '/wallpaper' }}
	flush
>
	<WallpaperScreen {shell} />
</SecondaryPageShell>
