import { cn } from "@emach/ui/lib/utils";
import { ArrowRight, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { EmachLinkButton } from "@/components/emach-button";
import { fmtBRL } from "@/lib/format";
import { listPriceCents } from "@/lib/list-price";
import type { ServiceSummary } from "@/lib/services";

/** Itens listados por cartão no desktop; o resto fica em "Ver os N produtos". */
const LIST_LIMIT = 4;

function plural(n: number, one: string, many: string) {
	return `${n} ${n === 1 ? one : many}`;
}

/** Colunas da grade: 2 do `md` ao `lg`, 4 no `xl`. */
const GRID_COLUMNS = { narrow: 2, wide: 4 } as const;

/**
 * Se o card fica com vaga vazia em cada layout: as vagas da linha são o maior
 * número de itens listados entre os cards dela.
 */
interface ShortIn {
	narrow: boolean;
	wide: boolean;
}

function listedCount(service: ServiceSummary) {
	return Math.min(service.preview.length, LIST_LIMIT);
}

export function shortIn(services: ServiceSummary[], index: number): ShortIn {
	const own = listedCount(services[index]);

	const rowMax = (cols: number) => {
		const start = index - (index % cols);

		return Math.max(...services.slice(start, start + cols).map(listedCount));
	};

	return {
		narrow: own < rowMax(GRID_COLUMNS.narrow),
		wide: own < rowMax(GRID_COLUMNS.wide),
	};
}

function seeAllLabel(service: ServiceSummary) {
	return service.productCount === 1
		? "Ver o produto"
		: `Ver os ${service.productCount} produtos`;
}

function ServiceCard({
	service,
	short,
}: {
	service: ServiceSummary;
	short: ShortIn;
}) {
	const listed = service.preview.slice(0, LIST_LIMIT);

	return (
		<article className="group flex flex-col overflow-hidden rounded-[5px] border border-line bg-paper transition-colors duration-150 ease-out hover:border-line-strong">
			<Link
				className="relative block aspect-square overflow-hidden bg-grafite text-white no-underline sm:aspect-video lg:aspect-[4/3]"
				href={service.href}
			>
				{service.imageSrc && (
					<Image
						alt=""
						className="object-cover"
						fill
						sizes="(min-width: 1296px) 300px, (min-width: 1024px) 25vw, 50vw"
						src={service.imageSrc}
					/>
				)}
				<span
					aria-hidden="true"
					className="absolute inset-0 bg-[linear-gradient(180deg,rgba(19,21,24,0)_38%,rgba(19,21,24,0.86)_100%)]"
				/>
				<h3 className="absolute inset-x-2.5 bottom-2.5 z-[1] font-display font-extrabold text-[22px] uppercase leading-[0.95] md:inset-x-4 md:bottom-3.5 md:text-[31px]">
					{service.name}
				</h3>
			</Link>
			<p className="flex flex-col gap-px px-2.5 pt-2.5 pb-1.5 text-[13px] text-ink-muted md:border-line md:border-b md:px-4 md:py-3">
				<span>
					{plural(service.productCount, "produto", "produtos")},{" "}
					{service.inStockCount} em estoque
				</span>
				<strong className="whitespace-nowrap font-extrabold text-[15px] text-ink tabular-nums md:text-[17px]">
					{service.fromPriceCents === null ? (
						"Esgotado"
					) : (
						<>
							<small className="font-normal text-[13px] text-ink-muted">
								a partir de{" "}
							</small>
							{fmtBRL(service.fromPriceCents)}
						</>
					)}
				</strong>
			</p>

			<ul className="flex flex-1 flex-col max-md:hidden">
				{listed.map((tool) => {
					const price = listPriceCents(tool);

					return (
						<li className="border-line border-b last:border-b-0" key={tool.id}>
							<Link
								className={cn(
									"grid min-h-[60px] grid-cols-[48px_minmax(0,1fr)] grid-rows-[auto_auto] items-center gap-x-3 px-4 py-2 text-ink no-underline hover:bg-canteiro [&:hover_.name]:underline",
									!tool.inStock && "text-ink-muted"
								)}
								href={`/product/${tool.slug}`}
							>
								<span className="relative row-span-2 size-12 overflow-hidden rounded-[3px] bg-well">
									{tool.primaryImage && (
										<Image
											alt=""
											className={cn(
												"object-contain p-1 mix-blend-multiply",
												!tool.inStock && "opacity-50 grayscale"
											)}
											fill
											sizes="48px"
											src={tool.primaryImage.url}
										/>
									)}
								</span>
								<span className="name line-clamp-2 self-end font-semibold text-[14px] leading-snug">
									{tool.name}
								</span>
								<b
									className={cn(
										"self-start whitespace-nowrap tabular-nums",
										tool.inStock && price !== null
											? "font-extrabold text-[15px]"
											: "font-semibold text-[13px] text-off"
									)}
								>
									{tool.inStock && price !== null ? fmtBRL(price) : "Esgotado"}
								</b>
							</Link>
						</li>
					);
				})}
				<li
					className={cn(
						"min-h-[60px] flex-1 p-3",
						short.narrow ? "md:flex" : "md:hidden",
						short.wide ? "xl:flex" : "xl:hidden"
					)}
				>
					<Link
						className="group/fill flex w-full flex-col justify-center gap-1 rounded-[5px] bg-canteiro px-4 py-3 text-ink no-underline"
						href={service.href}
					>
						<span className="inline-flex items-center gap-2 font-semibold text-[15px] group-hover/fill:underline">
							{seeAllLabel(service)}
							<ArrowRight aria-hidden="true" className="size-4" />
						</span>
						<span className="text-[13px] text-ink-2">de {service.name}</span>
					</Link>
				</li>
			</ul>

			<div aria-hidden="true" className="flex gap-1 px-2.5 pb-2.5 md:hidden">
				{listed.map((tool) => (
					<span
						className="relative size-9 overflow-hidden rounded-[3px] bg-well"
						key={tool.id}
					>
						{tool.primaryImage && (
							<Image
								alt=""
								className={cn(
									"object-contain p-0.5 mix-blend-multiply",
									!tool.inStock && "opacity-45 grayscale"
								)}
								fill
								sizes="36px"
								src={tool.primaryImage.url}
							/>
						)}
					</span>
				))}
			</div>

			<div
				className={cn(
					"px-4 pt-3 pb-4 max-md:hidden",
					short.narrow ? "md:hidden" : "md:block",
					short.wide ? "xl:hidden" : "xl:block"
				)}
			>
				<EmachLinkButton full href={service.href} variant="line">
					{seeAllLabel(service)}
					<ChevronRight aria-hidden="true" className="size-5" />
				</EmachLinkButton>
			</div>
		</article>
	);
}

/** "Qual é a sua obra hoje?": um cartão por ofício, com o que a loja tem para ele. */
export function ServicePicker({ services }: { services: ServiceSummary[] }) {
	return (
		<section
			aria-labelledby="obra-titulo"
			className="py-7 pb-9 md:pt-12 md:pb-14"
		>
			<div className="shop-wrap">
				<div className="mb-4 grid gap-2 md:mb-[26px] lg:grid-cols-[minmax(0,1fr)_minmax(0,420px)] lg:items-end lg:gap-8">
					<h2
						className="font-display font-extrabold text-[2.85rem] uppercase leading-[0.92] md:text-[clamp(2.7rem,1.4rem+3.6vw,4.6rem)]"
						id="obra-titulo"
					>
						Qual é a sua obra hoje?
					</h2>
					<p className="text-[15px] text-ink-2 leading-normal md:pb-1.5 md:text-[17px]">
						Escolha o serviço e veja só as ferramentas e os acessórios da loja
						que servem para ele, com preço e estoque de hoje.
					</p>
				</div>
				<div className="grid grid-cols-2 gap-2.5 md:gap-4 xl:grid-cols-4">
					{services.map((service, index) => (
						<ServiceCard
							key={service.slug}
							service={service}
							short={shortIn(services, index)}
						/>
					))}
				</div>
			</div>
		</section>
	);
}
