import type { ReactNode } from "react";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

/**
 * Moldura da loja para layout fora do grupo (shop): cabeçalho, o único
 * <main id="main-content"> (alvo do "pular para o conteúdo" do cabeçalho) e
 * rodapé. Quem renderiza dentro não abre outro <main>.
 */
export function StoreFrame({ children }: { children: ReactNode }) {
	return (
		<div className="flex min-h-screen flex-col">
			<SiteHeader />
			<main className="flex-1" id="main-content">
				{children}
			</main>
			<SiteFooter />
		</div>
	);
}
