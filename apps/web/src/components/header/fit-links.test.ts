import { describe, expect, it } from "vitest";

import { fitLinks } from "@/components/header/fit-links";

const base = {
	groupSize: 2,
	moreWidth: 60,
	separatorWidth: 20,
	widths: [100, 100, 100, 100],
};

describe("fitLinks", () => {
	it("mostra tudo quando cabe, sem reservar o Mais", () => {
		expect(fitLinks({ ...base, available: 420 })).toBe(4);
	});

	it("manda para o Mais o que não cabe, reservando o botão", () => {
		// 3 links + separador + Mais = 380.
		expect(fitLinks({ ...base, available: 400 })).toBe(3);
		expect(fitLinks({ ...base, available: 379 })).toBe(2);
	});

	it("o separador só conta quando um link do segundo grupo aparece", () => {
		// 2 ofícios + Mais = 260, sem o separador.
		expect(fitLinks({ ...base, available: 260 })).toBe(2);
	});

	it("nada cabe numa linha estreita", () => {
		expect(fitLinks({ ...base, available: 90 })).toBe(0);
	});
});
