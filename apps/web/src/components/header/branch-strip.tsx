"use client";

import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@emach/ui/components/popover";
import { cn } from "@emach/ui/lib/utils";
import { ChevronDown, MapPin, Navigation } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

import {
	EmachLinkButton,
	emachButtonVariants,
} from "@/components/emach-button";
import {
	type BranchStatus,
	branchStatus,
	hoursTable,
	type StoreClock,
	storeClock,
} from "@/lib/branch-status";
import type { HeaderBranch } from "@/lib/branches";

const triggerClass =
	"inline-flex min-h-10 cursor-pointer items-center gap-1.5 text-on-dark no-underline hover:underline focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-2";

const popupClass =
	"w-[340px] gap-3 rounded-[5px] border border-line bg-paper p-4 text-[14px] text-ink shadow-pop ring-0 [color-scheme:light]";

/**
 * Hora da loja só depois de montar: no servidor (e no prerender do
 * `cacheComponents`) o status ficaria congelado e quebraria a hidratação.
 */
function useStoreClock(): StoreClock | null {
	const [clock, setClock] = useState<StoreClock | null>(null);

	useEffect(() => {
		const tick = () => setClock(storeClock(new Date()));
		tick();
		const id = window.setInterval(tick, 60_000);

		return () => window.clearInterval(id);
	}, []);

	return clock;
}

function StatusDot({ open }: { open: boolean }) {
	return (
		<span
			aria-hidden="true"
			className={cn("size-2 shrink-0 rounded-full", open ? "bg-ok" : "bg-off")}
		/>
	);
}

function StatusText({
	className,
	status,
}: {
	className?: string;
	status: BranchStatus | null;
}) {
	if (!status) {
		return null;
	}

	return (
		<span className={cn("inline-flex items-center gap-1.5", className)}>
			<StatusDot open={status.open} />
			{status.label}
		</span>
	);
}

function plural(n: number, one: string, many: string) {
	return `${n} ${n === 1 ? one : many}`;
}

function OneBranch({
	branch,
	clock,
	onNavigate,
}: {
	branch: HeaderBranch;
	clock: StoreClock | null;
	onNavigate: () => void;
}) {
	const rows = branch.hours ? hoursTable(branch.hours) : null;

	return (
		<>
			<div>
				<h2 className="font-semibold text-[17px] leading-tight">
					{branch.name}
				</h2>
				<p className="mt-1 text-ink-2 leading-snug">
					{branch.street}
					{branch.locality && (
						<>
							<br />
							{branch.locality}
						</>
					)}
					{branch.cep && (
						<>
							<br />
							CEP {branch.cep}
						</>
					)}
				</p>
			</div>
			{rows && (
				<dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-[13px] tabular-nums">
					{rows.map((row) => {
						const today = clock !== null && row.days.includes(clock.day);

						return (
							<div className="contents" key={row.label}>
								<dt
									className={cn(
										"text-ink-muted",
										today && "font-semibold text-ink"
									)}
								>
									{row.label}
								</dt>
								<dd
									className={cn(
										"text-ink-2",
										today && "font-semibold text-ink"
									)}
								>
									{row.value}
								</dd>
							</div>
						);
					})}
				</dl>
			)}
			<div className="flex gap-2">
				<a
					className={emachButtonVariants({
						variant: "dark",
						className: "flex-1",
					})}
					href={branch.mapsUrl}
					rel="noopener noreferrer"
					target="_blank"
				>
					<Navigation aria-hidden="true" className="size-4" />
					Como chegar
				</a>
				<EmachLinkButton
					className="flex-1"
					href="/sobre#filiais"
					onClick={onNavigate}
					variant="line"
				>
					Ver a loja
				</EmachLinkButton>
			</div>
		</>
	);
}

function ManyBranches({
	branches,
	clock,
	onNavigate,
}: {
	branches: HeaderBranch[];
	clock: StoreClock | null;
	onNavigate: () => void;
}) {
	return (
		<>
			<h2 className="font-semibold text-[17px] leading-tight">
				Nossas filiais
			</h2>
			<ul className="-mx-2 flex flex-col">
				{branches.map((b) => (
					<li key={b.id}>
						<a
							className="flex flex-col gap-0.5 rounded-[3px] px-2 py-2 text-ink no-underline hover:bg-canteiro"
							href={b.mapsUrl}
							rel="noopener noreferrer"
							target="_blank"
						>
							<span className="font-semibold">{b.city}</span>
							<span className="text-[13px] text-ink-2">{b.street}</span>
							<StatusText
								className="text-[13px] text-ink-muted"
								status={clock ? branchStatus(b.hours, clock) : null}
							/>
						</a>
					</li>
				))}
			</ul>
			<Link
				className="font-semibold text-ink underline underline-offset-[3px]"
				href="/sobre#filiais"
				onClick={onNavigate}
			>
				Ver horários e mapa
			</Link>
		</>
	);
}

/** Lado esquerdo da faixa grafite: a filial (ou as filiais) e o status agora. */
export function BranchStrip({ branches }: { branches: HeaderBranch[] }) {
	const clock = useStoreClock();
	const [open, setOpen] = useState(false);
	const close = () => setOpen(false);
	const [only] = branches;

	if (!only) {
		return (
			<Link className={triggerClass} href="/sobre#filiais">
				<MapPin aria-hidden="true" className="size-4 text-on-dark-muted" />
				Nossas filiais
			</Link>
		);
	}

	const single = branches.length === 1;
	let summary: React.ReactNode = null;

	if (clock && single) {
		summary = <StatusText status={branchStatus(only.hours, clock)} />;
	} else if (clock) {
		const openNow = branches.filter(
			(b) => branchStatus(b.hours, clock)?.open
		).length;

		summary = (
			<StatusText
				status={{
					label:
						openNow > 0
							? plural(openNow, "aberta agora", "abertas agora")
							: "Todas fechadas agora",
					open: openNow > 0,
				}}
			/>
		);
	}

	return (
		<Popover onOpenChange={setOpen} open={open}>
			<PopoverTrigger className={triggerClass}>
				<MapPin aria-hidden="true" className="size-4 text-on-dark-muted" />
				<span className="max-sm:hidden">
					{single
						? [only.street, only.city].filter(Boolean).join(", ")
						: `${branches.length} filiais`}
				</span>
				<span className="sm:hidden">{single ? only.city : "Filiais"}</span>
				{summary && (
					<span className="ml-1.5 text-on-dark-muted max-md:hidden">
						{summary}
					</span>
				)}
				<ChevronDown aria-hidden="true" className="size-4 text-on-dark-muted" />
			</PopoverTrigger>
			<PopoverContent align="start" className={popupClass} sideOffset={4}>
				{single ? (
					<OneBranch branch={only} clock={clock} onNavigate={close} />
				) : (
					<ManyBranches branches={branches} clock={clock} onNavigate={close} />
				)}
			</PopoverContent>
		</Popover>
	);
}
