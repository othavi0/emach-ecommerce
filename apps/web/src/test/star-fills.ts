const SVG_CLASS = /<svg[^>]*class="([^"]*)"/g;
const SOLID_FILL = /(^|\s)fill-(?!none\b|transparent\b)\S+/;

// Lê cada <svg> renderizado e diz se a estrela tem preenchimento sólido.
export function starFills(html: string): Array<"cheia" | "contorno"> {
	return [...html.matchAll(SVG_CLASS)].map(([, className = ""]) =>
		SOLID_FILL.test(className) ? "cheia" : "contorno"
	);
}
