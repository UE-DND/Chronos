<script lang="ts">
	import { hostT } from '#lib/i18n/host-i18n.svelte.ts';
	import type { Path } from '$app/types';
	import type { BackFallback } from '#lib/navigation/index.ts';
	import LegalDocumentScreen from '#lib/components/legal/LegalDocumentScreen.svelte';
	import { onboardingController } from '#lib/client/onboarding.svelte.ts';

	const backFallback = $derived(
		(onboardingController.state.open
			? { kind: 'shell' as const }
			: { kind: 'route' as const, href: '/about' as Path }) satisfies BackFallback
	);
</script>

<LegalDocumentScreen
	title={hostT('route.terms')}
	{backFallback}
	documentPath="/legal/terms-of-service.md"
/>
