"use client";

import { cn } from "@emach/ui/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Route } from "next";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";

import { CountChip } from "@/components/count-chip";
import { nextAutoScroll } from "@/lib/shelf-rows";

interface ShelfProps {
	/** Intervalo do avanço automático quando há card fora da vista. */
	autoAdvanceMs: number;
	/** Cards já renderizados no servidor, um por item. */
	children: React.ReactNode;
	href: Route;
	imageSrc: string | null;
	inStockCount: number | null;
	itemCount: number;
	/** `half`: divide a linha com outra prateleira curta a partir do `xl`. */
	layout: "half" | "row";
	productCount: number;
	title: string;
}

function productsLabel(n: number) {
	return n === 1 ? "Ver o produto" : `Ver os ${n} produtos`;
}

// Quantos produtos a capa enxerga para calcular quantas colunas ela ocupa;
// de 4 em diante ela fica com uma coluna em qualquer largura.
function itemCountClass(n: number) {
	if (n === 1) {
		return "[--n:1]";
	}

	if (n === 2) {
		return "[--n:2]";
	}

	return n === 3 ? "[--n:3]" : "[--n:4]";
}

const arrowClass =
	"grid size-11 cursor-pointer place-items-center rounded-[3px] border-[1.5px] border-line-strong bg-paper hover:enabled:border-ink disabled:cursor-default disabled:opacity-35 max-md:hidden";

/**
 * Prateleira horizontal: título que leva à lista completa, setas no desktop,
 * arraste no celular e uma capa com a foto do ofício. A capa abre o trilho à
 * esquerda e ocupa as colunas que os produtos deixam livres, então a linha
 * fecha com qualquer número de produtos. No celular e na metade de um par, a
 * foto vira uma faixa acima dos cards. Com card fora da vista, o trilho anda
 * sozinho até alguém mexer nele.
 */
