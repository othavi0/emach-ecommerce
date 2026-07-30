"use client";

// Pilha segura mobile (issue #210, F3): elementos SEM override mobile empilham
// do terço inferior do 9:16 na ordem fixa recebida (SAFE_STACK_ORDER via
// partitionMobileElements) — texto à esquerda, CTA full-width; o produto
// herdado tem box central própria FORA do fluxo da pilha (comportamento
// hardcoded atual formalizado). Itens da pilha NÃO aplicam scale (adendo 4).
import type { Banner } from "@emach/db/schema/banner";
import type { ElementKey } from "@/lib/composition/composition-schema";
import {
	type HeroElementBanner,
	HeroProductMotion,
	type HeroProductMotionProps,
	renderHeroElement,
} from "./hero-element-renders";

export function HeroSafeStack({
	banner,
	keys,
	headingTag,
}: {
	banner: HeroElementBanner;
	keys: ElementKey[];
	headingTag: "h1" | "h2";
}) {
	const items = keys.filter(
		(k): k is Exclude<ElementKey, "product"> => k !== "product"
	);
	if (items.length === 0) {
		return null;
	}
	return (
		<div className="absolute inset-x-[5%] bottom-[16%] z-20 flex flex-col items-start gap-3 text-left lg:hidden">
			{items.map((key) => {
				// Pilha é sempre texto à esquerda (align start) e CTA sempre
				// full-width — comportamento mobile atual da loja, não a
				// composition do banner (que só regula anchor/scale desktop).
				const content = renderHeroElement(key, banner, {
					align: "start",
					ctaFull: true,
					headingTag,
				});
				if (content === null) {
					return null;
				}
				return (
					<div className={key === "cta" ? "w-full" : undefined} key={key}>
						{content}
					</div>
				);
			})}
		</div>
	);
}

export function HeroStackProduct({
	banner,
	...motion
}: Omit<HeroProductMotionProps, "url"> & {
	banner: Pick<Banner, "productImageUrl" | "productImageMobileUrl">;
}) {
	const url = banner.productImageMobileUrl ?? banner.productImageUrl;
	if (url == null) {
		return null;
	}
	// Box central própria fora do fluxo da pilha (contrato #210): dimensão
	// fixa, sem escala — centraliza via self-center no flex do slide mobile.
	return (
		<div className="relative h-[38%] w-[82%] self-center lg:hidden">
			<HeroProductMotion url={url} {...motion} />
		</div>
	);
}
