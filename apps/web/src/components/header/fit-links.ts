export interface FitInput {
	/** Largura disponível para os links (sem o botão "Departamentos"). */
	available: number;
	/** Quantos links vêm antes do separador (os ofícios); 0 sem separador. */
	groupSize: number;
	moreWidth: number;
	separatorWidth: number;
	widths: number[];
}

function rowWidth(widths: number[], count: number, input: FitInput): number {
	let total = 0;

	for (let i = 0; i < count; i++) {
		total += widths[i] ?? 0;
	}

	const crossesGroups = input.groupSize > 0 && count > input.groupSize;

	return crossesGroups ? total + input.separatorWidth : total;
}

/**
 * Quantos links cabem na linha, na ordem. O que sobra vai para o "Mais", e o
 * botão "Mais" só ocupa lugar quando sobra alguma coisa.
 */
export function fitLinks(input: FitInput): number {
	const { available, moreWidth, widths } = input;

	if (rowWidth(widths, widths.length, input) <= available) {
		return widths.length;
	}

	let count = widths.length - 1;

	while (count > 0 && rowWidth(widths, count, input) + moreWidth > available) {
		count--;
	}

	return count;
}
