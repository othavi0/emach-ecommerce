import { cva, type VariantProps } from "class-variance-authority";

/**
 * Pele do CTA do hero, congelada: o dono decidiu que o hero não muda no H3.
 * Cópia literal das classes de components/emach-button.tsx em 12b1379, só com
 * o que banner.ctaVariant usa. Só components/hero/* importa; hero-cta.test.tsx
 * trava as classes renderizadas.
 */
export const heroCtaVariants = cva(
	"inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-[2px] border border-transparent font-sans font-semibold tracking-[0.04em] transition-all duration-180 focus-visible:outline-2 focus-visible:outline-emach-red focus-visible:outline-offset-2 active:translate-y-px active:brightness-90 active:duration-75 disabled:pointer-events-none disabled:opacity-60 aria-busy:pointer-events-none motion-reduce:active:translate-y-0",
	{
		variants: {
			variant: {
				primary: "bg-emach-red text-white hover:bg-emach-red-hover",
				"outline-light":
					"border-white/70 bg-transparent text-white hover:border-white hover:bg-white hover:text-near-black",
				dark: "bg-near-black text-white hover:bg-black",
			},
			size: {
				lg: "h-13 px-[30px] text-sm",
			},
			full: {
				true: "w-full",
			},
		},
		defaultVariants: {
			size: "lg",
		},
	}
);

export type HeroCtaVariant = NonNullable<
	VariantProps<typeof heroCtaVariants>["variant"]
>;
