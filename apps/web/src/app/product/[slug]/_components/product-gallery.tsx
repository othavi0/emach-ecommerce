"use client";

import Image from "next/image";
import { useState } from "react";

interface ProductGalleryProps {
	images: string[];
	name: string;
}

export function ProductGallery({ images, name }: ProductGalleryProps) {
	const [selectedIndex, setSelectedIndex] = useState(0);
	const selectedImage =
		images[selectedIndex] ?? images[0] ?? "/images/products/placeholder.png";

	return (
		<div className="flex-1">
			{/* Main image */}
			<div className="relative aspect-square overflow-hidden bg-muted">
				<Image
					alt={name}
					className="object-cover"
					fill
					priority
					sizes="(max-width: 768px) 100vw, 50vw"
					src={selectedImage}
				/>
			</div>

			{/* Thumbnails — only render when more than one image */}
			{images.length > 1 && (
				<div className="mt-3 flex gap-3">
					{images.map((src, index) => (
						<button
							className={`relative h-16 w-16 shrink-0 overflow-hidden border transition-colors ${
								selectedIndex === index
									? "border-primary"
									: "border-border hover:border-foreground/40"
							}`}
							key={src}
							onClick={() => setSelectedIndex(index)}
							type="button"
						>
							<Image
								alt={`${name} — imagem ${index + 1}`}
								className="object-cover"
								fill
								sizes="64px"
								src={src}
							/>
						</button>
					))}
				</div>
			)}
		</div>
	);
}
