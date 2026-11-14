const allowedTags = [
	'h1',
	'h2',
	'h3',
	'h4',
	'h5',
	'h6',
	'p',
	'br',
	'hr',
	'strong',
	'em',
	'del',
	'ul',
	'ol',
	'li',
	'blockquote',
	'pre',
	'code',
	'table',
	'thead',
	'tbody',
	'tr',
	'th',
	'td',
	'a'
];

let dependencies: Promise<[typeof import('marked'), typeof import('dompurify')]> | null = null;

function loadDependencies() {
	dependencies ??= Promise.all([import('marked'), import('dompurify')]).catch((error) => {
		dependencies = null;
		throw error;
	});
	return dependencies;
}

/** Client-only: callers must move the sanitized nodes into their final container. */
export async function parseMarkdown(markdown: string): Promise<DocumentFragment> {
	const [{ marked }, { default: purifier }] = await loadDependencies();
	const html = marked.parse(markdown, { async: false });
	const fragment = purifier.sanitize(html, {
		ALLOWED_TAGS: allowedTags,
		ALLOWED_ATTR: ['href', 'title', 'start', 'colspan', 'rowspan', 'scope'],
		ALLOW_ARIA_ATTR: false,
		ALLOW_DATA_ATTR: false,
		RETURN_DOM_FRAGMENT: true
	});
	for (const link of fragment.querySelectorAll('a')) {
		const href = link.getAttribute('href');
		if (href === null) continue;
		try {
			// A fixed HTTPS base validates relative URLs even in native app schemes.
			const protocol = new URL(href, 'https://chronos.invalid/').protocol;
			if (!['http:', 'https:', 'mailto:'].includes(protocol)) {
				link.removeAttribute('href');
				continue;
			}
			const url = new URL(href, document.baseURI);
			if (['http:', 'https:'].includes(url.protocol) && url.origin !== location.origin) {
				link.setAttribute('target', '_blank');
				link.setAttribute('rel', 'noopener noreferrer');
			}
		} catch {
			link.removeAttribute('href');
		}
	}
	return fragment;
}
