export function SectionLabel({ children }: { children: React.ReactNode }) {
	return (
		<span className="font-display font-semibold text-mid-gray text-xs uppercase tracking-wider">
			{children}
		</span>
	);
}
