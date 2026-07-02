import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// getRedis → null força o caminho in-memory, determinístico mesmo se o .env
// local tiver Upstash configurado (nunca tocar Redis real em teste).
vi.mock("@emach/redis", () => ({ getRedis: () => null }));
vi.mock("@/lib/evlog", () => ({ log: { error: vi.fn(), warn: vi.fn() } }));

import { buildQuoteCacheKey, getCachedQuote, setCachedQuote } from "./cache";

const QUOTE = {
	negotiate: false,
	options: [
		{
			carrierId: "COR-40010",
			name: "Correios — Sedex",
			priceCents: 3171,
			deliveryDays: 2,
		},
	],
};

describe("buildQuoteCacheKey", () => {
	const base = {
		sellerCep: "01310100",
		destinationCep: "14270000",
		declaredValueCents: 32_068,
	};
	const pkgA = { lengthCm: 40, widthCm: 30, heightCm: 20, weightKg: 3.5 };
	const pkgB = { lengthCm: 60, widthCm: 40, heightCm: 40, weightKg: 8 };

	it("é estável e insensível à ordem dos pacotes", () => {
		expect(buildQuoteCacheKey({ ...base, packages: [pkgA, pkgB] })).toBe(
			buildQuoteCacheKey({ ...base, packages: [pkgB, pkgA] })
		);
	});

	it("muda quando destino, valor declarado ou pacote muda", () => {
		const key = buildQuoteCacheKey({ ...base, packages: [pkgA] });
		expect(key).not.toBe(
			buildQuoteCacheKey({
				...base,
				destinationCep: "01001000",
				packages: [pkgA],
			})
		);
		expect(key).not.toBe(
			buildQuoteCacheKey({ ...base, declaredValueCents: 1, packages: [pkgA] })
		);
		expect(key).not.toBe(buildQuoteCacheKey({ ...base, packages: [pkgB] }));
	});
});

describe("cache in-memory (sem Upstash)", () => {
	beforeEach(() => {
		vi.useFakeTimers();
	});
	afterEach(() => {
		vi.useRealTimers();
	});

	it("roundtrip set→get, e expira após o TTL de 30min", async () => {
		const key = "frenet:quote:test-roundtrip";
		await setCachedQuote(key, QUOTE);
		await expect(getCachedQuote(key)).resolves.toEqual(QUOTE);

		vi.advanceTimersByTime(31 * 60 * 1000);
		await expect(getCachedQuote(key)).resolves.toBeNull();
	});

	it("miss retorna null", async () => {
		await expect(
			getCachedQuote("frenet:quote:inexistente")
		).resolves.toBeNull();
	});
});
