<script lang="ts">
	import { hostT } from '#lib/i18n/host-i18n.svelte.ts';
	import { getContext } from 'svelte';
	import type { AppShellController } from '#lib/app/app-shell.svelte.ts';
	import SecondaryPageShell from '#lib/components/SecondaryPageShell.svelte';
	import DisplaySettingsScreen from '#lib/components/mine/DisplaySettingsScreen.svelte';
	import { getAppController } from '#lib/services/app-engine.ts';

	const shell = getContext<AppShellController>('appShell');
	const controller = getAppController();
</script>

<SecondaryPageShell
	title={hostT('route.displaySettings')}
	backFallback={{ kind: 'shell', tab: 'mine' }}
>
	<DisplaySettingsScreen {shell} />
</SecondaryPageShell>
