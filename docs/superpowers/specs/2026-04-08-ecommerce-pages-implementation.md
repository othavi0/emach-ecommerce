# Spec: Implementação das 6 Páginas do E-commerce EMACH

> Traduzir os designs do Pencil MCP (`~/Work/pencil/emach-ecommerce.pen`) em código React/Next.js usando os 30 componentes shadcn e tokens CSS Ferrari já instalados.

## Decisões

| Decisão | Escolha |
|---|---|
| Dados de produto | Mock data estático em `apps/web/src/lib/mock-data.ts` |
| Ordem de implementação | Landing → Login → Catálogo → Produto → Carrinho → Checkout |
| Git strategy | Branch `feat/ecommerce-pages`, commits semânticos por página |
| Abordagem | Pencil-First Pixel-Perfect — traduzir layout specs para Tailwind |
| Header global | Remover do root layout — cada página renderiza seu próprio header |

---

## 0. Preparação

### 0.1 Variáveis CSS faltantes

Adicionar ao `@theme inline` em `packages/ui/src/styles/globals.css`:

```css
--color-absolute-black: #000000;
--color-dark-surface: #303030;
--color-silver-gray: #969696;
--color-mid-gray: #8f8f8f;
--color-link-blue: #3860be;
--color-teal-hover: #1eaedb;
--color-dark-red: #b01e0a;
```

Isso permite usar `bg-absolute-black`, `text-silver-gray`, `hover:bg-teal-hover`, etc. no Tailwind.

### 0.2 Root Layout

Refatorar `apps/web/src/app/layout.tsx`:
- Remover `<Header />` do JSX
- Remover `grid h-svh grid-rows-[auto_1fr]` — cada página controla seu layout
- Manter: fontes Barlow/Barlow Condensed, `<Providers>`, `lang="pt-BR"`

### 0.3 Mock Data

Criar `apps/web/src/lib/mock-data.ts` com tipos e dados:

```ts
type Product = {
  id: string;
  slug: string;
  name: string;
  category: Category;
  price: number; // centavos
  description: string;
  specs: Record<string, string>; // voltagem, torque, etc.
  images: string[];
  badge?: "LANÇAMENTO" | "NOVO" | "PROMOÇÃO" | "BEST SELLER";
};

type Category = {
  id: string;
  slug: string;
  name: string;
  label: string; // uppercase para BC label
  description: string;
  image: string;
};
```

Produtos do Pencil (10-15 items):
- Furadeira de Impacto EMACH Pro 20V — R$ 899,00
- Serra Circular 7¼" 1800W — R$ 649,00
- Jogo de Chaves Combinadas 12pç — R$ 189,00
- Nível Laser 3 Linhas — R$ 459,00
- Kit Brocas Profissional 100pç — R$ 149,00
- Esmerilhadeira Angular 4½" — R$ 329,00
- Óculos de Proteção Anti-Impacto — R$ 49,90
- Kit Discos de Corte 50pç — R$ 89,90
- Parafusadeira 12V Compacta — R$ 349,00
- Kit Brocas SDS-Plus 10pç — R$ 129,00

Utilitário de formatação: `formatPrice(cents: number): string` → `"R$ 899,00"`

### 0.4 Imagens placeholder

Criar `/public/images/products/` com imagens placeholder. Opção: usar `/api/placeholder/[width]/[height]` ou imagens genéricas de ferramentas (Unsplash).

### 0.5 Componentes compartilhados de negócio

| Componente | Arquivo | Descrição |
|---|---|---|
| `SiteHeader` | `src/components/site-header.tsx` | Nav Ferrari: EMACH logo + links (Início, Produtos, Sobre) + icons (search, user, cart) + CTA "Entrar" |
| `SiteFooter` | `src/components/site-footer.tsx` | Footer 4-col (PRODUTOS, SUPORTE, EMPRESA, NEWSLETTER) + newsletter input |
| `CheckoutHeader` | `src/components/checkout-header.tsx` | Header mínimo: EMACH + step indicator + lock |
| `ProductCard` | `src/components/product-card.tsx` | Image + BC category label + title + price. Reusado em Landing, Catálogo, PDP related |
| `SectionLabel` | `src/components/section-label.tsx` | `<span className="font-display text-xs uppercase tracking-wider text-mid-gray">` |
| `PriceDisplay` | `src/components/price-display.tsx` | Formata e exibe preço em R$ com destaque visual |

