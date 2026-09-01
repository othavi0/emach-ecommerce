/**
 * Único ponto do app que injeta JSON-LD. `<` vira < para que dado do
 * catálogo (nome/descrição de produto) nunca feche o <script>.
 */
export function JsonLdScript({ data }: { data: object }) {
	return (
		<script
			// biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD exige <script> inline; "<" escapado bloqueia injeção via dados do catálogo
			dangerouslySetInnerHTML={{
				__html: JSON.stringify(data).replace(/</g, "\\u003c"),
			}}
			type="application/ld+json"
		/>
	);
}
