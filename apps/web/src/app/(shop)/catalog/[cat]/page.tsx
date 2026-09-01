import { db } from "@emach/db";
import { getAllCategorySlugs } from "@emach/db/queries/categories";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { SiteHeader } from "@/components/site-header";
import { canonicalFor } from "@/lib/seo/canonical";
import { CatalogResults } from "../_components/catalog-results";
import { CatalogSkeleton } from "../_components/catalog-skeleton";
import {
	defaultCategoryDescription,
	getCategoryShell,
} from "../_lib/category-shell";
import type { CatalogSearchParams } from "../_lib/parse-search-params";

interface CategoryPageProps {
	params: Promise<{ cat: string }>;
	searchParams: Promise<CatalogSearchParams>;
}

// Prebuilda o shell de cada categoria ativa; slug novo resolve on-demand e
// cacheia por janela (getCategoryShell). Satisfaz o cacheComponents (≥1 param).
export async function generateStaticParams() {
	const slugs = await getAllCategorySlugs(db);
	return slugs.map((cat) => ({ cat }));
}

export async function generateMetadata({
	params,
}: CategoryPageProps): Promise<Metadata> {
	const { cat } = await params;
	const category = await getCategoryShell(cat);
	if (!category) {
		return { title: "Categoria não encontrada" };
	}
	const title = category.name;
	const description =
		category.description ?? defaultCategoryDescription(category.name);
	const path = `/catalog/${cat}`;
	return {
		title,
		description,
		alternates: canonicalFor(path),
		openGraph: {
			title,
			description,
			type: "website",
			url: path,
			siteName: "EMACH",
		},
		twitter: { card: "summary_large_image", title, description },
	};
}

export default async function CategoryPage({
	params,
	searchParams,
}: CategoryPageProps) {
	const { cat } = await params;
	const category = await getCategoryShell(cat);
	if (!category) {
		notFound();
	}
	return (
		<>
			<SiteHeader />
			<Suspense fallback={<CatalogSkeleton />}>
				<CatalogResults cat={cat} searchParams={searchParams} />
			</Suspense>
		</>
	);
}
