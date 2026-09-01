import type { ToolDetail } from "@emach/db/queries/tools";
import { env } from "@emach/env/web";
import { JsonLdScript } from "@/components/seo/json-ld-script";
import {
	buildBreadcrumbJsonLd,
	buildProductJsonLd,
} from "../_lib/product-json-ld";

const BASE_URL = env.NEXT_PUBLIC_SITE_URL;

export function ProductJsonLd({ detail }: { detail: ToolDetail }) {
	// `new Date()` aqui roda dentro do shell cacheado da PDP (getProductShell,
	// 10min) — priceValidUntil "congela" por janela, o que é aceitável.
	const data = buildProductJsonLd(detail, {
		baseUrl: BASE_URL,
		now: new Date(),
	});
	return <JsonLdScript data={data} />;
}

export function BreadcrumbJsonLd({
	category,
	productName,
	slug,
}: {
	category: { slug: string; name: string } | null;
	productName: string;
	slug: string;
}) {
	const data = buildBreadcrumbJsonLd({
		baseUrl: BASE_URL,
		category,
		productName,
		slug,
	});
	return <JsonLdScript data={data} />;
}
