import { Check } from "lucide-react";

export function VerifiedBadge() {
	return (
		<span className="inline-flex items-center gap-1 font-semibold text-[13px] text-ok leading-none">
			<Check aria-hidden size={13} strokeWidth={2.5} />
			Compra verificada
		</span>
	);
}
