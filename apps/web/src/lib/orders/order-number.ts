/** Número público do pedido: ano UTC e sequência com no mínimo 6 dígitos. */
const ORDER_NUMBER_RE = /^\d{4}-\d{6,}$/;

export function formatOrderNumber(seq: number): string {
	const year = new Date().getUTCFullYear();
	return `${year}-${seq.toString().padStart(6, "0")}`;
}

/** Devolve o número só quando ele tem o formato de `formatOrderNumber`. */
export function parseOrderNumber(raw: string | undefined): string | null {
	return raw !== undefined && ORDER_NUMBER_RE.test(raw) ? raw : null;
}
