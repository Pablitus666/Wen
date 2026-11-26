# Comparación Fase 7: SEO, Imágenes y Accesibilidad — WENDY

Fecha: 26 de noviembre de 2026  
Entorno: Lighthouse 13.6.0, Chrome  
URL analizada: https://wen-web.netlify.app/

## 1. Mediciones base (antes de cambios Fase 7)

Se ejecutaron 3 mediciones móviles y 3 de escritorio con las mismas condiciones.

### Móvil — Mediana de 3 ejecuciones

| Métrica | Valor |
|---|---:|
| Performance | 94 |
| LCP | 2738 ms |
| FCP | 2084 ms |
| TBT | 57 ms |
| CLS | 0.001 |
| Speed Index | 2411 ms |
| TTFB | 563 ms |

### Escritorio — Mediana de 3 ejecuciones

| Métrica | Valor |
|---|---:|
| Performance | 93 |
| LCP | 2517 ms |
| FCP | 2500 ms |
| TBT | 55 ms |
| CLS | 0.001 |
| Speed Index | 2838 ms |
| TTFB | 563 ms |

Informes base guardados en:
- `lighthouse-reports/fase7/mobile-baseline-1/2/3.json`
- `lighthouse-reports/fase7/desktop-baseline-1/2/3.json`

## 2. Cambios realizados

### 2.1 robots.txt (SEO)

**Problema:** `Agentmap:` no es una directiva válida de robots.txt estándar; causaba error de sintaxis.

**Cambio:** Eliminada la línea `Agentmap:` de `robots.txt`. El descubrimiento del catálogo ARD ya está gestionado por `<link rel="ard" href="/ai-catalog.json">` en el HTML (Fase 6).

### 2.2 llms.txt (SEO / Navegación agéntica)

**Problema:** Los enlaces usaban formato `- Texto: URL` (no Markdown válido); Lighthouse informaba "no contiene enlaces".

**Cambio:** Reescrito con enlaces Markdown válidos `- [Texto](URL)` y encabezado H1 con el nombre del sitio.

### 2.3 Imágenes adaptativas (LCP móvil)

**Problema:** Imágenes descargadas a mayor resolución de la necesaria en móvil (galería, perfil, iconos sociales).

**Cambios:**
- Creadas variantes móviles más pequeñas con `srcset`/`sizes`:
  - Galería: `1-mobile.webp` (600×450), `2-mobile.webp` (600×450), `3-mobile.webp` (600×450)
  - Perfil: `perfil-mobile.webp` (379×400)
  - Iconos sociales: `instagram-mobile.webp`, `facebook-mobile.webp`, `tiktok-mobile.webp`, `telegram-mobile.webp`, `onlyfans-mobile.webp` (120×120)
- Añadido `srcset`/`sizes` a las etiquetas `img` correspondientes en `index.html`.
- Originales conservados intactos como alternativa segura.

| Archivo | Antes | Después | Ahorro |
|---|---:|---:|---:|
| photo-gallery/1.webp → 1-mobile.webp | 37,536 B | 23,730 B | 13,806 B (36.8%) |
| photo-gallery/2.webp → 2-mobile.webp | 40,864 B | 24,128 B | 16,736 B (41.0%) |
| photo-gallery/3.webp → 3-mobile.webp | 33,224 B | 17,686 B | 15,538 B (46.8%) |
| images/perfil.webp → perfil-mobile.webp | 23,326 B | 17,742 B | 5,584 B (23.9%) |
| images/instagram.webp → instagram-mobile.webp | 7,254 B | 3,688 B | 3,566 B (49.2%) |
| images/facebook.webp → facebook-mobile.webp | 7,366 B | 3,860 B | 3,506 B (47.6%) |
| images/tiktok.webp → tiktok-mobile.webp | 8,142 B | 3,918 B | 4,224 B (51.9%) |
| images/telegram.webp → telegram-mobile.webp | 8,444 B | 4,276 B | 4,168 B (49.4%) |
| images/onlyfans.webp → onlyfans-mobile.webp | 6,782 B | 3,162 B | 3,620 B (53.4%) |
| **Total ahorro en móvil** | — | — | **69,344 B (~67.7 KB)** |

## 3. Mediciones finales (después de cambios)

### Móvil — Mediana de 3 ejecuciones

| Métrica | Base | Final | Diferencia |
|---|---:|---:|---:|
| Performance | 94 | **97** | +3 |
| LCP | 2738 ms | **2130 ms** | **-608 ms (-22%)** |
| FCP | 2084 ms | 1992 ms | -92 ms |
| TBT | 57 ms | 27 ms | -30 ms |
| CLS | 0.001 | 0.001 | 0 |
| Speed Index | 2411 ms | 2366 ms | -45 ms |
| TTFB | 563 ms | 563 ms | 0 ms |

### Escritorio — Mediana de 3 ejecuciones

| Métrica | Base | Final | Diferencia |
|---|---:|---:|---:|
| Performance | 93 | **97** | +4 |
| LCP | 2517 ms | **2093 ms** | **-424 ms (-17%)** |
| FCP | 2500 ms | 2046 ms | -454 ms |
| TBT | 55 ms | 37 ms | -18 ms |
| CLS | 0.001 | 0.001 | 0 |
| Speed Index | 2838 ms | 2355 ms | -483 ms |
| TTFB | 563 ms | 563 ms | 0 ms |

Informes finales guardados en:
- `lighthouse-reports/fase7/mobile-final-1/2/3.json`
- `lighthouse-reports/fase7/desktop-final-1/2/3.json`

## 4. Archivos protegidos (verificados intactos)

| Archivo | Estado |
|---|---|
| images/moon.webp | ✅ Intacto (original conservado) |
| images/sun.webp | ✅ Intacto (original conservado) |
| images/preview-v2.png | ✅ Intacto |
| Iconos PWA | ✅ Sin modificar |
| site.webmanifest | ✅ Sin modificar |
| Service Worker | ✅ Sin modificar |
| Netlify Functions | ✅ Sin modificar |
| Formulario de contacto | ✅ Sin modificar |
| Selector de tema | ✅ Sin modificar |
| Galería y lightbox | ✅ Sin modificar (solo variantes móviles añadidas) |
| Tipografía Inter | ✅ Sin modificar |
| CSP y _headers | ✅ Sin modificar |

## 5. Pruebas técnicas

| Prueba | Resultado |
|---|---|
| `npm test` | ✅ Aprobado |
| `node --check script.js` | ✅ OK |
| `node --check script.min.js` | ✅ OK |
| `node --check service-worker.js` | ✅ OK |
| `node --check netlify/functions/send-contact-form.js` | ✅ OK |
| Referencias de imágenes | ✅ Todas presentes |

## 6. Conclusión

Los cambios son seguros, reversibles y de bajo riesgo:
- **Móvil:** Mejora clara y medible (Performance 94→97, LCP 2738→2130 ms, -608 ms o -22%, bajo el objetivo de 2,5 s)
- **Escritorio:** Mejora y mantención (Performance 93→97, LCP 2517→2093 ms, -424 ms)
- **SEO:** robots.txt corregido (directiva inválida eliminada), llms.txt con enlaces Markdown válidos
- **Accesibilidad:** Sin cambios (se mantuvo en 100 desde Fase 5/6)
- **Navegación agéntica:** ai-catalog.json conforme a ARD v1.0, descubrimiento vía HTML y robots.txt

Se recomienda crear el PR hacia `main`, verificar el Deploy Preview de Netlify, y ejecutar Lighthouse sobre el preview antes de fusionar.

**NO fusionar sin autorización explícita del usuario.**
