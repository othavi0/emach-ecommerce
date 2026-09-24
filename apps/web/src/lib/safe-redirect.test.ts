import { describe, expect, it } from "vitest";
import { safeRedirect } from "./safe-redirect";

const FALLBACK = "/dashboard";

describe("safeRedirect", () => {
	it.each([
		["/dashboard/pedidos?x=1", "/dashboard/pedidos?x=1"],
		["/checkout", "/checkout"],
		["/", "/"],
		["/product/furadeira-123#avaliacoes", "/product/furadeira-123#avaliacoes"],
	])("aceita caminho relativo da mesma origem: %j", (raw, expected) => {
		expect(safeRedirect(raw, FALLBACK)).toBe(expected);
	});

	it.each([
		["/\t/evil.com"],
		["/\n/evil.com"],
		["/\r/evil.com"],
		["//evil.com"],
		["/\\evil.com"],
		["/foo\\bar"],
		["https://evil.com"],
		["javascript:alert(1)"],
		[" /dashboard"],
		["/dash board"],
		["/\u0000/evil.com"],
		["dashboard"],
		[""],
	])("rejeita e devolve o fallback: %j", (raw) => {
		expect(safeRedirect(raw, FALLBACK)).toBe(FALLBACK);
	});

	it("devolve o fallback quando o parâmetro não veio", () => {
		expect(safeRedirect(null, FALLBACK)).toBe(FALLBACK);
		expect(safeRedirect(undefined, "/")).toBe("/");
	});
});
