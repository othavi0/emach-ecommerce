import { SiteFooter } from "@/components/site-footer";

export default function ShopLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<>
			{children}
			<SiteFooter />
		</>
	);
}
