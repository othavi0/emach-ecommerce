import type { ToolListItem } from "@emach/db/queries/tools";
import type { Voltage } from "@emach/db/schema/tools";

import { listPriceCents } from "@/lib/list-price";
import { voltageLabel } from "@/lib/purchase";

/**
 * O que o botão do card faz:
 * - `notify`: esgotado, leva à página do produto ("Avise-me quando chegar");
 * - `choose-voltage`: mais de uma voltagem, abre o "Ver rápido" para escolher;
 * - `add`: uma variante vendável, adiciona direto ao carrinho;
 * - `view`: sem preço de vitrine, só leva à página do produto.
 */
export type CardAction = "add" | "choose-voltage" | "notify" | "view";

export function cardAction(
	tool: Pick<ToolListItem, "defaultVariant" | "inStock">,
	voltages: Voltage[]
): CardAction {
	if (!tool.inStock) {
		return "notify";
	}
	if (listPriceCents(tool) === null) {
		return "view";
	}
	return voltages.length > 1 ? "choose-voltage" : "add";
}

/** "127 V ou 220 V"; `null` sem voltagem cadastrada. */
export function voltageSummary(voltages: Voltage[]): string | null {
	if (voltages.length === 0) {
		return null;
	}
	return voltages.map((v) => voltageLabel(v).name).join(" ou ");
}
