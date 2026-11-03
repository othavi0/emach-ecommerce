// @vitest-environment node
import type { Route } from "next";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

import { menuEntries, seeAllSpan } from "@/components/header/menu-entries";
import { MobileMenu } from "@/components/mobile-menu";
import type { HeaderBranch } from "@/lib/branches";
import type { NavPreviews, NavProduct } from "@/lib/nav-preview";
import type { StoreNav } from "@/lib/store-nav";

const session = vi.hoisted(() => ({
	current: null as { user: { name: string } } | null,
}));

vi.mock("next/navigation", () => ({
	usePathname: () => "/catalog",
	useRouter: () => ({ push: vi.fn(), refresh: vi.fn() }),
}));

vi.mock("@/lib/auth-client", () => ({
	signOut: vi.fn(),
	useSession: () => ({ data: session.current }),
}));

const NAV: StoreNav = {
	services: [
		{
			fromPriceCents: 2882,
			href: "/servicos/reboco" as Route,
			imageIsProduct: false,
			imageSrc: "/images/oficios/reboco.jpg",
			inStockCount: 3,
			name: "Reboco e acabamento",
			productCount: 4,
			slug: "reboco",
		},
	],
	categories: [
		{
			href: "/catalog/acessorios" as Route,
			name: "Acessórios",
			productCount: 7,
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

function product(id: string, imageSrc: string | null = null): NavProduct {
	return {
		categorySlug: "eletricas",
		id,
		imageSrc,
		name: `Produto ${id}`,
		priceCents: 2882,
		slug: id,
	};
}

const PREVIEWS: NavPreviews = {
	reboco: [product("a"), product("b"), product("c"), product("d")],
	acessorios: [product("e"), product("f", "/f.jpg")],
};

const BRANCHES: HeaderBranch[] = [
	{
		cep: null,
		city: "Itajaí",
		hours: null,
		id: "1",
		locality: "",
		mapsUrl: "https://maps.example/1",
		name: "EMACH Itajaí",
		street: "Rua A",
	},
];

function render() {
	return renderToStaticMarkup(
		<MobileMenu
			branches={BRANCHES}
			nav={NAV}
			onClose={() => undefined}
			open
			previews={PREVIEWS}
		/>
	);
}

const TAB = /<button[^>]*role="tab"[^>]*>([^<]*)<\/button>/g;
const SELECTED = /aria-selected="true"[^>]*role="tab"[^>]*>([^<]*)</;

describe("MobileMenu", () => {
	it("abre na aba de serviço, com as duas abas e só os ofícios", () => {
		const html = render();

		expect([...html.matchAll(TAB)].map((m) => m[1])).toEqual([
			"Por serviço",
			"Por categoria",
		]);
		expect(html.match(SELECTED)?.[1]).toBe("Por serviço");
		expect(html).toContain("Reboco e acabamento");
		expect(html).toContain("4 produtos, 3 em estoque");
		expect(html).toContain("a partir de R$");
		expect(html).not.toContain("Acessórios");
	});

	it("rodapé sem sessão: entrar, filial, entrega e WhatsApp", () => {
		session.current = null;
		const html = render();

		expect(html).toContain('href="/login?redirect=%2Fcatalog"');
		expect(html).toContain("Entrar ou criar conta");
		expect(html).not.toContain("Sair");
		expect(html).toContain("Itajaí");
		expect(html).toContain('href="/entrega"');
		expect(html).toContain("wa.me");
	});

	it("rodapé com sessão: minha conta e sair no lugar de entrar", () => {
		session.current = { user: { name: "Ana" } };
		const html = render();

		expect(html).toContain('href="/dashboard"');
		expect(html).toContain("Sair");
		expect(html).not.toContain("Entrar ou criar conta");
		session.current = null;
	});

	it("fechado e nunca aberto, não monta nada", () => {
		const html = renderToStaticMarkup(
			<MobileMenu
				branches={BRANCHES}
				nav={NAV}
				onClose={() => undefined}
				open={false}
				previews={PREVIEWS}
			/>
		);

		expect(html).toBe("");
	});
});

describe("menuEntries", () => {
	it("categoria vazia some, e a miniatura é a 1ª foto de produto", () => {
		const { category, service } = menuEntries(NAV, PREVIEWS);

		expect(category.map((c) => c.name)).toEqual(["Acessórios"]);
		expect(category[0]?.image).toEqual({ isProduct: true, src: "/f.jpg" });
		expect(category[0]?.meta).toEqual(["7 produtos"]);
		expect(service[0]?.products).toHaveLength(3);
	});
});

describe("seeAllSpan", () => {
	it("par ocupa a linha inteira; ímpar, a vaga que sobra", () => {
		expect([0, 1, 2, 3].map(seeAllSpan)).toEqual([
			"full",
			"half",
			"full",
			"half",
		]);
	});
});
