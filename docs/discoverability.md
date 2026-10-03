# Rastreo y contacto público

Las páginas `/es` y `/en` entregan la biografía, trayectoria y contacto en HTML.
`robots.txt` permite rastreo público; `sitemap.xml` anuncia las páginas canónicas
y sus variantes de idioma. Ambos se generan en runtime con `SITE_URL`, porque el
dominio se configura en Dokploy después de construir la imagen Docker.

El selector de idioma contiene enlaces normales, utilizables sin JavaScript.
Al activarlos desde un navegador conserva la sección y los parámetros actuales.

El perfil JSON-LD `ProfilePage` / `Person` se obtiene del mismo contenido del CMS
que la página: nombre, descripción, primer cargo de la trayectoria, empresa,
ubicación, foto, correo, perfiles públicos y CV. Actualizar el CMS actualiza ambas
representaciones. No se inventan métricas ni disponibilidad laboral.

El correo visible se envuelve en comentarios `email_off` según la documentación
de Cloudflare. Esa excepción conserva el enlace `mailto:` para lectores sin JS,
sin desactivar la protección del resto del dominio. El HTML y el JSON-LD escapan
el contenido del CMS antes de insertarlo.

## Verificación

```powershell
npm test
node scripts/check-discoverability.mjs https://alexanderschilling.cl
```

La comprobación consulta HTML real sin ejecutar JavaScript, robots, sitemap,
CVs y varias identificaciones de bots. No acredita acceso desde las IP de todos
los crawlers ni confirma indexación. Search Console y los eventos de Cloudflare
aportan esa evidencia adicional. La galería interactiva no es necesaria para
entender el perfil profesional.

## Pasos del propietario

1. Añadir o abrir la propiedad de dominio `alexanderschilling.cl` en Google
   Search Console. Si hace falta verificarla, añadir en Cloudflare el TXT exacto
   indicado por Google y completar la verificación.
2. Con la versión publicada, enviar `https://alexanderschilling.cl/sitemap.xml`.
3. Inspeccionar `/es` y `/en`, comprobar la URL canónica y solicitar indexación.
4. Consultar después los informes de indexación y rendimiento. Revisar en
   Cloudflare los eventos de bots si aparecen rechazos de crawlers legítimos.

No se necesita `llms.txt` para los resultados de IA de Google. Permitir rastreo y
publicar contacto no garantiza posicionamiento, citas de IA ni ofertas de empleo.

Referencias: [Google y funciones de IA](https://developers.google.com/search/docs/appearance/ai-features),
[ProfilePage](https://developers.google.com/search/docs/appearance/structured-data/profile-page),
[Cloudflare email obfuscation](https://developers.cloudflare.com/waf/tools/scrape-shield/email-address-obfuscation/),
[OpenAI crawlers](https://developers.openai.com/api/docs/bots).
