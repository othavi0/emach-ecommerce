import { describe, expect, it } from "vitest";
import { filesUnder, scanForLegacyTokens } from "@/test/h3-legacy-scan";

const FILES = [
	"app/checkout/layout.tsx",
	"app/checkout/page.tsx",
	"app/checkout/error.tsx",
	...filesUnder("app/checkout/_components"),
	"components/checkout-header.tsx",
	"components/checkout-footer.tsx",
];

describe("checkout sem token visual anterior ao H3", () => {
	it("lista os componentes do formulário", () => {
		expect(FILES).toContain("app/checkout/_components/checkout-content.tsx");
	});

	it("não tem achado do scanner", () => {
		expect(scanForLegacyTokens(FILES)).toEqual([]);
	});
});
