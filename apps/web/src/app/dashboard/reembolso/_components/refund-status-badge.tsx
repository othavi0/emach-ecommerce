import type { RefundStatus } from "@emach/db/schema/orders";
import {
	Ban,
	Check,
	CircleCheck,
	Clock,
	type LucideIcon,
	Search,
} from "lucide-react";
import { type ChipTone, StatusChip } from "@/components/status-chip";
import {
	REFUND_STATUS_BADGE,
	type RefundBadgeTone,
} from "@/lib/refunds/status";

// Tabela própria da devolução: o "info" dela é "Solicitado", não pago.
const TONE_TO_CHIP: Record<RefundBadgeTone, ChipTone> = {
	info: "neutral",
	warning: "neutral",
	progress: "neutral",
	success: "ok",
	muted: "off",
};

const STATUS_ICON: Record<RefundStatus, LucideIcon> = {
	requested: Clock,
	under_review: Search,
	approved: Check,
	refunded: CircleCheck,
	rejected: Ban,
};

export function RefundStatusBadge({ status }: { status: RefundStatus }) {
	const { label, tone } = REFUND_STATUS_BADGE[status];
	return (
		<StatusChip icon={STATUS_ICON[status]} tone={TONE_TO_CHIP[tone]}>
			{label}
		</StatusChip>
	);
}
