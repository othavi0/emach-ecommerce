import type { ToolListItem } from "@emach/db/queries/tools";
import { ProductCard } from "@/components/product-card";
import type { CardExtrasByTool } from "@/lib/card-data";

interface ProductGridProps {
	/** Voltagens e chips por toolId (ver `getCardExtras`). */
	extrasByTool?: CardExtrasByTool;
	tools: ToolListItem[];
}

export function ProductGrid({ extrasByTool, tools }: ProductGridProps) {
	return (
		<div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
			{tools.map((tool, index) => (
				<div
					className="emach-reveal-item"
					key={tool.id}
					style={{ "--i": index } as React.CSSProperties}
				>
					<ProductCard extras={extrasByTool?.[tool.id]} tool={tool} />
				</div>
			))}
		</div>
	);
}
