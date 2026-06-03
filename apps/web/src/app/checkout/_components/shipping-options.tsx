"use client";

import { Button } from "@emach/ui/components/button";

import { fmtBRL } from "@/lib/format";
import type { ShippingOption } from "@/lib/superfrete/types";

export type ShippingStatus = "idle" | "loading" | "error" | "ready";

interface ShippingOptionsProps {
	onRetry: () => void;
	onSelect: (serviceId: number) => void;
	options: ShippingOption[];
	selectedId: number | null;
	status: ShippingStatus;
}

export function ShippingOptions({
	status,
	options,
	selectedId,
	onSelect,
	onRetry,
}: ShippingOptionsProps) {
	if (status === "idle") {
		return (
			<p className="text-muted-foreground text-sm">
				Informe o CEP para calcular o frete.
			</p>
		);
	}
	if (status === "loading") {
		return <p className="text-muted-foreground text-sm">Calculando frete…</p>;
	}
	if (status === "error") {
		return (
			<div className="space-y-2">
				<p className="text-destructive text-sm">
					Não foi possível calcular o frete.
				</p>
				<Button
					className="h-9 rounded-none"
					onClick={onRetry}
					type="button"
					variant="outline"
				>
					Tentar novamente
				</Button>
			</div>
		);
	}
	if (options.length === 0) {
		return (
			<p className="text-muted-foreground text-sm">
				Nenhuma opção de frete para este CEP.
			</p>
		);
	}
	return (
		<div className="space-y-2">
			{options.map((opt) => (
				<label
					className="flex cursor-pointer items-center justify-between border border-border p-3 text-sm"
					key={opt.serviceId}
				>
					<span className="flex items-center gap-3">
						<input
							checked={selectedId === opt.serviceId}
							name="shipping-option"
							onChange={() => onSelect(opt.serviceId)}
							type="radio"
						/>
						<span>
							<span className="font-medium">{opt.name}</span>{" "}
							<span className="text-muted-foreground">
								· {opt.company} · {opt.deliveryDays} dia(s)
							</span>
						</span>
					</span>
					<span className="font-medium">{fmtBRL(opt.priceCents)}</span>
				</label>
			))}
		</div>
	);
}
