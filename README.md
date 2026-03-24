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
npm test
npm run build
```

## Variables de entorno

```bash
PORTFOLIO_API_BASE_URL=https://tu-backend.example.com
NEXT_PUBLIC_SHOW_CONTENT_WARNINGS=false
```

- El frontend publica paginas por idioma en `/:lang` (ej: `/en`, `/es`).
- El frontend consulta `GET /portfolio?lang=en|es` desde ese backend.
- El switch de idioma preserva la ruta actual, los query params y el `#hash` de seccion.
- En `development` muestra un aviso con faltantes. En `production`, ese aviso solo aparece si `NEXT_PUBLIC_SHOW_CONTENT_WARNINGS=true`.

## Catalogo de `content.type` esperado

Estos son los tipos minimos que el frontend espera en `portfolio_content`.
La fuente unica de verdad es `src/types/portfolio-api.ts` (`EXPECTED_CONTENT_TYPES`).
Ademas, el frontend reporta:

- `missingContentTypes`: tipos faltantes
- `duplicateContentTypes`: tipos repetidos
- `unknownContentTypes`: tipos que no estan en el catalogo

- `banner_badge`
- `banner_title`
- `banner_subtitle`
- `banner_story_button`
- `banner_work_button`
- `about_status`
- `about_content`
- `about_badge_1`
- `about_badge_2`
- `career_subtitle`
- `career_title`
- `career_description`
- `photo_title`
- `photo_description`
- `photo_instagram`
- `hispano_title`
- `hispano_description`
- `hispano_badge_1`
- `hispano_badge_2`
- `contact_title`
- `contact_description`

## Estructura

- `src/app/layout.tsx`: metadata global, fuentes, estilos base.
- `src/app/[lang]/layout.tsx`: metadata SEO localizada por idioma.
- `src/app/page.tsx`: redireccion al idioma por defecto.
- `src/app/[lang]/page.tsx`: composicion principal por secciones por idioma.
- `src/components/layout/`: header y footer.
- `src/components/sections/`: secciones del portafolio (hero, about, experience, passions, gaming, contact).
- `src/data/portfolio.ts`: fallback local si el backend no esta disponible.
- `src/lib/i18n-routing.ts`: helper para cambio de idioma preservando search/hash.
- `src/lib/portfolio-api.ts`: fetch + mapeo de respuesta backend a la UI.
- `src/lib/portfolio-content-types.ts`: analizador del catalogo de `content.type`.
- `src/types/portfolio.ts`: contratos tipados para datos y componentes.

## Notas de produccion

- Imagenes remotas configuradas en `next.config.mjs` para `lh3.googleusercontent.com`.
- Interacciones de UI ("View Prior Milestones") implementadas con estado React en cliente.
- SEO localizado configurado con metadata por idioma en `src/app/[lang]/layout.tsx`.
- Tests unitarios disponibles con Vitest para el analizador de `content.type` y el helper de routing i18n.
