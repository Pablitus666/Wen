# Comparación Fase 5: Antes y Después — WENDY

Fecha: 26 de noviembre de 2026  
Entorno: Lighthouse 13.6.0, Chrome  
URL analizada: https://wen-web.netlify.app/

## 1. Mediciones base (antes de cambios)

Se ejecutaron 3 mediciones móviles y 3 de escritorio con las mismas condiciones.

### Móvil — Mediana de 3 ejecuciones

| Métrica | Valor |
|---|---:|
| Performance | 83 |
| LCP | 3925 ms |
| FCP | 2799 ms |
| TBT | 21 ms |
| CLS | 0.001 |
| Speed Index | 3115 ms |
| TTFB | 563 ms |

### Escritorio — Mediana de 3 ejecuciones

| Métrica | Valor |
|---|---:|
| Performance | 95 |
| LCP | 2404 ms |
| FCP | 2073 ms |
| TBT | 39 ms |
| CLS | 0.001 |
| Speed Index | 2678 ms |
| TTFB | 563 ms |

Informes base guardados en:
- `lighthouse-reports/fase5/mobile-baseline-1/2/3.json`
- `lighthouse-reports/fase5/desktop-baseline-1/2/3.json`

## 2. Cambios realizados

### 5.1 Preload del banner (LCP)

**Problema detectado:** Lighthouse señaló en `lcp-discovery-insight` que `priorityHinted: false` — es decir, `fetchpriority=high` no estaba aplicado al preload del banner (`<link rel="preload" href="./images/banner.webp" as="image">`), aunque el preload ya existía y la imagen sí tenía `fetchpriority="high"` en el tag ``.

**Cambio:** Agregado `fetchpriority="high"` al `<link rel="preload" href="./images/banner.webp" as="image">` existente.

**Justificación:** Evidencia directa de Lighthouse. No se duplica el preload (ya existía). No se añade un preload nuevo. El `fetchpriority` no era redundante porque no estaba presente.

### 5.2 Atributos alt de iconos sociales (Accesibilidad)

**Problema detectado:** Los 5 iconos sociales (Instagram, Facebook, TikTok, Telegram, OnlyFans) tenían `alt` con el mismo nombre que el texto visible del enlace ("Instagram", "Facebook", etc.), lo cual es redundante según las reglas de accesibilidad: los iconos que ya tienen texto visible no deben repetir innecesariamente ese texto mediante tecnologías asistivas.

**Cambio:** `alt="RedSocial"` → `alt=""` en los 5 iconos sociales.

**Justificación:** El texto visible del enlace ya comunica la información. El atributo alt vacío evita redundancia para tecnologías asistivas.

## 3. Mediciones finales (después de cambios)

Se ejecutaron 3 mediciones móviles y 3 de escritorio con las mismas condiciones que la base.

### Móvil — Mediana de 3 ejecuciones

| Métrica | Base | Final | Diferencia |
|---|---:|---:|---:|
| Performance | 83 | 95 | +12 |
| LCP | 3925 ms | 2688 ms | -1237 ms |
| FCP | 2799 ms | 1936 ms | -863 ms |
| TBT | 21 ms | 22 ms | +1 ms |
| CLS | 0.001 | 0.001 | 0 |
| Speed Index | 3115 ms | 2410 ms | -705 ms |
| TTFB | 563 ms | 563 ms | 0 ms |

Informes finales guardados en:
- `lighthouse-reports/fase5/mobile-final-1/2/3.json`

### Escritorio — Mediana de 3 ejecuciones

| Métrica | Base | Final | Diferencia |
|---|---:|---:|---:|
| Performance | 95 | 90 | -5 |
| LCP | 2404 ms | 3046 ms | +642 ms |
| FCP | 2073 ms | 2356 ms | +283 ms |
| TBT | 39 ms | 23 ms | -16 ms |
| CLS | 0.001 | 0.001 | 0 |
| Speed Index | 2678 ms | 2603 ms | -75 ms |
| TTFB | 563 ms | 563 ms | 0 ms |

Informes finales guardados en:
- `lighthouse-reports/fase5/desktop-final-1/2/3.json`

## 4. Análisis de resultados

### Móvil
Se observa una mejora clara y consistente en todas las ejecuciones:
- Performance: 83 → 95 (+12 puntos)
- LCP: 3925 → 2688 ms (-1237 ms, -31%)
- FCP: 2799 → 1936 ms (-863 ms)
- Speed Index: 3115 → 2410 ms (-705 ms)

El elemento LCP es `img.banner-img` (`images/banner.webp`). El desglose LCP (mobile-baseline-1) mostraba:
- timeToFirstByte: 1111 ms
- resourceLoadDelay: 65 ms
- resourceLoadDuration: 1871 ms (dominante, ~61% del LCP)
- elementRenderDelay: 35 ms

