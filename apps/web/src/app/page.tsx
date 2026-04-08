import { Badge } from "@emach/ui/components/badge";
import { Button } from "@emach/ui/components/button";
import { Input } from "@emach/ui/components/input";
import Image from "next/image";
import Link from "next/link";
import { ProductCard } from "@/components/product-card";
import { SectionLabel } from "@/components/section-label";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import {
	categories,
	formatPrice,
	getFeaturedProducts,
	products,
} from "@/lib/mock-data";

export default function HomePage() {
	const featuredProduct = products[0];
	const featuredProducts =
		getFeaturedProducts(4).length >= 4
			? getFeaturedProducts(4)
			: products.slice(0, 4);
	const displayCategories = categories.slice(0, 3);

	return (
		<>
			{/* Header */}
			<SiteHeader />

			<main>
				{/* 1. Hero */}
				<section className="dark relative h-[680px] bg-absolute-black">
					{/* Hero background image */}
					<Image
						alt="Ferramentas profissionais EMACH"
						className="object-cover"
						fill
						priority
						src="/images/hero-tools.png"
					/>
					{/* Cinematic gradient backdrop */}
					<div
						aria-hidden="true"
						className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-black/30"
					/>
					{/* Subtle red accent stripe at top */}
					<div
						aria-hidden="true"
						className="absolute top-0 left-0 h-[3px] w-full bg-primary"
					/>

					<div className="relative z-10 flex h-full flex-col justify-end gap-4 px-20 pb-20">
						<SectionLabel>Ferramentas Profissionais</SectionLabel>

						<h1 className="max-w-[600px] font-medium text-5xl text-foreground leading-tight">
							Precisão que constrói o futuro.
						</h1>

						<p className="max-w-[500px] text-base text-mid-gray">
							Ferramentas elétricas e manuais de alta performance para quem
							exige resultados.
						</p>

						<div className="mt-2 flex items-center gap-4">
							<Button
								nativeButton={false}
								render={<Link href="/catalog" />}
								size="lg"
								variant="outline"
							>
								Ver Catálogo
							</Button>
							<Link
								className="font-semibold text-sm text-white transition-colors hover:text-primary"
								href="/catalog?sort=new"
							>
								Novidades →
							</Link>
						</div>
					</div>
				</section>

				{/* 2. Categories */}
				<section className="px-20 py-20">
					<SectionLabel>Categorias</SectionLabel>
					<h2 className="mt-2 font-medium text-[26px]">
						Encontre a Ferramenta Ideal
					</h2>

					<div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
						{displayCategories.map((category) => (
							<Link
								className="group block"
								href={`/catalog?cat=${category.slug}`}
								key={category.slug}
							>
								<div className="relative h-[320px] overflow-hidden bg-muted">
									<Image
										alt={category.name}
										className="object-cover transition-transform duration-300 group-hover:scale-105"
										fill
										sizes="(max-width: 768px) 100vw, 33vw"
										src={category.image}
									/>
									{/* Dark gradient overlay */}
									<div
										aria-hidden="true"
										className="absolute inset-0 z-10 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity duration-300 group-hover:from-black/90"
									/>
									{/* Bottom text */}
									<div className="absolute right-0 bottom-0 left-0 z-20 p-6">
										<h3 className="font-semibold text-lg text-white">
											{category.name}
										</h3>
										<p className="mt-1 text-sm text-white/70">
											{category.description}
										</p>
									</div>
								</div>
							</Link>
						))}
					</div>
				</section>

				{/* 3. Featured Product */}
				{featuredProduct && (
					<section className="dark grid h-auto grid-cols-1 bg-background md:h-[500px] md:grid-cols-2">
						{/* Left: product image */}
						<div className="relative h-[400px] bg-muted md:h-full">
							<Image
								alt={featuredProduct.name}
								className="object-cover"
								fill
								sizes="50vw"
								src={
									featuredProduct.images[0] ??
									"/images/products/placeholder.png"
								}
							/>
						</div>

						{/* Right: product details */}
						<div className="flex flex-col justify-center gap-4 px-10 py-10 md:px-15 md:py-20">
							<SectionLabel>{featuredProduct.category}</SectionLabel>

							<h2 className="font-medium text-3xl text-foreground md:text-4xl">
								{featuredProduct.name}
							</h2>

							<p className="max-w-[460px] text-muted-foreground text-sm">
								{featuredProduct.shortDescription}
							</p>

							<div className="flex items-center gap-3">
								<span className="font-bold text-2xl text-foreground">
									{formatPrice(featuredProduct.price)}
								</span>
								{featuredProduct.badge && (
									<Badge>{featuredProduct.badge}</Badge>
								)}
							</div>

							<div className="mt-2 flex items-center gap-3">
								<Button
									nativeButton={false}
									render={<Link href={`/product/${featuredProduct.slug}`} />}
								>
									Comprar Agora
								</Button>
								<Button
									nativeButton={false}
									render={<Link href={`/product/${featuredProduct.slug}`} />}
									variant="outline"
								>
									Ver Detalhes
								</Button>
							</div>
						</div>
					</section>
				)}

				{/* 4. Products Grid */}
				<section className="px-20 py-20">
					<div className="mb-10 flex items-center justify-between">
						<div>
							<SectionLabel>Destaques</SectionLabel>
							<h2 className="mt-2 font-medium text-[26px]">
								Produtos em Destaque
							</h2>
						</div>
						<Link
							className="font-semibold text-foreground text-sm transition-colors hover:text-primary"
							href="/catalog"
						>
							Ver Todos →
						</Link>
					</div>

					<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
						{featuredProducts.map((product) => (
							<ProductCard key={product.id} product={product} />
						))}
					</div>
				</section>

				{/* 5. Newsletter */}
				<section className="dark flex flex-col items-center gap-10 bg-dark-surface px-20 py-15 md:flex-row">
					<div className="flex-1">
						<SectionLabel>Newsletter</SectionLabel>
						<h2 className="mt-2 font-medium text-2xl text-foreground">
							Fique por dentro
						</h2>
						<p className="mt-2 max-w-[400px] text-muted-foreground text-sm">
							Receba em primeira mão lançamentos, promoções exclusivas e dicas
							de uso das ferramentas EMACH.
						</p>
					</div>

					<div className="flex w-full gap-2 md:w-auto">
						<Input
							aria-label="Seu e-mail"
							className="h-11 min-w-[260px] bg-white/5 text-white placeholder:text-muted-foreground"
							placeholder="seu@email.com"
							type="email"
						/>
						<Button className="h-11 shrink-0">Cadastrar</Button>
					</div>
				</section>
			</main>

			{/* Footer */}
			<SiteFooter />
		</>
	);
}
