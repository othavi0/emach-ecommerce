"use client";

import { Button } from "@emach/ui/components/button";
import { Card } from "@emach/ui/components/card";
import { Input } from "@emach/ui/components/input";
import { Label } from "@emach/ui/components/label";
import { Separator } from "@emach/ui/components/separator";
import { useForm } from "@tanstack/react-form";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import z from "zod";
import Loader from "@/components/loader";
import { authClient } from "@/lib/auth-client";

export default function LoginPage() {
	const [mode, setMode] = useState<"sign-in" | "sign-up">("sign-in");
	const router = useRouter();
	const { isPending } = authClient.useSession();

	const signInForm = useForm({
		defaultValues: {
			email: "",
			password: "",
		},
		onSubmit: async ({ value }) => {
			await authClient.signIn.email(
				{
					email: value.email,
					password: value.password,
				},
				{
					onSuccess: () => {
						router.push("/dashboard");
						toast.success("Login realizado com sucesso");
					},
					onError: (error) => {
						toast.error(error.error.message || error.error.statusText);
					},
				}
			);
		},
		validators: {
			onSubmit: z.object({
				email: z.email("E-mail inválido"),
				password: z.string().min(8, "A senha deve ter no mínimo 8 caracteres"),
			}),
		},
	});

	const signUpForm = useForm({
		defaultValues: {
			name: "",
			email: "",
			password: "",
		},
		onSubmit: async ({ value }) => {
			await authClient.signUp.email(
				{
					email: value.email,
					password: value.password,
					name: value.name,
				},
				{
					onSuccess: () => {
						router.push("/dashboard");
						toast.success("Conta criada com sucesso");
					},
					onError: (error) => {
						toast.error(error.error.message || error.error.statusText);
					},
				}
			);
		},
		validators: {
			onSubmit: z.object({
				name: z.string().min(2, "O nome deve ter no mínimo 2 caracteres"),
				email: z.email("E-mail inválido"),
				password: z.string().min(8, "A senha deve ter no mínimo 8 caracteres"),
			}),
		},
	});

	if (isPending) {
		return (
			<main className="dark flex h-svh items-center justify-center bg-background">
				<Loader />
			</main>
		);
	}

	const isSignIn = mode === "sign-in";

	return (
		<main className="dark flex h-svh flex-col items-center justify-center gap-8 bg-background">
			<span className="font-bold text-2xl text-foreground tracking-[3px]">
				EMACH
			</span>

			<Card className="w-[420px] rounded-none p-8">
				<h2 className="font-medium text-2xl text-foreground">
					{isSignIn ? "Entrar" : "Criar conta"}
				</h2>
				<p className="mt-1 text-muted-foreground text-sm">
					{isSignIn
						? "Acesse sua conta EMACH"
						: "Crie sua conta para comprar na EMACH"}
				</p>

				{isSignIn ? (
					<form
						className="mt-6 space-y-4"
						onSubmit={(e) => {
							e.preventDefault();
							e.stopPropagation();
							signInForm.handleSubmit();
						}}
					>
						<signInForm.Field name="email">
							{(field) => (
								<div className="space-y-1.5">
									<Label
										className="font-display text-xs uppercase tracking-wider"
										htmlFor={field.name}
									>
										E-mail
									</Label>
									<Input
										className="rounded-none"
										id={field.name}
										name={field.name}
										onBlur={field.handleBlur}
										onChange={(e) => field.handleChange(e.target.value)}
										type="email"
										value={field.state.value}
									/>
									{field.state.meta.errors.map((error) => (
										<p
											className="text-destructive text-xs"
											key={error?.message}
										>
											{error?.message}
										</p>
									))}
								</div>
							)}
						</signInForm.Field>

						<signInForm.Field name="password">
							{(field) => (
								<div className="space-y-1.5">
									<div className="flex items-center justify-between">
										<Label
											className="font-display text-xs uppercase tracking-wider"
											htmlFor={field.name}
										>
											Senha
										</Label>
										<button
											className="text-link-blue text-xs hover:underline"
											type="button"
										>
											Esqueceu a senha?
										</button>
									</div>
									<Input
										className="rounded-none"
										id={field.name}
										name={field.name}
										onBlur={field.handleBlur}
										onChange={(e) => field.handleChange(e.target.value)}
										type="password"
										value={field.state.value}
									/>
									{field.state.meta.errors.map((error) => (
										<p
											className="text-destructive text-xs"
											key={error?.message}
										>
											{error?.message}
										</p>
									))}
								</div>
							)}
						</signInForm.Field>

						<signInForm.Subscribe
							selector={(state) => ({
								canSubmit: state.canSubmit,
								isSubmitting: state.isSubmitting,
							})}
						>
							{({ canSubmit, isSubmitting }) => (
								<Button
									className="mt-2 h-12 w-full rounded-none"
									disabled={!canSubmit || isSubmitting}
									type="submit"
								>
									{isSubmitting ? "Entrando..." : "Entrar"}
								</Button>
							)}
						</signInForm.Subscribe>
					</form>
				) : (
					<form
						className="mt-6 space-y-4"
						onSubmit={(e) => {
							e.preventDefault();
							e.stopPropagation();
							signUpForm.handleSubmit();
						}}
					>
						<signUpForm.Field name="name">
							{(field) => (
								<div className="space-y-1.5">
									<Label
										className="font-display text-xs uppercase tracking-wider"
										htmlFor={field.name}
									>
										Nome
									</Label>
									<Input
										className="rounded-none"
										id={field.name}
										name={field.name}
										onBlur={field.handleBlur}
										onChange={(e) => field.handleChange(e.target.value)}
										value={field.state.value}
									/>
									{field.state.meta.errors.map((error) => (
										<p
											className="text-destructive text-xs"
											key={error?.message}
										>
											{error?.message}
										</p>
									))}
								</div>
							)}
						</signUpForm.Field>

						<signUpForm.Field name="email">
							{(field) => (
								<div className="space-y-1.5">
									<Label
										className="font-display text-xs uppercase tracking-wider"
										htmlFor={field.name}
									>
										E-mail
									</Label>
									<Input
										className="rounded-none"
										id={field.name}
										name={field.name}
										onBlur={field.handleBlur}
										onChange={(e) => field.handleChange(e.target.value)}
										type="email"
										value={field.state.value}
									/>
									{field.state.meta.errors.map((error) => (
										<p
											className="text-destructive text-xs"
											key={error?.message}
										>
											{error?.message}
										</p>
									))}
								</div>
							)}
						</signUpForm.Field>

						<signUpForm.Field name="password">
							{(field) => (
								<div className="space-y-1.5">
									<Label
										className="font-display text-xs uppercase tracking-wider"
										htmlFor={field.name}
									>
										Senha
									</Label>
									<Input
										className="rounded-none"
										id={field.name}
										name={field.name}
										onBlur={field.handleBlur}
										onChange={(e) => field.handleChange(e.target.value)}
										type="password"
										value={field.state.value}
									/>
									{field.state.meta.errors.map((error) => (
										<p
											className="text-destructive text-xs"
											key={error?.message}
										>
											{error?.message}
										</p>
									))}
								</div>
							)}
						</signUpForm.Field>

						<signUpForm.Subscribe
							selector={(state) => ({
								canSubmit: state.canSubmit,
								isSubmitting: state.isSubmitting,
							})}
						>
							{({ canSubmit, isSubmitting }) => (
								<Button
									className="mt-2 h-12 w-full rounded-none"
									disabled={!canSubmit || isSubmitting}
									type="submit"
								>
									{isSubmitting ? "Criando conta..." : "Criar conta"}
								</Button>
							)}
						</signUpForm.Subscribe>
					</form>
				)}

				<div className="my-6 flex items-center gap-4">
					<Separator className="flex-1" />
					<span className="text-muted-foreground text-xs">OU</span>
					<Separator className="flex-1" />
				</div>

				<Button
					className="h-12 w-full rounded-none"
					onClick={() => setMode(isSignIn ? "sign-up" : "sign-in")}
					type="button"
					variant="outline"
				>
					{isSignIn ? "Criar conta" : "Já tenho conta"}
				</Button>
			</Card>

			<span className="text-muted-foreground text-xs">© 2026 EMACH</span>
		</main>
	);
}
