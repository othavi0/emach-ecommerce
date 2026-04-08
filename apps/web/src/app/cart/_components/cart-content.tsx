"use client";

import { Button } from "@emach/ui/components/button";
import { Separator } from "@emach/ui/components/separator";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@emach/ui/components/table";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { type CartItem, formatPrice, products } from "@/lib/mock-data";

const initialCart: CartItem[] = [
	{ product: products[0], quantity: 1, selectedVoltage: "20V" },
	{ product: products[1], quantity: 2, selectedVoltage: "110V" },
	{ product: products[4], quantity: 1 },
];

export function CartContent() {
	const [items, setItems] = useState<CartItem[]>(initialCart);

	const updateQuantity = (productId: string, delta: number) => {
		setItems((prev) =>
			prev.map((item) => {
				if (item.product.id !== productId) {
					return item;
				}
				const next = item.quantity + delta;
				if (next < 1) {
					return item;
				}
				return { ...item, quantity: next };
			})
		);
	};

	const removeItem = (productId: string) => {
		setItems((prev) => prev.filter((item) => item.product.id !== productId));
	};

	const subtotal = items.reduce(
		(acc, item) => acc + item.product.price * item.quantity,
		0
	);
	const frete = subtotal > 50_000 ? 0 : 2990;
	const total = subtotal + frete;

	return (
		<main className="mx-auto max-w-6xl px-20 py-10">
			<h1 className="font-medium text-2xl text-foreground">
				Carrinho de Compras
			</h1>
			<p className="mt-1 text-muted-foreground text-sm">
				{items.length} {items.length === 1 ? "item" : "itens"}
			</p>

			<div className="mt-8 flex flex-col gap-10 lg:flex-row">
				{/* Cart table */}
				<div className="flex-1">
					{items.length === 0 ? (
						<EmptyState />
					) : (
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead className="font-display text-muted-foreground text-xs uppercase tracking-wider">
										Produto
									</TableHead>
									<TableHead className="font-display text-muted-foreground text-xs uppercase tracking-wider">
										Preço
									</TableHead>
									<TableHead className="font-display text-muted-foreground text-xs uppercase tracking-wider">
										Qtd
									</TableHead>
									<TableHead className="font-display text-muted-foreground text-xs uppercase tracking-wider">
										Total
									</TableHead>
									<TableHead className="w-10" />
								</TableRow>
							</TableHeader>
							<TableBody>
								{items.map((item) => (
									<TableRow key={item.product.id}>
										{/* Product */}
										<TableCell className="py-4">
											<div className="flex items-center gap-4">
												<div className="relative size-16 shrink-0 overflow-hidden bg-muted">
													<Image
														alt={item.product.name}
														className="object-cover"
														fill
														sizes="64px"
														src={
															item.product.images[0] ??
															"/images/products/placeholder.png"
														}
													/>
												</div>
												<div>
													<p className="font-medium text-foreground text-sm leading-tight">
														{item.product.name}
													</p>
													{item.selectedVoltage && (
														<p className="mt-0.5 font-display text-muted-foreground text-xs uppercase tracking-wider">
															{item.selectedVoltage}
														</p>
													)}
												</div>
											</div>
										</TableCell>

										{/* Price */}
										<TableCell className="text-foreground text-sm">
											{formatPrice(item.product.price)}
										</TableCell>

										{/* Quantity */}
										<TableCell>
											<div className="flex items-center border border-border">
												<button
													className="flex size-8 items-center justify-center text-foreground transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40"
													disabled={item.quantity <= 1}
													onClick={() => updateQuantity(item.product.id, -1)}
													type="button"
												>
													<Minus className="size-3" />
												</button>
												<span className="flex w-10 items-center justify-center text-center text-sm">
													{item.quantity}
												</span>
												<button
													className="flex size-8 items-center justify-center text-foreground transition-colors hover:bg-muted"
													onClick={() => updateQuantity(item.product.id, 1)}
													type="button"
												>
													<Plus className="size-3" />
												</button>
											</div>
										</TableCell>

										{/* Row total */}
										<TableCell className="font-medium text-foreground text-sm">
											{formatPrice(item.product.price * item.quantity)}
										</TableCell>

										{/* Delete */}
										<TableCell>
											<button
												className="flex size-8 items-center justify-center text-muted-foreground transition-colors hover:text-destructive"
												onClick={() => removeItem(item.product.id)}
												type="button"
											>
												<Trash2 className="size-4" />
											</button>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					)}
				</div>

				{/* Order summary */}
				<div className="w-full lg:w-[380px]">
					<div className="space-y-4 border border-border p-6">
						<h2 className="font-display font-semibold text-xs uppercase tracking-wider">
							Resumo do Pedido
						</h2>
						<Separator />
						<div className="space-y-3 text-sm">
							<div className="flex justify-between">
								<span className="text-muted-foreground">Subtotal</span>
								<span>{formatPrice(subtotal)}</span>
							</div>
							<div className="flex justify-between">
								<span className="text-muted-foreground">Frete</span>
								<span>{subtotal > 50_000 ? "Grátis" : formatPrice(2990)}</span>
							</div>
						</div>
						<Separator />
						<div className="flex justify-between font-bold text-base">
							<span>Total</span>
							<span>{formatPrice(total)}</span>
						</div>
						<Button
							className="mt-4 h-12 w-full"
							nativeButton={false}
							render={<Link href="/checkout" />}
						>
							Finalizar Compra →
						</Button>
						<Button
							className="h-12 w-full"
							nativeButton={false}
							render={<Link href="/catalog" />}
							variant="outline"
						>
							Continuar Comprando
						</Button>
					</div>
				</div>
			</div>
		</main>
	);
}

function EmptyState() {
	return (
		<div className="flex flex-col items-center justify-center py-20 text-center">
			<ShoppingBag className="mb-4 size-12 text-muted-foreground" />
			<h2 className="font-medium text-lg">Seu carrinho está vazio</h2>
			<p className="mt-2 text-muted-foreground text-sm">
				Explore nosso catálogo e encontre as melhores ferramentas.
			</p>
			<Button
				className="mt-6"
				nativeButton={false}
				render={<Link href="/catalog" />}
			>
				Ver Catálogo
			</Button>
		</div>
	);
}
