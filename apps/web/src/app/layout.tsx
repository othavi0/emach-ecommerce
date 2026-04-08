import type { Metadata } from "next";
import { Barlow, Barlow_Condensed } from "next/font/google";

import "../index.css";
import Providers from "@/components/providers";

const barlow = Barlow({
	subsets: ["latin"],
	weight: ["400", "500", "600", "700"],
	variable: "--font-barlow",
});

const barlowCondensed = Barlow_Condensed({
	subsets: ["latin"],
	weight: ["400", "500", "600", "700"],
	variable: "--font-barlow-condensed",
});

export const metadata: Metadata = {
	title: "EMACH — Ferramentas Profissionais",
	description:
		"Ferramentas elétricas e manuais de alta performance para profissionais.",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="pt-BR">
			<body
				className={`${barlow.variable} ${barlowCondensed.variable} antialiased`}
			>
				<Providers>{children}</Providers>
			</body>
		</html>
	);
}
