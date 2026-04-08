import { Badge } from "@emach/ui/components/badge";
import Image from "next/image";
import Link from "next/link";

import { formatPrice, type Product } from "@/lib/mock-data";

export function ProductCard({ product }: { product: Product }) {
	return (
		<Link className="group block" href={`/product/${product.slug}`}>
			<div className="relative aspect-square overflow-hidden bg-muted">
				<Image
					alt={product.name}
					className="object-cover transition-transform duration-300 group-hover:scale-105"
					fill
					sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
					src={product.images[0] ?? "/images/products/placeholder.png"}
				/>
				{product.badge && (
					<Badge className="absolute top-3 left-3">{product.badge}</Badge>
				)}
			</div>
			<div className="py-3">
				<span className="font-display font-semibold text-[11px] text-mid-gray uppercase tracking-wider">
					{product.category}
				</span>
				<h3 className="mt-1 font-medium text-base text-foreground">
					{product.name}
				</h3>
				<div className="mt-1 flex items-center gap-2">
					<span className="font-bold text-foreground text-sm">
						{formatPrice(product.price)}
					</span>
					{product.originalPrice && (
						<span className="text-muted-foreground text-xs line-through">
							{formatPrice(product.originalPrice)}
						</span>
					)}
				</div>
			</div>
		</Link>
	);
}
