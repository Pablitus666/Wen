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
  // LIGHTBOX GALERÍA CON CARRUSEL (7 IMÁGENES POR GALERÍA)
  // ======================================================
  const gallery = document.getElementById("gallery");
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightbox-img");
  const lightboxPrev = document.getElementById("lightbox-prev");
  const lightboxNext = document.getElementById("lightbox-next");
  const lightboxCounter = document.getElementById("lightbox-counter");
  ;

  // Datos de las galerías: cada una tiene 7 imágenes (1 principal + 6 adicionales)
  const galleries = [
    {
      id: 1,
      name: "Galería 1",
      images: [
        "./photo-gallery/1.webp",
        "./photo-gallery/g1-2.webp",
        "./photo-gallery/g1-3.webp",
        "./photo-gallery/g1-4.webp",
        "./photo-gallery/g1-5.webp",
        "./photo-gallery/g1-6.webp",
        "./photo-gallery/g1-7.webp"
      ]
    },
    {
      id: 2,
      name: "Galería 2",
      images: [
        "./photo-gallery/2.webp",
        "./photo-gallery/g2-2.webp",
        "./photo-gallery/g2-3.webp",
        "./photo-gallery/g2-4.webp",
        "./photo-gallery/g2-5.webp",
        "./photo-gallery/g2-6.webp",
        "./photo-gallery/g2-7.webp"
      ]
    },
    {
      id: 3,
      name: "Galería 3",
      images: [
        "./photo-gallery/3.webp",
        "./photo-gallery/g3-2.webp",
        "./photo-gallery/g3-3.webp",
        "./photo-gallery/g3-4.webp",
        "./photo-gallery/g3-5.webp",
        "./photo-gallery/g3-6.webp",
        "./photo-gallery/g3-7.webp"
      ]
    }
  ];

  let currentGalleryIndex = 0;
  let currentImageIndex = 0;

  if (gallery && lightbox && lightboxImg) {
    const focusableElementsSelector = 'a[href], button:not([disabled]), input, textarea, select, [tabindex]:not([tabindex="-1"])';
    let previouslyFocusedElement;

    function openLightbox(galleryIndex, imageIndex = 0) {
      previouslyFocusedElement = document.activeElement;

      currentGalleryIndex = galleryIndex;
      currentImageIndex = imageIndex;

      updateLightboxImage();

      lightbox.classList.remove("hidden");
      lightbox.setAttribute("aria-hidden", "false");
      body.style.overflow = "hidden";

      const focusableElements = document.querySelectorAll(focusableElementsSelector);
      focusableElements.forEach(el => {
        if (!lightbox.contains(el)) {
          el.setAttribute('data-original-tabindex', el.tabIndex);
          el.tabIndex = -1;
        }
      });

      lightbox.focus();
    }

    function updateLightboxImage() {
      const gallery = galleries[currentGalleryIndex];
      const imageSrc = gallery.images[currentImageIndex];
      lightboxImg.src = imageSrc;
      lightboxImg.alt = `Foto ${currentImageIndex + 1} de ${gallery.name}`;
      lightboxCounter.textContent = `${currentImageIndex + 1} / ${gallery.images.length}`;
    }

    function nextImage() {
      const gallery = galleries[currentGalleryIndex];
      currentImageIndex = (currentImageIndex + 1) % gallery.images.length;
      updateLightboxImage();
    }

    function prevImage() {
      const gallery = galleries[currentGalleryIndex];
      currentImageIndex = (currentImageIndex - 1 + gallery.images.length) % gallery.images.length;
      updateLightboxImage();
    }

    const closeLightbox = () => {
      const disabledElements = document.querySelectorAll('[data-original-tabindex]');
      disabledElements.forEach(el => {
        const originalTabindex = el.getAttribute('data-original-tabindex');
        if (originalTabindex !== null) {
          el.tabIndex = Number(originalTabindex);
        }
        el.removeAttribute('data-original-tabindex');
      });

      if (previouslyFocusedElement && document.contains(previouslyFocusedElement)) {
        previouslyFocusedElement.focus();
      } else {
        lightbox.blur();
      }

      lightbox.classList.add("hidden");
      lightbox.setAttribute("aria-hidden", "true");
      body.style.overflow = "";
      lightboxImg.removeAttribute("src");
      previouslyFocusedElement = null;
    };

    gallery.addEventListener("click", e => {
      const img = e.target.closest("img");
      if (img) {
        const galleryIndex = parseInt(img.getAttribute("data-gallery")) - 1;
        const imageIndex = parseInt(img.getAttribute("data-index")) || 0;
        openLightbox(galleryIndex, imageIndex);
      }
    });

    lightboxPrev.addEventListener("click", e => {
      e.stopPropagation();
      prevImage();
    });

    lightboxNext.addEventListener("click", e => {
      e.stopPropagation();
      nextImage();
    });


    lightbox.addEventListener("click", e => {
      if (e.target === lightbox) {
        closeLightbox();
      }
    });

    document.addEventListener("keydown", e => {
      if (!lightbox.classList.contains("hidden")) {
        if (e.key === "Escape") {
          closeLightbox();
        } else if (e.key === "ArrowRight") {
          e.preventDefault();
          nextImage();
        } else if (e.key === "ArrowLeft") {
          e.preventDefault();
          prevImage();
        }
      }
    });

    let touchStartX = 0;
    let touchEndX = 0;

    lightbox.addEventListener("touchstart", e => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    lightbox.addEventListener("touchend", e => {
      touchEndX = e.changedTouches[0].screenX;
      handleGesture();
    }, { passive: true });

    function handleGesture() {
      const diff = touchStartX - touchEndX;
      if (Math.abs(diff) > 50) {
        if (diff > 0) {
          nextImage();
        } else {
          prevImage();
        }
      }
    }
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
