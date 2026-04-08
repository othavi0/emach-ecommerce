# Design Spec: Ferrari Design System — Pencil + shadcn

> Catálogo visual completo no Pencil MCP + instalação de componentes shadcn para o e-commerce emach.

## Escopo

1. **Catálogo de Design System** no Pencil (`.pen`) com tokens, componentes e estados
2. **6 páginas do e-commerce** designed no Pencil: Landing, Catálogo, Produto, Carrinho, Checkout, Login
3. **21 componentes shadcn** novos instalados em `packages/ui/`

## Abordagem: Component-First

Tokens → Componentes reusáveis → Páginas compostas. Componentes mapeiam 1:1 com shadcn.

---

## 1. Foundation — Variáveis Pencil

### Cores Light

| Variável | Hex | Papel |
|---|---|---|
| `--background` | `#FFFFFF` | Superfície editorial branca |
| `--foreground` | `#181818` | Texto primário (Near Black) |
| `--primary` | `#DA291C` | Ferrari Red — CTAs |
| `--primary-foreground` | `#FFFFFF` | Texto sobre Ferrari Red |
| `--secondary` | `#FFFFFF` | Botão branco padrão |
| `--secondary-foreground` | `#000000` | Texto sobre botão branco |
| `--muted` | `#D2D2D2` | Dividers, superfícies sutis |
| `--muted-foreground` | `#666666` | Texto secundário |
| `--destructive` | `#F13A2C` | Warning Red (distinto do brand red) |
| `--border` | `#CCCCCC` | Bordas |
| `--card` | `#FFFFFF` | Background de cards |
| `--card-foreground` | `#181818` | Texto de cards |

### Cores Dark (seções cinemáticas)

| Variável | Hex | Papel |
|---|---|---|
| `--dark-background` | `#181818` | Near Black |
| `--dark-foreground` | `#FFFFFF` | Texto branco |
| `--dark-muted` | `#303030` | Dark Surface |
| `--dark-muted-foreground` | `#8F8F8F` | Mid Gray |
| `--dark-border` | `#FFFFFF1A` | Bordas sutis |
| `--dark-card` | `#303030` | Cards dark |

### Cores Especiais

| Variável | Hex | Papel |
|---|---|---|
| `--teal-hover` | `#1EAEDB` | Hover de botões |
| `--link-blue` | `#3860BE` | Hover de links |
| `--racing-yellow` | `#FFF200` | Heritage accent |
| `--modena-yellow` | `#F6E500` | Heritage accent 2 |
| `--success` | `#03904A` | Status positivo |
| `--info` | `#4C98B9` | Status informativo |
| `--dark-red` | `#B01E0A` | Hover do Ferrari Red |
| `--absolute-black` | `#000000` | Hero/cinematic |
| `--dark-surface` | `#303030` | Footer/newsletter |
| `--silver-gray` | `#969696` | Placeholder text |
| `--mid-gray` | `#8F8F8F` | Texto terciário |

### Tipografia

| Variável | Fonte | Papel |
|---|---|---|
| `--font-sans` | `Barlow` | Headings, body, botões, nav |
| `--font-display` | `Barlow Condensed` | Labels/tags — uppercase + 1px letter-spacing |

### Escala Tipográfica

| Papel | Size | Weight | LS | Fonte |
|---|---|---|---|---|
| Section Title | 26px | 500 | normal | Barlow |
| Card Heading | 24px | 400 | normal | Barlow |
| Subheading | 18px | 700 | normal | Barlow |
| UI Heading | 16px | 500 | 0.08px | Barlow |
| Button Label | 16px | 400 | 1.28px | Barlow |
| Nav Link | 13px | 600 | 0.13px | Barlow |
| Caption | 13px | 400 | 0.195px | Barlow |
| Label Upper | 12px | 400 | 1px | Barlow Condensed + uppercase |
| Micro Label | 11px | 400 | 1px | Barlow Condensed + uppercase |

---

## 2. Componentes Reusáveis

Cada componente criado como `reusable: true` no Pencil. Frame lateral "Design System".

### 2.1 Buttons

| Variante | BG | Text | Border | Hover |
|---|---|---|---|---|
| Primary Red | `#DA291C` | `#FFFFFF` | none | `#B01E0A` |
| Secondary White | `#FFFFFF` | `#000000` | `1px #000000` | `#1EAEDB` bg, white text |
| Ghost | transparent | `#FFFFFF` | `1px #FFFFFF` | `#1EAEDB` bg |
| Text Link | transparent | `#181818` | none | `#3860BE` text |

Propriedades: `border-radius: 0`, `padding: 12px 10px`, `Barlow 16px/400`, `letter-spacing: 1.28px`
Estados: Default, Hover, Focus (ring `#DA291C`), Disabled (opacity 0.5)

### 2.2 Input Group

