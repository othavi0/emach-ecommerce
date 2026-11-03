"use client";

import type { CategoryNode } from "@emach/db/queries/categories";
import { cn } from "@emach/ui/lib/utils";
import { ArrowLeft, ChevronDown } from "lucide-react";
import type { Route } from "next";
import Link from "next/link";
import { deriveDrilldownLevel } from "../_lib/drilldown-level";
import { isModifiedClick } from "../_lib/is-modified-click";
import { isOptionVisible, OptionContent, optionClass } from "./filter-option";

interface CategoryDrilldownProps {
	activeSlug: string | null;
	/** facetCounts.byCategory (id → count). */
	counts: Record<string, number>;
	/** Href real de cada linha — o crawler segue; o clique é interceptado. */
	hrefFor: (slug: string | null) => string;
	onSelect: (slug: string | null) => void;
	/** facetCounts.total — contagem da linha "Todas". */
	totalCount: number;
	tree: CategoryNode[];
}

/**
 * Navegação de categoria por nível (drill-down): mostra só o nível atual,
 * a linha "voltar" e a categoria ativa. Clicar num item filtra por ele e
 * desce um nível; "voltar" filtra pelo pai. Substitui a árvore expandível.
 */
export function CategoryDrilldown({
	tree,
	activeSlug,
	counts,
	totalCount,
	onSelect,
	hrefFor,
}: CategoryDrilldownProps) {
	const level = deriveDrilldownLevel(tree, activeSlug);

	const rows = level.rows.filter((row) =>
		isOptionVisible(counts[row.id] ?? 0, false)
	);

	return (
		<nav aria-label="Categorias" className="flex flex-col">
			{level.back && (
				<Link
					className={cn(optionClass, "text-[14px] text-ink-2")}
					// SAFETY: hrefFor é categoryHrefFor, que devolve buildHref (catalog/_lib/catalog-filters.ts): sempre `/catalog[/slug][?query]`.
					href={hrefFor(level.back.slug) as Route}
					onClick={(e) => {
						// ctrl/cmd/shift/alt e botão do meio ficam com o browser (nova aba).
						if (isModifiedClick(e)) {
							return;
						}

						e.preventDefault();
						onSelect(level.back?.slug ?? null);
					}}
				>
					<span
						aria-hidden="true"
						className="grid size-5 shrink-0 place-items-center"
					>
						<ArrowLeft className="size-4" />
					</span>
					<span className="label flex-1">{level.back.name}</span>
				</Link>
			)}

			<div aria-current="page" className={cn(optionClass, "cursor-default")}>
				<OptionContent
					checked
					count={level.active ? (counts[level.active.id] ?? 0) : totalCount}
					label={level.active ? level.active.name : "Todas"}
					mark="radio"
				/>
			</div>

			<div className={cn("flex flex-col", level.rowsAreChildren && "pl-4")}>
				{rows.map((row) => (
					<Link
						className={optionClass}
						// SAFETY: hrefFor é categoryHrefFor, que devolve buildHref (catalog/_lib/catalog-filters.ts): sempre `/catalog[/slug][?query]`.
						href={hrefFor(row.slug) as Route}
						key={row.id}
						onClick={(e) => {
							if (isModifiedClick(e)) {
								return;
							}

							e.preventDefault();
							onSelect(row.slug);
						}}
					>
						<OptionContent
							checked={false}
							count={counts[row.id] ?? 0}
							label={
								<>
									{row.name}
									{row.hasChildren && (
										<ChevronDown
											aria-hidden="true"
											className="ml-1 inline size-3.5 text-ink-muted"
										/>
									)}
								</>
							}
							mark="radio"
						/>
					</Link>
				))}
			</div>
		</nav>
	);
}
