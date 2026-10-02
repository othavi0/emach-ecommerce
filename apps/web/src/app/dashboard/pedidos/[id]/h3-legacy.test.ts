import { readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { filesUnder, scanForLegacyTokens } from "@/test/h3-legacy-scan";

const DIR = "app/dashboard/pedidos/[id]";
const FILES = filesUnder(DIR);
const SRC_ROOT = resolve(import.meta.dirname, "../../../..");

describe(`${DIR} sem token visual anterior ao H3`, () => {
	it("varre os arquivos da pasta", () => {
		expect(FILES.length).toBeGreaterThan(0);
	});

	it("não tem token legado", () => {
		expect(scanForLegacyTokens(FILES)).toEqual([]);
	});

	it("não usa o poço de foto antigo", () => {
		const hits = FILES.filter((file) =>
			readFileSync(join(SRC_ROOT, file), "utf8").includes(
				"emach-bg-placeholder"
			)
		);
		expect(hits).toEqual([]);
	});
});