- Label: `Barlow Condensed 12px/400 uppercase, 1px LS, #8F8F8F`
- Input: `border: 1px #CCCCCC`, `padding: 8px 12px`, `Barlow 14px`, `border-radius: 0`
- Focus: border `#DA291C`
- Error: border `#F13A2C` + mensagem erro

### 2.3 Cards

- **Editorial (light):** bg white, sem shadow, imagem full-width, heading Barlow 16px/700 #181818, caption BC 12px uppercase #8F8F8F
- **Cinematic (dark):** bg #000, heading Barlow 24px/500 white, caption BC 11px uppercase #969696

### 2.4 Dialog

- Overlay: `hsla(0,0%,7%,0.8)`, container white, `border-radius: 8px`

### 2.5 Navigation

- Header: bg #000, h52, links Barlow 13px/600 white
- Footer: bg #303030, 4-col, Barlow Condensed uppercase

### 2.6 Badge

`border-radius: 0`, BC 11px uppercase, bg `#DA291C` (primary) ou `#303030` (muted)

### 2.7 Table

Sem bordas externas, header BC uppercase, rows border-bottom `1px #D2D2D2`

### 2.8 Tabs

Sem bg, indicador inferior `2px #DA291C`, Barlow 13px/600

### 2.9 Select

Mesmo estilo Input, dropdown `border: 1px #CCCCCC`

### 2.10 Accordion

Barlow 16px/500, chevron, border-bottom `#D2D2D2`

### 2.11 Breadcrumb

Barlow 13px/400 #8F8F8F, ativo #181818, separador `/`

### 2.12 Pagination

Barlow 13px, ativo `bg #DA291C text #FFF`, default `border 1px #CCCCCC`

### 2.13 Avatar

`border-radius: 50%`, iniciais como fallback

### 2.14 Tooltip

bg #000, text white, Barlow 12px, border-radius 2px

### 2.15 Sheet

Slide-in lateral, bg white, header + close

### 2.16 Carousel

Arrows + dot indicators (dots circulares 50%)

### 2.17 Toggle

`border-radius: 2px`, bg `#DA291C` quando ativo

### 2.18 Textarea

Mesmo estilo Input, multi-line

### 2.19 Separator

`1px #D2D2D2` (light) / `1px #FFFFFF1A` (dark)

### 2.20 Scroll Area

Scrollbar 4px `#D2D2D2`, hover `#8F8F8F`

### 2.21 Popover

bg white, border `1px #CCCCCC`, border-radius 2px

---

## 3. Páginas (1440px wide)

### 3.1 Landing Page

Chiaroscuro: Header(dark) → Hero(dark) → Editorial(light) → Featured(dark) → Products(light) → Newsletter(dark) → Footer(dark)

- Hero: full-bleed #000, headline Barlow 26px/500 white, Ghost CTA
- Editorial: 2-col image+text, BC labels uppercase
- Products: grid 3-4 cols, editorial cards
- Newsletter: #303030, input + Subscribe Red

### 3.2 Catálogo

Header + sidebar filtros 240px (Accordion) + grid 3-col + Pagination + Footer

### 3.3 Produto Detail

2-col: gallery carousel + info (tag BC, título 26px, preço 24px/700, Select, Add to Cart Red, Ghost wishlist) + Tabs + Related dark carousel

### 3.4 Carrinho

2-col: items table + order summary card (subtotal, frete, total, Checkout Red, Continue Ghost)

### 3.5 Checkout

Header mínimo + 2-col: form steps (Tabs/Accordion) + order summary sticky + Footer mínimo

### 3.6 Login

Full-page dark #000 + card branco centrado (email + password + Sign In Red + Create Account link)

---

## 4. shadcn Components a Instalar

```
dialog sheet table tabs badge avatar select separator tooltip 
accordion breadcrumb navigation-menu pagination toggle toggle-group 
textarea popover command scroll-area aspect-ratio carousel
```

Via: `bunx shadcn@latest add [acima] -c packages/ui`

---

## 5. Decisões de Design

| Decisão | Escolha | Motivo |
|---|---|---|
| border-radius | 0px em tudo (exceto modal 8px, avatar/dots 50%) | DESIGN.md: "razor precision" |
| Ferrari Red | Apenas em CTAs primários | DESIGN.md: "sua força vem da parcimônia" |
| Shadows | Nenhum em cards/componentes | Profundidade via contraste de superfícies |
| Chiaroscuro | Seções alternadas dark/light | Ritmo editorial de revista de luxo |
| Fontes | Barlow (texto) + Barlow Condensed (labels uppercase) | Substitutos de FerrariSans e Body-Font |

---

## 6. Verificação

1. `get_screenshot` de cada frame Pencil
2. Comparar visualmente com `design/preview.html` e `design/preview-dark.html`
3. `bun run check-types` após instalar componentes
4. `bun x ultracite check` para lint/format
