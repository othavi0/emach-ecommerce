"use client";

import { cn } from "@emach/ui/lib/utils";
import { ChevronDown, Menu } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense, useEffect, useLayoutEffect, useRef, useState } from "react";

import {
	type DeptItem,
	IndexPanel,
	ItemPanel,
} from "@/components/header/dept-panels";
import { fitLinks } from "@/components/header/fit-links";
import { navShortLabel } from "@/lib/nav-label";
import type { NavPreviews } from "@/lib/nav-preview";
import type { StoreNav } from "@/lib/store-nav";

/** Intenção antes de abrir o painel pelo hover, e folga antes de fechar. */
const OPEN_DELAY_MS = 150;
const CLOSE_DELAY_MS = 220;

type Open =
	| { kind: "none" }
	| { kind: "index" }
	| { kind: "more" }
	| { kind: "item"; slug: string };

const CLOSED: Open = { kind: "none" };

const linkClass =
	"inline-flex min-h-[50px] shrink-0 items-center whitespace-nowrap px-2 text-[14px] text-ink-2 no-underline transition-colors duration-150 ease-out hover:text-ink focus-visible:text-ink focus-visible:outline-2 focus-visible:outline-ink focus-visible:-outline-offset-2 aria-[current=page]:font-semibold aria-[current=page]:text-ink xl:px-[11px] xl:text-[15px]";

const separatorClass = "mx-2.5 h-[22px] w-px shrink-0 bg-line";

const panelClass =
	"absolute inset-x-0 top-full animate-in fade-in-0 slide-in-from-top-[6px] border-line border-b bg-paper shadow-[0_22px_30px_-22px_rgba(22,25,29,0.45)] duration-[260ms] ease-out-expo motion-reduce:animate-none";

export function deptItems(nav: StoreNav): DeptItem[] {
	return [
		...nav.services.map(
			(s): DeptItem => ({
				href: s.href,
				image: s.imageSrc
					? { isProduct: s.imageIsProduct, src: s.imageSrc }
					: null,
				kind: "service",
				label: s.name,
				name: s.name,
				productCount: s.productCount,
				slug: s.slug,
			})
		),
		...nav.categories
			.filter((c) => c.productCount > 0)
			.map(
				(c): DeptItem => ({
					href: c.href,
					image: null,
					kind: "category",
					label: navShortLabel(c.name),
					name: c.name,
					productCount: c.productCount,
					slug: c.slug,
				})
			),
	];
}

function MoreList({
	items,
	onNavigate,
}: {
	items: DeptItem[];
	onNavigate: () => void;
}) {
	const groups = [
		{ title: "Por serviço", items: items.filter((i) => i.kind === "service") },
		{
			title: "Por categoria",
			items: items.filter((i) => i.kind === "category"),
		},
	].filter((g) => g.items.length > 0);

	return (
		<div
			className="fade-in-0 slide-in-from-top-[6px] absolute top-full right-0 z-10 mt-px flex w-72 animate-in flex-col gap-3 rounded-[5px] border border-line bg-paper p-3 shadow-pop duration-[260ms] ease-out-expo motion-reduce:animate-none"
			id="dept-more"
		>
			{groups.map((g) => (
				<div key={g.title}>
					<p className="px-2 pb-1 text-[13px] text-ink-muted">{g.title}</p>
					<ul>
						{g.items.map((i) => (
							<li key={i.slug}>
								<Link
									className="flex min-h-10 items-center justify-between gap-3 rounded-[3px] px-2 text-[14px] text-ink no-underline hover:bg-canteiro"
									href={i.href}
									onClick={onNavigate}
								>
									{i.name}
									<span className="text-[13px] text-ink-muted tabular-nums">
										{i.productCount}
									</span>
								</Link>
							</li>
						))}
					</ul>
				</div>
			))}
		</div>
	);
}

