# Tobias Ponce de Leon — sitio profesional

Sitio estático en React, TypeScript y Vite. Incluye animaciones con GSAP, mascota 3D liviana, portfolio, planes, preguntas frecuentes y formulario de contacto por WhatsApp.

## Ejecutar el proyecto

```bash
npm install
npm run dev
```

Para generar la versión lista para publicar:

```bash
npm run build
```

El resultado queda en `dist/`.

## Cambiar la información principal

La marca, teléfono, WhatsApp, email, Instagram, dominio, precios, colores y mensajes precargados están en `src/config/site.ts`.

- Planes y prestaciones: `src/data/plans.ts`.
- Servicios: `src/data/services.ts`.
- Proyectos, enlaces, etiquetas e imágenes: `src/data/projects.ts`.
- Textos de cada sección: `src/sections/`.
- Colores globales: `src/styles/base.css`.
- Duración y entrada de animaciones: `src/hooks/useGsapContext.ts`.
- Recorrido y poses de la mascota: `src/three/MascotExperience.tsx`.
- Forma, materiales y colores de la mascota: `src/three/Mascot.tsx`.

## Reemplazar imágenes del portfolio

Guardá las nuevas capturas en `public/projects/` y actualizá sus rutas en `src/data/projects.ts`. Se recomienda usar WebP o AVIF, mantener una proporción cercana a 16:10 para escritorio y 1:2 para celular, y conservar dimensiones explícitas en `ProjectCard.tsx`.

Las imágenes actuales son placeholders generados para evitar recursos rotos. El script `scripts/generate-placeholders.ps1` permite regenerarlos.

## Dominio y SEO

Al definir el dominio definitivo, actualizá:

1. `domain` en `src/config/site.ts`.
2. URL canonical y Open Graph en `index.html`.
3. La URL de `public/sitemap.xml`.
4. La URL del sitemap en `public/robots.txt`.

## Publicar en Cloudflare Pages

1. Subí el proyecto a un repositorio Git.
2. En Cloudflare Pages elegí **Create application > Pages > Connect to Git**.
3. Seleccioná el repositorio.
4. Usá `npm run build` como comando de compilación.
5. Usá `dist` como directorio de salida.
6. Guardá y desplegá.

No se necesitan variables de entorno para esta versión. El formulario funciona sin backend y abre WhatsApp con los datos completados.
