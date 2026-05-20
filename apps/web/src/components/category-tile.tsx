"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";

interface CategoryTileCategory {
	description: string | null;
	name: string;
	slug: string;
}

interface CategoryTileProps {
	category: CategoryTileCategory;
	index: number;
}

export function CategoryTile({ category, index }: CategoryTileProps) {
	const indexLabel = String(index + 1).padStart(2, "0");

	return (
		<Link
			className="group relative block aspect-[3/4] overflow-hidden border border-transparent bg-cinema-2 transition-[transform,border-color] duration-300 ease-out hover:scale-[1.015] hover:border-emach-red motion-reduce:transition-none motion-reduce:hover:scale-100"
			href={`/catalog?cat=${category.slug}`}
		>
			{/* TODO(asset): substituir placeholder por imagem/render representativa da categoria */}
			<div
				aria-hidden="true"
				className="emach-bg-category-fallback absolute top-0 right-0 left-0 h-1/2 transition-[filter] duration-[400ms] ease-out [filter:grayscale(60%)_brightness(0.7)] motion-reduce:transition-none group-hover:[filter:grayscale(0%)_brightness(1)]"
			/>

			{/* Outline gigante "01" — sai parcialmente do card */}
			<span
				aria-hidden="true"
				className="pointer-events-none absolute right-[-24px] bottom-[-48px] font-display font-medium text-[200px] text-transparent leading-none transition-[color] duration-300 ease-out [-webkit-text-stroke:1px_#2a2a2a] group-hover:[-webkit-text-stroke:1px_#da291c]"
			>
				{indexLabel}
			</span>

			{/* Bloco de texto + CTA */}
			<div className="absolute right-5 bottom-5 left-5 flex flex-col gap-3 text-white">
				<h3 className="font-display font-medium text-[42px] leading-[0.95] tracking-[0.005em] lg:text-[48px]">
					{category.name}
				</h3>
				<span aria-hidden="true" className="h-[2px] w-12 bg-emach-red" />
				<span className="inline-flex items-center gap-2 font-bold font-display text-[13px] uppercase tracking-[0.14em]">
					Explorar
					<ArrowRight
						aria-hidden="true"
						className="transition-transform duration-250 ease-out group-hover:translate-x-2 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0"
						size={16}
						strokeWidth={2}
					/>
				</span>
			</div>
		</Link>
	);
}
