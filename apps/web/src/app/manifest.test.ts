import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

import manifest from "./manifest";

const APP_DIR = fileURLToPath(new URL(".", import.meta.url));
const PUBLIC_DIR = fileURLToPath(new URL("../../public/", import.meta.url));
const LEADING_SLASH = /^\//;

// Ícone servido pela convenção de arquivo do App Router (`app/favicon.ico`,
// `app/apple-icon.png`) ou pela pasta `public/`.
function iconExists(src: string) {
	const name = src.replace(LEADING_SLASH, "");

	return existsSync(`${APP_DIR}${name}`) || existsSync(`${PUBLIC_DIR}${name}`);
}

describe("manifest", () => {
	it("todo ícone aponta para um arquivo que existe", () => {
		const missing = (manifest().icons ?? [])
			.map((icon) => icon.src)
			.filter((src) => !iconExists(src));

		expect(missing).toEqual([]);
	});
});
