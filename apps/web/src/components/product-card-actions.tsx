"use client";

import { Bell, Eye, ShoppingCart } from "lucide-react";
import Link from "next/link";

import { emachButtonVariants } from "@/components/emach-button";
import { useQuickView } from "@/components/quick-view";
import type { CardAction } from "@/lib/card-action";
import { useCartActions } from "@/lib/cart-context";
import type { CartItemSnapshot } from "@/lib/cart-store";

export function QuickViewButton({
	name,
	slug,
}: {
	name: string;
	slug: string;
}) {
	const openQuickView = useQuickView();

	return (
		<button
			aria-label={`Ver rápido: ${name}`}
			className="absolute right-1.5 bottom-1.5 z-[2] inline-flex min-h-11 cursor-pointer items-center gap-1 rounded-[3px] border border-line bg-paper px-2.5 font-semibold text-[13px] text-ink shadow-[0_4px_10px_-4px_rgba(22,25,29,0.25)] hover:border-ink sm:right-2.5 sm:bottom-2.5 sm:gap-1.5 sm:px-3 sm:text-[14px]"
			onClick={() => openQuickView(slug)}
			type="button"
		>
			<Eye aria-hidden="true" className="size-4 sm:size-5" />
			Ver rápido
		</button>
	);
}

// Os quatro estados usam o mesmo botão `line`: o card não compete com o CTA
// vermelho da página nem pesa a grade com blocos de grafite.
const actionButton = emachButtonVariants({
	variant: "line",
	full: true,
	className:
		"mt-2.5 whitespace-normal px-2 text-center text-[14px] leading-tight sm:px-4 sm:text-[15px]",
});

interface CardActionButtonProps {
	action: CardAction;
	item: CartItemSnapshot;
	name: string;
	slug: string;
}

/** Botão do card: adicionar, escolher voltagem (abre o "Ver rápido") ou avisar. */
export function CardActionButton({
	action,
	item,
	name,
	slug,
}: CardActionButtonProps) {
	const { add, openSheet } = useCartActions();
	const openQuickView = useQuickView();

	switch (action) {
		case "add":
			return (
				<button
					className={actionButton}
					onClick={() => {
						add(item, 1);
						openSheet();
					}}
					type="button"
				>
					<ShoppingCart
						aria-hidden="true"
						className="size-[18px] max-sm:hidden"
					/>
					<span className="sm:hidden">Adicionar</span>
					<span className="max-sm:hidden">Adicionar ao carrinho</span>
					<span className="sr-only">: {name}</span>
				</button>
			);
		case "choose-voltage":
			return (
				<button
					className={actionButton}
					onClick={() => openQuickView(slug)}
					type="button"
				>
					Escolher voltagem
					<span className="sr-only">: {name}</span>
				</button>
			);
		case "notify":
			return (
				<Link className={actionButton} href={`/product/${slug}`}>
					<Bell aria-hidden="true" className="size-[18px] max-sm:hidden" />
					<span className="sm:hidden">Avise-me</span>
					<span className="max-sm:hidden">Avise-me quando chegar</span>
					<span className="sr-only">: {name}</span>
				</Link>
			);
		default:
			return (
				<Link className={actionButton} href={`/product/${slug}`}>
					Ver produto
					<span className="sr-only">: {name}</span>
				</Link>
			);
	}
}
