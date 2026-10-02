import { describe, expect, it } from "vitest";
import { filesUnder, scanForLegacyTokens } from "@/test/h3-legacy-scan";

const FILES = [
	...filesUnder("app/(auth)"),
	"components/auth-submit-button.tsx",
];

describe("telas de auth sem token visual anterior ao H3", () => {
	it("cobre as quatro rotas", () => {
		for (const route of [
			"login",
			"esqueci-senha",
			"redefinir-senha",
			"verificar-email",
		]) {
			expect(FILES.some((f) => f.includes(`/${route}/`))).toBe(true);
		}
	});

	it("não acha nenhum token legado", () => {
		expect(scanForLegacyTokens(FILES)).toEqual([]);
	});
});
