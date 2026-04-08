"use client";

import { Button } from "@emach/ui/components/button";
import { Input } from "@emach/ui/components/input";
import { Label } from "@emach/ui/components/label";
import { Separator } from "@emach/ui/components/separator";
import { useForm } from "@tanstack/react-form";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import z from "zod";
import { formatPrice, products } from "@/lib/mock-data";

const firstProduct = products[0];
const secondProduct = products[1];

const orderItems = [
	...(firstProduct ? [{ product: firstProduct, quantity: 1 }] : []),
	...(secondProduct ? [{ product: secondProduct, quantity: 2 }] : []),
];
const subtotal = orderItems.reduce(
	(sum, item) => sum + item.product.price * item.quantity,
	0
);
const shipping = subtotal > 50_000 ? 0 : 2990;
const total = subtotal + shipping;

const checkoutSchema = z.object({
	firstName: z.string().min(2, "Nome é obrigatório"),
	lastName: z.string().min(2, "Sobrenome é obrigatório"),
	email: z.string().email("E-mail inválido"),
	phone: z.string().min(10, "Telefone inválido"),
	address: z.string().min(5, "Endereço é obrigatório"),
	city: z.string().min(2, "Cidade é obrigatória"),
	zipCode: z.string().min(8, "CEP inválido"),
	state: z.string().min(2, "Estado é obrigatório"),
});

