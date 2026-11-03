import { readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { filesUnder } from "./h3-legacy-scan";

const SRC_ROOT = resolve(import.meta.dirname, "..");

const SCALE = [12, 13, 14, 15, 16, 17, 20, 24] as const;
const DISPLAY_MIN = 26;

const FROZEN = new Map<string, string>([
	["components/hero-carousel.tsx", "hero congelado por decisão do dono"],
	[
		"components/hero/hero-cta-variants.ts",
		"hero congelado por decisão do dono",
	],
	[
		"components/hero/hero-element-renders.tsx",
		"hero congelado por decisão do dono",
	],
]);

const SIZE = /text-\[(\d+(?:\.\d+)?)px\]/g;

const BANNED_WEIGHTS = [
	{ re: /\bfont-medium\b/g, fix: "font-normal" },
	{ re: /\bfont-bold\b/g, fix: "font-semibold" },
	{ re: /\bfont-black\b/g, fix: "font-extrabold" },
] as const;

function nearestAllowed(px: number) {
	if (px >= DISPLAY_MIN) {
		return `${px}px só com font-display ou em número grande (font-extrabold e tabular-nums), senão 24px`;
	}

	const nearest = SCALE.reduce((best, step) =>
		Math.abs(step - px) < Math.abs(best - px) ? step : best
	);

	return `${nearest}px`;
}

/** Título condensado ou número grande, como o preço da página de produto. */
function isDisplayLine(text: string) {
	return (
		text.includes("font-display") ||
		(text.includes("font-extrabold") && text.includes("tabular-nums"))
	);
}

function scanTypeScale(source: string, file: string): string[] {
	const problems: string[] = [];

	for (const [index, text] of source.split("\n").entries()) {
		const where = `${file}:${index + 1}`;

		for (const match of text.matchAll(SIZE)) {
			const px = Number(match[1]);

			const allowed =
				SCALE.some((step) => step === px) ||
				(px >= DISPLAY_MIN && isDisplayLine(text));

			if (!allowed) {
				problems.push(
					`${where}: ${match[0]} fora da escala; use ${nearestAllowed(px)}`
				);
			}
		}

		for (const { re, fix } of BANNED_WEIGHTS) {
			for (const match of text.matchAll(re)) {
				problems.push(`${where}: ${match[0]} fora dos pesos; use ${fix}`);
			}
		}
	}

	return problems;
}

const FILES = filesUnder(".").filter(
	(file) => !(file.startsWith("test/") || FROZEN.has(file))
);

describe("escala de tipo e pesos em apps/web/src (DESIGN.md §3)", () => {
	it("varre a árvore inteira", () => {
		expect(FILES).toContain("components/product-card.tsx");
		expect(FILES).toContain("app/checkout/_components/checkout-content.tsx");
	});

	it("aponta tamanho e peso fora da escala com o valor mais próximo", () => {
		expect(
			scanTypeScale(
				'<p className="font-bold text-[13.5px] text-[40px]">',
				"x.tsx"
			)
		).toEqual([
			"x.tsx:1: text-[13.5px] fora da escala; use 13px",
			"x.tsx:1: text-[40px] fora da escala; use 40px só com font-display ou em número grande (font-extrabold e tabular-nums), senão 24px",
			"x.tsx:1: font-bold fora dos pesos; use font-semibold",
		]);
		expect(
			scanTypeScale('<h1 className="font-display text-[40px]">', "x.tsx")
		).toEqual([]);
	});

	it("todo arquivo usa só a escala e os pesos permitidos", () => {
		const problems = FILES.flatMap((file) =>
			scanTypeScale(readFileSync(join(SRC_ROOT, file), "utf8"), file)
		);

		expect(problems).toEqual([]);
	});
});
