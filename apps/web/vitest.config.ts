import { resolve } from "node:path";
import { defineConfig } from "vitest/config";

// Testes que batem no Supabase compartilhado: o `vitest.workspace.ts` roda a
// lista em série e o test:ci a deixa de fora. A guarda `vitest.workspace.test.ts`
// não usa banco; entra aqui só para o test:ci não mudar (#246).
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
