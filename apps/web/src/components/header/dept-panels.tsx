"use client";

import { cn } from "@emach/ui/lib/utils";
import { ArrowRight } from "lucide-react";
import type { Route } from "next";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { CountChip } from "@/components/count-chip";
import { ProductImage } from "@/components/product-image";
import { fmtBRL } from "@/lib/format";
import type { NavProduct } from "@/lib/nav-preview";
import type { NavService } from "@/lib/store-nav";

/** Ofício ou categoria, como a barra e os painéis mostram. */
export interface DeptItem {
	href: Route;
	image: { isProduct: boolean; src: string } | null;
	kind: "category" | "service";
	/** Rótulo curto da barra ("À bateria" no lugar de "Ferramentas à bateria"). */
	label: string;
	name: string;
	productCount: number;
	slug: string;
}

export function plural(n: number, one: string, many: string) {
	return `${n} ${n === 1 ? one : many}`;
}

export function seeAllLabel(count: number) {
	return count === 1 ? "Ver o produto" : `Ver os ${count} produtos`;
}

/** A mesma frase de estoque da home: "4 produtos, 3 em estoque · a partir de R$ 28,82". */
export function serviceStockLine(s: NavService) {
	const base = `${plural(s.productCount, "produto", "produtos")}, ${s.inStockCount} em estoque`;

	return s.fromPriceCents === null
		? base
		: `${base} · a partir de ${fmtBRL(s.fromPriceCents)}`;
}

const SPAN = ["", "col-span-1", "col-span-2", "col-span-3", "col-span-4"];

const seeAllLinkClass =
	"inline-flex items-center gap-1.5 font-semibold text-[15px] text-ink no-underline hover:underline";

function DeptPhoto({
	className,
	image,
	sizes,
}: {
	className?: string;
	image: DeptItem["image"];
	sizes: string;
}) {
	return (
		<span
			className={cn(
				"relative block overflow-hidden rounded-[5px] bg-well",
				className
			)}
		>
			{image && (
				<Image
					alt=""
					className={image.isProduct ? "object-contain p-4" : "object-cover"}
					fill
					sizes={sizes}
					src={image.src}
				/>
			)}
		</span>
	);
}

function MiniCard({
	onNavigate,
	product,
}: {
	onNavigate: () => void;
	product: NavProduct;
}) {
	return (
		<Link
			className="flex h-full items-start gap-3 rounded-[5px] border border-line p-2.5 text-ink no-underline transition-colors hover:border-line-strong"
			href={`/product/${product.slug}`}
			onClick={onNavigate}
		>
			<span className="relative size-16 shrink-0 overflow-hidden rounded-[3px] bg-well">
				<ProductImage
					categorySlug={product.categorySlug}
					sizes="64px"
					src={product.imageSrc ?? undefined}
				/>
			</span>
			<span className="flex min-w-0 flex-col gap-1">
				<span className="line-clamp-2 text-[14px] leading-snug">
					{product.name}
				</span>
				<span className="font-semibold text-[15px] tabular-nums">
					{fmtBRL(product.priceCents)}
				</span>
			</span>
		</Link>
	);
}

/** Painel de um ofício ou categoria, aberto pelo hover do link na barra. */
export function ItemPanel({
	item,
	onNavigate,
	products,
}: {
	item: DeptItem;
	onNavigate: () => void;
	products: NavProduct[];
}) {
	const gap = 4 - products.length;

	return (
		<div className="shop-wrap flex gap-8 pt-6 pb-7" data-panel="item">
			{item.kind === "service" && (
				<DeptPhoto
					className="aspect-[4/3] w-[260px] shrink-0 self-start"
					image={item.image}
					sizes="260px"
				/>
			)}
			<div className="flex min-w-0 flex-1 flex-col gap-4">
				<div className="flex items-center gap-3">
					<h2 className="font-display font-extrabold text-[32px] text-ink uppercase leading-none">
						{item.name}
					</h2>
					<CountChip className="text-[13px]">
						{plural(item.productCount, "produto", "produtos")}
					</CountChip>
				</div>
				<ul className="grid grid-cols-4 gap-3">
					{products.map((p) => (
						<li key={p.id}>
							<MiniCard onNavigate={onNavigate} product={p} />
						</li>
					))}
					{gap > 0 && (
						<li className={SPAN[gap]}>
							<Link
								className="flex h-full min-h-[86px] items-center justify-between gap-3 rounded-[5px] bg-canteiro px-4 font-semibold text-[15px] text-ink no-underline hover:underline"
								href={item.href}
								onClick={onNavigate}
							>
								{seeAllLabel(item.productCount)}
								<ArrowRight aria-hidden="true" className="size-5 shrink-0" />
							</Link>
						</li>
					)}
				</ul>
				{gap <= 0 && (
					<Link
						className={seeAllLinkClass}
						href={item.href}
						onClick={onNavigate}
					>
						{seeAllLabel(item.productCount)}
						<ArrowRight aria-hidden="true" className="size-4" />
					</Link>
				)}
			</div>
		</div>
	);
}

