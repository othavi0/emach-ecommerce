import type { ToolListItem } from "@emach/db/queries/tools";
import { describe, expect, it } from "vitest";

import type { ServiceSummary } from "@/lib/services";
import { shortIn } from "./service-picker";

function service(listed: number): ServiceSummary {
	return {
		fromPriceCents: null,
		href: "/",
		id: `s${listed}`,
		imageSrc: null,
		inStockCount: 0,
		name: "Ofício",
		preview: Array.from({ length: listed }) as ToolListItem[],
		productCount: listed,
		slug: `s${listed}`,
	};
}

describe("shortIn", () => {
	const row = [2, 4, 3, 3, 6, 1].map(service);

	it("mede a vaga vazia contra o maior card da linha de 2 colunas", () => {
		expect(row.map((_, i) => shortIn(row, i).narrow)).toEqual([
			true,
			false,
			false,
			false,
			false,
			true,
		]);
	});

	it("mede a vaga vazia contra o maior card da linha de 4 colunas", () => {
		expect(row.map((_, i) => shortIn(row, i).wide)).toEqual([
			true,
			false,
			true,
			true,
			false,
			true,
		]);
	});

	it("limita as vagas a 4: card com 6 produtos não deixa vaga no de 4", () => {
		const pair = [4, 6].map(service);

		expect(pair.map((_, i) => shortIn(pair, i).narrow)).toEqual([false, false]);
	});
});
