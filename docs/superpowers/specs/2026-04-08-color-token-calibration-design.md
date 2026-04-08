# Calibração de Tokens de Cor — globals.css

## Context

O `globals.css` do `@emach/ui` contém dois conjuntos de CSS variables: `:root` (seções light) e `.dark` (seções dark/chiaroscuro). Os valores foram gerados pelo `shadcn init` e nunca calibrados para o design Ferrari. Isso causa dois problemas:

1. **Bug de herança de cor**: O bloco `.dark {}` define apenas CSS custom properties, mas não define `color:` — o `color` é herdado do `body` como near-black (computado uma vez no body), fazendo texto de componentes como Button outline ficar invisível em seções escuras.

2. **Tokens descalibrados**: Valores oklch não correspondem aos hex do design Ferrari (`DESIGN.md`, `.impeccable.md`). Exemplo: `--foreground` é `oklch(0.133)` ≈ `#080808`, mas deveria ser `#181818` = `oklch(0.209)`.

## Escopo

**Arquivo único**: `packages/ui/src/styles/globals.css`
**Componentes shadcn**: Nenhum componente precisa mudança — todos usam tokens semânticos.
**Páginas/layouts**: Nenhum arquivo de página precisa mudar.
**Pencil MCP**: Sincronizar tokens após a mudança.

## 1. Fix da Causa-Raiz — Herança de Cor

Adicionar ao bloco `.dark {}`:

```css
.dark {
    /* ... variáveis existentes ... */
    color: var(--foreground);
    background-color: var(--background);
}
```

**Por quê**: A propriedade CSS `color` é herdada como valor computado. O `body { @apply text-foreground }` resolve `color` uma vez como near-black. Descendentes herdam esse valor computado, mesmo dentro de `.dark` onde `--foreground` é branco. Adicionar `color: var(--foreground)` ao `.dark` faz cada seção dark re-definir a cor de texto, que filhos então herdam corretamente.

## 2. Calibração de Tokens — :root

| Token | Atual | Novo | Ferrari Hex | Motivo |
|---|---|---|---|---|
| `--foreground` | `oklch(0.133 0 0)` | `oklch(0.209 0 0)` | `#181818` | Near Black, não quase-preto |
| `--card-foreground` | `oklch(0.133 0 0)` | `oklch(0.209 0 0)` | `#181818` | Mesmo que foreground |
| `--popover-foreground` | `oklch(0.133 0 0)` | `oklch(0.209 0 0)` | `#181818` | Mesmo que foreground |
| `--secondary-foreground` | `oklch(0 0 0)` | `oklch(0.209 0 0)` | `#181818` | Era puro preto, Ferrari usa Near Black |
| `--muted` | `oklch(0.855 0 0)` | `oklch(0.864 0 0)` | `#D2D2D2` | Ajuste fino |
| `--muted-foreground` | `oklch(0.443 0 0)` | `oklch(0.510 0 0)` | `#666666` | Dark Gray para texto secundário |
| `--border` | `oklch(0.831 0 0)` | `oklch(0.845 0 0)` | `#CCCCCC` | Border Gray |
| `--input` | `oklch(0.831 0 0)` | `oklch(0.845 0 0)` | `#CCCCCC` | Mesmo que border |
| `--sidebar-foreground` | `oklch(0.133 0 0)` | `oklch(0.209 0 0)` | `#181818` | Segue foreground |
| `--sidebar-accent` | `oklch(0.855 0 0)` | `oklch(0.864 0 0)` | `#D2D2D2` | Segue muted |
| `--sidebar-accent-foreground` | `oklch(0.133 0 0)` | `oklch(0.209 0 0)` | `#181818` | Segue foreground |
| `--sidebar-border` | `oklch(0.831 0 0)` | `oklch(0.845 0 0)` | `#CCCCCC` | Segue border |

**Tokens que NÃO mudam** (já corretos): `--background`, `--card`, `--popover`, `--primary`, `--primary-foreground`, `--secondary`, `--accent`, `--accent-foreground`, `--destructive`, `--ring`, `--radius`, `--sidebar`, `--sidebar-primary`, `--sidebar-primary-foreground`, `--sidebar-ring`, `--chart-*`.

## 3. Calibração de Tokens — .dark

| Token | Atual | Novo | Ferrari Hex | Motivo |
|---|---|---|---|---|
| `--background` | `oklch(0.133 0 0)` | `oklch(0.209 0 0)` | `#181818` | Near Black (seções cinemáticas) |
| `--card` | `oklch(0.216 0 0)` | `oklch(0.309 0 0)` | `#303030` | Dark Surface |
| `--popover` | `oklch(0.216 0 0)` | `oklch(0.309 0 0)` | `#303030` | Dark Surface |
| `--secondary` | `oklch(0.133 0 0)` | `oklch(0.209 0 0)` | `#181818` | Near Black |
| `--muted` | `oklch(0.216 0 0)` | `oklch(0.309 0 0)` | `#303030` | Dark Surface |
| `--muted-foreground` | `oklch(0.592 0 0)` | `oklch(0.650 0 0)` | `#8F8F8F` | Mid Gray |
| `--accent` | `oklch(0.216 0 0)` | `oklch(0.529 0.194 26 / 10%)` | Ferrari Red @10% | Era solid dark, deveria ser brand tint |
| `--accent-foreground` | `oklch(1 0 0)` | `oklch(0.529 0.194 26)` | `#DA291C` | Era branco, deveria ser Ferrari Red |
| `--sidebar` | `oklch(0.133 0 0)` | `oklch(0.209 0 0)` | `#181818` | Segue background |
| `--sidebar-accent` | `oklch(0.216 0 0)` | `oklch(0.309 0 0)` | `#303030` | Segue muted |

**Tokens que NÃO mudam**: `--foreground`, `--card-foreground`, `--popover-foreground`, `--primary`, `--primary-foreground`, `--secondary-foreground`, `--destructive`, `--border`, `--input`, `--ring`, `--sidebar-foreground`, `--sidebar-primary`, `--sidebar-primary-foreground`, `--sidebar-accent-foreground`, `--sidebar-border`, `--sidebar-ring`, `--chart-*`.

## 4. Auditoria de Componentes

10 componentes shadcn usam `dark:` classes: `avatar`, `badge`, `button`, `checkbox`, `dropdown-menu`, `input`, `input-group`, `select`, `tabs`, `textarea`, `toggle`.

**Veredicto: Nenhum precisa mudança direta.** Todos referenciam tokens semânticos (`--input`, `--muted`, `--destructive`) que serão calibrados. As classes `dark:` são benéficas para o chiaroscuro — dão tratamento refinado (inputs com fundo sutil, borders translúcidos) dentro de seções escuras.

## 5. Pencil MCP Sync

Após atualizar `globals.css`, sincronizar as variáveis de cor no Pencil design system (`~/Work/pencil/emach-ecommerce.pen`) via `/pencil-design` para manter o design system visual alinhado.

## Verificação

1. Rodar `bun run dev:web`
2. Verificar a home page (`/`): seções alternadas dark/light com cores corretas
3. Verificar `/login`: seção dark com inputs e buttons visíveis e corretos
4. Verificar footer: Dark Surface (`#303030`) com texto legível
5. Testar Button outline em seção dark: texto branco visível, hover funciona
6. Testar Input em seção dark: fundo sutil, placeholder legível, border visível
7. Comparar visualmente com `design/preview-dark.html` para validar correspondência
