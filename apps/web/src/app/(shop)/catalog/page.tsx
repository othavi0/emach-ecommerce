import type { Metadata } from "next";
import { Suspense } from "react";
import { SiteHeader } from "@/components/site-header";
import { canonicalFor } from "@/lib/seo/canonical";
import { CatalogContent } from "./_components/catalog-content";
import { CatalogSkeleton } from "./_components/catalog-skeleton";
import { CATALOG_PAGE_SIZE, getCatalogData } from "./_lib/catalog-data";
import type { CatalogSearchParams } from "./_lib/parse-search-params";
import { parseCatalogSearchParams } from "./_lib/parse-search-params";

interface CatalogPageProps {
	searchParams: Promise<CatalogSearchParams>;
}

// Metadata estática: sob cacheComponents, ler searchParams em generateMetadata
// bloquearia o prerender do shell. O título/categoria da busca aparece no corpo
// (CatalogContent), não no <title> (a rota tem filtros via query, não path).
export const metadata: Metadata = {
	title: "Catálogo",
	description:
		"Todas as ferramentas da EMACH: elétricas, manuais, medição e EPIs. Filtre por categoria, voltagem e preço.",
	// Canonical estático: a rota aceita 8 filtros por query e todos são a
	// mesma página. Não ler searchParams aqui (bloquearia o prerender do shell).
	alternates: canonicalFor("/catalog"),
};

export default function CatalogPage({ searchParams }: CatalogPageProps) {
	return (
		<>
			<SiteHeader />
			<Suspense fallback={<CatalogSkeleton />}>
				<CatalogResults searchParams={searchParams} />
			</Suspense>
		</>
	);
}

// Buraco dinâmico do catálogo: lê searchParams (filtros/busca/paginação) — por
// isso vive sob Suspense. Os dados vêm de getCatalogData ('use cache' por
// combinação de filtros): hit não toca o Postgres.
async function CatalogResults({ searchParams }: CatalogPageProps) {
	const params = await searchParams;
	const parsed = parseCatalogSearchParams(params);

	const {
		categoryTree,
		currentCategory,
		facetCounts,
		tools,
		total,
		voltagesByTool,
	} = await getCatalogData({
		cat: params.cat,
		search: parsed.search,
		voltages: parsed.voltages,
		priceMin: parsed.priceMin,
		priceMax: parsed.priceMax,
		onlyPromo: parsed.onlyPromo,
		sort: parsed.sort,
		page: parsed.page,
	});

	return (
		<CatalogContent
			categoryTree={categoryTree}
			currentCategoryDescription={currentCategory?.description ?? null}
			currentCategoryName={currentCategory?.name ?? null}
			currentCategorySlug={currentCategory?.slug ?? null}
			facetCounts={facetCounts}
			onlyPromo={parsed.onlyPromo}
			page={parsed.page}
			pageSize={CATALOG_PAGE_SIZE}
			priceMax={parsed.priceMax ?? null}
			priceMin={parsed.priceMin ?? null}
			query={parsed.q}
			sort={parsed.sort}
			tools={tools}
			total={total}
			voltages={parsed.voltages}
			voltagesByTool={voltagesByTool}
		/>
	);
}
