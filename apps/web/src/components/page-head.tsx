import { cn } from "@emach/ui/lib/utils";
import type { ReactNode } from "react";
import { Breadcrumb, type Crumb } from "@/components/breadcrumb";

/** Escala do título de página do H3. Usar daqui, nunca reescrever o clamp. */
export const PAGE_TITLE_CLASS =
	"font-display font-extrabold text-[clamp(2.4rem,1.6rem+2.2vw,3.6rem)] uppercase leading-[0.92]";

interface PageHeadProps {
	/** À direita do título no desktop: chip de status, ação da página. */
	aside?: ReactNode;
	/** Linha de apoio abaixo do título: contagem, data, lede. */
	children?: ReactNode;
	/** Rótulo da página atual na trilha. Padrão: title. */
	current?: string;
	title: string;
	/** Links antes da página atual. Sem trail, sem trilha (checkout, auth). */
	trail?: readonly Crumb[];
}

/** Trilha e o único h1 da página. */
export function PageHead({
	aside,
	children,
	current,
	title,
	trail,
}: PageHeadProps) {
	return (
		<header>
			{trail ? <Breadcrumb current={current ?? title} trail={trail} /> : null}
			<div
				className={cn(
					"mb-6 flex flex-wrap items-end justify-between gap-4",
					trail ? "mt-0.5 md:mt-2" : "pt-6 md:pt-10"
				)}
			>
				<div className="min-w-0">
					<h1 className={PAGE_TITLE_CLASS}>{title}</h1>
					{children ? (
						<div className="mt-2 text-[15.5px] text-ink-2">{children}</div>
					) : null}
				</div>
				{aside ? <div className="shrink-0">{aside}</div> : null}
			</div>
		</header>
	);
}
