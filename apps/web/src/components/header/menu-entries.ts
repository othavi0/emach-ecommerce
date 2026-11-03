import type { Route } from "next";

import { plural } from "@/components/header/dept-panels";
import { fmtBRL } from "@/lib/format";
import type { NavPreviews, NavProduct } from "@/lib/nav-preview";
import type { StoreNav } from "@/lib/store-nav";

export const MENU_TABS = [
	{ id: "service", label: "Por serviço" },
	{ id: "category", label: "Por categoria" },
] as const;

export type MenuTab = (typeof MENU_TABS)[number]["id"];

/** Produtos mostrados dentro de um item aberto da sanfona. */
const MENU_PREVIEW_LIMIT = 3;

/** Um ofício ou uma categoria, como a sanfona do menu do celular mostra. */
export interface MenuEntry {
	href: Route;
	/** `isProduct`: foto de produto, que pede `object-contain` em `bg-well`. */
	image: { isProduct: boolean; src: string } | null;
	/** Até duas linhas curtas embaixo do nome. */
	meta: string[];
	name: string;
	productCount: number;
	products: NavProduct[];
	slug: string;
}

export function menuEntries(
	nav: StoreNav,
	previews: NavPreviews
): Record<MenuTab, MenuEntry[]> {
	const productsOf = (slug: string) =>
		(previews[slug] ?? []).slice(0, MENU_PREVIEW_LIMIT);

	return {
		service: nav.services.map((s) => ({
			href: s.href,
			image: s.imageSrc
				? { isProduct: s.imageIsProduct, src: s.imageSrc }
				: null,
			meta: [
				`${plural(s.productCount, "produto", "produtos")}, ${s.inStockCount} em estoque`,
				...(s.fromPriceCents === null
					? []
					: [`a partir de ${fmtBRL(s.fromPriceCents)}`]),
			],
			name: s.name,
			productCount: s.productCount,
			products: productsOf(s.slug),
			slug: s.slug,
		})),
		category: nav.categories
			.filter((c) => c.productCount > 0)
			.map((c) => {
				const products = productsOf(c.slug);
				const photo = products.find((p) => p.imageSrc)?.imageSrc;

				return {
					href: c.href,
					image: photo ? { isProduct: true, src: photo } : null,
					meta: [plural(c.productCount, "produto", "produtos")],
					name: c.name,
					productCount: c.productCount,
					products,
					slug: c.slug,
				};
			}),
	};
}

/**
 * Vaga do cartão "Ver os N produtos" na grade de duas colunas: com número par
 * de produtos ele ocupa a linha inteira, com ímpar a vaga que sobra.
 */
export function seeAllSpan(productsShown: number): "full" | "half" {
	return productsShown % 2 === 0 ? "full" : "half";
}
