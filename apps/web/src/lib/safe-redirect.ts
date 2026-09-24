// O parser de URL do browser descarta tab/CR/LF e trata `\` como `/`, então
// "/\t/evil.com" vira "//evil.com" (outra origem) depois de passar num teste
// de prefixo. Rejeitar qualquer espaço, controle ou barra invertida fecha isso.
const UNSAFE_CHAR_RE = /[\s\\\p{Cc}]/u;
const PROBE_ORIGIN = "https://same-origin.invalid";

export function safeRedirect(
	raw: string | null | undefined,
	fallback: string
): string {
	if (
		!raw?.startsWith("/") ||
		raw.startsWith("//") ||
		UNSAFE_CHAR_RE.test(raw)
	) {
		return fallback;
	}
	return new URL(raw, PROBE_ORIGIN).origin === PROBE_ORIGIN ? raw : fallback;
}