export function Shelf({
	autoAdvanceMs,
	children,
	href,
	imageSrc,
	inStockCount,
	itemCount,
	layout,
	productCount,
	title,
}: ShelfProps) {
	const titleId = useId();
	const sectionRef = useRef<HTMLElement>(null);
	const trackRef = useRef<HTMLDivElement>(null);
	const capaRef = useRef<HTMLAnchorElement>(null);
	const stoppedRef = useRef(false);

	// Nasce em `atStart` para a capa não sair do SSR com a sombra de "rolou".
	const [edges, setEdges] = useState({
		atEnd: true,
		atStart: true,
		fits: false,
	});

	const half = layout === "half";
	// A metade de um par com um produto só mantém a capa ao lado do card.
	const bandOnWide = half && itemCount > 1;
	const label = productsLabel(Math.max(productCount, itemCount));

	function measure() {
		const track = trackRef.current;

		if (!track) {
			return;
		}

		const max = track.scrollWidth - track.clientWidth;
		setEdges({
			atEnd: track.scrollLeft >= max - 2,
			atStart: track.scrollLeft <= 2,
			fits: max <= 2,
		});
	}

	// biome-ignore lint/correctness/useExhaustiveDependencies: mede uma vez e a cada resize; measure só lê o ref
	useEffect(() => {
		measure();
		window.addEventListener("resize", measure);

		return () => window.removeEventListener("resize", measure);
	}, []);

	useEffect(() => {
		const section = sectionRef.current;
		const track = trackRef.current;

		if (
			!(section && track) ||
			window.matchMedia("(prefers-reduced-motion: reduce)").matches
		) {
			return;
		}

		let visible = false;
		let hovered = false;

		const observer = new IntersectionObserver(
			([entry]) => {
				visible = entry?.isIntersecting ?? false;
			},
			{ threshold: 0.6 }
		);

		observer.observe(track);

		const stop = () => {
			stoppedRef.current = true;
		};

		const enter = () => {
			hovered = true;
		};

		const leave = () => {
			hovered = false;
		};

		const userEvents = ["pointerdown", "wheel", "touchstart", "keydown"];

		for (const name of userEvents) {
			track.addEventListener(name, stop, { passive: true });
		}

		section.addEventListener("pointerenter", enter);
		section.addEventListener("pointerleave", leave);

		const timer = window.setInterval(() => {
			if (
				stoppedRef.current ||
				hovered ||
				!visible ||
				document.hidden ||
				section.contains(document.activeElement)
			) {
				return;
			}

			const max = track.scrollWidth - track.clientWidth;
			const card = track.lastElementChild;

			if (max <= 2 || !(card instanceof HTMLElement)) {
				return;
			}

			const gap = Number.parseFloat(getComputedStyle(track).columnGap) || 0;
			track.scrollTo({
				left: nextAutoScroll(track.scrollLeft, max, card.offsetWidth + gap),
				behavior: "smooth",
			});
		}, autoAdvanceMs);

		return () => {
			window.clearInterval(timer);
			observer.disconnect();

			for (const name of userEvents) {
				track.removeEventListener(name, stop);
			}

			section.removeEventListener("pointerenter", enter);
			section.removeEventListener("pointerleave", leave);
		};
	}, [autoAdvanceMs]);

	function page(direction: 1 | -1) {
		const track = trackRef.current;

		if (!track) {
			return;
		}

		stoppedRef.current = true;
		const capaWidth = capaRef.current?.offsetWidth ?? 0;

		const reduce = window.matchMedia(
			"(prefers-reduced-motion: reduce)"
		).matches;

		track.scrollBy({
			left: direction * (track.clientWidth - capaWidth),
			behavior: reduce ? "auto" : "smooth",
		});
	}

	return (
		<section
			aria-labelledby={titleId}
			className="flex min-w-0 flex-col"
			ref={sectionRef}
		>
			<div className="mb-5 flex items-end justify-between gap-x-5 gap-y-2 max-md:mb-3 max-md:items-start">
				<div>
					<h3
						className="font-display font-extrabold text-[clamp(1.55rem,1.15rem+1vw,2.1rem)] uppercase leading-[0.98]"
						id={titleId}
					>
						<Link
							className="text-ink no-underline decoration-2 hover:underline"
							href={href}
						>
							{title}
						</Link>
					</h3>
					<CountChip className="mt-2">
						{productCount} {productCount === 1 ? "produto" : "produtos"}
						{inStockCount !== null && `, ${inStockCount} em estoque`}
					</CountChip>
				</div>
				{!edges.fits && (
					<div className="flex shrink-0 items-center gap-2 max-md:hidden">
						<button
							aria-label={`Anteriores em ${title}`}
							className={arrowClass}
							disabled={edges.atStart}
							onClick={() => page(-1)}
							type="button"
						>
							<ChevronLeft aria-hidden="true" className="size-5" />
						</button>
						<button
							aria-label={`Próximos em ${title}`}
							className={arrowClass}
							disabled={edges.atEnd}
							onClick={() => page(1)}
							type="button"
						>
							<ChevronRight aria-hidden="true" className="size-5" />
						</button>
					</div>
				)}
			</div>
			<Link
				className={cn(
					"group relative mb-3 flex min-h-28 items-end justify-end overflow-hidden rounded-[5px] bg-grafite text-white no-underline md:hidden",
					bandOnWide && "xl:mb-4 xl:flex xl:min-h-[150px]"
				)}
				href={href}
			>
				{imageSrc && (
					<Image
						alt=""
						className="object-cover opacity-55 transition-opacity duration-300 ease-out group-hover:opacity-45 motion-reduce:transition-none"
						fill
						sizes="(min-width: 1296px) 640px, 100vw"
						src={imageSrc}
					/>
				)}
				<span className="relative z-[1] inline-flex items-center gap-1.5 p-4 font-semibold text-[14px] md:p-5 md:text-[15px]">
					{label}
					<ChevronRight aria-hidden="true" className="size-5" />
				</span>
			</Link>
			<div
				className={cn(
					"-mx-4 flex snap-x snap-mandatory scroll-px-4 gap-2.5 overflow-x-auto overscroll-x-contain px-4 pt-0.5 pb-1.5 [--shelf-col:62%] [--span:max(1,calc(var(--cols)_-_var(--n)))] [scrollbar-width:none] md:mx-0 md:scroll-px-0 md:scroll-pl-[calc(var(--shelf-col)_+_16px)] md:gap-4 md:px-0 md:[--cols:2.4] md:[--shelf-capa:calc(var(--shelf-col)_*_var(--span)_+_16px_*_(var(--span)_-_1))] md:[--shelf-col:calc((100%_-_22.4px)/2.4)] [&::-webkit-scrollbar]:hidden [&>*]:min-w-0 [&>*]:shrink-0 [&>*]:basis-(--shelf-col) [&>*]:snap-start",
					"lg:[--cols:3] lg:[--shelf-col:calc((100%_-_32px)/3)] xl:[--cols:4] xl:[--shelf-col:calc((100%_-_48px)/4)]",
					half &&
						"xl:flex-1 xl:[--cols:2] xl:[--shelf-col:calc((100%_-_16px)/2)]",
					itemCountClass(itemCount)
				)}
				onScroll={measure}
				ref={trackRef}
			>
				<Link
					className={cn(
						"group @container sticky left-0 z-[2] flex min-h-full items-end overflow-hidden rounded-[5px] bg-grafite text-white no-underline transition-shadow duration-300 ease-out-expo max-md:hidden",
						bandOnWide && "xl:hidden",
						!(edges.fits || edges.atStart) &&
							"shadow-[10px_0_18px_-6px_rgb(22_25_29/0.38)]"
					)}
					href={href}
					ref={capaRef}
					style={{ flexBasis: "var(--shelf-capa)", scrollSnapAlign: "none" }}
				>
					{imageSrc && (
						<Image
							alt=""
							className="object-cover opacity-55 transition-opacity duration-300 ease-out group-hover:opacity-45 motion-reduce:transition-none"
							fill
							sizes="(min-width: 1296px) 640px, 50vw"
							src={imageSrc}
						/>
					)}
					<span className="relative z-[1] grid gap-2.5 @[420px]:p-7 p-5">
						<b className="font-display font-extrabold @[420px]:text-[46px] text-[30px] uppercase leading-[0.95]">
							{title}
						</b>
						<span className="inline-flex items-center gap-1.5 font-semibold text-[15px]">
							{label}
							<ChevronRight aria-hidden="true" className="size-5" />
						</span>
					</span>
				</Link>
				{children}
			</div>
		</section>
	);
}
