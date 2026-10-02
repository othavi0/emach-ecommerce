import { describe, expect, it } from "vitest";
import { scanForLegacyTokens } from "@/test/h3-legacy-scan";

const SUPPORT_PAGES = [
	"components/institutional-page.tsx",
	"app/(shop)/sobre/page.tsx",
	"app/(shop)/entrega/page.tsx",
	"app/(shop)/privacidade/page.tsx",
	"app/not-found.tsx",
	"app/(shop)/product/[slug]/not-found.tsx",
	"app/error.tsx",
	"app/global-error.tsx",
] as const;

describe("páginas de apoio no H3", () => {
	it("não usam token visual anterior ao H3", () => {
		expect(scanForLegacyTokens(SUPPORT_PAGES)).toEqual([]);
	});
});