/** Posição do indicador: `translateX` e `scaleX` sobre uma barra de 1 px. */
function useIndicator(
	row: React.RefObject<HTMLDivElement | null>,
	bar: React.RefObject<HTMLSpanElement | null>,
	target: string | null,
	visible: number
) {
	const placed = useRef(false);

	// biome-ignore lint/correctness/useExhaustiveDependencies: `visible` muda as posições dos links sem mudar o alvo.
	useLayoutEffect(() => {
		const el = bar.current;

		const link = target
			? row.current?.querySelector<HTMLElement>(`[data-slug="${target}"]`)
			: null;

		if (!el) {
			return;
		}

		if (!link) {
			el.style.opacity = "0";

			return;
		}

		const inset = Number.parseFloat(getComputedStyle(link).paddingLeft) || 0;
		const x = link.offsetLeft + inset;
		const w = Math.max(link.offsetWidth - inset * 2, 1);

		// Primeira posição sem transição, senão o indicador desliza da borda.
		if (!placed.current) {
			el.style.transition = "none";
		}

		el.style.transform = `translateX(${x}px) scaleX(${w})`;
		el.style.opacity = "1";

		if (!placed.current) {
			el.getBoundingClientRect();
			el.style.transition = "";
			placed.current = true;
		}
	}, [bar, row, target, visible]);
}

/**
 * Da borda esquerda da linha até a borda útil do contêiner. O botão "Mais" fica
 * fora da linha: medir só a linha descontaria a largura dele duas vezes.
 */
function availableWidth(row: HTMLElement): number {
	const box = row.parentElement;

	if (!box) {
		return row.clientWidth;
	}

	const right =
		box.getBoundingClientRect().right -
		Number.parseFloat(getComputedStyle(box).paddingRight);

	return right - row.getBoundingClientRect().left;
}

/** Quantos links cabem na linha; o resto vai para o "Mais". */
function useFit(
	row: React.RefObject<HTMLDivElement | null>,
	ghost: React.RefObject<HTMLDivElement | null>,
	total: number,
	groupSize: number
) {
	const [visible, setVisible] = useState(total);

	useEffect(() => {
		const rowEl = row.current;
		const ghostEl = ghost.current;

		if (!(rowEl && ghostEl)) {
			return;
		}

		const measure = () => {
			const widths = [
				...ghostEl.querySelectorAll<HTMLElement>("[data-ghost=link]"),
			].map((el) => el.offsetWidth);

			const sep = ghostEl.querySelector<HTMLElement>("[data-ghost=sep]");
			const more = ghostEl.querySelector<HTMLElement>("[data-ghost=more]");
			const sepStyle = sep ? getComputedStyle(sep) : null;

			setVisible(
				fitLinks({
					available: availableWidth(rowEl),
					groupSize,
					moreWidth: more?.offsetWidth ?? 0,
					separatorWidth: sep
						? sep.offsetWidth +
							Number.parseFloat(sepStyle?.marginLeft ?? "0") +
							Number.parseFloat(sepStyle?.marginRight ?? "0")
						: 0,
					widths,
				})
			);
		};

		measure();
		const observer = new ResizeObserver(measure);
		observer.observe(rowEl.parentElement ?? rowEl);
		observer.observe(ghostEl);

		return () => observer.disconnect();
	}, [ghost, row, groupSize]);

	return Math.min(visible, total);
}