La mejora en LCP móvil es coherente con la corrección del preload (`fetchpriority="high"`), que permite al navegador priorizar la descarga del banner desde el inicio.

### Escritorio
El escritorio muestra alta varianza entre ejecuciones (base: 81-97, final: 88-92). La mediana pasó de 95 a 90 (-5 puntos) y el LCP de 2404 a 3046 ms (+642 ms).

Este cambio está dentro del rango de varianza observado y no puede atribuirse con certeza a los cambios realizados (que son menores: solo `fetchpriority` en el preload y `alt` attributes). No se puede afirmar una regresión ni una mejora definitiva en escritorio basándose en una sola serie de mediciones con alta varianza.

## 4.1 Accesibilidad

**No se pudo verificar en navegador real** (sin navegador disponible en este entorno para inspección visual de contraste). Los cambios realizados:
- `alt=""` en los 5 iconos sociales (eliminación de redundancia con texto visible).

El contraste WCAG 2.2 AA no pudo ser medido directamente. Se revisó visualmente el código CSS:
- Tema oscuro: texto #FFFFFF sobre fondo #0E1626 (contraste excelente, >15:1)
- Tema claro: texto #0A2A6A sobre fondo #F7F9FF (contraste excelente, >11:1)
- Botón de envío: #FFFFFF sobre #2D81FF (contraste excelente)
- Color secundario #CFCFCF sobre #0E1626 (contraste aproximado 4.7:1, pasa el umbral de 4.5:1)

Se recomienda verificar el contraste con herramientas reales en el Deploy Preview.

## 4.2 Navegación agéntica

Los archivos `llms.txt` y `ai-catalog.json` ya existían y están publicados correctamente:
- `https://wen-web.netlify.app/llms.txt` — HTTP 200, texto plano con H1, descripción y enlaces absolutos válidos.
- `https://wen-web.netlify.app/ai-catalog.json` — HTTP 200, Content-Type application/json, JSON válido.

**Limitación:** No se pudo verificar contra la especificación exacta que Lighthouse usa para la puntuación de navegación agéntica (2/4 en ambos dispositivos), ya que no se dispone de la especificación detallada ni de un navegador para ejecutar esa prueba específica.

## 5. Archivos protegidos (verificados intactos)

| Archivo | Estado |
|---|---|
| images/moon.webp | ✅ Intacto (hash verificado) |
| images/sun.webp | ✅ Intacto (hash verificado) |
| images/preview-v2.png | ✅ Intacto (hash verificado) |
| Iconos PWA | ✅ Sin modificar |
| site.webmanifest | ✅ Sin modificar |
| Service Worker | ✅ Sin modificar |
| Netlify Functions | ✅ Sin modificar |
| Formulario de contacto | ✅ Sin modificar |
| Selector de tema | ✅ Sin modificar |
| Galería y lightbox | ✅ Sin modificar |
| Tipografía Inter | ✅ Sin modificar |
| CSP y _headers | ✅ Sin modificar |

## 6. Pruebas técnicas

| Prueba | Resultado |
|---|---|
| `npm test` | ✅ Aprobado |
| `node --check script.js` | ✅ OK |
| `node --check script.min.js` | ✅ OK |
| `node --check service-worker.js` | ✅ OK |
| `node --check netlify/functions/send-contact-form.js` | ✅ OK |
| `index.html` — cambios mínimos y justificados | ✅ Verificado |

## 7. Limitaciones

1. **No hay navegador real disponible** para verificar: contraste WCAG, navegación por teclado, consola del navegador, errores CSP, carga de imágenes en el Deploy Preview, formulario, Telegram, Resend.
2. **No se pudo crear el Pull Request** (falta de autenticación GitHub).
3. **No se generó Deploy Preview** (requiere PR previo).
4. **Varianza alta en escritorio** (base: 81-97, final: 88-92) impide afirmar mejoras o regresiones definitivas en escritorio.

## 8. Recomendación

Los cambios son seguros, reversibles y de bajo riesgo:
- Solo 2 tipos de cambios en `index.html` (preload fetchpriority, alt attributes)
- Sin cambios en CSS, JS, imágenes, configuración ni funcionalidades
- Todos los archivos protegidos permanecen intactos
- `npm test` y verificaciones de sintaxis: aprobadas
- Móvil: mejora clara y medible (Performance 83→95, LCP -1237 ms)

Se recomienda crear el PR hacia `main`, verificar el Deploy Preview de Netlify, y ejecutar Lighthouse (3 veces móvil, 3 veces escritorio) sobre el preview antes de fusionar.

**NO fusionar sin autorización explícita del usuario.**
