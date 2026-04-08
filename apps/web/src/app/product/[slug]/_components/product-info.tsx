"use client";

import { Badge } from "@emach/ui/components/badge";
import { Button } from "@emach/ui/components/button";
import { Separator } from "@emach/ui/components/separator";
import { Heart, ShoppingBag } from "lucide-react";
import { useState } from "react";

import { formatPrice, type Product } from "@/lib/mock-data";

interface ProductInfoProps {
	product: Product;
}

export function ProductInfo({ product }: ProductInfoProps) {
	const [selectedVoltage, setSelectedVoltage] = useState<string | null>(
		product.voltage?.[0] ?? null
	);

	return (
		<div className="w-full space-y-6 md:w-[480px]">
			{/* Category label */}
			<span className="font-display font-semibold text-[11px] text-mid-gray uppercase tracking-wider">
				{product.category}
			</span>

			{/* Name + badge */}
			<div className="space-y-2">
				<h1 className="font-medium text-2xl text-foreground md:text-3xl">
					{product.name}
				</h1>
				{product.badge && <Badge>{product.badge}</Badge>}
			</div>

			{/* Price */}
			<div className="flex items-baseline gap-3">
				<span className="font-bold text-foreground text-xl md:text-2xl">
					{formatPrice(product.price)}
				</span>
				{product.originalPrice && (
					<span className="text-muted-foreground text-sm line-through">
						{formatPrice(product.originalPrice)}
					</span>
				)}
			</div>

			{/* Short description */}
			<p className="text-muted-foreground text-sm leading-relaxed">
				{product.shortDescription}
			</p>

			{/* Voltage selector */}
			{product.voltage && product.voltage.length > 1 && (
				<div className="space-y-2">
					<span className="font-display font-semibold text-[11px] text-mid-gray uppercase tracking-wider">
						Voltagem
					</span>
					<div className="flex gap-2">
						{product.voltage.map((v) => (
							<button
								className={`border px-4 py-1.5 font-medium text-sm transition-colors ${
									selectedVoltage === v
										? "border-foreground bg-foreground text-background"
										: "border-border bg-background text-foreground hover:border-foreground/50"
								}`}
								key={v}
								onClick={() => setSelectedVoltage(v)}
								type="button"
							>
								{v}
							</button>
						))}
					</div>
				</div>
			)}

			{/* CTAs */}
			<div className="flex flex-col gap-3">
				<Button className="h-12 w-full gap-2 text-sm">
					<ShoppingBag className="size-4" />
					Comprar
				</Button>
				<Button className="h-12 w-full gap-2 text-sm" variant="outline">
					<Heart className="size-4" />
					Adicionar à Lista
				</Button>
			</div>

			<Separator />

			{/* Meta */}
			<div className="space-y-1.5">
				<p className="text-muted-foreground text-xs">SKU: {product.sku}</p>
				<p className="text-xs">
					{product.inStock ? (
						<span className="text-success">Em Estoque</span>
					) : (
						<span className="text-destructive">Indisponível</span>
					)}
				</p>
			</div>
		</div>
	);
}
