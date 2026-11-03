import { describe, expect, it } from "vitest";

import { autoAdvanceMs, groupShelfRows, nextAutoScroll } from "./shelf-rows";

const shelf = (key: string, n: number) => ({
	items: Array.from({ length: n }, (_, i) => i),
	key,
});

const rowKeys = (shelves: ReturnType<typeof shelf>[]) =>
	groupShelfRows(shelves).map((row) =>
		row.kind === "pair"
			? `${row.shelves[0].key}+${row.shelves[1].key}`
			: row.shelf.key
	);

describe("groupShelfRows", () => {
	it("junta duas prateleiras curtas seguidas e deixa as longas na linha inteira", () => {
		expect(
			rowKeys([
				shelf("reboco", 4),
				shelf("demolicao", 2),
				shelf("furar", 2),
				shelf("mistura", 4),
			])
		).toEqual(["reboco", "demolicao+furar", "mistura"]);
	});

	it("desfaz o par quando uma das duas ganha o 3º produto", () => {
		expect(rowKeys([shelf("demolicao", 3), shelf("furar", 2)])).toEqual([
			"demolicao",
			"furar",
		]);
	});

	it("deixa sozinha a curta sem vizinha curta", () => {
		expect(rowKeys([shelf("a", 1), shelf("b", 2), shelf("c", 2)])).toEqual([
			"a+b",
			"c",
		]);
		expect(rowKeys([shelf("a", 2), shelf("b", 5), shelf("c", 1)])).toEqual([
			"a",
			"b",
			"c",
		]);
	});

	it("devolve lista vazia sem prateleiras", () => {
		expect(groupShelfRows([])).toEqual([]);
	});
});

describe("autoAdvanceMs", () => {
	it("dá ritmos diferentes a prateleiras vizinhas", () => {
		const ms = [0, 1, 2, 3, 4].map(autoAdvanceMs);

		for (let i = 1; i < ms.length; i++) {
			expect(ms[i]).not.toBe(ms[i - 1]);
		}
	});
});

describe("nextAutoScroll", () => {
	it("anda um card e para no fim do trilho", () => {
		expect(nextAutoScroll(0, 700, 320)).toBe(320);
		expect(nextAutoScroll(640, 700, 320)).toBe(700);
	});

	it("volta ao começo depois do fim", () => {
		expect(nextAutoScroll(700, 700, 320)).toBe(0);
		expect(nextAutoScroll(699, 700, 320)).toBe(0);
	});
});
