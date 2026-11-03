/** Navegação da loja (cabeçalho, menu, rodapé). Módulo server-only. */
import { db } from "@emach/db";
import { getCategoryTree } from "@emach/db/queries/categories";
import { getTools } from "@emach/db/queries/tools";
import type { Route } from "next";
import { cacheLife } from "next/cache";
import { type NavPreviews, pickNavProducts } from "@/lib/nav-preview";
import { catalogHref } from "@/lib/routes";
import { splitServiceTree } from "@/lib/service-tree";
import {
	getServices,
	SERVICE_IMAGES,
	type ServiceSummary,
} from "@/lib/services";

export interface NavCategory {
	href: Route;
	name: string;
	productCount: number;
	slug: string;
}

export interface NavService {
	fromPriceCents: number | null;
	href: Route;
	/** `imageSrc` é a foto de um produto, não a do ofício: pede `object-contain`. */
	imageIsProduct: boolean;
	imageSrc: string | null;
	inStockCount: number;
	name: string;
	productCount: number;
	slug: string;
}

export interface StoreNav {
	categories: NavCategory[];
	services: NavService[];
}

/** Produtos lidos por categoria para achar 4 vendáveis, em estoque primeiro. */
const CATEGORY_SAMPLE = 24;

function toNavService(service: ServiceSummary): NavService {
	return {
		fromPriceCents: service.fromPriceCents,
		href: service.href,
		imageIsProduct:
			service.imageSrc !== null && !SERVICE_IMAGES.has(service.slug),
		imageSrc: service.imageSrc,
		inStockCount: service.inStockCount,
		name: service.name,
		productCount: service.productCount,
		slug: service.slug,
	};
}

export async function getStoreNav(): Promise<StoreNav> {
	"use cache";
	cacheLife({ revalidate: 600 });

	const [tree, services] = await Promise.all([
		getCategoryTree(db),
		getServices(),
	]);

	const { categories } = splitServiceTree(tree);

	return {
		categories: categories.map(
			(c): NavCategory => ({
				href: catalogHref(c.slug),
				name: c.name,
				productCount: c.productCount,
				slug: c.slug,
			})
		),
		services: services.map(toNavService),
	};
}

/** Produtos do painel de cada ofício e categoria, por slug: painéis do desktop e sanfona do celular. */
export async function getNavPreviews(): Promise<NavPreviews> {
	"use cache";
	cacheLife({ revalidate: 600 });

	const [tree, services] = await Promise.all([
		getCategoryTree(db),
		getServices(),
	]);

	const { categories } = splitServiceTree(tree);

	const categoryEntries = await Promise.all(
		categories
			.filter((c) => c.productCount > 0)
			.map(async (c) => {
				const { tools } = await getTools(db, {
					categoryId: c.id,
					limit: CATEGORY_SAMPLE,
				});

				return [c.slug, pickNavProducts(tools)] as const;
			})
	);

	return Object.fromEntries([
		...services.map((s) => [s.slug, pickNavProducts(s.preview)] as const),
		...categoryEntries,
	]);
}
