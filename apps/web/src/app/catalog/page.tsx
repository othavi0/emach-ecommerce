// apps/web/src/app/catalog/page.tsx
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { CatalogContent } from "./_components/catalog-content";

export const metadata = {
	title: "Catálogo — EMACH",
	description:
		"Explore ferramentas elétricas, manuais, equipamentos de medição e segurança EMACH.",
};

export default function CatalogPage() {
	return (
		<>
			<SiteHeader />
			<CatalogContent />
			<SiteFooter />
		</>
	);
}