---

## 1. Landing Page (`/`)

**Arquivo principal:** `apps/web/src/app/page.tsx` (server component)

### Layout chiaroscuro (7 seções)

1. **SiteHeader** (dark)
2. **Hero Section** (dark `#000`) — height 680px, image fill via Next.js `<Image>`, content bottom-aligned
   - Label BC: "FERRAMENTAS PROFISSIONAIS"
   - H1: "Ferramentas que Constroem o Futuro" (48px/500, max-w-[600px])
   - Subtitle: "Qualidade profissional para quem exige precisão em cada projeto." (16px, max-w-[500px])
   - CTAs: Ghost button "Ver Catálogo" + TextLink "Novidades →"
   - padding: 0 80px, justify-end, gap 16

3. **Categorias Section** (light `#FFF`) — padding 80px
   - Label + heading
   - Grid 3-col gap-24: 3× editorial cards (image + tag + title + desc)

4. **Featured Section** (dark `#181818`) — height 500px, grid 2-col
   - Left: product image fill
   - Right (560px, padding 80 60): tag + title 36px/500 + desc + price + badge + CTAs

5. **Products Section** (light `#FFF`) — padding 80px
   - Header: label + heading + "Ver Todos →"
   - Grid 4-col gap-24: 4× ProductCard

6. **Newsletter Section** (dark `#303030`) — padding 60 80, horizontal
   - Left: label + heading + desc
   - Right: email input 44h + red subscribe button

7. **SiteFooter** (dark `#303030`)

### Componentes específicos da rota
Nenhum necessário — tudo composto com shadcn + componentes compartilhados.

---

## 2. Login (`/login`)

**Arquivo principal:** `apps/web/src/app/login/page.tsx`

### Layout
Full-page dark (`#000`), centered. Card branco 420px.

### Estrutura
```
<main className="dark h-svh flex flex-col items-center justify-center gap-8">
  "EMACH" logo (24px/700, tracking-[3px])
  <div className="w-[420px] bg-white p-8 flex flex-col gap-5">
    "Entrar" (24px/500)
    Subtitle (13px muted)
    InputGroup E-MAIL
    Password field (SENHA + eye icon)
    "Esqueceu a senha?" link (right-aligned)
    Button Primary "Entrar" (h-12 w-full)
    Separator "OU"
    Button Outline "Criar Conta" (h-12 w-full)
  </div>
  Copyright (11px)
</main>
```

### Integração com auth existente
Reutilizar lógica de `sign-in-form.tsx` (TanStack Form + Better Auth), mas com layout Ferrari.

---

## 3. Catálogo (`/catalog`)

**Arquivos:**
```
app/catalog/
├── page.tsx
├── _components/
│   ├── catalog-sidebar.tsx
│   ├── product-grid.tsx
│   └── sort-bar.tsx
```

### Layout
Header + horizontal (sidebar 280px | main fill) + Footer.

### Sidebar (`_components/catalog-sidebar.tsx`)
- "FILTROS" label
- 3× Accordion: Categorias, Faixa de Preço, Voltagem
- border-right 1px muted

### Main Content
- Breadcrumb + sort row (count + sort dropdown + view toggle)
- Grid 3-col gap-20: 6× ProductCard
- Pagination centered

### Server Component
Busca do mock data com filtros (client-side inicialmente, sem URL state).

---

## 4. Produto Detail (`/product/[slug]`)

**Arquivos:**
```
app/product/[slug]/
├── page.tsx
├── _components/
│   ├── product-gallery.tsx
│   ├── product-info.tsx
│   ├── product-tabs.tsx
│   └── related-products.tsx
```

### Layout
Header + Breadcrumb + 2-col (gallery + info) + Tabs + Related dark + Footer.

### Gallery (`_components/product-gallery.tsx`)
- Main image (500h, fill width)
- 4 thumbnails (80×80, active has 2px foreground border)
- Client component para seleção de thumbnail

### Product Info (`_components/product-info.tsx`)
- Category label (BC uppercase)
- Title (28px/500)
- Description (14px)
- Price (26px/700) + Badge
- Select VOLTAGEM
- "Comprar" CTA (h-12, primary, full-width) + icon shopping-bag
- "Adicionar à Lista" (h-12, outline, full-width) + icon heart
- Meta: SKU + Disponibilidade

