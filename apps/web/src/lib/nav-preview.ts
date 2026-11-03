import type { ToolListItem } from "@emach/db/queries/tools";

import { listPriceCents, sortInStockFirst } from "@/lib/list-price";

/** Produtos mostrados no painel de cada departamento. */
export const NAV_PREVIEW_LIMIT = 4;

export interface NavProduct {
	categorySlug: string;
	id: string;
	imageSrc: string | null;
	name: string;
	priceCents: number;
	slug: string;
}

/** Prévia por slug do ofício ou da categoria. */
export type NavPreviews = Record<string, NavProduct[]>;

/**
 * Até 4 produtos vendáveis, em estoque primeiro. A query já filtra
 * `visible_on_site`; produto sem preço (rascunho) fica de fora.
 */
export function pickNavProducts(tools: ToolListItem[]): NavProduct[] {
	const picked: NavProduct[] = [];

	for (const tool of sortInStockFirst(tools)) {
		const priceCents = listPriceCents(tool);

		if (priceCents === null) {
			continue;
		}

		picked.push({
			categorySlug: tool.primaryCategory?.slug ?? "",
			id: tool.id,
			imageSrc: tool.primaryImage?.url ?? null,
			name: tool.name,
			priceCents,
			slug: tool.slug,
		});

		if (picked.length === NAV_PREVIEW_LIMIT) {
			break;
		}
	}

	return picked;
}
