import { Button } from "@emach/ui/components/button";
import { Input } from "@emach/ui/components/input";
import Link from "next/link";

const footerColumns = [
	{
		title: "PRODUTOS",
		links: [
			{ label: "Ferramentas Elétricas", href: "/catalog?cat=eletricas" },
			{ label: "Ferramentas Manuais", href: "/catalog?cat=manuais" },
			{ label: "Medição", href: "/catalog?cat=medicao" },
			{ label: "Segurança", href: "/catalog?cat=seguranca" },
			{ label: "Acessórios", href: "/catalog?cat=acessorios" },
		],
	},
	{
		title: "SUPORTE",
		links: [
			{ label: "Central de Ajuda", href: "#" },
			{ label: "Garantia", href: "#" },
			{ label: "Assistência Técnica", href: "#" },
			{ label: "Rastrear Pedido", href: "#" },
		],
	},
	{
		title: "EMPRESA",
		links: [
			{ label: "Sobre a EMACH", href: "#" },
			{ label: "Trabalhe Conosco", href: "#" },
			{ label: "Imprensa", href: "#" },
			{ label: "Contato", href: "#" },
		],
	},
] as const;

export function SiteFooter() {
	return (
		<footer className="dark bg-dark-surface px-10 py-10">
			<div className="grid grid-cols-1 gap-10 md:grid-cols-4">
				{footerColumns.map((col) => (
					<div key={col.title}>
						<h4 className="mb-4 font-display font-semibold text-white text-xs uppercase tracking-wider">
							{col.title}
						</h4>
						<ul className="space-y-2">
							{col.links.map((link) => (
								<li key={link.label}>
									<Link
										className="text-muted-foreground text-sm transition-colors hover:text-white"
										href={link.href}
									>
										{link.label}
									</Link>
								</li>
							))}
						</ul>
					</div>
				))}
				<div>
					<h4 className="mb-4 font-display font-semibold text-white text-xs uppercase tracking-wider">
						NEWSLETTER
					</h4>
					<p className="mb-4 text-muted-foreground text-sm">
						Receba novidades e ofertas exclusivas.
					</p>
					<div className="flex gap-2">
						<Input
							className="h-11 flex-1 bg-white/5 text-sm text-white placeholder:text-muted-foreground"
							placeholder="seu@email.com"
							type="email"
						/>
						<Button className="h-11 px-5">Cadastrar</Button>
					</div>
				</div>
			</div>
			<div className="mt-10 border-white/10 border-t pt-6 text-center text-muted-foreground text-xs">
				© 2026 EMACH. Todos os direitos reservados.
			</div>
		</footer>
	);
}