function moveFocus(list: HTMLElement, step: 1 | -1) {
	const links = [...list.querySelectorAll<HTMLAnchorElement>("a[data-office]")];
	const active = document.activeElement;
	const at = active instanceof HTMLAnchorElement ? links.indexOf(active) : -1;
	const next = links[(at + step + links.length) % links.length];
	next?.focus();
}

/** Painel do botão "Departamentos" (C4): os ofícios em lista e o quadro com a foto. */
export function IndexPanel({
	items,
	onNavigate,
	services,
	totalProducts,
}: {
	items: DeptItem[];
	onNavigate: () => void;
	services: NavService[];
	totalProducts: number;
}) {
	const offices = items.filter((i) => i.kind === "service");
	const [shown, setShown] = useState(offices[0]?.slug ?? null);
	const [pointing, setPointing] = useState<string | null>(null);
	const frame = offices.find((o) => o.slug === shown) ?? offices[0];
	const twoColumns = offices.length > 6;

	const point = (slug: string | null) => {
		setPointing(slug);

		if (slug) {
			setShown(slug);
		}
	};

	return (
		<div data-panel="index">
			{frame && (
				<div className="shop-wrap grid grid-cols-[minmax(0,3fr)_minmax(0,2fr)] gap-10 pt-7 pb-8">
					{/* biome-ignore lint/a11y/noNoninteractiveElementInteractions: a lista só delega as setas entre os links dos ofícios */}
					<ul
						className={cn(
							"grid content-start gap-x-10 gap-y-5",
							twoColumns && "grid-flow-col grid-cols-2"
						)}
						onKeyDown={(e) => {
							if (e.key === "ArrowDown" || e.key === "ArrowUp") {
								e.preventDefault();
								moveFocus(e.currentTarget, e.key === "ArrowDown" ? 1 : -1);
							}
						}}
						style={
							twoColumns
								? {
										gridTemplateRows: `repeat(${Math.ceil(offices.length / 2)}, auto)`,
									}
								: undefined
						}
					>
						{offices.map((o) => {
							const service = services.find((s) => s.slug === o.slug);

							return (
								<li key={o.slug}>
									<Link
										className={cn(
											"group block text-ink no-underline transition-colors duration-150",
											pointing !== null &&
												pointing !== o.slug &&
												"text-ink-muted"
										)}
										data-office=""
										href={o.href}
										onBlur={() => point(null)}
										onClick={onNavigate}
										onFocus={() => point(o.slug)}
										onPointerEnter={() => point(o.slug)}
										onPointerLeave={() => point(null)}
									>
										<span className="block font-display font-extrabold text-[40px] uppercase leading-[0.95]">
											{o.name}
										</span>
										{service && (
											<span className="mt-1 block text-[13px] text-ink-muted tabular-nums">
												{serviceStockLine(service)}
											</span>
										)}
									</Link>
								</li>
							);
						})}
					</ul>
					<div className="flex flex-col gap-3">
						<DeptPhoto
							className="min-h-[240px] flex-1"
							image={frame.image}
							sizes="(min-width: 1296px) 480px, 38vw"
						/>
						<div className="flex items-baseline justify-between gap-4">
							<span className="font-semibold text-[17px] text-ink">
								{frame.name}
							</span>
							<Link
								className={seeAllLinkClass}
								href={frame.href}
								onClick={onNavigate}
							>
								{seeAllLabel(frame.productCount)}
								<ArrowRight aria-hidden="true" className="size-4" />
							</Link>
						</div>
					</div>
				</div>
			)}
			<div className="bg-canteiro">
				<div className="shop-wrap flex min-h-12 items-center justify-between gap-4 text-[14px]">
					<span className="text-ink-2 tabular-nums">
						{plural(totalProducts, "produto", "produtos")}
					</span>
					<Link
						className={seeAllLinkClass}
						href="/catalog"
						onClick={onNavigate}
					>
						Ver catálogo completo
						<ArrowRight aria-hidden="true" className="size-4" />
					</Link>
				</div>
			</div>
		</div>
	);
}
