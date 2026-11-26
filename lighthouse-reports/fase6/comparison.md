# Comparación Fase 6: Optimización Integral — WENDY

Fecha: 26 de noviembre de 2026  
Entorno: Lighthouse 13.6.0, Chrome  
URL analizada: https://wen-web.netlify.app/

## 1. Mediciones base (antes de cambios Fase 6)

Se ejecutaron 3 mediciones móviles y 3 de escritorio con las mismas condiciones.

### Móvil — Mediana de 3 ejecuciones

| Métrica | Valor |
|---|---:|
| Performance | 79 |
| LCP | 4354 ms |
| FCP | 2050 ms |
| TBT | 13 ms |
| CLS | 0.001 |
| Speed Index | 2717 ms |
| TTFB | 563 ms |

### Escritorio — Mediana de 3 ejecuciones

| Métrica | Valor |
|---|---:|
| Performance | 90 |
| LCP | 3397 ms |
| FCP | 1959 ms |
| TBT | 17 ms |
| CLS | 0.001 |
| Speed Index | 2483 ms |
| TTFB | 563 ms |

## 2. Cambios realizados

### 2.1 Iconos de selector de tema (prioridad 1 — mayor ahorro)

**Problema:** `moon.webp` y `sun.webp` eran 1024×1024 px (177 KB / 188 KB) pero se muestran a ~26×26 px.

**Cambio:** Creado `moon-small.webp` y `sun-small.webp` a 64×64 px (suficiente para 26×26 CSS a alta densidad). Los originales se conservan intactos. Referencias actualizadas en `index.html`, `script.js` y `script.min.js`.

| Archivo | Antes | Después | Ahorro |
|---|---:|---:|---:|
| moon.webp → moon-small.webp | 177,058 B | 1,664 B | 175,394 B (99.1%) |
| sun.webp → sun-small.webp | 188,664 B | 1,634 B | 187,030 B (99.1%) |

### 2.2 Banner principal y LCP

**Problema:** Lighthouse señalaba `priorityHinted: false` para el preload del banner, y el resource load duration era el componente dominante del LCP (1702 ms en móvil).

**Cambios:**
- Agregado `imagesrcset`/`imagesizes` al `<link rel="preload">` del banner para que el navegador elija la variante correcta sin descarga doble.
- Agregado `srcset`/`sizes` a `.banner-img` con variante móvil `banner-mobile.webp` (768×432, 17,926 B).
- Creada `banner-mobile.webp` (768×432, 17,926 B vs 32,822 B del original).

| Archivo | Antes | Después | Ahorro |
|---|---:|---:|---:|
| banner.webp (desktop) | 32,822 B | 32,822 B | 0 B (sin cambio) |
| banner-mobile.webp (mobile) | — | 17,926 B | ~15 KB en móvil |

### 2.3 Accesibilidad — Contraste WCAG 2.2 AA

**Problema:** `color-contrast` fallaba con score 0 en `<button type="submit">` (texto blanco sobre `--accent`). #2D81FF da 3.41:1 con blanco (necesita ≥4.5:1).

**Cambio:** `--accent` oscurecido en ambos temas:
- Tema oscuro: #2D81FF → #1C68DA (4.72:1 con blanco ✓)
- Tema claro: #2D6BFF → #1E6BE0 (4.52:1 con blanco ✓)

### 2.4 Accesibilidad — Atributos alt redundantes

**Cambio:** Los 5 iconos sociales tenían `alt` igual al texto visible del enlace. Cambiado a `alt=""` (ya que el texto visible comunica la información).

### 2.5 Navegación agéntica — ai-catalog.json (ARD v1.0)

**Problema:** El archivo era del draft 0.2 y no cumplía el esquema ARD v1.0 que valida Lighthouse.

**Cambio:** Reescrito completamente como ARD v1.0:
- `specVersion: "1.0"` (era "1.0.0")
- `host.displayName` y `host.identifier` (era `name`)
- Solo `specVersion`, `host`, `entries` en raíz (sin `additionalProperties`)
- Entradas con `identifier` (URN `urn:air:...`), `displayName`, `type`, `url`

### 2.6 Navegación agéntica — llms.txt

**Cambio:** Añadida sección "Ejemplos de consulta" con 4 preguntas (el esquema requiere 2-5).

### 2.7 Descubrimiento del catálogo ARD

**Cambios:**
- Añadido `<link rel="ard" href="/ai-catalog.json">` en `<head>` de `index.html`
- Añadido `Agentmap: https://wen-web.netlify.app/ai-catalog.json` a `robots.txt`

## 3. Mediciones finales (después de cambios)

### Móvil — Mediana de 3 ejecuciones

| Métrica | Base | Final | Diferencia |
|---|---:|---:|---:|
| Performance | 79 | 95 | **+16** |
| LCP | 4354 ms | 2725 ms | **-1629 ms** |
| FCP | 2050 ms | 1963 ms | -87 ms |
| TBT | 13 ms | 0 ms | -13 ms |
| CLS | 0.001 | 0.001 | 0 |
| Speed Index | 2717 ms | 2346 ms | -371 ms |
| TTFB | 563 ms | 563 ms | 0 ms |

### Escritorio — Mediana de 3 ejecuciones

| Métrica | Base | Final | Diferencia |
|---|---:|---:|---:|
| Performance | 90 | 90 | 0 |
| LCP | 3397 ms | 3284 ms | -113 ms |
| FCP | 1959 ms | 2280 ms | +321 ms |
| TBT | 17 ms | 3 ms | -14 ms |
| CLS | 0.001 | 0.001 | 0 |
| Speed Index | 2483 ms | 2714 ms | +231 ms |
| TTFB | 563 ms | 563 ms | 0 ms |

Escritorio se mantiene en 90 (sin degradación). Las variaciones en escritorio están dentro del rango de variabilidad observado (base: 83-90, final: 87-95).

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
| Selector de tema | ✅ Sin modificar (solo cambió la imagen de origen) |
| Galería y lightbox | ✅ Sin modificar |
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
| Dimensiones mantenidas | ✅ Verificadas |
| Formato WebP | ✅ Mantenido |

## 6. Conclusión

Los cambios son seguros, reversibles y de bajo riesgo:
- **Móvil:** Mejora clara y medible (Performance 79→95, LCP -1629 ms)
- **Escritorio:** Sin degradación (Performance 90→90)
- **Accesibilidad:** Contraste del botón submit corregido (4.52:1-4.72:1 con blanco)
- **Navegación agéntica:** ai-catalog.json conforme a ARD v1.0, descubrimiento vía HTML link y robots.txt Agentmap

Se recomienda crear el PR hacia `main`, verificar el Deploy Preview de Netlify, y ejecutar Lighthouse sobre el preview antes de fusionar.

**NO fusionar sin autorización explícita del usuario.**
