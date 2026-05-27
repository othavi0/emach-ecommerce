"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import { CategoryTile } from "@/components/category-tile";

interface CategoryGridCategory {
	description: string | null;
	id: string;
	imageUrl: string | null;
	name: string;
	slug: string;
}

interface CategoryGridProps {
	categories: CategoryGridCategory[];
}

const EASE = [0.16, 1, 0.3, 1] as const;

export function CategoryGrid({ categories }: CategoryGridProps) {
	const reduceMotion = useReducedMotion() ?? false;

	const containerVariants: Variants = {
		hidden: {},
		visible: {
			transition: { staggerChildren: reduceMotion ? 0 : 0.1 },
		},
	};

	const itemVariants: Variants = {
		hidden: {
			opacity: 0,
			scale: reduceMotion ? 1 : 0.95,
			y: reduceMotion ? 0 : 16,
		},
		visible: {
			opacity: 1,
			scale: 1,
			y: 0,
			transition: { duration: 0.55, ease: EASE },
		},
	};

	return (
		<motion.div
			className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4"
			initial="hidden"
			variants={containerVariants}
			viewport={{ once: true, amount: 0.2 }}
			whileInView="visible"
		>
			{categories.map((cat, idx) => (
				<motion.div key={cat.id} variants={itemVariants}>
					<CategoryTile category={cat} index={idx} />
				</motion.div>
			))}
		</motion.div>
	);
}
