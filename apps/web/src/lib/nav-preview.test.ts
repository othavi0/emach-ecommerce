import type { ToolListItem } from "@emach/db/queries/tools";
import { describe, expect, it } from "vitest";

import { pickNavProducts } from "@/lib/nav-preview";

function tool(
	id: string,
	{
		inStock = true,
		price = "10.00",
	}: { inStock?: boolean; price?: string | null } = {}
): ToolListItem {
	const variant: ToolListItem["defaultVariant"] = {
		discountedAmount: null,
		id: `${id}-v`,
		priceAmount: "0",
		sku: id,
		voltage: null,
	};

	// A query dashboard-owned tipa o preço como string, mas o rascunho chega null.
	Object.assign(variant, { priceAmount: price });

	return {
		activePromotionId: null,
		avgRating: null,
		defaultVariant: variant,
		hasOtherVariants: false,
		id,
		inStock,
		name: id,
		primaryCategory: { id: "c", name: "Elétricas", slug: "eletricas" },
		primaryImage: null,
		reviewCount: 0,
		slug: id,
		status: "active",
	};
}

describe("pickNavProducts", () => {
	it("põe os em estoque primeiro e para em 4", () => {
		const picked = pickNavProducts([
			tool("a", { inStock: false }),
			tool("b"),
			tool("c"),
			tool("d"),
			tool("e"),
		]);

		expect(picked.map((p) => p.id)).toEqual(["b", "c", "d", "e"]);
	});

	it("deixa de fora o produto sem preço", () => {
		const picked = pickNavProducts([tool("a", { price: null }), tool("b")]);

		expect(picked).toEqual([
			expect.objectContaining({ id: "b", priceCents: 1000 }),
		]);
	});
});
