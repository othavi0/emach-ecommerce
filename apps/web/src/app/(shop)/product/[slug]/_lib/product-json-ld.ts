import { numericToCents } from "@/lib/format";
import { effectiveAutoDiscountCents } from "@/lib/promotions";

/** Subconjunto estrutural de ToolDetail usado pelo JSON-LD (fixture-friendly). */
export interface ProductJsonLdInput {
	activePromotion: {
		discountType: string;
		discountValue: string;
		endsAt: Date | null;
	} | null;
	images: Array<{ url: string }>;
	reviewStats: { avg: number | null; count: number };
	stockByVariant: Record<string, boolean>;
	tool: {
		description: string | null;
		id: string;
		manufacturerName: string | null;
		name: string;
		slug: string | null;
	};
	variants: Array<{
		barcode: string | null;
		id: string;
		priceAmount: string | null;
		sku: string;
	}>;
}

export interface Offer {
	"@id": string;
	"@type": "Offer";
	availability: "https://schema.org/InStock" | "https://schema.org/OutOfStock";
	gtin?: string;
	itemCondition: "https://schema.org/NewCondition";
	price: string;
	priceCurrency: "BRL";
	priceValidUntil: string;
	sku: string;
	url: string;
}

export interface ProductJsonLd {
	"@context": "https://schema.org";
	"@type": "Product";
	aggregateRating?: {
		"@type": "AggregateRating";
		ratingValue: number;
		reviewCount: number;
	};
	brand?: { "@type": "Brand"; name: string };
	description?: string;
	image?: string[];
	name: string;
	offers?: Offer | Offer[];
	sku?: string;
}

export interface BreadcrumbJsonLd {
	"@context": "https://schema.org";
	"@type": "BreadcrumbList";
	itemListElement: Array<{
		"@type": "ListItem";
		item: string;
		name: string;
		position: number;
	}>;
}

const TRAILING_SLASHES = /\/+$/;
const ONLY_DIGITS = /^\d+$/;
const GTIN_LENGTHS = new Set([8, 12, 13, 14]);

function isoDate(d: Date): string {
	return d.toISOString().slice(0, 10);
}

function gtinFrom(barcode: string | null): string | undefined {
	if (!barcode) {
		return;
	}
	const digits = barcode.trim();
	return ONLY_DIGITS.test(digits) && GTIN_LENGTHS.has(digits.length)
		? digits
		: undefined;
}

/** Fim da promoção ativa; sem promoção (ou sem fim) vale um ano. */
export function priceValidUntil(
	promotion: { endsAt: Date | null } | null,
	now: Date
): string {
	if (promotion?.endsAt) {
		return isoDate(promotion.endsAt);
	}
	const next = new Date(now);
	next.setUTCFullYear(next.getUTCFullYear() + 1);
	return isoDate(next);
}

function finalPriceAmount(
	priceAmount: string,
	promotion: ProductJsonLdInput["activePromotion"]
): string {
	if (!promotion) {
		return priceAmount;
	}
	const baseCents = numericToCents(priceAmount);
	const discountedCents = effectiveAutoDiscountCents(
		baseCents,
		promotion.discountType,
		promotion.discountValue
	);
	if (discountedCents >= baseCents) {
		return priceAmount;
	}
	return (discountedCents / 100).toFixed(2);
}

export function buildProductJsonLd(
	input: ProductJsonLdInput,
	opts: { baseUrl: string; now: Date }
): ProductJsonLd {
	const base = opts.baseUrl.replace(TRAILING_SLASHES, "");
	const { tool, variants, images, stockByVariant, reviewStats } = input;
	const url = `${base}/product/${tool.slug ?? tool.id}`;
	const validUntil = priceValidUntil(input.activePromotion, opts.now);

	const offers: Offer[] = [];
	for (const v of variants) {
		// Offer sem `price` é inválida no Rich Results — variante sem preço não vira Offer.
		if (v.priceAmount === null) {
			continue;
		}
		const gtin = gtinFrom(v.barcode);
		offers.push({
			"@id": `${url}#offer-${v.sku}`,
			"@type": "Offer",
			availability: stockByVariant[v.id]
				? "https://schema.org/InStock"
				: "https://schema.org/OutOfStock",
			...(gtin ? { gtin } : {}),
			itemCondition: "https://schema.org/NewCondition",
			price: finalPriceAmount(v.priceAmount, input.activePromotion),
			priceCurrency: "BRL",
			priceValidUntil: validUntil,
			sku: v.sku,
			url,
		});
	}

	const firstOffer = offers[0];

	return {
		"@context": "https://schema.org",
		"@type": "Product",
		name: tool.name,
		...(tool.description ? { description: tool.description } : {}),
		...(images.length > 0 ? { image: images.map((i) => i.url) } : {}),
		...(variants[0] ? { sku: variants[0].sku } : {}),
		...(tool.manufacturerName
			? { brand: { "@type": "Brand", name: tool.manufacturerName } }
			: {}),
		...(firstOffer
			? { offers: offers.length === 1 ? firstOffer : offers }
			: {}),
		...(reviewStats.count > 0 && reviewStats.avg !== null
			? {
					aggregateRating: {
						"@type": "AggregateRating",
						ratingValue: Number(reviewStats.avg.toFixed(2)),
						reviewCount: reviewStats.count,
					},
				}
			: {}),
	};
}

export function buildBreadcrumbJsonLd(input: {
	baseUrl: string;
	category: { name: string; slug: string } | null;
	productName: string;
	slug: string;
}): BreadcrumbJsonLd {
	const base = input.baseUrl.replace(TRAILING_SLASHES, "");
	const items = [
		{ item: `${base}/`, name: "Início" },
		{ item: `${base}/catalog`, name: "Catálogo" },
		...(input.category
			? [
					{
						item: `${base}/catalog?cat=${input.category.slug}`,
						name: input.category.name,
					},
				]
			: []),
		{ item: `${base}/product/${input.slug}`, name: input.productName },
	];
	return {
		"@context": "https://schema.org",
		"@type": "BreadcrumbList",
		itemListElement: items.map((entry, index) => ({
			"@type": "ListItem",
			item: entry.item,
			name: entry.name,
			position: index + 1,
		})),
	};
}
