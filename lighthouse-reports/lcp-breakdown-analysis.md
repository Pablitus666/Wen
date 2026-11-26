# Análisis de Desglose LCP — WENDY

Fecha: 26 de noviembre de 2026  
Entorno: Lighthouse 13.6.0, Chrome, emulación móvil (Moto G Power, Slow 4G) y escritorio  
URL analizada: https://wen-web.netlify.app/

## 1. Métricas LCP globales

| Métrica | Móvil | Escritorio |
|---|---:|---:|
| LCP | 3123 ms | 4486 ms |
| FCP | 1919 ms | 2061 ms |
| TTFB | 1021 ms | 1163 ms |
| Server response | 563 ms | 563 ms |
| Total bytes | 849,669 B | 849,667 B |

## 2. Elemento LCP

- **Selector:** `main > header.header > div.header-banner > img.banner-img`
- **Recurso:** `./images/banner.webp`
- **URL completa:** `https://wen-web.netlify.app/images/banner.webp`
- **Etiqueta HTML:** `<img src="./images/banner.webp" alt="Banner de presentación" class="banner-img" width="1280" height="720" fetchpriority="high" loading="eager">`
- **Dimensiones de visualización:** 386 × 250 px (móvil), 386 × 250 px (escritorio)
- **Dimensiones del archivo:** 1280 × 720 px
- **Peso actual:** 37,178 bytes

## 3. Desglose LCP (LCP Breakdown)

### Móvil

| Subparte | Duración | % del LCP |
|---|---:|---:|
| Time to first byte (TTFB) | 1021 ms | ~33 % |
| Resource load delay | 43 ms | ~1 % |
| Resource load duration | 2027 ms | ~65 % |
| Element render delay | 31 ms | ~1 % |
| **Total LCP** | **3123 ms** | **100 %** |

### Escritorio

| Subparte | Duración | % del LCP |
|---|---:|---:|
| Time to first byte (TTFB) | 1163 ms | ~26 % |
| Resource load delay | 71 ms | ~2 % |
| Resource load duration | 3215 ms | ~72 % |
| Element render delay | 38 ms | ~1 % |
| **Total LCP** | **4486 ms** | **100 %** |

## 4. Descubrimiento del recurso LCP (LCP Discovery)

| Check | Móvil | Escritorio |
|---|---|---|
| `requestDiscoverable` (descubrible en documento inicial) | true | true |
| `eagerlyLoaded` (no usa `loading=lazy`) | true | true |
| `priorityHinted` (fetchpriority=high aplicado al preload) | false | false |

**Observación:** El recurso es descubrible y se carga con prioridad (`fetchpriority="high"`, `loading="eager"`). Sin embargo, Lighthouse indica que `fetchpriority=high` no está aplicado al **preload** (`<link rel="preload" href="./images/banner.webp" as="image">` no incluye `fetchpriority`).

## 5. Tiempo de respuesta del servidor

- Móvil: 563 ms
- Escritorio: 563 ms
- Ahorro potencial indicado: 463 ms (opportunity)

## 6. Conclusión del problema dominante

El problema dominante del LCP es el **tiempo de descarga del recurso (resource load duration)**:

- Móvil: 2027 ms de 3123 ms (65 %)
- Escritorio: 3215 ms de 4486 ms (72 %)

Esto indica que reducir el peso de `images/banner.webp` es la acción de mayor impacto para mejorar el LCP. El TTFB también es relevante (33 % móvil, 26 % escritorio) pero está fuera del alcance de optimización de archivos estáticos (depende del servidor Netlify y la red).

El elemento render delay es mínimo (~1 %), por lo que el CSS no retrasa significativamente la presentación del banner.

## 7. Recomendación de acción

Optimizar `images/banner.webp` (37,178 B → objetivo: reducir sin pérdida visual perceptible) es la acción prioritaria. El ahorro estimado por Lighthouse es de aproximadamente 22 KB en "Improve image delivery".

También se podría considerar añadir `fetchpriority="high"` al `<link rel="preload">` del banner, aunque el impacto es secundario respecto a la reducción de peso.

## 8. Archivos protegidos (no modificar)

- `images/moon.webp`
- `images/sun.webp`
- `images/preview-v2.png`
- Iconos PWA
- `site.webmanifest`
- Service Worker
- Netlify Functions
- Formulario de contacto, Telegram, Resend
- Selector de tema
- Galería y lightbox
- Tipografía Inter
- CSP y `_headers`
- Diseño, colores, dimensiones, comportamiento responsive
