/**
 * `/catalog?cat=<slug>` era a URL de categoria até o PR de rotas próprias.
 * Devolve a URL nova (`/catalog/<slug>` + demais params) ou null.
 */
export function legacyCategoryRedirect(url: URL): URL | null {
	if (url.pathname !== "/catalog") {
		return null;
	}
	const cat = url.searchParams.get("cat")?.trim();
	if (!cat) {
		return null;
	}
	const next = new URL(url);
	next.pathname = `/catalog/${encodeURIComponent(cat)}`;
	next.searchParams.delete("cat");
	return next;
}