### Related Products (`_components/related-products.tsx`)
- Dark section (#181818)
- "VOCÊ TAMBÉM VAI GOSTAR" label
- Grid 4-col: 4× ProductCard (dark variant)

---

## 5. Carrinho (`/cart`)

**Arquivos:**
```
app/cart/
├── page.tsx
├── _components/
│   ├── cart-table.tsx         ← Client component (qty +/-)
│   └── order-summary.tsx
```

### Layout
Header + 2-col (table fill | summary 380px) + Footer.

### Cart Table (client component)
- Table header: PRODUTO | QTD | PREÇO | (trash)
- Rows com: thumbnail 64×64, name + variant, qty controls (- n +), price, trash icon
- Estado local com `useState` para qty

### Order Summary
- "RESUMO DO PEDIDO"
- Subtotal / Frete / Desconto rows
- Total bold
- "Finalizar Compra →" (primary h-12)
- "Continuar Comprando" (outline h-12)

---

## 6. Checkout (`/checkout`)

**Arquivos:**
```
app/checkout/
├── page.tsx
├── _components/
│   ├── checkout-form.tsx       ← Client component (TanStack Form)
│   ├── checkout-summary.tsx
│   └── step-indicator.tsx
```

### Layout
CheckoutHeader + 2-col (form fill | summary 380px) + minimal footer.

### CheckoutHeader (`src/components/checkout-header.tsx`)
- EMACH logo + step indicator (3 dots + lines) + lock icon
- bg absolute-black, h-[52px]

### Form (client component)
- "Informações de Contato" + inputs (NOME, SOBRENOME, E-MAIL, TELEFONE)
- "Endereço de Entrega" + inputs (ENDEREÇO, CIDADE, CEP, ESTADO)
- TanStack Form + Zod validation

---

## Padrão de Styling — Pencil → Tailwind

| Pencil Spec | Tailwind Class |
|---|---|
| `padding: [80, 80]` | `p-20` (80/4) |
| `padding: [60, 80]` | `py-15 px-20` |
| `gap: 24` | `gap-6` |
| `width: "fill_container"` | `w-full` ou `flex-1` |
| `width: 480` | `w-[480px]` |
| `height: 52` | `h-[52px]` |
| `fontSize: 48, fontWeight: 500` | `text-5xl font-medium` |
| `fontSize: 26, fontWeight: 500` | `text-2xl font-medium` |
| `fontSize: 13, fontWeight: 600` | `text-sm font-semibold` |
| BC 12px uppercase LS 1px | `font-display text-xs uppercase tracking-wider` |
| BC 11px uppercase LS 1px | `font-display text-[11px] uppercase tracking-wider` |
| `fill: "$--primary"` | `bg-primary` |
| `fill: "$--absolute-black"` | `bg-absolute-black` |
| `fill: "$--dark-surface"` | `bg-dark-surface` |
| `stroke: 1px $--border` | `border border-border` |
| `stroke: 1px $--primary` (focus) | `focus:border-primary` |
| `cornerRadius: 0` | `rounded-none` (default nos componentes) |
| `cornerRadius: 8` | `rounded-lg` (só dialog) |
| Hero image fill | `<Image fill className="object-cover">` |

---

## Verificação

Para cada página implementada:
1. `bun run dev:web` — confirmar que renderiza sem erros
2. Comparar visualmente com `get_screenshot` do Pencil
3. `bun run check-types` — zero erros TypeScript
4. `bun x ultracite check` — lint limpo
5. Testar chiaroscuro: `class="dark"` nas seções certas
6. Testar responsividade: verificar que não quebra em viewports menores (mobile não está no Pencil, mas não deve crashar)

---

## Ordem de Commits

```
feat: preparar infra para páginas do e-commerce
  - globals.css: adicionar variáveis CSS faltantes
  - layout.tsx: remover header global
  - mock-data.ts: dados mockados de ferramentas
  - componentes compartilhados (SiteHeader, SiteFooter, ProductCard, etc.)

feat: implementar landing page com chiaroscuro
feat: redesign da página de login com visual Ferrari
feat: implementar página de catálogo com sidebar e filtros
feat: implementar página de produto detail
feat: implementar página de carrinho
feat: implementar página de checkout
```
