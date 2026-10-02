import type { AttributeDefinition } from "@emach/db/schema/attributes";

import { fmtSpecNumber, fmtSpecRange } from "@/lib/format";

/** Recorte de atributo que a formatação usa (definição + valor do produto). */
export interface FormattableAttribute {
	definition: {
		inputType: AttributeDefinition["inputType"];
		unit: string | null;
	};
	value: {
		valueBool: boolean | null;
		valueNumeric: string | null;
		valueNumericMax: string | null;
		valueText: string | null;
	};
}

export const EMPTY_ATTRIBUTE = "—";

export function formatAttribute(item: FormattableAttribute): string {
	const { definition, value } = item;
	const unit = definition.unit ?? "";
	switch (definition.inputType) {
		case "boolean": {
			if (value.valueBool == null) {
				return EMPTY_ATTRIBUTE;
			}
			return value.valueBool ? "Sim" : "Não";
		}
		case "numeric_range":
			return fmtSpecRange(value.valueNumeric, value.valueNumericMax, unit);
		case "number":
			return fmtSpecNumber(value.valueNumeric, unit);
		case "select": {
			// Opções de select podem ter unidade ("Diâmetro do disco: 185" + mm).
			if (!value.valueText) {
				return EMPTY_ATTRIBUTE;
			}
			return unit ? `${value.valueText} ${unit}` : value.valueText;
		}
		default:
			return value.valueText ?? EMPTY_ATTRIBUTE;
	}
}

/**
 * Chips curtos de especificação ("800 W", "Lixa de 225 mm"): os primeiros
 * atributos com valor, na ordem do cadastro. Sim/Não não dizem nada sem o
 * rótulo, então ficam de fora; texto longo também.
 */
export function specChips(
	attributes: FormattableAttribute[],
	max: number
): string[] {
	const chips: string[] = [];
	for (const attribute of attributes) {
		if (chips.length >= max) {
			break;
		}
		if (attribute.definition.inputType === "boolean") {
			continue;
		}
		const text = formatAttribute(attribute);
		if (text !== EMPTY_ATTRIBUTE && text.length <= 24) {
			chips.push(text);
		}
	}
	return chips;
}
