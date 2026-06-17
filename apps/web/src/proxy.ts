import { evlogMiddleware } from "evlog/next";
import { type NextRequest, NextResponse } from "next/server";

const PROTECTED = ["/dashboard", "/pedidos"];

const runEvlog = evlogMiddleware({
	exclude: ["/api/auth/**", "/_next/**", "/favicon/**"],
});

export async function proxy(req: NextRequest) {
	const { pathname } = req.nextUrl;
	// 1ª camada (edge, só existência do cookie); a validação real da sessão fica
	// no content sob Suspense (requireCurrentClient). Com cacheComponents o shell
	// é servido com 200, então sem o edge-redirect o cliente deslogado veria o
	// shell piscar antes de cair no /login. `/checkout/success` é confirmação
	// pública (não lê sessão) — fica de fora.
	const isProtected =
		PROTECTED.some((p) => pathname.startsWith(p)) ||
		(pathname.startsWith("/checkout") &&
			!pathname.startsWith("/checkout/success"));

	if (isProtected) {
		// Better Auth prefixa o cookie com `__Secure-` quando roda sob HTTPS
		// (produção). Em dev (HTTP) o nome é cru. Checar as duas variantes —
		// senão o proxy nunca acha a sessão em prod e entra em loop de redirect
		// /dashboard → /login → /dashboard (tela preta do loader).
		const token =
			req.cookies.get("ecommerce.session_token") ??
			req.cookies.get("__Secure-ecommerce.session_token");
		if (!token) {
			const url = req.nextUrl.clone();
			url.pathname = "/login";
			url.searchParams.set("redirect", req.nextUrl.pathname);
			return NextResponse.redirect(url);
		}
	}

	return await runEvlog(req);
}

export const config = {
	matcher: [
		"/((?!_next/static|_next/image|favicon|images|.*\\.png$|.*\\.svg$).*)",
	],
};
