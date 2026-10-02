import { describe, expect, it } from "vitest";
import { filesUnder, scanForLegacyTokens } from "@/test/h3-legacy-scan";

const FILES = [
	...filesUnder("app/(shop)/cart"),
	"components/cart-sheet.tsx",
	"components/cart-item-row.tsx",
	"components/cart-totals.tsx",
	"components/cart-empty.tsx",
	"components/header-bar.tsx",
];

describe("carrinho sem token visual anterior ao H3", () => {
	it("varre a página e a gaveta", () => {
		expect(FILES).toContain("app/(shop)/cart/_components/cart-content.tsx");
		expect(scanForLegacyTokens(FILES)).toEqual([]);
	});
});
