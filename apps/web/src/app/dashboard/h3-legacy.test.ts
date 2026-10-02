import { describe, expect, it } from "vitest";
import { filesUnder, scanForLegacyTokens } from "@/test/h3-legacy-scan";

const D = "app/dashboard";

const FILES = [
	`${D}/layout.tsx`,
	`${D}/page.tsx`,
	`${D}/_components/account-nav.tsx`,
	`${D}/_components/count-tabs.tsx`,
	`${D}/_components/dashboard-chrome.tsx`,
	`${D}/_components/dashboard-chrome-skeleton.tsx`,
	`${D}/_components/nav-items.ts`,
	`${D}/_components/order-preview.tsx`,
	`${D}/_components/quick-action-card.tsx`,
	`${D}/pedidos/page.tsx`,
	...filesUnder(`${D}/pedidos/_components`),
	...filesUnder(`${D}/reembolso`),
];

describe("conta (U4) sem token visual anterior ao H3", () => {
	it("nenhum achado", () => {
		expect(scanForLegacyTokens(FILES)).toEqual([]);
	});
});