export function CheckoutContent() {
	const form = useForm({
		defaultValues: {
			firstName: "",
			lastName: "",
			email: "",
			phone: "",
			address: "",
			city: "",
			zipCode: "",
			state: "",
		},
		validators: {
			onSubmit: checkoutSchema,
		},
		onSubmit: () => {
			toast.success("Dados salvos! Prosseguindo para entrega...");
		},
	});

	return (
		<div className="mx-auto max-w-6xl px-20 py-10">
			<div className="flex flex-col gap-15 lg:flex-row">
				{/* Form */}
				<div className="flex-1">
					<h1 className="font-medium text-2xl">Dados Pessoais</h1>
					<p className="mt-1 text-muted-foreground text-sm">
						Preencha seus dados para continuar
					</p>

					<form
						className="mt-8 space-y-6"
						onSubmit={(e) => {
							e.preventDefault();
							e.stopPropagation();
							form.handleSubmit();
						}}
					>
						{/* Nome + Sobrenome */}
						<div className="grid grid-cols-2 gap-4">
							<div>
								<Label
									className="font-display text-xs uppercase tracking-wider"
									htmlFor="firstName"
								>
									Nome
								</Label>
								<form.Field name="firstName">
									{(field) => (
										<>
											<Input
												className="mt-2 h-11 rounded-none"
												id="firstName"
												onBlur={field.handleBlur}
												onChange={(e) => field.handleChange(e.target.value)}
												placeholder="Seu nome"
												value={field.state.value}
											/>
											{field.state.meta.errors.map((error) => (
												<p
													className="mt-1 text-destructive text-xs"
													key={error?.message}
												>
													{error?.message}
												</p>
											))}
										</>
									)}
								</form.Field>
							</div>

							<div>
								<Label
									className="font-display text-xs uppercase tracking-wider"
									htmlFor="lastName"
								>
									Sobrenome
								</Label>
								<form.Field name="lastName">
									{(field) => (
										<>
											<Input
												className="mt-2 h-11 rounded-none"
												id="lastName"
												onBlur={field.handleBlur}
												onChange={(e) => field.handleChange(e.target.value)}
												placeholder="Seu sobrenome"
												value={field.state.value}
											/>
											{field.state.meta.errors.map((error) => (
												<p
													className="mt-1 text-destructive text-xs"
													key={error?.message}
												>
													{error?.message}
												</p>
											))}
										</>
									)}
								</form.Field>
							</div>
						</div>

						{/* E-mail */}
						<div>
							<Label
								className="font-display text-xs uppercase tracking-wider"
								htmlFor="email"
							>
								E-mail
							</Label>
							<form.Field name="email">
								{(field) => (
									<>
										<Input
											className="mt-2 h-11 rounded-none"
											id="email"
											onBlur={field.handleBlur}
											onChange={(e) => field.handleChange(e.target.value)}
											placeholder="seu@email.com"
											type="email"
											value={field.state.value}
										/>
										{field.state.meta.errors.map((error) => (
											<p
												className="mt-1 text-destructive text-xs"
												key={error?.message}
											>
												{error?.message}
											</p>
										))}
									</>
								)}
							</form.Field>
						</div>

						{/* Telefone */}
						<div>
							<Label
								className="font-display text-xs uppercase tracking-wider"
								htmlFor="phone"
							>
								Telefone
							</Label>
							<form.Field name="phone">
								{(field) => (
									<>
										<Input
											className="mt-2 h-11 rounded-none"
											id="phone"
											onBlur={field.handleBlur}
											onChange={(e) => field.handleChange(e.target.value)}
											placeholder="(11) 99999-9999"
											type="tel"
											value={field.state.value}
										/>
										{field.state.meta.errors.map((error) => (
											<p
												className="mt-1 text-destructive text-xs"
												key={error?.message}
											>
												{error?.message}
											</p>
										))}
									</>
								)}
							</form.Field>
						</div>

						<Separator />

						<h2 className="font-medium text-lg">Endereço de Entrega</h2>

						{/* Endereço */}
						<div>
							<Label
								className="font-display text-xs uppercase tracking-wider"
								htmlFor="address"
							>
								Endereço
							</Label>
							<form.Field name="address">
								{(field) => (
									<>
										<Input
											className="mt-2 h-11 rounded-none"
											id="address"
											onBlur={field.handleBlur}
											onChange={(e) => field.handleChange(e.target.value)}
											placeholder="Rua, número, complemento"
											value={field.state.value}
										/>
										{field.state.meta.errors.map((error) => (
											<p
												className="mt-1 text-destructive text-xs"
												key={error?.message}
											>
												{error?.message}
											</p>
										))}
									</>
								)}
							</form.Field>
						</div>

						{/* Cidade + Estado */}
						<div className="grid grid-cols-2 gap-4">
							<div>
								<Label
									className="font-display text-xs uppercase tracking-wider"
									htmlFor="city"
								>
									Cidade
								</Label>
								<form.Field name="city">
									{(field) => (
										<>
											<Input
												className="mt-2 h-11 rounded-none"
												id="city"
												onBlur={field.handleBlur}
												onChange={(e) => field.handleChange(e.target.value)}
												placeholder="São Paulo"
												value={field.state.value}
											/>
											{field.state.meta.errors.map((error) => (
												<p
													className="mt-1 text-destructive text-xs"
													key={error?.message}
												>
													{error?.message}
												</p>
											))}
										</>
									)}
								</form.Field>
							</div>

							<div>
								<Label
									className="font-display text-xs uppercase tracking-wider"
									htmlFor="state"
								>
									Estado
								</Label>
								<form.Field name="state">
									{(field) => (
										<>
											<Input
												className="mt-2 h-11 rounded-none"
												id="state"
												onBlur={field.handleBlur}
												onChange={(e) => field.handleChange(e.target.value)}
												placeholder="SP"
												value={field.state.value}
											/>
											{field.state.meta.errors.map((error) => (
												<p
													className="mt-1 text-destructive text-xs"
													key={error?.message}
												>
													{error?.message}
												</p>
											))}
										</>
									)}
								</form.Field>
							</div>
						</div>

						{/* CEP */}
						<div className="grid grid-cols-2 gap-4">
							<div>
								<Label
									className="font-display text-xs uppercase tracking-wider"
									htmlFor="zipCode"
								>
									CEP
								</Label>
								<form.Field name="zipCode">
									{(field) => (
										<>
											<Input
												className="mt-2 h-11 rounded-none"
												id="zipCode"
												onBlur={field.handleBlur}
												onChange={(e) => field.handleChange(e.target.value)}
												placeholder="00000-000"
												value={field.state.value}
											/>
											{field.state.meta.errors.map((error) => (
												<p
													className="mt-1 text-destructive text-xs"
													key={error?.message}
												>
													{error?.message}
												</p>
											))}
										</>
									)}
								</form.Field>
							</div>
						</div>

						{/* Action buttons */}
						<div className="flex items-center justify-between pt-4">
							<Button
								className="h-12 rounded-none"
								nativeButton={false}
								render={<Link href="/cart" />}
								variant="outline"
							>
								Voltar ao Carrinho
							</Button>
							<form.Subscribe
								selector={(state) => ({
									canSubmit: state.canSubmit,
									isSubmitting: state.isSubmitting,
								})}
							>
								{({ canSubmit, isSubmitting }) => (
									<Button
										className="h-12 rounded-none"
										disabled={!canSubmit || isSubmitting}
										type="submit"
									>
										{isSubmitting ? "Salvando..." : "Continuar para Entrega →"}
									</Button>
								)}
							</form.Subscribe>
						</div>
					</form>
				</div>

				{/* Order Summary */}
				<div className="w-full lg:w-[380px]">
					<div className="sticky top-10 space-y-4 border border-border p-6">
						<h2 className="font-display font-semibold text-xs uppercase tracking-wider">
							Resumo do Pedido
						</h2>
						<Separator />

						{orderItems.map((item) => (
							<div className="flex gap-4" key={item.product.id}>
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
								<div className="flex-1 text-sm">
									<p className="font-medium">{item.product.name}</p>
									<p className="text-muted-foreground">Qtd: {item.quantity}</p>
								</div>
								<span className="font-medium text-sm">
									{formatPrice(item.product.price * item.quantity)}
								</span>
							</div>
						))}

						<Separator />

						<div className="space-y-2 text-sm">
							<div className="flex justify-between">
								<span className="text-muted-foreground">Subtotal</span>
								<span>{formatPrice(subtotal)}</span>
							</div>
							<div className="flex justify-between">
								<span className="text-muted-foreground">Frete</span>
								<span>{shipping === 0 ? "Grátis" : formatPrice(shipping)}</span>
							</div>
						</div>

						<Separator />

						<div className="flex justify-between font-bold text-base">
							<span>Total</span>
							<span>{formatPrice(total)}</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
