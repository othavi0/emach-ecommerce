"use client";

import { cn } from "@emach/ui/lib/utils";
import { ArrowRight, LogOut, MapPin, Truck, User, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { ContactLink } from "@/components/contact-link";
import {
	branchPlace,
	branchSummary,
	StatusText,
	useStoreClock,
} from "@/components/header/branch-strip";
import { MenuAccordionItem } from "@/components/header/menu-accordion";
import {
	MENU_TABS,
	type MenuTab,
	menuEntries,
} from "@/components/header/menu-entries";
import { useSession } from "@/lib/auth-client";
import type { HeaderBranch } from "@/lib/branches";
import type { NavPreviews } from "@/lib/nav-preview";
import { loginHref } from "@/lib/safe-redirect";
import type { StoreNav } from "@/lib/store-nav";
import { useOverlay } from "@/lib/use-overlay";
import { useSignOut } from "@/lib/use-sign-out";

interface MobileMenuProps {
	branches: HeaderBranch[];
	nav: StoreNav;
	onClose: () => void;
	open: boolean;
	previews: NavPreviews;
}

const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";

const footRowClass =
	"flex min-h-11 w-full cursor-pointer items-center gap-3 text-left font-semibold text-[15px] text-ink no-underline";

const footIconClass = "size-5 shrink-0 text-ink-2";

function prefersReducedMotion() {
	return window.matchMedia(REDUCED_MOTION).matches;
}

/** Rola a lista até o item quando o topo dele ou o fim ficou fora da vista. */
function revealItem(item: HTMLElement) {
	const scroller = item.closest("nav");

	if (!scroller) {
		return;
	}

	const view = scroller.getBoundingClientRect();
	const box = item.getBoundingClientRect();
	let delta = 0;

	if (box.top < view.top) {
		delta = box.top - view.top;
	} else if (box.bottom > view.bottom) {
		delta = Math.min(box.bottom - view.bottom, box.top - view.top);
	}

	if (delta !== 0) {
		scroller.scrollBy({
			behavior: prefersReducedMotion() ? "auto" : "smooth",
			top: delta,
		});
	}
}

function MenuTabs({
	onSelect,
	tab,
}: {
	onSelect: (tab: MenuTab) => void;
	tab: MenuTab;
}) {
	const at = MENU_TABS.findIndex((t) => t.id === tab);

	return (
		<div
			aria-label="Departamentos"
			className="relative mx-4 grid shrink-0 grid-cols-2 rounded-[5px] bg-canteiro p-1"
			onKeyDown={(e) => {
				if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") {
					return;
				}

				e.preventDefault();
				const step = e.key === "ArrowRight" ? 1 : -1;

				const next =
					MENU_TABS[(at + step + MENU_TABS.length) % MENU_TABS.length];

				if (next) {
					onSelect(next.id);
					e.currentTarget
						.querySelector<HTMLElement>(`#menu-tab-${next.id}`)
						?.focus();
				}
			}}
			role="tablist"
		>
			<span
				aria-hidden="true"
				className="absolute inset-y-1 left-1 w-[calc(50%-4px)] rounded-[3px] bg-paper shadow-[0_1px_3px_rgba(22,25,29,0.16)] transition-transform duration-[260ms] ease-out-expo motion-reduce:transition-none"
				style={{ transform: `translateX(${at * 100}%)` }}
			/>
			{MENU_TABS.map((t) => (
				<button
					aria-controls="menu-tabpanel"
					aria-selected={t.id === tab}
					className={cn(
						"relative min-h-11 cursor-pointer rounded-[3px] text-center font-semibold text-[14px] transition-colors duration-[260ms] ease-out-expo",
						t.id === tab ? "text-ink" : "text-ink-2"
					)}
					id={`menu-tab-${t.id}`}
					key={t.id}
					onClick={() => onSelect(t.id)}
					role="tab"
					tabIndex={t.id === tab ? 0 : -1}
					type="button"
				>
					{t.label}
				</button>
			))}
		</div>
	);
}

function MenuFooter({
	branches,
	onClose,
}: {
	branches: HeaderBranch[];
	onClose: () => void;
}) {
	const { data: session } = useSession();
	const pathname = usePathname();
	const signOut = useSignOut();
	const clock = useStoreClock();
	const status = clock ? branchSummary(branches, clock) : null;

	async function handleSignOut() {
		onClose();
		await signOut();
	}

	return (
		<div className="mt-5 grid gap-0.5 bg-canteiro px-4 pt-2.5 pb-[calc(16px+env(safe-area-inset-bottom,0px))]">
			{session?.user ? (
				<>
					<Link className={footRowClass} href="/dashboard" onClick={onClose}>
						<User aria-hidden="true" className={footIconClass} />
						Minha conta
					</Link>
					<button
						className={footRowClass}
						onClick={handleSignOut}
						type="button"
					>
						<LogOut aria-hidden="true" className={footIconClass} />
						Sair
					</button>
				</>
			) : (
				<Link
					className={footRowClass}
					href={loginHref(pathname)}
					onClick={onClose}
				>
					<User aria-hidden="true" className={footIconClass} />
					<span>
						Entrar ou criar conta
						<span className="block font-normal text-[13px] text-ink-muted">
							Pedidos e endereços
						</span>
					</span>
				</Link>
			)}
			<Link className={footRowClass} href="/sobre#filiais" onClick={onClose}>
				<MapPin aria-hidden="true" className={footIconClass} />
				<span>
					{branchPlace(branches)}
					{status && (
						<StatusText
							className="flex font-normal text-[13px] text-ink-muted"
							status={status}
						/>
					)}
				</span>
			</Link>
			<Link className={footRowClass} href="/entrega" onClick={onClose}>
				<Truck aria-hidden="true" className={footIconClass} />
				Entrega e pagamento
			</Link>
			<ContactLink
				className="mt-1.5 flex min-h-11 w-full items-center justify-center gap-2 rounded-[3px] bg-grafite px-4 font-semibold text-[15px] text-on-dark no-underline hover:bg-black"
				iconClassName="size-5"
			/>
		</div>
	);
}

