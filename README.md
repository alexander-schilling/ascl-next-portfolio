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
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

- El frontend publica paginas por idioma en `/:lang` (ej: `/en`, `/es`).
- La raiz `/` resuelve el idioma en este orden: cookie guardada, `Accept-Language` del navegador, geolocalizacion del hosting (si expone headers compatibles), y fallback final a `en`.
- Cualquier visita a `/:lang` actualiza la cookie `preferred-language` para recordar la preferencia del usuario.
- El frontend consulta `GET /portfolio?lang=en|es` desde ese backend.
- `getPortfolioData` cachea en servidor el resultado por idioma y revalida cada `PORTFOLIO_CACHE_REVALIDATE_SECONDS` segundos (por defecto: `300`).
- El switch de idioma preserva la ruta actual, los query params y el `#hash` de seccion.
- En `development` muestra un aviso con faltantes. En `production`, ese aviso solo aparece si `NEXT_PUBLIC_SHOW_CONTENT_WARNINGS=true`.
- `NEXT_PUBLIC_SITE_URL` define la URL canonica usada por metadata, `robots.txt` y `sitemap.xml`.

## Docker

Se incluye un `Dockerfile` multi-stage para produccion y un `docker-compose.yml` para levantar el frontend con variables de entorno explicitas.
La imagen final prioriza menor tamaño usando `node:20-alpine` + `output: "standalone"` de Next.js.

### Archivo de entorno para Docker

Usa el ejemplo versionado y copialo a un archivo local antes de levantar los contenedores:

```bash
cp .env.docker.example .env.docker
```

`NODE_ENV`, `PORT` y `PORTFOLIO_*` se pasan al contenedor como variables de runtime.
Las variables `NEXT_PUBLIC_*` se evalúan durante `next build`, por lo que `docker-compose.yml` las pasa tanto al build como al runtime.

### Build manual

```bash
docker build \
  --build-arg NEXT_PUBLIC_SHOW_CONTENT_WARNINGS=false \
  --build-arg NEXT_PUBLIC_SITE_URL=http://localhost:3000 \
  -t ascl-next-portfolio .
docker run --rm -p 3000:3000 \
  -e NODE_ENV=production \
  -e PORT=3000 \
  -e PORTFOLIO_API_BASE_URL=https://tu-backend.example.com \
  -e PORTFOLIO_CACHE_REVALIDATE_SECONDS=300 \
  -e NEXT_PUBLIC_SHOW_CONTENT_WARNINGS=false \
  -e NEXT_PUBLIC_SITE_URL=http://localhost:3000 \
  ascl-next-portfolio
```

### Docker Compose

```bash
docker compose --env-file .env.docker up --build
```

`PORT` controla tanto el puerto interno del contenedor como el publicado por Compose (`PORT:PORT`).

Si no defines `PORTFOLIO_API_BASE_URL`, la app sigue funcionando con el fallback local ya implementado en `src/lib/portfolio-api.ts`.

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

## Iconos desde CMS

El frontend permite definir iconos desde el CMS para varias zonas del sitio sin hardcodearlos en los componentes.
La logica vive en `src/lib/portfolio-api.ts` y las claves soportadas se centralizan en `src/lib/content-icons.ts`.

### Secciones que aceptan iconos

- `about_badge_1`: badge 1 de About (`about.features[0]`)
- `about_badge_2`: badge 2 de About (`about.features[1]`)
- `portfolio_career.description`: cada `<p>` o `<div>` puede definir su propio icono en Experience
- `photo_title`: icono del titulo de Photography
- `hispano_title`: icono del titulo de Comunidad Hispano / Gaming

### Formatos soportados

Puedes usar cualquiera de estos formatos dentro del contenido HTML del CMS:

#### 1. Atributo `data-icon`

```html
<div data-icon="leadership">
  <h4>Leadership</h4>
  <p>Guiding teams, growing talent.</p>
</div>
```

Tambien se aceptan estos atributos equivalentes:

- `data-icon`
- `data-icon-key`
- `icon`
- `identifier`

#### 2. Tag `<icon>`

```html
<div>
  <icon>architecture</icon>
  Architected a real-time fraud detection engine.
</div>
```

#### 3. Token al inicio del texto

```html
<p>[icon:groups] Mentored a cross-functional team of 12 engineers.</p>
```

Tambien funciona la variante con doble corchete:

```html
<p>[[icon:camera]] Photography</p>
```

### Claves de icono disponibles

Usa preferentemente estas claves canonicas:

- `curiosity`
- `leadership`
- `insights`
- `groups`
- `architecture`
- `rocket_launch`
- `smartphone`
- `bolt`
- `camera`
- `joystick`

> Nota: internamente existen aliases para algunos nombres relacionados, pero para contenido CMS se recomienda usar siempre las claves canonicas de la lista anterior.

### Ejemplos por seccion

#### About badges (`about_badge_1`, `about_badge_2`)

```html
<div data-icon="curiosity">
  <h4>Curiosity</h4>
  <p>Lifelong learner since 1996.</p>
</div>
```

```html
<div data-icon="leadership">
  <h4>Leadership</h4>
  <p>Guiding teams, growing talent.</p>
</div>
```

#### Career highlights (`portfolio_career.description`)

Cada highlight debe venir dentro de un `<p>` o `<div>`.
Cada bloque puede tener su propio icono.

```html
<p data-icon="insights">Reduced processing latency by 65%.</p>
<p>[icon:groups] Mentored a cross-functional team of 12 engineers.</p>
<div><icon>architecture</icon>Architected a real-time fraud detection engine.</div>
```

#### Photography (`photo_title`)

```html
<span data-icon="camera">Photography</span>
```

o bien:

```html
[[icon:camera]] Photography
```

#### Comunidad Hispano / Gaming (`hispano_title`)

```html
<span data-icon="joystick">Comunidad Hispano</span>
```

### Fallbacks y comportamiento

- Si `about_badge_1` o `about_badge_2` no definen icono, el frontend intenta inferir uno segun el texto.
- Si un highlight de `portfolio_career.description` no trae icono, el frontend intenta inferirlo a partir del contenido del texto.
- Si `photo_title` o `hispano_title` no traen icono, se usa el fallback local definido en `src/data/portfolio.ts`.
- Los tokens como `[icon:camera]` o `[[icon:camera]]` se eliminan del texto final renderizado; solo se usan como metadata.

### Links de empresa en Career

Ademas de los iconos de highlights, cada item de `portfolio_career` puede mostrar iconos junto al nombre de la empresa si el backend envia:

- `company_url`: muestra icono de Website
- `company_linkedin`: muestra icono de LinkedIn

Ambos enlaces se renderizan con `target="_blank"` en la tarjeta de experiencia.

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
