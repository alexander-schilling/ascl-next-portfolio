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
PORTFOLIO_CACHE_REVALIDATE_SECONDS=300
NEXT_PUBLIC_SHOW_CONTENT_WARNINGS=false
```

- El frontend publica paginas por idioma en `/:lang` (ej: `/en`, `/es`).
- La raiz `/` resuelve el idioma en este orden: cookie guardada, `Accept-Language` del navegador, geolocalizacion del hosting (si expone headers compatibles), y fallback final a `en`.
- Cualquier visita a `/:lang` actualiza la cookie `preferred-language` para recordar la preferencia del usuario.
- El frontend consulta `GET /portfolio?lang=en|es` desde ese backend.
- `getPortfolioData` cachea en servidor el resultado por idioma y revalida cada `PORTFOLIO_CACHE_REVALIDATE_SECONDS` segundos (por defecto: `300`).
- El switch de idioma preserva la ruta actual, los query params y el `#hash` de seccion.
- En `development` muestra un aviso con faltantes. En `production`, ese aviso solo aparece si `NEXT_PUBLIC_SHOW_CONTENT_WARNINGS=true`.

## Identifiers esperados en `portfolio_files`

- `hero_background`: fondo de la seccion Hero (`hero.backgroundImageUrl`)
- `resume`: CV publico (`resumeUrl`)
- `brand_logo`: logo header/footer (`brandLogoUrl`)
- `profile_picture`: retrato de About (`about.portraitUrl`)
- `hispano_banner`: imagen principal de Gaming (`gaming.imageUrl`)

## Catalogo de `content.type` esperado

Estos son los tipos minimos que el frontend espera en `portfolio_content`.
La fuente unica de verdad es `src/types/portfolio-api.ts` (`EXPECTED_CONTENT_TYPES`).
Ademas, el frontend reporta:

- `missingContentTypes`: tipos faltantes
- `duplicateContentTypes`: tipos repetidos
- `unknownContentTypes`: tipos que no estan en el catalogo

- `header_brand`
- `story_button`
- `career_button`
- `passions_button`
- `contact_button`
- `header_resume_button`
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
- `experience_show_more_button`
- `photo_title`
- `photo_description`
- `photo_instagram`
- `photo_gallery_1_title`
- `photo_gallery_2_title`
- `photo_gallery_3_title`
- `hispano_title`
- `hispano_description`
- `hispano_badge_1`
- `hispano_badge_2`
- `contact_title`
- `contact_description`
- `contact_base_label`
- `contact_base_value`
- `contact_currently_reading_label`
- `contact_currently_reading_value`
- `language_switcher_en_label`
- `language_switcher_es_label`
- `seo_title`
- `seo_description`
- `seo_open_graph_description`
- `seo_site_name`
- `manifest_name`
- `manifest_short_name`
- `manifest_description`
- `footer_brand`
- `footer_note`

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
- `src/lib/portfolio-social.ts`: mapeo de socials por contexto (footer vs hispano/gaming).
- `src/types/portfolio.ts`: contratos tipados para datos y componentes.

## Notas de produccion

- Imagenes remotas configuradas en `next.config.mjs` para `lh3.googleusercontent.com`.
- Interacciones de UI ("View Prior Milestones") implementadas con estado React en cliente.
- SEO localizado configurado con metadata por idioma en `src/app/[lang]/layout.tsx`.
- Tests unitarios disponibles con Vitest para el analizador de `content.type` y el helper de routing i18n.
- `portfolio_social` usa identifiers especificos por contexto: `linkedin`, `photo_instagram`, `github` para footer/contacto y `hispano_discord`, `hispano_web`, `hispano_instagram` para `gaming.links`.
