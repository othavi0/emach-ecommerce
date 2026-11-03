import { cn } from "@emach/ui/lib/utils";
import { Check } from "lucide-react";

/** `radio`: escolha única (serviço, categoria, faixa de preço); `checkbox`: múltipla. */
export type OptionMark = "radio" | "checkbox";

/** Linha de opção do filtro: mesma altura e alinhamento em todos os grupos. */
export const optionClass =
	"flex min-h-11 w-full cursor-pointer items-center gap-3 text-left text-[15px] text-ink leading-snug no-underline [&:hover_.label]:underline";

/** Opção com contagem 0 some, a não ser que esteja marcada (para poder desmarcar). */
export function isOptionVisible(count: number, checked: boolean) {
	return checked || count > 0;
}

interface OptionContentProps {
	checked: boolean;
	count: number;
	label: React.ReactNode;
	mark: OptionMark;
}

/** Indicador, rótulo e contagem; o controle real é o link ou o botão em volta. */
export function OptionContent({
	checked,
	count,
	label,
	mark,
}: OptionContentProps) {
	return (
		<>
			<span
				aria-hidden="true"
				className={cn(
					"grid size-5 shrink-0 place-items-center border-2 border-line-strong bg-paper text-white transition-colors duration-100",
					mark === "radio" ? "rounded-full" : "rounded-[2px]",
					checked && "border-grafite",
					checked && mark === "checkbox" && "bg-grafite"
				)}
			>
				{checked &&
					(mark === "radio" ? (
						<span className="size-2.5 rounded-full bg-grafite" />
					) : (
						<Check className="size-3.5" strokeWidth={3} />
					))}
			</span>
			<span className="label flex-1">{label}</span>
			<span className="text-[14px] text-ink-muted tabular-nums">{count}</span>
		</>
	);
}
