"use client";

import { cn } from "@emach/ui/lib/utils";
import { ArrowRight, ChevronDown } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { seeAllLabel } from "@/components/header/dept-panels";
import { type MenuEntry, seeAllSpan } from "@/components/header/menu-entries";
import { ProductImage } from "@/components/product-image";
import { fmtBRL } from "@/lib/format";

const motionClass =
	"duration-[260ms] ease-out-expo motion-reduce:transition-none";

function Thumb({ image }: { image: MenuEntry["image"] }) {
	return (
		<span className="relative size-12 shrink-0 overflow-hidden rounded-[3px] bg-well">
			{image && (
				<Image
					alt=""
					className={image.isProduct ? "object-contain p-1" : "object-cover"}
					fill
					sizes="48px"
					src={image.src}
				/>
			)}
		</span>
	);
}

export function MenuAccordionItem({
	entry,
	expanded,
	onNavigate,
	onOpened,
	onToggle,
}: {
	entry: MenuEntry;
	expanded: boolean;
	onNavigate: () => void;
	/** Fim da animação de abrir (ou abrir sem animação). */
	onOpened: (item: HTMLElement) => void;
	onToggle: () => void;
}) {
	const id = `menu-acc-${entry.slug}`;
	const span = seeAllSpan(entry.products.length);

	return (
		<li className="rounded-[5px]" data-acc={entry.slug}>
			<button
				aria-controls={id}
				aria-expanded={expanded}
				className="flex min-h-16 w-full cursor-pointer items-center gap-3 py-2 text-left"
				id={`${id}-btn`}
				onClick={onToggle}
				type="button"
			>
				<Thumb image={entry.image} />
				<span className="min-w-0 flex-1">
					<span className="block font-semibold text-[16px] text-ink leading-tight">
						{entry.name}
					</span>
					{entry.meta.map((line) => (
						<span
							className="mt-0.5 block truncate text-[13px] text-ink-muted tabular-nums leading-snug"
							key={line}
						>
							{line}
						</span>
					))}
				</span>
				<ChevronDown
					aria-hidden="true"
					className={cn(
						"size-5 shrink-0 text-ink-muted transition-transform",
						motionClass,
						expanded && "rotate-180"
					)}
				/>
			</button>
			<section
				aria-labelledby={`${id}-btn`}
				className={cn(
					"grid transition-[grid-template-rows]",
					motionClass,
					expanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
				)}
				id={id}
				inert={!expanded}
				onTransitionEnd={(e) => {
					if (
						expanded &&
						e.target === e.currentTarget &&
						e.propertyName === "grid-template-rows"
					) {
						onOpened(e.currentTarget.parentElement ?? e.currentTarget);
					}
				}}
			>
				<div className="min-h-0 overflow-hidden">
					<ul
						className={cn(
							"grid grid-cols-2 gap-2 pt-1 pb-3 transition-opacity",
							motionClass,
							expanded ? "opacity-100" : "opacity-0"
						)}
					>
						{entry.products.map((p) => (
							<li key={p.id}>
								<Link
									className="flex h-full flex-col gap-1.5 rounded-[5px] border border-line p-2 text-ink no-underline"
									href={`/product/${p.slug}`}
									onClick={onNavigate}
								>
									<span className="relative block aspect-square overflow-hidden rounded-[3px] bg-well">
										{p.imageSrc ? (
											<Image
												alt=""
												className="object-contain p-2 mix-blend-multiply"
												fill
												sizes="45vw"
												src={p.imageSrc}
											/>
										) : (
											<ProductImage
												categorySlug={p.categorySlug}
												sizes="45vw"
											/>
										)}
									</span>
									<span className="line-clamp-2 min-h-[2lh] text-[13px] leading-snug">
										{p.name}
									</span>
									<span className="font-extrabold text-[15px] tabular-nums">
										{fmtBRL(p.priceCents)}
									</span>
								</Link>
							</li>
						))}
						<li
							className={span === "full" ? "col-span-2" : undefined}
							data-span={span}
						>
							<Link
								className="flex h-full min-h-14 items-center justify-between gap-2 rounded-[5px] bg-canteiro p-3 text-ink no-underline"
								href={entry.href}
								onClick={onNavigate}
							>
								<span className="flex flex-col gap-0.5">
									<span className="font-semibold text-[14px]">
										{seeAllLabel(entry.productCount)}
									</span>
									<span className="text-[12px] text-ink-muted">
										{entry.name}
									</span>
								</span>
								<ArrowRight aria-hidden="true" className="size-4 shrink-0" />
							</Link>
						</li>
					</ul>
				</div>
			</section>
		</li>
	);
}
