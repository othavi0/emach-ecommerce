// Mesma regra que o Better Auth 1.6 aplica a callbackURL relativa
// (dist/auth/trusted-origins.mjs). Um destino que ela recusa vira 403
// INVALID_CALLBACK_URL no login Google e no cadastro, então aceitar mais que
// isso aqui quebra o fluxo. A regra também fecha o open redirect: tab, CR/LF,
// espaço e `\` não passam, e o parser de URL não tem como transformar o
// caminho em "//outra-origem".
const SAFE_PATH_RE = /^\/(?!\/|\\|%2f|%5c)[\w\-.+/@]*(?:\?[\w\-.+/=&%@]*)?$/;

// Voltar para uma tela de auth depois de entrar prende o cliente no fallback
// do /login, que só sai quando não há sessão.
const AUTH_PATH_RE =
	/^\/(?:login|esqueci-senha|redefinir-senha|verificar-email)\/?(?:\?|$)/;

/** Caminho (com ou sem query) de uma das telas de auth do grupo (auth). */
export function isAuthPath(path: string): boolean {
	return AUTH_PATH_RE.test(path);
}

export function safeRedirect(
	raw: string | null | undefined,
	fallback: string
): string {
	return raw && SAFE_PATH_RE.test(raw) && !isAuthPath(raw) ? raw : fallback;
}
