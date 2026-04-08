// apps/web/src/app/catalog/_components/catalog-content.tsx
"use client";

import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@emach/ui/components/accordion";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@emach/ui/components/breadcrumb";
import { Separator } from "@emach/ui/components/separator";
import { useState } from "react";

import { ProductCard } from "@/components/product-card";
import { categories, products } from "@/lib/mock-data";

type PriceRange = "all" | "0-200" | "200-500" | "500+";

const priceRanges: { label: string; value: PriceRange }[] = [
	{ label: "Todos os Preços", value: "all" },
	{ label: "Até R$ 200", value: "0-200" },
	{ label: "R$ 200 – R$ 500", value: "200-500" },
	{ label: "Acima de R$ 500", value: "500+" },
];

function matchesPriceRange(price: number, range: PriceRange): boolean {
	if (range === "all") {
		return true;
	}
	if (range === "0-200") {
		return price < 20_000;
	}
	if (range === "200-500") {
		return price >= 20_000 && price < 50_000;
	}
	return price >= 50_000;
}

export function CatalogContent() {
	const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
	const [selectedPriceRange, setSelectedPriceRange] =
		useState<PriceRange>("all");

	const filteredProducts = products.filter((product) => {
		const matchesCategory =
			selectedCategory === null || product.categorySlug === selectedCategory;
		const matchesPrice = matchesPriceRange(product.price, selectedPriceRange);
		return matchesCategory && matchesPrice;
	});

	return (
		<div className="flex min-h-[calc(100svh-52px)] bg-background">
			{/* Sidebar */}
			<aside className="w-[280px] shrink-0 border-border border-r p-6">
				<span className="font-display font-semibold text-muted-foreground text-xs uppercase tracking-wider">
					Filtros
				</span>

				<Separator className="my-4" />

				<Accordion defaultValue={["categorias", "preco"]} multiple>
					{/* Categorias */}
					<AccordionItem value="categorias">
						<AccordionTrigger>Categorias</AccordionTrigger>
						<AccordionContent>
							<ul className="space-y-2 pt-1">
								<li>
									<button
										className={`cursor-pointer text-left text-sm transition-colors ${
											selectedCategory === null
												? "font-semibold text-primary"
												: "text-foreground hover:text-primary"
										}`}
										onClick={() => setSelectedCategory(null)}
										type="button"
									>
										Todas as Categorias
									</button>
								</li>
								{categories.map((category) => (
									<li key={category.slug}>
										<button
											className={`cursor-pointer text-left text-sm transition-colors ${
												selectedCategory === category.slug
													? "font-semibold text-primary"
													: "text-foreground hover:text-primary"
											}`}
											onClick={() => setSelectedCategory(category.slug)}
											type="button"
										>
											{category.name}
										</button>
									</li>
								))}
							</ul>
						</AccordionContent>
					</AccordionItem>

					{/* Faixa de Preço */}
					<AccordionItem value="preco">
						<AccordionTrigger>Faixa de Preço</AccordionTrigger>
						<AccordionContent>
							<ul className="space-y-2 pt-1">
								{priceRanges.map((range) => (
									<li key={range.value}>
										<button
											className={`cursor-pointer text-left text-sm transition-colors ${
												selectedPriceRange === range.value
													? "font-semibold text-primary"
													: "text-foreground hover:text-primary"
											}`}
											onClick={() => setSelectedPriceRange(range.value)}
											type="button"
										>
											{range.label}
										</button>
									</li>
								))}
							</ul>
						</AccordionContent>
					</AccordionItem>
				</Accordion>
			</aside>

			{/* Main content */}
			<main className="flex-1 space-y-6 p-8 px-10">
				{/* Sort bar */}
				<div className="flex items-center justify-between">
					<div>
						<Breadcrumb>
							<BreadcrumbList>
								<BreadcrumbItem>
									<BreadcrumbLink href="/">Home</BreadcrumbLink>
								</BreadcrumbItem>
								<BreadcrumbSeparator />
								<BreadcrumbItem>
									<BreadcrumbPage>Catálogo</BreadcrumbPage>
								</BreadcrumbItem>
							</BreadcrumbList>
						</Breadcrumb>
						<p className="mt-1 text-muted-foreground text-sm">
							{filteredProducts.length}{" "}
							{filteredProducts.length === 1 ? "produto" : "produtos"}
						</p>
					</div>

					<div className="flex items-center gap-2">
						<span className="text-muted-foreground text-xs">Ordenar por:</span>
						<select className="border border-border bg-background px-3 py-1.5 text-foreground text-xs">
							<option>Relevância</option>
							<option>Menor Preço</option>
							<option>Maior Preço</option>
							<option>Mais Vendidos</option>
						</select>
					</div>
				</div>

				{/* Product grid */}
				{filteredProducts.length > 0 ? (
					<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
						{filteredProducts.map((product) => (
							<ProductCard key={product.id} product={product} />
						))}
					</div>
				) : (
					<div className="flex flex-col items-center justify-center py-24 text-center">
						<span className="font-display font-semibold text-muted-foreground text-xs uppercase tracking-wider">
							Nenhum Resultado
						</span>
						<p className="mt-3 text-foreground text-sm">
							Nenhum produto corresponde aos filtros selecionados.
						</p>
						<button
							className="mt-6 cursor-pointer text-primary text-sm underline-offset-4 hover:underline"
							onClick={() => {
								setSelectedCategory(null);
								setSelectedPriceRange("all");
							}}
							type="button"
						>
							Limpar filtros
						</button>
					</div>
				)}
			</main>
		</div>
	);
}
