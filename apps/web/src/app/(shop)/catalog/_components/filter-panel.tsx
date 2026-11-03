// apps/web/src/app/(shop)/catalog/_components/filter-panel.tsx
"use client";

import type { CategoryNode } from "@emach/db/queries/categories";
import type { Route } from "next";
import Link from "next/link";
import type { CatalogService } from "../_lib/catalog-data";
import type { VoltageKey } from "../_lib/catalog-filters";
import type { FacetCounts } from "../_lib/facet-counts";
import { isModifiedClick } from "../_lib/is-modified-click";
import { matchPriceRange, PRICE_RANGES } from "../_lib/price-ranges";
import { CategoryDrilldown } from "./category-drilldown";
import { isOptionVisible, OptionContent, optionClass } from "./filter-option";

const VOLTAGE_OPTIONS: VoltageKey[] = ["127V", "220V", "Bivolt", "380V"];

interface FilterPanelProps {
	activeSlug: string | null;
	/** Href de cada categoria do drilldown (link rastreável). */
	categoryHrefFor: (slug: string | null) => string;
	facetCounts: FacetCounts;
	onApplyPrice: () => void;
	onlyPromo: boolean;
	onPmaxChange: (value: string) => void;
	onPminChange: (value: string) => void;
	onSelectCategory: (slug: string | null) => void;
	onSelectPriceRange: (pmin: number | null, pmax: number | null) => void;
	onTogglePromo: (value: boolean) => void;
	onToggleVoltage: (value: VoltageKey) => void;
	pmaxValue: string;
	pminValue: string;
	priceMax: number | null;
	priceMin: number | null;
	services: CatalogService[];
	tree: CategoryNode[];
	voltages: VoltageKey[];
}

function Group({
	children,
	title,
}: {
	children: React.ReactNode;
	title: string;
}) {
	return (
		<fieldset className="min-w-0 pb-[26px]">
			<legend className="float-left mb-1 w-full p-0 font-semibold text-[15px] text-ink">
				{title}
			</legend>
			<div className="clear-both">{children}</div>
		</fieldset>
	);
}

/** Corpo dos filtros do catálogo, compartilhado entre a coluna do desktop e a gaveta do celular. */
export function FilterPanel({
	tree,
	services,
	activeSlug,
	facetCounts,
	categoryHrefFor,
	onSelectCategory,
	pminValue,
	pmaxValue,
	priceMin,
	priceMax,
	onPminChange,
	onPmaxChange,
	onApplyPrice,
	onSelectPriceRange,
	onlyPromo,
	onTogglePromo,
	voltages,
	onToggleVoltage,
}: FilterPanelProps) {
	const matchedRange = matchPriceRange(priceMin, priceMax);
	const serviceActive = services.some((s) => s.slug === activeSlug);

	const shownServices = services.filter((s) =>
		isOptionVisible(s.productCount, s.slug === activeSlug)
	);

	const shownVoltages = VOLTAGE_OPTIONS.filter((v) =>
		isOptionVisible(facetCounts.byVoltage[v], voltages.includes(v))
	);

	const shownRanges = PRICE_RANGES.filter((r) =>
		isOptionVisible(facetCounts.byPriceRange[r.key], matchedRange === r.key)
	);

	return (
		<div>
			{shownServices.length > 0 && (
				<Group title="Serviço">
					{shownServices.map((service) => {
						const active = service.slug === activeSlug;

						return (
							<Link
								aria-current={active ? "page" : undefined}
								className={optionClass}
								// SAFETY: categoryHrefFor é o buildHref de catalog/_lib/catalog-filters.ts: sempre `/catalog[/slug][?query]`.
								href={categoryHrefFor(active ? null : service.slug) as Route}
								key={service.slug}
								onClick={(e) => {
									if (isModifiedClick(e)) {
										return;
									}

									e.preventDefault();
									onSelectCategory(active ? null : service.slug);
								}}
							>
								<OptionContent
									checked={active}
									count={service.productCount}
									label={service.name}
									mark="radio"
								/>
							</Link>
						);
					})}
				</Group>
			)}

			<Group title="Categoria">
				<CategoryDrilldown
					activeSlug={serviceActive ? null : activeSlug}
					counts={facetCounts.byCategory}
					hrefFor={categoryHrefFor}
					onSelect={onSelectCategory}
					totalCount={facetCounts.total}
					tree={tree}
				/>
			</Group>

			{shownVoltages.length > 0 && (
				<Group title="Voltagem">
					{shownVoltages.map((v) => {
						const selected = voltages.includes(v);

						return (
							<button
								aria-pressed={selected}
								className={optionClass}
								key={v}
								onClick={() => onToggleVoltage(v)}
								type="button"
							>
								<OptionContent
									checked={selected}
									count={facetCounts.byVoltage[v]}
									label={v}
									mark="checkbox"
								/>
							</button>
						);
					})}
				</Group>
			)}

			<Group title="Preço">
				{shownRanges.map((r) => {
					const selected = matchedRange === r.key;

					return (
						<button
							aria-pressed={selected}
							className={optionClass}
							key={r.key}
							onClick={() =>
								selected
									? onSelectPriceRange(null, null)
									: onSelectPriceRange(r.pmin, r.pmax)
							}
							type="button"
						>
							<OptionContent
								checked={selected}
								count={facetCounts.byPriceRange[r.key]}
								label={r.label}
								mark="radio"
							/>
						</button>
					);
				})}
				<div className="mt-2 flex items-center gap-1.5">
					<input
						aria-label="Preço mínimo em reais"
						className="h-11 w-full min-w-0 rounded-[3px] border-[1.5px] border-line-strong bg-paper px-2.5 text-[15px] text-ink placeholder:text-ink-muted focus:border-ink focus:outline-none"
						inputMode="numeric"
						onChange={(e) => onPminChange(e.target.value)}
						onKeyDown={(e) => {
							if (e.key === "Enter") {
								onApplyPrice();
							}
						}}
						placeholder="R$ mín"
						type="number"
						value={pminValue}
					/>
					<input
						aria-label="Preço máximo em reais"
						className="h-11 w-full min-w-0 rounded-[3px] border-[1.5px] border-line-strong bg-paper px-2.5 text-[15px] text-ink placeholder:text-ink-muted focus:border-ink focus:outline-none"
						inputMode="numeric"
						onChange={(e) => onPmaxChange(e.target.value)}
						onKeyDown={(e) => {
							if (e.key === "Enter") {
								onApplyPrice();
							}
						}}
						placeholder="R$ máx"
						type="number"
						value={pmaxValue}
					/>
					<button
						className="h-11 shrink-0 cursor-pointer rounded-[3px] bg-grafite px-3.5 font-semibold text-[14px] text-on-dark hover:bg-black"
						onClick={onApplyPrice}
						type="button"
					>
						Aplicar
					</button>
				</div>
			</Group>

			{isOptionVisible(facetCounts.promo, onlyPromo) && (
				<Group title="Ofertas">
					<button
						aria-pressed={onlyPromo}
						className={optionClass}
						onClick={() => onTogglePromo(!onlyPromo)}
						type="button"
					>
						<OptionContent
							checked={onlyPromo}
							count={facetCounts.promo}
							label="Só em promoção"
							mark="checkbox"
						/>
					</button>
				</Group>
			)}
		</div>
	);
}
