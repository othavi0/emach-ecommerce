import type { OrderStatus } from "@emach/db/schema/orders";
import {
	Ban,
	CircleAlert,
	CircleCheck,
	Clock,
	CreditCard,
	type LucideIcon,
	Package,
	RotateCcw,
	Truck,
	Undo2,
} from "lucide-react";
import { type ChipTone, StatusChip } from "@/components/status-chip";
import type { BadgeTone } from "@/lib/orders/status";
import { ORDER_STATUS_BADGE } from "@/lib/orders/status";

const TONE_TO_CHIP: Record<BadgeTone, ChipTone> = {
	neutral: "neutral",
	danger: "alert",
	info: "ok",
	progress: "neutral",
	transit: "neutral",
	success: "ok",
	muted: "off",
	warning: "off",
};

const STATUS_ICON: Record<OrderStatus, LucideIcon> = {
	pending_payment: Clock,
	payment_failed: CircleAlert,
	paid: CreditCard,
	preparing: Package,
	shipped: Truck,
	delivered: CircleCheck,
	canceled: Ban,
	refunded: RotateCcw,
	returned: Undo2,
};

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
	const { label, tone } = ORDER_STATUS_BADGE[status];
	return (
		<StatusChip
			icon={STATUS_ICON[status]}
			struck={tone === "muted"}
			tone={TONE_TO_CHIP[tone]}
		>
			{label}
		</StatusChip>
	);
}
