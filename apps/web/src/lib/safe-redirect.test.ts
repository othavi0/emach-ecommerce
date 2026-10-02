import { describe, expect, it } from "vitest";
import { safeRedirect } from "./safe-redirect";

const FALLBACK = "/dashboard";

describe("safeRedirect", () => {
	it.each([
		["/dashboard/pedidos?x=1", "/dashboard/pedidos?x=1"],
		["/checkout", "/checkout"],
		["/", "/"],
		["/product/parafusadeira-efp21", "/product/parafusadeira-efp21"],
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
		["/product/furadeira-123#avaliacoes"],
		["/busca%20x"],
		["/a:b"],
		[""],
	])("rejeita e devolve o fallback: %j", (raw) => {
		expect(safeRedirect(raw, FALLBACK)).toBe(FALLBACK);
	});

	// Com o cabeçalho da loja no /login, "Entrar" geraria /login?redirect=/login
	// e o login terminaria preso no fallback da própria tela.
	it.each([
		["/login"],
		["/login?x=1"],
		["/login/"],
		["/esqueci-senha"],
		["/redefinir-senha?token=abc"],
		["/verificar-email"],
	])("rota de auth não é destino e vira o fallback: %j", (raw) => {
		expect(safeRedirect(raw, FALLBACK)).toBe(FALLBACK);
	});

	it("caminho que só começa igual a uma rota de auth continua aceito", () => {
		expect(safeRedirect("/loginx", FALLBACK)).toBe("/loginx");
		expect(safeRedirect("/login-ajuda?x=1", FALLBACK)).toBe("/login-ajuda?x=1");
	});

	it("devolve o fallback quando o parâmetro não veio", () => {
		expect(safeRedirect(null, FALLBACK)).toBe(FALLBACK);
		expect(safeRedirect(undefined, "/")).toBe("/");
	});
});
