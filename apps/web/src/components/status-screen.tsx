import type { ReactNode } from "react";
import { PAGE_TITLE_CLASS } from "@/components/page-head";

/**
 * Corpo de 404, erro, erro global e erro do checkout: título display, lede,
 * ações e nota de rodapé. Não abre <main> nem renderiza link próprio: as ações
 * vêm do chamador, e o global-error não tem providers.
 */
export function StatusScreen({
	actions,
	footnote,
	lede,
	title,
}: {
	actions: ReactNode;
	footnote?: ReactNode;
	lede: string;
	title: string;
}) {
	return (
		<div className="shop-wrap py-16 md:py-24">
			<div className="max-w-[640px]">
				<h1 className={PAGE_TITLE_CLASS}>{title}</h1>
				<p className="mt-4 max-w-[52ch] text-[17px] text-ink-2 leading-relaxed">
					{lede}
				</p>
				<div className="mt-8 flex flex-wrap gap-3">{actions}</div>
				{footnote ? (
					<p className="mt-8 text-[13px] text-ink-muted tabular-nums">
						{footnote}
					</p>
				) : null}
			</div>
		</div>
	);
}