/** Menu do celular em tela cheia (M3): abas, sanfona por item e rodapé. */
export function MobileMenu({
	branches,
	nav,
	open,
	onClose,
	previews,
}: MobileMenuProps) {
	const pathname = usePathname();
	// Esc, focus-trap, scroll-lock e restauração de foco vêm do hook.
	const panelRef = useOverlay(open, onClose);
	const onCloseRef = useRef(onClose);
	onCloseRef.current = onClose;
	// Separado do `open` para o painel ficar montado durante a saída.
	const [mounted, setMounted] = useState(open);
	// Este componente não desmonta com o menu: a aba vale até a página fechar.
	const [tab, setTab] = useState<MenuTab>("service");
	const [expanded, setExpanded] = useState<string | null>(null);

	if (open && !mounted) {
		setMounted(true);
	}

	// Fecha ao navegar (troca de rota). Backstop além do onClick de cada link.
	useEffect(() => {
		if (pathname) {
			onCloseRef.current();
		}
	}, [pathname]);

	// Sem animação de saída não há `animationend` para desmontar.
	useEffect(() => {
		if (!open && mounted && prefersReducedMotion()) {
			setMounted(false);
		}
	}, [open, mounted]);

	if (!mounted) {
		return null;
	}

	const entries = menuEntries(nav, previews)[tab];

	const toggle = (slug: string) => {
		const opening = expanded !== slug;
		setExpanded(opening ? slug : null);

		if (opening && prefersReducedMotion()) {
			requestAnimationFrame(() => {
				const item = panelRef.current?.querySelector<HTMLElement>(
					`[data-acc="${slug}"]`
				);

				if (item) {
					revealItem(item);
				}
			});
		}
	};

	return (
		<div
			aria-label="Menu"
			aria-modal="true"
			className={cn(
				"fixed inset-0 z-[60] flex flex-col bg-paper ease-out-expo motion-reduce:animate-none lg:hidden",
				open
					? "fade-in-0 slide-in-from-bottom-3 animate-in duration-[280ms]"
					: "fade-out-0 slide-out-to-bottom-3 animate-out fill-mode-forwards duration-200"
			)}
			data-state={open ? "open" : "closed"}
			id="mobile-menu"
			onAnimationEnd={(e) => {
				if (!open && e.target === e.currentTarget) {
					setMounted(false);
				}
			}}
			ref={panelRef}
			role="dialog"
		>
			<div className="flex min-h-14 shrink-0 items-center justify-between gap-2 py-1.5 pr-1.5 pl-4">
				<h2 className="font-display font-extrabold text-[24px] text-ink uppercase leading-none">
					Departamentos
				</h2>
				<button
					aria-label="Fechar menu"
					className="grid size-11 cursor-pointer place-items-center rounded-[3px] hover:bg-canteiro"
					onClick={onClose}
					type="button"
				>
					<X aria-hidden="true" className="size-6" />
				</button>
			</div>

			<MenuTabs
				onSelect={(next) => {
					if (next !== tab) {
						setTab(next);
						setExpanded(null);
					}
				}}
				tab={tab}
			/>

			<nav
				aria-label="Menu da loja"
				className="mt-2 flex-1 overflow-y-auto overscroll-contain"
			>
				<div
					aria-labelledby={`menu-tab-${tab}`}
					className="fade-in-0 animate-in px-4 duration-150 ease-out-expo motion-reduce:animate-none"
					id="menu-tabpanel"
					key={tab}
					role="tabpanel"
				>
					<ul className="grid gap-2">
						{entries.map((entry) => (
							<MenuAccordionItem
								entry={entry}
								expanded={expanded === entry.slug}
								key={entry.slug}
								onNavigate={onClose}
								onOpened={revealItem}
								onToggle={() => toggle(entry.slug)}
							/>
						))}
					</ul>
					<Link
						className="mt-3 flex min-h-12 items-center justify-center gap-2 rounded-[3px] border border-line-strong font-semibold text-[15px] text-ink no-underline"
						href="/catalog"
						onClick={onClose}
					>
						Ver catálogo completo
						<ArrowRight aria-hidden="true" className="size-4" />
					</Link>
				</div>
				<MenuFooter branches={branches} onClose={onClose} />
			</nav>
		</div>
	);
}
