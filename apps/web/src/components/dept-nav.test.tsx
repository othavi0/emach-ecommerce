// @vitest-environment node
import type { Route } from "next";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

import { DeptNav, deptItems } from "@/components/dept-nav";
import { IndexPanel, ItemPanel } from "@/components/header/dept-panels";
import type { NavProduct } from "@/lib/nav-preview";
import type { StoreNav } from "@/lib/store-nav";

// `null` simula o prerender de uma rota dinâmica: o pathname só existe no
// request, e o usePathname suspende.
const pathname = vi.hoisted(() => ({ current: "/" as string | null }));

vi.mock("next/navigation", () => ({
	usePathname: () => {
		if (pathname.current === null) {
			throw new Promise(() => undefined);
		}

		return pathname.current;
	},
}));

const NAV: StoreNav = {
	services: [
		{
			fromPriceCents: 2882,
			href: "/catalog/reboco-e-acabamento" as Route,
			imageIsProduct: false,
			imageSrc: null,
			inStockCount: 3,
			name: "Reboco e acabamento",
			productCount: 4,
			slug: "reboco-e-acabamento",
		},
		{
			fromPriceCents: null,
			href: "/catalog/demolicao" as Route,
			imageIsProduct: false,
			imageSrc: null,
			inStockCount: 0,
			name: "Demolição",
			productCount: 2,
			slug: "demolicao",
		},
	],
	categories: [
		{
			href: "/catalog/acessorios" as Route,
			name: "Acessórios",
			productCount: 4,
			slug: "acessorios",
		},
		{
			href: "/catalog/vazia" as Route,
			name: "Vazia",
			productCount: 0,
			slug: "vazia",
		},
	],
};

function product(id: string): NavProduct {
	return {
		categorySlug: "eletricas",
		id,
		imageSrc: null,
		name: `Produto ${id}`,
		priceCents: 2882,
		slug: id,
	};
}

const GAP_CARD = /<li class="col-span-2">.*Ver os 2 produtos/;
const LINK_BELOW_GRID = /<\/ul><a[^>]*href="\/catalog\/acessorios"/;
const CURRENT_LINK = /<a[^>]*aria-current="page"[^>]*>([^<]*)<\/a>/g;

function currentLinks(at: string | null): string[] {
	pathname.current = at;
	const html = renderToStaticMarkup(<DeptNav nav={NAV} previews={{}} />);

	return [...html.matchAll(CURRENT_LINK)].map((m) => m[1] ?? "");
}

const noop = () => undefined;

function item(slug: string) {
	const found = deptItems(NAV).find((i) => i.slug === slug);

	if (!found) {
		throw new Error(`sem item ${slug}`);
	}

	return found;
}

describe("DeptNav", () => {
	it("marca como ativo só o departamento da página aberta", () => {
		expect(currentLinks("/catalog/demolicao")).toEqual(["Demolição"]);
		expect(currentLinks("/catalog/acessorios")).toEqual(["Acessórios"]);
	});

	it("não marca nada fora de um departamento", () => {
		expect(currentLinks("/")).toEqual([]);
		expect(currentLinks("/product/lixadeira")).toEqual([]);
	});

	it("renderiza os links sem ativo quando o pathname ainda não existe", () => {
		expect(currentLinks(null)).toEqual([]);
		pathname.current = null;
		expect(renderToStaticMarkup(<DeptNav nav={NAV} previews={{}} />)).toContain(
			'href="/catalog/demolicao"'
		);
	});

	it("deixa a categoria sem produto fora da barra", () => {
		expect(deptItems(NAV).map((i) => i.slug)).toEqual([
			"reboco-e-acabamento",
			"demolicao",
			"acessorios",
		]);
	});
});

describe("ItemPanel", () => {
	it("ofício com 2 produtos ganha o cartão que ocupa as colunas livres", () => {
		const html = renderToStaticMarkup(
			<ItemPanel
				item={item("demolicao")}
				onNavigate={noop}
				products={[product("a"), product("b")]}
			/>
		);

		expect(html).toContain("Produto a");
		expect(html).toContain("R$ 28,82");
		expect(html).toMatch(GAP_CARD);
	});

	it("com 4 produtos o link para o resto fica abaixo da grade", () => {
		const html = renderToStaticMarkup(
			<ItemPanel
				item={item("acessorios")}
				onNavigate={noop}
				products={["a", "b", "c", "d"].map(product)}
			/>
		);

		expect(html).not.toContain("col-span");
		expect(html).toMatch(LINK_BELOW_GRID);
	});
});

describe("IndexPanel", () => {
	const html = renderToStaticMarkup(
		<IndexPanel
			items={deptItems(NAV)}
			onNavigate={noop}
			services={NAV.services}
			totalProducts={4}
		/>
	);

	it("lista só os ofícios", () => {
		expect(html).toContain("Reboco e acabamento");
		expect(html).toContain("Demolição");
		expect(html).not.toContain("Acessórios");
		expect(html).not.toContain("Por categoria");
	});

	it("traz a frase de estoque da home", () => {
		expect(html).toContain("4 produtos, 3 em estoque · a partir de R$ 28,82");
		expect(html).toContain("2 produtos, 0 em estoque");
		expect(html).toContain("Ver catálogo completo");
	});
});
