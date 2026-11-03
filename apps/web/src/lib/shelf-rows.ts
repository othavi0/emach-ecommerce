/** Até quantos produtos uma prateleira divide a linha com a vizinha. */
export const PAIR_MAX_ITEMS = 2;

export type ShelfRow<S> =
	| { kind: "row"; shelf: S }
	| { kind: "pair"; shelves: readonly [S, S] };

/**
 * Agrupa as prateleiras da vitrine em linhas: duas seguidas com até
 * `PAIR_MAX_ITEMS` produtos cada dividem uma linha; as demais ocupam a linha
 * inteira. Uma curta sem vizinha curta fica sozinha, com a capa esticada.
 */
export function groupShelfRows<S extends { items: readonly unknown[] }>(
	shelves: readonly S[]
): ShelfRow<S>[] {
	const rows: ShelfRow<S>[] = [];
	let index = 0;

	while (index < shelves.length) {
		const shelf = shelves[index];
		const next = shelves[index + 1];

		if (
			shelf.items.length <= PAIR_MAX_ITEMS &&
			next !== undefined &&
			next.items.length <= PAIR_MAX_ITEMS
		) {
			rows.push({ kind: "pair", shelves: [shelf, next] });
			index += 2;
		} else {
			rows.push({ kind: "row", shelf });
			index += 1;
		}
	}

	return rows;
}

/**
 * Intervalo do avanço automático de cada prateleira, pela posição na vitrine.
 * Vizinhas recebem ritmos diferentes para os trilhos não andarem juntos.
 */
const AUTO_ADVANCE_MS = [5200, 6700, 5900, 7400] as const;

export function autoAdvanceMs(position: number): number {
	return AUTO_ADVANCE_MS[position % AUTO_ADVANCE_MS.length];
}

/** Próxima posição do trilho: um card adiante, ou o começo depois do fim. */
export function nextAutoScroll(
	scrollLeft: number,
	maxScroll: number,
	step: number
): number {
	if (scrollLeft >= maxScroll - 2) {
		return 0;
	}

	return Math.min(scrollLeft + step, maxScroll);
}
