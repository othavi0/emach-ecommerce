import type {
	BranchBusinessHours,
	BranchBusinessHoursPeriod,
} from "@emach/db/schema/inventory";

/** Dia da semana (0 = domingo) e minutos desde a meia-noite, no fuso da loja. */
export interface StoreClock {
	day: number;
	minutes: number;
}

export interface BranchStatus {
	label: string;
	open: boolean;
}

type Slot = readonly [start: number, end: number];

const WEEKDAY_NAMES = [
	"domingo",
	"segunda",
	"terça",
	"quarta",
	"quinta",
	"sexta",
	"sábado",
];

const WEEKDAY_INDEX = new Map(
	["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d, i) => [d, i])
);

const STORE_CLOCK_FORMAT = new Intl.DateTimeFormat("en-US", {
	hour: "numeric",
	hourCycle: "h23",
	minute: "numeric",
	timeZone: "America/Sao_Paulo",
	weekday: "short",
});

export function storeClock(at: Date): StoreClock {
	const parts = STORE_CLOCK_FORMAT.formatToParts(at);

	const part = (type: Intl.DateTimeFormatPartTypes) =>
		parts.find((p) => p.type === type)?.value ?? "";

	return {
		day: WEEKDAY_INDEX.get(part("weekday")) ?? 0,
		minutes: Number(part("hour")) * 60 + Number(part("minute")),
	};
}

function toMinutes(hhmm: string): number | null {
	const [h, m] = hhmm.split(":").map(Number);

	if (h === undefined || !Number.isFinite(h)) {
		return null;
	}

	return h * 60 + (m !== undefined && Number.isFinite(m) ? m : 0);
}

function periodSlots(period: BranchBusinessHoursPeriod | undefined): Slot[] {
	if (!(period?.isOpen && period.opensAt && period.closesAt)) {
		return [];
	}

	const bounds =
		period.breakStart && period.breakEnd
			? [period.opensAt, period.breakStart, period.breakEnd, period.closesAt]
			: [period.opensAt, period.closesAt];

	const minutes = bounds.map(toMinutes);

	if (minutes.some((m) => m === null)) {
		return [];
	}

	const slots: Slot[] = [];

	for (let i = 0; i + 1 < minutes.length; i += 2) {
		slots.push([minutes[i] ?? 0, minutes[i + 1] ?? 0]);
	}

	return slots;
}

/** Feriado não entra: a loja não sabe quais dias são feriado. */
function daySlots(hours: BranchBusinessHours, day: number): Slot[] {
	if (day === 0) {
		return [];
	}

	return periodSlots(day === 6 ? hours.saturday : hours.weekdays);
}

/** 480 vira "8h"; 810 vira "13h30". */
export function fmtHour(minutes: number): string {
	const h = Math.floor(minutes / 60);
	const m = minutes % 60;

	return m === 0 ? `${h}h` : `${h}h${String(m).padStart(2, "0")}`;
}

export function branchStatus(
	hours: BranchBusinessHours | null,
	{ day, minutes }: StoreClock
): BranchStatus | null {
	if (!hours) {
		return null;
	}

	const today = daySlots(hours, day);

	const current = today.find(
		([start, end]) => minutes >= start && minutes < end
	);

	if (current) {
		return { label: `Aberto até ${fmtHour(current[1])}`, open: true };
	}

	const later = today.find(([start]) => start > minutes);

	if (later) {
		const startedToday = today.some(([start]) => start < minutes);

		return {
			label: `${startedToday ? "Volta" : "Abre"} às ${fmtHour(later[0])}`,
			open: false,
		};
	}

	for (let ahead = 1; ahead <= 7; ahead++) {
		const next = (day + ahead) % 7;
		const first = daySlots(hours, next)[0];

		if (first) {
			const when = ahead === 1 ? "amanhã" : WEEKDAY_NAMES[next];

			return { label: `Abre ${when} às ${fmtHour(first[0])}`, open: false };
		}
	}

	return { label: "Fechado", open: false };
}

export interface HoursRow {
	/** Dias da semana (0 = domingo) que a linha cobre. */
	days: number[];
	label: string;
	value: string;
}

function fmtSlots(slots: Slot[]): string {
	if (slots.length === 0) {
		return "Fechado";
	}

	return slots
		.map(([start, end]) => `${fmtHour(start)} às ${fmtHour(end)}`)
		.join(", ");
}

export function hoursTable(hours: BranchBusinessHours): HoursRow[] {
	return [
		{
			days: [1, 2, 3, 4, 5],
			label: "Segunda a sexta",
			value: fmtSlots(daySlots(hours, 1)),
		},
		{ days: [6], label: "Sábado", value: fmtSlots(daySlots(hours, 6)) },
		{ days: [0], label: "Domingo", value: "Fechado" },
	];
}
