import { describe, expect, it } from "vitest";
import { filesUnder, scanForLegacyTokens } from "@/test/h3-legacy-scan";

const DIR = "app/dashboard/dados-pessoais";
const FILES = filesUnder(DIR);

describe(`${DIR} sem token visual anterior ao H3`, () => {
	it("varre os arquivos da pasta", () => {
		expect(FILES.length).toBeGreaterThan(0);
	});

	it("não tem token legado", () => {
		expect(scanForLegacyTokens(FILES)).toEqual([]);
	});
});
