"use client";

import { Separator } from "@emach/ui/components/separator";
import {
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
} from "@emach/ui/components/tabs";

import type { Product } from "@/lib/mock-data";

interface ProductTabsProps {
	product: Product;
}

export function ProductTabs({ product }: ProductTabsProps) {
	return (
		<div className="px-20 pb-10">
			<Separator className="mb-8" />
			<Tabs defaultValue="description">
				<TabsList variant="line">
					<TabsTrigger value="description">Descrição</TabsTrigger>
					<TabsTrigger value="specs">Especificações</TabsTrigger>
					<TabsTrigger value="reviews">Avaliações</TabsTrigger>
				</TabsList>

				<TabsContent className="pt-6" value="description">
					<p className="max-w-[720px] text-muted-foreground text-sm leading-relaxed">
						{product.description}
					</p>
				</TabsContent>

				<TabsContent className="pt-6" value="specs">
					<div className="max-w-[600px] divide-y divide-border">
						{Object.entries(product.specs).map(([key, value]) => (
							<div className="flex justify-between py-3" key={key}>
								<span className="font-medium text-foreground text-sm">
									{key}
								</span>
								<span className="text-muted-foreground text-sm">{value}</span>
							</div>
						))}
					</div>
				</TabsContent>

				<TabsContent className="pt-6" value="reviews">
					<p className="text-muted-foreground text-sm">
						Nenhuma avaliação ainda.
					</p>
				</TabsContent>
			</Tabs>
		</div>
	);
}
