import { describe, expect, it } from "vitest";
import { DELIVERY_LEDE, deliverySections } from "@/app/(shop)/entrega/_content";
import {
	PRIVACY_LEDE,
	privacySections,
} from "@/app/(shop)/privacidade/_content";
import type { InstitutionalSection } from "@/components/institutional-page";

// Decisão do dono do produto (spec, Track 3): nenhum texto institucional
// fala de troca, devolução ou garantia, nem promete prazo fixo de entrega.
const FORBIDDEN = /\b(troca|trocas|devolu\w*|garantia\w*)\b/i;
const FIXED_DEADLINE =
	/\b(em|até)\s+\d+\s+dias?\s+(úteis\s+)?(para|pra)\s+entreg/i;

function allText(sections: InstitutionalSection[], lede: string): string[] {
	const out = [lede];
	for (const s of sections) {
		out.push(s.title, ...s.paragraphs, ...(s.bullets ?? []));
	}
	return out;
}

describe.each([
	["privacidade", privacySections, PRIVACY_LEDE],
	["entrega", deliverySections, DELIVERY_LEDE],
] as const)("%s", (_name, sections, lede) => {
	it("não menciona troca, devolução ou garantia", () => {
		for (const text of allText(sections, lede)) {
			expect(text).not.toMatch(FORBIDDEN);
		}
	});
	it("não promete prazo fixo de entrega", () => {
		for (const text of allText(sections, lede)) {
			expect(text).not.toMatch(FIXED_DEADLINE);
		}
	});
	it("ids de seção são únicos e parágrafos/bullets não são vazios nem repetidos", () => {
		const ids = sections.map((s) => s.id);
		expect(new Set(ids).size).toBe(ids.length);
		for (const s of sections) {
			const items = [...s.paragraphs, ...(s.bullets ?? [])];
			expect(items.every((t) => t.trim().length > 0)).toBe(true);
			expect(new Set(items).size).toBe(items.length);
		}
	});
});
