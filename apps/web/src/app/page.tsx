import { db } from "@emach/db";
import type { ToolListItem } from "@emach/db/queries/catalog";
import { getActivePromotions, getRecentTools } from "@emach/db/queries/catalog";
import { category } from "@emach/db/schema/categories";
import { cn } from "@emach/ui/lib/utils";
import { and, asc, eq, isNull } from "drizzle-orm";
import { CategoryGrid } from "@/components/category-grid";
import { EmachButton } from "@/components/emach-button";
import { HeroCarousel } from "@/components/hero-carousel";
import { PageContainer } from "@/components/page-container";
import { ProductCard } from "@/components/product-card";
import { SectionHeader } from "@/components/section-header";
import { SectionLabel } from "@/components/section-label";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { TrustBar } from "@/components/trust-bar";

export const revalidate = 600;

const STATS = [
	{ n: "200+", l: "Horas de teste" },
	{ n: "2 anos", l: "Garantia total" },
	{ n: "98%", l: "Aprovação" },
	{ n: "50+", l: "Cidades" },
	{ n: "24/7", l: "Suporte" },
	{ n: "12×", l: "Sem juros" },
];

async function getRootCategories() {
	return db
		.select({
			id: category.id,
			slug: category.slug,
			name: category.name,
			description: category.description,
		})
		.from(category)
		.where(and(isNull(category.parentId), eq(category.isActive, true)))
		.orderBy(asc(category.sortOrder))
		.limit(4);
}

function flattenPromoTools(
	promotions: Awaited<ReturnType<typeof getActivePromotions>>,
	limit: number
): ToolListItem[] {
	const seen = new Map<string, ToolListItem>();
	for (const promo of promotions) {
		for (const tool of promo.tools) {
			if (!seen.has(tool.id)) {
				seen.set(tool.id, tool);
			}
			if (seen.size >= limit) {
				break;
			}
		}
		if (seen.size >= limit) {
			break;
		}
	}
	return Array.from(seen.values());
}

export default async function HomePage() {
	const [rootCategories, activePromotions, recentTools] = await Promise.all([
		getRootCategories(),
		getActivePromotions(db, 4),
		getRecentTools(db, 4),
	]);

	const promoTools = flattenPromoTools(activePromotions, 4);

	return (
		<>
			<SiteHeader overlay />

			<main>
				<HeroCarousel />

				<TrustBar />

				{rootCategories.length > 0 && (
					<section className="bg-cinema-3 text-white">
						<PageContainer className="px-[56px] py-[72px]">
							<SectionHeader
								label="01 · Categorias"
								link={{
									href: "/catalog",
									label: "Ver todas",
									variant: "arrow",
								}}
								title="Explorar por categoria"
							/>
							<CategoryGrid categories={rootCategories} />
						</PageContainer>
					</section>
				)}

				{promoTools.length > 0 && (
					<section className="bg-gray-10 px-[56px] py-[72px]">
						<PageContainer>
							<SectionHeader
								label="02 · Ofertas"
								link={{ href: "/catalog?promo=1", label: "Ver todas" }}
								title="Promoções ativas"
							/>
							<div className="grid grid-cols-4 gap-6">
								{promoTools.map((tool) => (
									<ProductCard key={tool.id} tool={tool} />
								))}
							</div>
						</PageContainer>
					</section>
				)}

				<section className="bg-black text-white">
					<PageContainer className="grid min-h-[440px] grid-cols-2 px-0">
						<div className="flex flex-col justify-center gap-5 px-20 py-20">
							<SectionLabel tone="accent">Feito para durar</SectionLabel>
							<h2 className="font-display font-medium text-[48px] leading-[1.02] tracking-[-0.01em]">
								Engenharia que
								<br />
								não abandona você
								<br />
								no meio da obra.
							</h2>
							<p className="max-w-[440px] text-[16px] text-white/70 leading-relaxed">
								Cada ferramenta EMACH passa por 200+ horas de testes em campo
								antes de chegar ao catálogo.
							</p>
							<div>
								<EmachButton size="lg" variant="outline-light">
									Conheça a marca
								</EmachButton>
							</div>
						</div>

						<div className="emach-bg-stats relative border-emach-red border-l-[3px]">
							<div className="absolute inset-0 grid grid-cols-3 content-center p-10">
								{STATS.map((s, i) => (
									<div
										className={cn(
											"p-5",
											i > 2 && "border-white/10 border-t",
											i % 3 < 2 && "border-white/10 border-r"
										)}
										key={s.n}
									>
										<div className="font-display font-medium text-[32px] text-white">
											{s.n}
										</div>
										<div className="mt-1 text-[11px] text-white/55 uppercase tracking-[0.14em]">
											{s.l}
										</div>
									</div>
								))}
							</div>
						</div>
					</PageContainer>
				</section>

				{recentTools.length > 0 && (
					<section className="bg-gray-10 px-[56px] py-[72px]">
						<PageContainer>
							<SectionHeader
								label="03 · Novidades"
								link={{ href: "/catalog?sort=newest", label: "Ver todas" }}
								title="Recém-chegadas"
							/>
							<div className="grid grid-cols-4 gap-6">
								{recentTools.map((tool) => (
									<ProductCard key={tool.id} tool={tool} />
								))}
							</div>
						</PageContainer>
					</section>
				)}
			</main>

			<SiteFooter />
		</>
	);
}
