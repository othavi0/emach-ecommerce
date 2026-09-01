import type { SortKey, VoltageKey } from "./catalog-filters";

const VALID_SORTS: readonly SortKey[] = [
	"relevance",
	"price-asc",
	"price-desc",
	"name-asc",
	"newest",
];

const VALID_VOLTAGES: readonly VoltageKey[] = [
	"127V",
	"220V",
	"Bivolt",
	"380V",
];

export interface CatalogSearchParams {
	cat?: string;
	page?: string;
	pmax?: string;
	pmin?: string;
	promo?: string;
	q?: string;
	sort?: string;
	voltage?: string;
}

export interface ParsedCatalogParams {
	onlyPromo: boolean;
	page: number;
	priceMax?: number;
	priceMin?: number;
	/** Texto cru do input (pra repovoar o campo). */
	q: string;
	/** Texto normalizado usado na query; undefined quando vazio. */
	search?: string;
	sort: SortKey;
	voltages: VoltageKey[];
}

function parseSort(value: string | undefined): SortKey {
	return value && (VALID_SORTS as readonly string[]).includes(value)
		? (value as SortKey)
		: "relevance";
}

function parseVoltages(value: string | undefined): VoltageKey[] {
	if (!value) {
		return [];
	}
	return value
		.split(",")
		.filter((v): v is VoltageKey =>
			(VALID_VOLTAGES as readonly string[]).includes(v)
		);
}

function parsePositiveInt(value: string | undefined): number | undefined {
	if (!value) {
		return;
	}
	const n = Number(value);
	return Number.isFinite(n) && n >= 0 ? n : undefined;
}

export function parseCatalogSearchParams(
	params: CatalogSearchParams
): ParsedCatalogParams {
	const q = params.q ?? "";
	const trimmed = q.trim();
	return {
		onlyPromo: params.promo === "1",
		page: Math.max(1, parsePositiveInt(params.page) ?? 1),
		priceMax: parsePositiveInt(params.pmax),
		priceMin: parsePositiveInt(params.pmin),
		q,
		search: trimmed ? trimmed : undefined,
		sort: parseSort(params.sort),
		voltages: parseVoltages(params.voltage),
	};
}
