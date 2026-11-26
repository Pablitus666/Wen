// ======================================================
// script.js – Versión Final Profesional + Popup Flotante
// ======================================================

(() => {
  "use strict";

  // ======================================================
  // CONSTANTES BASE
  // ======================================================
  const body = document.body;
  const themeToggle = document.getElementById("theme-toggle");
  const themeIcon = document.getElementById("theme-icon");
  const LS_THEME = "ls_theme_mode";

  // ======================================================
  // APLICAR TEMA
  // ======================================================
  function applyTheme(theme) {
    const isLight = theme === "light";

    body.classList.toggle("light-mode", isLight);
    themeIcon.src = isLight ? "./images/sun-small.webp" : "./images/moon-small.webp";
    themeToggle.setAttribute("aria-pressed", String(isLight));

    const toast = document.getElementById("toast");
    toast?.classList.toggle("light-mode", isLight);

    localStorage.setItem(LS_THEME, theme);
  }

  // ======================================================
  // TEMA INICIAL
  // ======================================================
  (() => {
    const savedTheme = localStorage.getItem(LS_THEME) || "dark";
    applyTheme(savedTheme);
  })();

  // ======================================================
  // TOGGLE DE TEMA
  // ======================================================
  themeToggle.addEventListener("click", () => {
    const newTheme = body.classList.contains("light-mode") ? "dark" : "light";
    applyTheme(newTheme);

    themeToggle.animate(
      [
        { transform: "scale(1)" },
        { transform: "scale(0.92)" },
        { transform: "scale(1)" }
      ],
      { duration: 220, easing: "ease-out" }
    );
  });

  // ======================================================
  // PARALLAX HEADER
  // ======================================================
  const bannerImg = document.querySelector(".header-banner .banner-img");

  if (bannerImg) {
    let ticking = false;
    let winH = window.innerHeight;

    const updateParallax = () => {
      const rectTop = bannerImg.getBoundingClientRect().top;
      const ratio = Math.min(Math.max(rectTop / winH, -1), 1);
      bannerImg.style.transform = `translateY(${ratio * -25}px) scale(1.04)`;
      ticking = false;
    };

    window.addEventListener("scroll", () => {
      if (!ticking) {
        requestAnimationFrame(updateParallax);
        ticking = true;
      }
    }, { passive: true });

    window.addEventListener("resize", () => {
      winH = window.innerHeight;
      requestAnimationFrame(updateParallax);
    });

    requestAnimationFrame(updateParallax);
  }

  // ======================================================
  // SCROLL REVEAL
  // ======================================================
  const revealItems = document.querySelectorAll(
    ".reveal, [data-scroll-reveal], .fade-left, .fade-right"
  );

  if (revealItems.length) {
    const io = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    revealItems.forEach(el => io.observe(el));
  }

  // ======================================================
  // FALLBACK GLOBAL PARA IMÁGENES
  // ======================================================
  const fallback = "./images/offline-image.png";

  document.querySelectorAll("img").forEach(img => {
    img.addEventListener("error", () => {
      if (!img.dataset.fallback) {
        img.dataset.fallback = "1";
        img.src = fallback;
      }
    });
  });

  // ======================================================
  // LIGHTBOX GALERÍA CON TRAMPA DE FOCO (ACCESIBILIDAD)
  // ======================================================
  const gallery = document.getElementById("gallery");
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightbox-img");
  
  if (gallery && lightbox && lightboxImg) {
    const focusableElementsSelector = 'a[href], button:not([disabled]), input, textarea, select, [tabindex]:not([tabindex="-1"])';
    let previouslyFocusedElement;

    const openLightbox = (imageElement) => {
      // 1. Guardar el elemento que tenía el foco
      previouslyFocusedElement = document.activeElement;

      // 2. Mostrar el lightbox
      lightboxImg.src = imageElement.src;
      lightbox.classList.remove("hidden");
      lightbox.setAttribute("aria-hidden", "false");
      body.style.overflow = "hidden";

      // 3. Deshabilitar todos los elementos enfocables fuera del lightbox
      const focusableElements = document.querySelectorAll(focusableElementsSelector);
      focusableElements.forEach(el => {
        if (!lightbox.contains(el)) {
          el.setAttribute('data-original-tabindex', el.tabIndex);
          el.tabIndex = -1;
        }
      });

      // 4. Poner el foco en el lightbox
      lightbox.focus();
    };

    const closeLightbox = () => {
      // 1. Restaurar primero los elementos enfocables del documento.
      const disabledElements = document.querySelectorAll('[data-original-tabindex]');
      disabledElements.forEach(el => {
        const originalTabindex = el.getAttribute('data-original-tabindex');
        if (originalTabindex !== null) {
          el.tabIndex = Number(originalTabindex);
        }
        el.removeAttribute('data-original-tabindex');
      });

      // 2. Devolver el foco ANTES de ocultar el lightbox y aplicar aria-hidden.
      // Así evitamos dejar el foco dentro de un elemento oculto a tecnologías asistivas.
      if (previouslyFocusedElement && document.contains(previouslyFocusedElement)) {
        previouslyFocusedElement.focus();
      } else {
        lightbox.blur();
      }

      // 3. Ahora es seguro ocultar el lightbox.
      lightbox.classList.add("hidden");
      lightbox.setAttribute("aria-hidden", "true");
      body.style.overflow = "";
      lightboxImg.removeAttribute("src");
      previouslyFocusedElement = null;
    };

    gallery.addEventListener("click", e => {
      if (e.target.tagName === "IMG") {
        openLightbox(e.target);
      }
    });

    lightbox.addEventListener("click", e => {
      if (e.target === lightbox) {
        closeLightbox();
      }
    });

    document.addEventListener("keydown", e => {
      // Solo cerrar si el lightbox está visible
      if (!lightbox.classList.contains("hidden") && e.key === "Escape") {
        closeLightbox();
      }
    });
  }

  // ======================================================
  // POPUP FLOTANTE (TOAST)
  // ======================================================
  function showToast(message = "Acción completada", type = "success") {
    const toast = document.getElementById("toast");
    if (!toast) return;

    const text = toast.querySelector(".toast-text");
    text.textContent = message;

    // Limpiar clases anteriores y añadir las nuevas
    toast.classList.remove("success", "error");
    toast.classList.add(type); // 'success' o 'error'
    
    toast.classList.add("toast-show");

    // Ocultar el toast después de 3 segundos
    setTimeout(() => {
      toast.classList.remove("toast-show");
    }, 3000);
  }

  // ======================================================
  // FORM SUBMIT DIRECTO A TELEGRAM (vía Netlify Function)
  // ======================================================
  const form = document.getElementById("contact-form");

  if (form) {
    const textarea = document.getElementById("message");
    const charCounter = document.getElementById("char-counter");
    const maxLength = textarea.getAttribute("maxlength");

    if (textarea && charCounter) {
      textarea.addEventListener("input", () => {
        // --- Lógica de auto-redimensionamiento ---
        textarea.style.height = 'auto'; 
        textarea.style.height = `${textarea.scrollHeight}px`;

        // --- Lógica del contador de caracteres ---
        const currentLength = textarea.value.length;
        charCounter.textContent = `${currentLength}/${maxLength}`;

        // Cambiar color si se alcanza el límite
        if (currentLength >= maxLength) {
          charCounter.classList.add("limit-reached");
        } else {
          charCounter.classList.remove("limit-reached");
        }
      });
    }

    form.addEventListener("submit", async e => {
      e.preventDefault();

      const formData = new FormData(form);
      const name = formData.get("name") || 'No especificado';
      const email = formData.get("email") || 'No especificado';
      const message = formData.get("message") || 'No especificado';

      try {
        // Tarea única: enviar directamente a la función de Telegram
        const response = await fetch("/.netlify/functions/send-contact-form", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, message })
        });

        // Si la función de Netlify falla, lanzamos un error
        if (!response.ok) {
          throw new Error(`Error en el servidor: ${response.status}`);
        }

        showToast("Mensaje enviado correctamente", "success");
        form.reset();
        
        // Resetear altura y contador del textarea
        if(textarea && charCounter) {
          textarea.style.height = 'auto';
          charCounter.textContent = `0/${maxLength}`;
          charCounter.classList.remove("limit-reached");
        }

      } catch (err) {
        showToast("Hubo un error. Intenta nuevamente.", "error");
        console.error("Error al enviar formulario:", err);
      }
    });
  }

  // ======================================================
  // REGISTRO DEL SERVICE WORKER (PWA / MODO SIN CONEXIÓN)
  // ======================================================
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker
        .register("./service-worker.js")
        .catch(error => {
          console.warn("No se pudo registrar el Service Worker:", error);
        });
    });
  }

})();