function DeptBar({
	current,
	nav,
	previews,
}: {
	current: string | null;
	nav: StoreNav;
	previews: NavPreviews;
}) {
	const items = deptItems(nav);
	const groupSize = items.filter((i) => i.kind === "service").length;
	const hasGroups = groupSize > 0 && groupSize < items.length;

	const [open, setOpen] = useState<Open>(CLOSED);
	const [hover, setHover] = useState<string | null>(null);
	const rootRef = useRef<HTMLElement>(null);
	const rowRef = useRef<HTMLDivElement>(null);
	const ghostRef = useRef<HTMLDivElement>(null);
	const barRef = useRef<HTMLSpanElement>(null);
	const indexButtonRef = useRef<HTMLButtonElement>(null);
	const moreButtonRef = useRef<HTMLButtonElement>(null);
	const panelRef = useRef<HTMLDivElement>(null);
	const openTimer = useRef<number | undefined>(undefined);
	const closeTimer = useRef<number | undefined>(undefined);
	const focusPanel = useRef(false);

	const visible = useFit(
		rowRef,
		ghostRef,
		items.length,
		hasGroups ? groupSize : 0
	);

	const shown = items.slice(0, visible);
	const overflow = items.slice(visible);

	const currentSlug = items.find((i) => i.href === current)?.slug ?? null;
	const openItem = open.kind === "item" ? open.slug : null;
	useIndicator(rowRef, barRef, openItem ?? hover ?? currentSlug, visible);

	const clearTimers = () => {
		window.clearTimeout(openTimer.current);
		window.clearTimeout(closeTimer.current);
	};

	const close = () => {
		clearTimers();
		setOpen(CLOSED);
	};

	useEffect(
		() => () => {
			window.clearTimeout(openTimer.current);
			window.clearTimeout(closeTimer.current);
		},
		[]
	);

	// Navegação concluída fecha qualquer painel aberto.
	// biome-ignore lint/correctness/useExhaustiveDependencies: dispara só na troca de rota.
	useEffect(() => {
		setOpen(CLOSED);
	}, [current]);

	useEffect(() => {
		if (focusPanel.current && open.kind !== "none") {
			focusPanel.current = false;
			panelRef.current
				?.querySelector<HTMLElement>("a")
				?.focus({ preventScroll: true });
		}
	}, [open]);

	useEffect(() => {
		if (open.kind === "none") {
			return;
		}

		const onPointer = (e: PointerEvent) => {
			if (!(e.target instanceof Node && rootRef.current?.contains(e.target))) {
				setOpen(CLOSED);
			}
		};

		const onKey = (e: KeyboardEvent) => {
			if (e.key !== "Escape") {
				return;
			}

			const focusInside = rootRef.current?.contains(document.activeElement);
			setOpen(CLOSED);

			if (!focusInside) {
				return;
			}

			if (open.kind === "index") {
				indexButtonRef.current?.focus();
			} else if (open.kind === "more") {
				moreButtonRef.current?.focus();
			} else {
				rowRef.current
					?.querySelector<HTMLElement>(`[data-slug="${open.slug}"]`)
					?.focus();
			}
		};

		document.addEventListener("pointerdown", onPointer);
		document.addEventListener("keydown", onKey);

		return () => {
			document.removeEventListener("pointerdown", onPointer);
			document.removeEventListener("keydown", onKey);
		};
	}, [open]);

	const hoverLink = (slug: string) => {
		setHover(slug);
		clearTimers();

		if (open.kind === "item") {
			setOpen({ kind: "item", slug });
		} else if (open.kind === "none") {
			openTimer.current = window.setTimeout(
				() => setOpen({ kind: "item", slug }),
				OPEN_DELAY_MS
			);
		}
	};

	const leaveNav = () => {
		window.clearTimeout(openTimer.current);
		setHover(null);

		if (open.kind === "item") {
			closeTimer.current = window.setTimeout(close, CLOSE_DELAY_MS);
		}
	};

	const item = openItem ? items.find((i) => i.slug === openItem) : undefined;
	const totalProducts = nav.categories.reduce((n, c) => n + c.productCount, 0);

	return (
		// biome-ignore lint/a11y/noNoninteractiveElementInteractions: o hover e o blur só cronometram o painel; links e botões seguem acessíveis pelo teclado.
		<nav
			aria-label="Departamentos"
			className="relative z-20 border-line border-b bg-paper max-lg:hidden"
			onBlur={(e) => {
				if (
					!(
						e.relatedTarget instanceof Node &&
						e.currentTarget.contains(e.relatedTarget)
					) &&
					e.relatedTarget !== null
				) {
					close();
				}
			}}
			onPointerEnter={() => window.clearTimeout(closeTimer.current)}
			onPointerLeave={leaveNav}
			ref={rootRef}
		>
			<div className="shop-wrap flex min-h-[50px] items-center">
				<button
					aria-controls="dept-panel"
					aria-expanded={open.kind === "index"}
					className="mr-2.5 inline-flex min-h-[50px] shrink-0 cursor-pointer items-center gap-2 border-line border-r pr-4 font-semibold text-[15px] text-ink"
					onClick={(e) => {
						clearTimers();
						focusPanel.current = e.detail === 0;
						setOpen((o) => (o.kind === "index" ? CLOSED : { kind: "index" }));
					}}
					ref={indexButtonRef}
					type="button"
				>
					<Menu aria-hidden="true" className="size-5" />
					Departamentos
					<ChevronDown
						aria-hidden="true"
						className={cn(
							"size-4 transition-transform duration-200 ease-out-expo motion-reduce:transition-none",
							open.kind === "index" && "rotate-180"
						)}
					/>
				</button>

				<div
					className="relative flex min-w-0 flex-1 items-center overflow-hidden"
					ref={rowRef}
				>
					{shown.map((i, n) => (
						<span className="contents" key={i.slug}>
							{hasGroups && n === groupSize && (
								<span aria-hidden="true" className={separatorClass} />
							)}
							<Link
								aria-controls={openItem === i.slug ? "dept-panel" : undefined}
								aria-current={i.slug === currentSlug ? "page" : undefined}
								aria-expanded={openItem === i.slug}
								className={linkClass}
								data-slug={i.slug}
								href={i.href}
								onClick={close}
								onFocus={() => setHover(i.slug)}
								onKeyDown={(e) => {
									if (e.key === "ArrowDown") {
										e.preventDefault();
										clearTimers();
										focusPanel.current = true;
										setOpen({ kind: "item", slug: i.slug });
									}
								}}
								onPointerEnter={() => hoverLink(i.slug)}
								onPointerLeave={() => {
									window.clearTimeout(openTimer.current);
									setHover(null);
								}}
							>
								{i.label}
							</Link>
						</span>
					))}
					<span
						aria-hidden="true"
						className="pointer-events-none absolute bottom-0 left-0 h-0.5 w-px origin-left bg-ink opacity-0 transition-[transform,opacity] duration-[260ms] ease-out-expo motion-reduce:transition-none"
						ref={barRef}
					/>
				</div>

				{overflow.length > 0 && (
					<div className="relative shrink-0">
						<button
							aria-controls="dept-more"
							aria-expanded={open.kind === "more"}
							className="inline-flex min-h-[50px] cursor-pointer items-center gap-1 px-2 text-[14px] text-ink-2 hover:text-ink xl:text-[15px]"
							onClick={() => {
								clearTimers();
								setOpen((o) => (o.kind === "more" ? CLOSED : { kind: "more" }));
							}}
							ref={moreButtonRef}
							type="button"
						>
							Mais
							<ChevronDown aria-hidden="true" className="size-4" />
						</button>
						{open.kind === "more" && (
							<MoreList items={overflow} onNavigate={close} />
						)}
					</div>
				)}

				{/* Réplica invisível dos links: mede a largura de cada um, inclusive os que estão no "Mais". */}
				<div
					aria-hidden="true"
					className="invisible absolute top-0 left-0 flex h-0 overflow-hidden"
					ref={ghostRef}
				>
					{items.map((i) => (
						<span
							className={cn(
								linkClass,
								i.slug === currentSlug && "font-semibold"
							)}
							data-ghost="link"
							key={i.slug}
						>
							{i.label}
						</span>
					))}
					<span className={separatorClass} data-ghost="sep" />
					<span
						className="inline-flex shrink-0 items-center gap-1 px-2 text-[14px] xl:text-[15px]"
						data-ghost="more"
					>
						Mais
						<ChevronDown className="size-4" />
					</span>
				</div>
			</div>

			{(open.kind === "index" || item) && (
				<div className={panelClass} id="dept-panel" ref={panelRef}>
					{open.kind === "index" ? (
						<IndexPanel
							items={items}
							onNavigate={close}
							services={nav.services}
							totalProducts={totalProducts}
						/>
					) : (
						item && (
							<ItemPanel
								item={item}
								onNavigate={close}
								products={previews[item.slug] ?? []}
							/>
						)
					)}
				</div>
			)}
		</nav>
	);
}

function CurrentDeptBar(props: { nav: StoreNav; previews: NavPreviews }) {
	return <DeptBar current={usePathname()} {...props} />;
}

/** Navegação por serviço e por categoria (desktop). No mobile vive no menu. */
export function DeptNav({
	nav,
	previews,
}: {
	nav: StoreNav;
	previews: NavPreviews;
}) {
	return (
		// Em rota dinâmica o pathname só existe no request: fora de Suspense o
		// usePathname derruba o prerender do build.
		<Suspense
			fallback={<DeptBar current={null} nav={nav} previews={previews} />}
		>
			<CurrentDeptBar nav={nav} previews={previews} />
		</Suspense>
	);
}
