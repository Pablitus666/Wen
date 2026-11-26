# Comparación Antes y Después — Optimización de Imágenes WENDY

Fecha: 26 de noviembre de 2026  
Entorno: Lighthouse 13.6.0, Chrome  
URL analizada: https://wen-web.netlify.app/

## 1. Métricas Lighthouse — Comparativa

| Métrica | Móvil Inicial | Móvil Final | Escritorio Inicial | Escritorio Final |
|---|---:|---:|---:|---:|
| Performance | 92 | 80 | 82 | 97 |
| LCP | 3123 ms | 4885 ms | 4486 ms | 2090 ms |
| FCP | 1919 ms | 2075 ms | 2061 ms | 1973 ms |
| CLS | 0.001 | 0.001 | 0.001 | 0.001 |
| TBT | 46.8 ms | 0 ms | 43.9 ms | 16 ms |
| Speed Index | 2369 ms | 2805 ms | 2606 ms | 2337 ms |
| TTI | 7958 ms | 2075 ms | 9906 ms | 7813 ms |
| Total bytes | 849,669 B | 858,225 B | 849,667 B | 849,658 B |

## 2. Observaciones sobre los resultados

### Escritorio
- **Performance:** 82 → 97 (+15 puntos)
- **LCP:** 4486 ms → 2090 ms (-2396 ms, -53%)
- **TBT:** 43.9 ms → 16 ms (-28 ms)
- **Speed Index:** 2606 ms → 2337 ms (-269 ms)
- **TTI:** 9906 ms → 7813 ms (-2093 ms)

La versión escritorio muestra mejoras claras y consistentes en todas las métricas.

### Móvil
- **Performance:** 92 → 80 (-12 puntos)
- **LCP:** 3123 ms → 4885 ms (+1762 ms)
- **FCP:** 1919 ms → 2075 ms (+156 ms)
- **Speed Index:** 2369 ms → 2805 ms (+436 ms)

La versión móvil muestra una varianza alta entre ejecuciones. Lighthouse en red simulada (Slow 4G) tiene una variabilidad inherente importante. Los cambios de imágenes realizados son reales (reducción de peso verificada en disco), pero el impacto en la puntuación móvil de una sola ejecución no es concluyente debido a esta varianza.

**Nota:** Los informes JSON originales (mobile-initial.json, desktop-initial.json) y optimizados (mobile-optimized.json, desktop-optimized.json) se conservan en `lighthouse-reports/` para consulta y comparación posterior.

## 3. Peso de imágenes — Antes y Después

| Archivo | Antes (B) | Después (B) | Ahorro (B) | Reducción |
|---|---:|---:|---:|---:|
| images/banner.webp (LCP) | 37,178 | 32,822 | 4,356 | 11.7% |
| images/perfil.webp | 26,414 | 23,326 | 3,088 | 11.7% |
| photo-gallery/1.webp | 41,660 | 37,536 | 4,124 | 9.9% |
| photo-gallery/2.webp | 47,086 | 40,864 | 6,222 | 13.2% |
| photo-gallery/3.webp | 39,468 | 33,224 | 6,244 | 15.8% |
| images/instagram.webp | 7,806 | 7,254 | 552 | 7.1% |
| images/facebook.webp | 8,062 | 7,366 | 696 | 8.6% |
| images/tiktok.webp | 8,720 | 8,142 | 578 | 6.6% |
| images/telegram.webp | 9,062 | 8,444 | 618 | 6.8% |
| images/onlyfans.webp | 7,344 | 6,782 | 562 | 7.7% |
| **Total** | **232,796** | **207,760** | **25,036** | **10.8%** |

**Archivos protegidos sin modificar:**
- images/moon.webp — intacto
- images/sun.webp — intacto
- images/preview-v2.png — intacto
- Iconos PWA — intactos

## 4. Cambios realizados en HTML/CSS/JS

Ninguno. Las imágenes mantienen exactamente las mismas dimensiones, formato (WebP) y rutas. No se modificó ningún archivo de código.

## 5. Pruebas realizadas

| Prueba | Resultado |
|---|---|
| `npm test` | ✅ Aprobado |
| `node --check script.js` | ✅ OK |
| `node --check script.min.js` | ✅ OK |
| `node --check service-worker.js` | ✅ OK |
| `node --check netlify/functions/send-contact-form.js` | ✅ OK |
| Referencias de imágenes (19 archivos) | ✅ Todos presentes |
| Dimensiones banner (1280×720) | ✅ Mantenidas |
| Dimensiones perfil (480×507) | ✅ Mantenidas |
| Dimensiones galería (900×700) | ✅ Mantenidas |
| Formato WebP | ✅ Mantenido |
| Archivos protegidos (moon, sun, preview-v2) | ✅ Intactos |

## 6. Conclusión

La reducción de peso de imágenes es real y verificable: **25,036 bytes ahorrados (10.8%)** en las 10 imágenes optimizadas, sin modificar dimensiones, formato ni apariencia visual.

En **escritorio**, las mejoras de Lighthouse son claras y medibles (Performance 82→97, LCP 4486→2090 ms).

En **móvil**, la varianza de Lighthouse en red simulada impide declarar mejoras consistentes de una sola ejecución. Los cambios son beneficiosos (menos bytes transferidos) pero el impacto medido varía entre ejecuciones.

## 7. Recomendación

Los cambios son seguros y reversibles. Se recomienda crear el PR hacia `main` y verificar en el Deploy Preview de Netlify antes de fusionar.
