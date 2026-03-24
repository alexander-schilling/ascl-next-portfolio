# ASCL Portfolio (Next.js)

Portafolio personal migrado desde un export HTML de Stitch a una base modular en Next.js (App Router + TypeScript + Tailwind).

## Requisitos

- Node.js `>= 20.9.0`
- npm `>= 10`

## Comandos

```bash
npm install
npm run dev
```

```bash
npm run lint
npm run build
```

## Estructura

- `src/app/layout.tsx`: metadata global, fuentes, estilos base.
- `src/app/page.tsx`: composicion principal por secciones.
- `src/components/layout/`: header y footer.
- `src/components/sections/`: secciones del portafolio (hero, about, experience, passions, gaming, contact).
- `src/data/portfolio.ts`: contenido centralizado y editable.
- `src/types/portfolio.ts`: contratos tipados para datos y componentes.

## Notas de produccion

- Imagenes remotas configuradas en `next.config.mjs` para `lh3.googleusercontent.com`.
- Interacciones de UI ("View Prior Milestones") implementadas con estado React en cliente.
- SEO base configurado con `metadata` en `src/app/layout.tsx`.
