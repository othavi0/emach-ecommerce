import type { Metadata } from "next";
import { Barlow, Barlow_Condensed } from "next/font/google";

import "../index.css";
import Header from "@/components/header";
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
	title: "emach",
	description: "emach",
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
				<Providers>
					<div className="grid h-svh grid-rows-[auto_1fr]">
						<Header />
						{children}
					</div>
				</Providers>
			</body>
		</html>
	);
}
