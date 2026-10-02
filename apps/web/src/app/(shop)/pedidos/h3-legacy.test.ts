import { describe, expect, it } from "vitest";
import { filesUnder, scanForLegacyTokens } from "@/test/h3-legacy-scan";

const FILES = [
	...filesUnder("app/(shop)/pedidos"),
	"app/(shop)/checkout/success/page.tsx",
];

describe("pedido recebido e pedido público sem token visual anterior ao H3", () => {
	it("lista a página do pedido e a faixa compartilhada", () => {
		expect(FILES).toContain("app/(shop)/pedidos/[number]/page.tsx");
		expect(FILES).toContain(
			"app/(shop)/pedidos/_components/order-received.tsx"
		);
	});

	it("não tem achado do scanner", () => {
		expect(scanForLegacyTokens(FILES)).toEqual([]);
	});
});
