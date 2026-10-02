import { cn } from "@emach/ui/lib/utils";
import type { LucideIcon } from "lucide-react";

export type StepState = "done" | "current" | "upcoming" | "ok";

export interface StepperStep {
	Icon: LucideIcon;
	key: string;
	label: string;
	state: StepState;
}

// Feito e atual em ink, por vir em line-strong, entregue em ok. Sem vermelho:
// na conta o vermelho é só do "Pagar".
const NODE_CLASS: Record<StepState, string> = {
	ok: "border-ok bg-ok text-white",
	current: "border-ink bg-ink text-white",
	done: "border-ink bg-paper text-ink",
	upcoming: "border-line-strong bg-paper text-ink-muted",
};

const LABEL_CLASS: Record<StepState, string> = {
	ok: "font-bold text-ok",
	current: "font-bold text-ink",
	done: "text-ink-2",
	upcoming: "text-ink-muted",
};

export function StatusStepper({ steps }: { steps: StepperStep[] }) {
	return (
		<div className="flex items-start border-line border-t px-[18px] pt-5 pb-4">
			{steps.map((step, idx) => (
				<div className="contents" key={step.key}>
					{idx > 0 && (
						<div
							className={cn(
								"mt-[18px] h-[2px] flex-1",
								isFilled(steps[idx - 1].state) ? "bg-ink" : "bg-line-strong"
							)}
						/>
					)}
					<div className="flex w-[88px] shrink-0 flex-col items-center">
						<span
							className={cn(
								"flex h-[38px] w-[38px] items-center justify-center rounded-full border-[1.5px]",
								NODE_CLASS[step.state]
							)}
						>
							<step.Icon className="h-[19px] w-[19px]" strokeWidth={1.8} />
						</span>
						<span
							className={cn(
								"mt-[9px] text-center text-[13px] leading-tight",
								LABEL_CLASS[step.state]
							)}
						>
							{step.label}
						</span>
					</div>
				</div>
			))}
		</div>
	);
}

function isFilled(state: StepState): boolean {
	return state === "done" || state === "ok";
}
