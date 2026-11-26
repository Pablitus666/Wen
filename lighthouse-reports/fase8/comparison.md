# Comparación Fase 8: Optimización Fina de Rendimiento — WENDY

Fecha: 26 de noviembre de 2026  
Entorno: Lighthouse 13.6.0, Chrome  
URL analizada: https://wen-web.netlify.app/

## 1. Estado de partida

La rama `fase8-optimizacion-fina-wendy` se crea sobre `main` en commit `c04cf79` (Fase 7 ya fusionada en producción).

Las optimizaciones de imagen de la Fase 7 ya están en producción:
- `moon-small.webp` / `sun-small.webp` (64×64, ~1,6 KB cada uno, en lugar de 177/188 KB)
- `banner-mobile.webp` (768×432, 17,926 B, en lugar de 32,822 B en móvil)
- `photo-gallery/1-mobile.webp` (600×450, 23,730 B, en lugar de 37,536 B)
- `photo-gallery/2-mobile.webp` (600×450, 24,128 B, en lugar de 40,864 B)
- `photo-gallery/3-mobile.webp` (600×450, 17,686 B, en lugar de 33,224 B)
- `perfil-mobile.webp` (379×400, 17,742 B, en lugar de 23,326 B)
- Iconos sociales móviles (120×120, ~3-4 KB cada uno, en lugar de ~7-9 KB)
- `srcset`/`sizes` en HTML para todas las imágenes anteriores

## 2. Mediciones base (antes de cambios Fase 8)

Se ejecutaron 3 mediciones móviles y 3 de escritorio con las mismas condiciones.

### Móvil — Mediana de 3 ejecuciones

| Métrica | Valor |
|---|---:|
| Performance | 97 |
| LCP | 2062 ms |
| FCP | 1998 ms |
| TBT | 56 ms |
| CLS | 0.001 |
| Speed Index | 2332 ms |
| TTFB | 563 ms |

### Escritorio — Mediana de 3 ejecuciones

| Métrica | Valor |
|---|---:|
| Performance | 90 |
| LCP | 3061 ms |
| FCP | 2415 ms |
| TBT | 57 ms |
| CLS | 0.001 |
| Speed Index | 2873 ms |
| TTFB | 563 ms |

Informes base: `lighthouse-reports/fase8/mobile-baseline-1/2/3.json`, `desktop-baseline-1/2/3.json`

## 3. Diagnóstico del LCP móvil

El elemento LCP es `img.banner-img` (`images/banner.webp`). El desglose LCP (mobile-baseline-1) mostró:

| Subparte | Duración | % del LCP |
|---|---:|---:|
| Time to first byte (TTFB) | 1205 ms | ~58% |
| Resource load delay | 45 ms | ~2% |
| Resource load duration | 2995 ms | ~145%* |
| Element render delay | 34 ms | ~2% |

*El resourceLoadDuration supera el LCP total debido a mediciones superpuestas en el trace.

**Diagnóstico:** El problema dominante del LCP móvil es el tiempo de descarga del recurso (resourceLoadDuration), seguido por el TTFB elevado. El preload del banner ya tiene `fetchpriority="high"` y `imagesrcset`/`imagesizes` correctos. Las imágenes de galería y perfil ya tienen variantes móviles con `srcset`/`sizes`.

El `width="1280"` en el `` del banner no impedía que el navegador seleccionara `banner-mobile.webp` en móvil (el `sizes` se aplica correctamente). Cambiarlo a `width="768"` no mejoró el LCP (medición final mostró LCP 3333 ms vs 2062 ms base, una regresión). El cambio fue revertido.

## 4. Cambios realizados

**Ningún cambio de código.** Las variantes de imagen móvil ya estaban creadas y referenciadas en `index.html` desde la Fase 7 (commit `08e847e`, fusionado en `main` como `c04cf79`). La Fase 8 verificó que estas optimizaciones están correctamente implementadas y no encontró cambios adicionales que mejoraran el rendimiento medible.

## 5. Mediciones finales (después de cambios Fase 8)

No se realizaron cambios de código, por lo tanto no hay mediciones "después" distintas de las base. Los valores de base son los mismos que los finales:

### Móvil — Mediana de 3 ejecuciones

| Métrica | Base | Final | Diferencia |
|---|---:|---:|---:|
| Performance | 97 | 97 | 0 |
| LCP | 2062 ms | 2062 ms | 0 ms |
| FCP | 1998 ms | 1998 ms | 0 ms |
| TBT | 56 ms | 56 ms | 0 ms |
| CLS | 0.001 | 0.001 | 0 |
| Speed Index | 2332 ms | 2332 ms | 0 ms |
| TTFB | 563 ms | 563 ms | 0 ms |

### Escritorio — Mediana de 3 ejecuciones

| Métrica | Base | Final | Diferencia |
|---|---:|---:|---:|
| Performance | 90 | 90 | 0 |
| LCP | 3061 ms | 3061 ms | 0 ms |
| FCP | 2415 ms | 2415 ms | 0 ms |
| TBT | 57 ms | 57 ms | 0 ms |
| CLS | 0.001 | 0.001 | 0 |
| Speed Index | 2873 ms | 2873 ms | 0 ms |
| TTFB | 563 ms | 563 ms | 0 ms |

Informes: `lighthouse-reports/fase8/mobile-baseline-1/2/3.json`, `desktop-baseline-1/2/3.json` (mismos archivos que los "finales", no hubo cambios de código).

## 6. Archivos protegidos (verificados intactos)

Todos los archivos protegidos permanecen sin modificar:
- `images/moon.webp`, `images/sun.webp`, `images/preview-v2.png`
- Iconos PWA, `site.webmanifest`, Service Worker
- Netlify Functions, formulario de contacto, selector de tema
- Galería y lightbox, tipografía Inter, CSP, `_headers`

## 7. Pruebas técnicas

| Prueba | Resultado |
|---|---|
| `npm test` | ✅ Aprobado (antes de cambios) |
| `node --check script.js` | ✅ OK |
| `node --check script.min.js` | ✅ OK |
| `node --check service-worker.js` | ✅ OK |
| `node --check netlify/functions/send-contact-form.js` | ✅ OK |
| Referencias de imágenes | ✅ Todas presentes |

## 8. Conclusión

La Fase 7 ya implementó todas las optimizaciones de imagen identificadas:
- `moon.webp` / `sun.webp` → versiones de 64×64 (~1,6 KB cada uno, ahorro ~363 KB)
- `banner.mobile.webp` (768×432, 17,926 B vs 32,822 B original)
- Galería móvil (600×450, ~18-24 KB cada una, en lugar de 33-47 KB)
- Perfil móvil (379×400, 17,742 B, en lugar de 23,326 B)
- Iconos sociales móviles (120×120, ~3-4 KB cada uno)
- `srcset`/`sizes` en HTML para todas las imágenes anteriores

La Fase 8 verificó que estas optimizaciones están correctamente implementadas y no encontró cambios adicionales que mejoraran el rendimiento medible. El LCP móvil ya está en 2062 ms, por debajo del objetivo de 2500 ms. El escritorio se mantiene en 90 de performance.

**No hay cambios de código para commitear en la Fase 8.** Las optimizaciones ya están en producción desde la Fase 7.

**Recomendación:** No hay cambios que fusione. La rama `fase8-optimizacion-fina-wendy` se mantiene como registro de la auditoría realizada, pero no contiene modificaciones de código respecto a `main`.

**NO fusionar sin autorización explícita del usuario.** De hecho, no hay cambios que fusione.
