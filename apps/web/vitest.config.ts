import { resolve } from "node:path";
import { defineConfig } from "vitest/config";

// Testes que batem no Supabase compartilhado (precisam de DATABASE_URL). O
// `vitest.workspace.ts` roda esta lista em série, num processo só, e o test:ci
// (VITEST_UNIT_ONLY=1) a deixa de fora até haver um Postgres efêmero no CI.
// A guarda `vitest.workspace.test.ts` não usa banco, mas fica aqui para o
// test:ci não mudar.
export const INTEGRATION = [
	"**/lib/auto-promo.integration.test.ts",
	"**/lib/tool-images.integration.test.ts",
	"**/checkout/_lib/place-order.test.ts",
	"**/checkout/_actions/revalidate-cart.test.ts",
	"**/lib/coupons/validate-coupon.test.ts",
	"**/catalog/_lib/facet-counts.test.ts",
	"**/catalog/_lib/catalog-data.test.ts",
	"vitest.workspace.test.ts",
];

export default defineConfig({
	resolve: {
		alias: {
			"@": resolve(import.meta.dirname, "src"),
		},
	},
	css: {
		postcss: {},
	},
	test: {
		environment: "node",
		setupFiles: ["./vitest.setup.ts"],
	},
});
