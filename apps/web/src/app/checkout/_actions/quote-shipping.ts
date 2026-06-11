"use server";

import { headers } from "next/headers";
import { z } from "zod";

import { getClientIp } from "@/lib/client-ip";
import { log } from "@/lib/evlog";
import { RATE_LIMIT_MESSAGE, shippingLimiter } from "@/lib/rate-limit";
import { quoteShipping } from "@/lib/superfrete/quote";
import type { ShippingOption } from "@/lib/superfrete/types";

const inputSchema = z.object({
	destinationCep: z
		.string()
		.transform((v) => v.replace(/\D/g, ""))
		.refine((v) => v.length === 8, "CEP inválido"),
	items: z
		.array(
			z.object({
				toolId: z.string().min(1),
				quantity: z.number().int().positive(),
			})
		)
		.min(1, "Carrinho vazio"),
	declaredValueCents: z.number().int().nonnegative().optional(),
});

export type QuoteShippingResult =
	| { ok: true; options: ShippingOption[]; negotiate: boolean }
	| { ok: false; error: string };

export async function quoteShippingAction(
	rawInput: unknown
): Promise<QuoteShippingResult> {
	const parsed = inputSchema.safeParse(rawInput);
	if (!parsed.success) {
		return { ok: false, error: "Dados inválidos para cotação" };
	}

	// Action pública (usada no freight-calculator da página de produto) → sem
	// sessão; rate limit por IP confiável. IP ausente cai no bucket "anon".
	const ip = getClientIp(await headers()) ?? "anon";
	const { success } = await shippingLimiter.limit(`shipping:${ip}`);
	if (!success) {
		return { ok: false, error: RATE_LIMIT_MESSAGE };
	}

	try {
		const { options, negotiate } = await quoteShipping(parsed.data);
		return { ok: true, options, negotiate };
	} catch (err) {
		log.error({
			action: "quote_shipping_failed",
			error: err instanceof Error ? err.message : "erro inesperado",
		});
		return { ok: false, error: "Não foi possível calcular o frete." };
	}
}
