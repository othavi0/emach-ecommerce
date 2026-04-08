import { ProductCard } from "@/components/product-card";
import { SectionLabel } from "@/components/section-label";
import type { Product } from "@/lib/mock-data";

interface RelatedProductsProps {
	products: Product[];
}

export function RelatedProducts({ products }: RelatedProductsProps) {
	if (products.length === 0) {
		return null;
	}

	return (
		<section className="dark bg-background px-20 py-15">
			<SectionLabel>Relacionados</SectionLabel>
			<h2 className="mt-2 font-medium text-2xl text-foreground">
				Você também pode gostar
			</h2>
			<div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
				{products.map((product) => (
					<ProductCard key={product.id} product={product} />
				))}
			</div>
		</section>
	);
}
