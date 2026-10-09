<script lang="ts">
	import { hostT } from '#lib/i18n/host-i18n.svelte.ts';
	import SecondaryPageShell from '#lib/components/SecondaryPageShell.svelte';
	import DeveloperScreen from '#lib/components/about/DeveloperScreen.svelte';
	import { getAppController } from '#lib/services/app-engine.ts';

	const controller = getAppController();
</script>

<SecondaryPageShell
	title={hostT('route.developer')}
	backFallback={{ kind: 'route', href: '/about' }}
>
	<DeveloperScreen />
</SecondaryPageShell>
