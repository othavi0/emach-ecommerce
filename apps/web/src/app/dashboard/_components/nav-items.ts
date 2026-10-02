import type { Route } from "next";

export interface NavItem {
	href: Route;
	label: string;
}

export const NAV_ITEMS: readonly NavItem[] = [
	{ label: "Início", href: "/dashboard" },
	{ label: "Pedidos", href: "/dashboard/pedidos" },
	{ label: "Reembolso e devoluções", href: "/dashboard/reembolso" },
	{ label: "Meus dados", href: "/dashboard/dados-pessoais" },
];

// "/dashboard" é prefixo de todas as outras rotas da conta, então só casa exato.
export function isAccountNavActive(pathname: string, href: string): boolean {
	if (pathname === href) {
		return true;
	}
	return href !== "/dashboard" && pathname.startsWith(`${href}/`);
}
