const header = document.querySelector("[data-header]");
const revealItems = document.querySelectorAll(".reveal");

const updateHeader = () => {
  header.classList.toggle("is-scrolled", window.scrollY > 26);
};

updateHeader();
window.addEventListener("scroll", updateHeader, { passive: true });

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.13 }
  );

  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

const carousel = document.querySelector("[data-carousel]");

if (carousel) {
  const slides = Array.from(carousel.querySelectorAll("[data-slide]"));
  const dots = Array.from(carousel.querySelectorAll("[data-dot]"));
  const previous = carousel.querySelector("[data-prev]");
  const next = carousel.querySelector("[data-next]");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let activeIndex = 0;
  let intervalId;

  const showSlide = (index) => {
    activeIndex = (index + slides.length) % slides.length;

    slides.forEach((slide, position) => {
      const isActive = position === activeIndex;
      slide.classList.toggle("is-active", isActive);
      slide.setAttribute("aria-hidden", String(!isActive));
    });

    dots.forEach((dot, position) => {
      const isActive = position === activeIndex;
      dot.classList.toggle("is-active", isActive);
      if (isActive) {
        dot.setAttribute("aria-current", "true");
      } else {
        dot.removeAttribute("aria-current");
      }
    });
  };

  const stopRotation = () => {
    window.clearInterval(intervalId);
  };

  const startRotation = () => {
    if (!reducedMotion) {
      stopRotation();
      intervalId = window.setInterval(() => showSlide(activeIndex + 1), 6000);
    }
  };

  previous.addEventListener("click", () => {
    showSlide(activeIndex - 1);
    startRotation();
  });

  next.addEventListener("click", () => {
    showSlide(activeIndex + 1);
    startRotation();
  });

  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
      showSlide(index);
      startRotation();
    });
  });

  carousel.addEventListener("mouseenter", stopRotation);
  carousel.addEventListener("mouseleave", startRotation);
  carousel.addEventListener("focusin", stopRotation);
  carousel.addEventListener("focusout", startRotation);

  showSlide(activeIndex);
  startRotation();
}

const lightbox = document.querySelector("[data-lightbox]");

if (lightbox) {
  const lightboxImage = lightbox.querySelector("[data-lightbox-image]");
  const closeButton = lightbox.querySelector("[data-lightbox-close]");
  const galleryButtons = document.querySelectorAll("[data-lightbox-src]");

  const closeLightbox = () => {
    lightbox.classList.remove("is-open");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.classList.remove("lightbox-lock");
  };

  galleryButtons.forEach((button) => {
    button.addEventListener("click", () => {
      lightboxImage.src = button.dataset.lightboxSrc;
      lightboxImage.alt = button.dataset.lightboxAlt || "";
      lightbox.classList.add("is-open");
      lightbox.setAttribute("aria-hidden", "false");
      document.body.classList.add("lightbox-lock");
      closeButton.focus();
    });
  });

  closeButton.addEventListener("click", closeLightbox);

  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) {
      closeLightbox();
    }
  });

  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && lightbox.classList.contains("is-open")) {
      closeLightbox();
    }
  });
}
