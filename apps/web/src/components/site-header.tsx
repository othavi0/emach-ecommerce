import { Button } from "@emach/ui/components/button";
import { Search, ShoppingBag, User } from "lucide-react";
import Link from "next/link";

const navLinks = [
	{ href: "/catalog", label: "Catálogo" },
	{ href: "/catalog?cat=eletricas", label: "Elétricas" },
	{ href: "/catalog?cat=manuais", label: "Manuais" },
	{ href: "/catalog?cat=medicao", label: "Medição" },
] as const;

export function SiteHeader() {
	return (
		<header className="flex h-[52px] items-center justify-between bg-absolute-black px-10">
			<div className="flex items-center gap-8">
				<Link className="font-bold text-lg text-white tracking-[2px]" href="/">
					EMACH
				</Link>
				<nav className="hidden items-center gap-6 md:flex">
					{navLinks.map((link) => (
						<Link
							className="font-semibold text-sm text-white/80 transition-colors hover:text-white"
							href={link.href}
							key={link.href}
						>
							{link.label}
						</Link>
					))}
				</nav>
			</div>
			<div className="flex items-center gap-4">
				<button className="text-white/80 hover:text-white" type="button">
					<Search className="size-[18px]" />
				</button>
				<Link className="text-white/80 hover:text-white" href="/login">
					<User className="size-[18px]" />
				</Link>
				<Link className="text-white/80 hover:text-white" href="/cart">
					<ShoppingBag className="size-[18px]" />
				</Link>
				<Button nativeButton={false} render={<Link href="/login" />} size="sm">
					Entrar
				</Button>
			</div>
		</header>
	);
}
