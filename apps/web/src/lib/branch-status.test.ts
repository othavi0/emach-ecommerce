import type { BranchBusinessHours } from "@emach/db/schema/inventory";
import { describe, expect, it } from "vitest";

import { branchStatus, hoursTable, storeClock } from "@/lib/branch-status";

const HOURS: BranchBusinessHours = {
	weekdays: {
		breakEnd: "13:00",
		breakStart: "12:00",
		closesAt: "18:00",
		isOpen: true,
		opensAt: "08:00",
	},
	saturday: {
		breakEnd: null,
		breakStart: null,
		closesAt: "12:00",
		isOpen: true,
		opensAt: "08:00",
	},
	holidays: {
		breakEnd: null,
		breakStart: null,
		closesAt: null,
		isOpen: false,
		opensAt: null,
	},
};

const at = (day: number, hhmm: string) => {
	const [h = 0, m = 0] = hhmm.split(":").map(Number);

	return { day, minutes: h * 60 + m };
};

describe("branchStatus", () => {
	it("aberto no meio da tarde de uma quarta", () => {
		expect(branchStatus(HOURS, at(3, "15:10"))).toEqual({
			label: "Aberto até 18h",
			open: true,
		});
	});

	it("aberto pela manhã fecha no almoço", () => {
		expect(branchStatus(HOURS, at(3, "09:00"))?.label).toBe("Aberto até 12h");
	});

	it("no almoço avisa a volta", () => {
		expect(branchStatus(HOURS, at(2, "12:30"))).toEqual({
			label: "Volta às 13h",
			open: false,
		});
	});

	it("de manhã cedo avisa a abertura do dia", () => {
		expect(branchStatus(HOURS, at(1, "07:15"))?.label).toBe("Abre às 8h");
	});

	it("depois do fechamento aponta para amanhã", () => {
		expect(branchStatus(HOURS, at(4, "18:00"))).toEqual({
			label: "Abre amanhã às 8h",
			open: false,
		});
	});

	it("sábado tem meio período", () => {
		expect(branchStatus(HOURS, at(6, "11:59"))?.label).toBe("Aberto até 12h");
		expect(branchStatus(HOURS, at(6, "12:00"))?.label).toBe(
			"Abre segunda às 8h"
		);
	});

	it("domingo fica fechado e aponta para amanhã", () => {
		expect(branchStatus(HOURS, at(0, "10:00"))).toEqual({
			label: "Abre amanhã às 8h",
			open: false,
		});
	});

	it("loja sem sábado pula para segunda", () => {
		const noSaturday = {
			...HOURS,
			saturday: { ...HOURS.saturday, isOpen: false },
		};

		expect(branchStatus(noSaturday, at(5, "19:00"))?.label).toBe(
			"Abre segunda às 8h"
		);
	});

	it("sem horário cadastrado não tem status", () => {
		expect(branchStatus(null, at(3, "10:00"))).toBeNull();
	});
});

describe("storeClock", () => {
	it("lê a hora de Brasília, não a do servidor", () => {
		// 2026-11-04 (quarta) 02:30 UTC = 23:30 de terça em São Paulo (UTC-3).
		expect(storeClock(new Date("2026-11-04T02:30:00Z"))).toEqual({
			day: 2,
			minutes: 23 * 60 + 30,
		});
	});
});

describe("hoursTable", () => {
	it("mostra o almoço e o domingo fechado", () => {
		expect(hoursTable(HOURS).map((r) => [r.label, r.value])).toEqual([
			["Segunda a sexta", "8h às 12h, 13h às 18h"],
			["Sábado", "8h às 12h"],
			["Domingo", "Fechado"],
		]);
	});
});
