const slides = Array.from(document.querySelectorAll(".slide"));
const dots = Array.from(document.querySelectorAll(".carousel-dot"));
const previousButton = document.querySelector(".carousel-arrow--previous");
const nextButton = document.querySelector(".carousel-arrow--next");
const currentCounter = document.querySelector(".carousel-progress__current");
const progressBar = document.querySelector(".carousel-progress__track span");
const menuToggle = document.querySelector(".menu-toggle");
const navigation = document.querySelector(".navigation");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

let activeIndex = 0;
let autoplayTimer;

function showSlide(index) {
  activeIndex = (index + slides.length) % slides.length;

  slides.forEach((slide, slideIndex) => {
    const isActive = slideIndex === activeIndex;
    slide.classList.toggle("is-active", isActive);
    slide.setAttribute("aria-hidden", String(!isActive));
  });

  dots.forEach((dot, dotIndex) => {
    const isActive = dotIndex === activeIndex;
    dot.classList.toggle("is-active", isActive);
    dot.setAttribute("aria-pressed", String(isActive));
  });

  currentCounter.textContent = String(activeIndex + 1).padStart(2, "0");
  progressBar.style.width = `${((activeIndex + 1) / slides.length) * 100}%`;
}

function stopAutoplay() {
  window.clearInterval(autoplayTimer);
}

function startAutoplay() {
  stopAutoplay();

  if (!reducedMotion.matches) {
    autoplayTimer = window.setInterval(() => showSlide(activeIndex + 1), 6000);
  }
}

previousButton.addEventListener("click", () => {
  showSlide(activeIndex - 1);
  startAutoplay();
});

nextButton.addEventListener("click", () => {
  showSlide(activeIndex + 1);
  startAutoplay();
});

dots.forEach((dot, index) => {
  dot.addEventListener("click", () => {
    showSlide(index);
    startAutoplay();
  });
});

document.querySelector(".carousel").addEventListener("mouseenter", stopAutoplay);
document.querySelector(".carousel").addEventListener("mouseleave", startAutoplay);
document.querySelector(".carousel").addEventListener("focusin", stopAutoplay);
document.querySelector(".carousel").addEventListener("focusout", startAutoplay);

reducedMotion.addEventListener("change", startAutoplay);
startAutoplay();

const testimonialCarousel = document.querySelector(".testimonials__carousel");
const testimonialTrack = testimonialCarousel.querySelector(".testimonials__track");
const testimonialCurrent = testimonialCarousel.querySelector(".testimonials__current");
const testimonialPrevious = testimonialCarousel.querySelector(".testimonials__arrow--previous");
const testimonialNext = testimonialCarousel.querySelector(".testimonials__arrow--next");
const testimonialCards = Array.from(testimonialTrack.children);
const testimonialCount = testimonialCards.length;

let testimonialIndex = 0;
let testimonialVisible = 0;
let testimonialTimer;

function stopTestimonialAutoplay() {
  window.clearInterval(testimonialTimer);
}

function updateTestimonialCarousel() {
  const card = testimonialTrack.children[testimonialIndex];
  const offset = card.offsetLeft - testimonialTrack.children[0].offsetLeft;
  const current = ((testimonialIndex - testimonialVisible) % testimonialCount + testimonialCount) % testimonialCount;

  testimonialTrack.style.transform = `translateX(-${offset}px)`;
  testimonialCurrent.textContent = String(current + 1).padStart(2, "0");
}

function showNextTestimonial(direction) {
  testimonialIndex += direction;
  updateTestimonialCarousel();
}

function configureTestimonialCarousel() {
  const visible = Number.parseInt(
    window.getComputedStyle(testimonialCarousel).getPropertyValue("--testimonial-visible"),
    10
  );

  if (visible === testimonialVisible) {
    updateTestimonialCarousel();
    return;
  }

  stopTestimonialAutoplay();
  testimonialTrack.querySelectorAll(".is-clone").forEach((clone) => clone.remove());

  const previousClones = testimonialCards.slice(-visible).map((card) => {
    const clone = card.cloneNode(true);
    clone.classList.add("is-clone");
    clone.setAttribute("aria-hidden", "true");
    return clone;
  });
  const nextClones = testimonialCards.slice(0, visible).map((card) => {
    const clone = card.cloneNode(true);
    clone.classList.add("is-clone");
    clone.setAttribute("aria-hidden", "true");
    return clone;
  });

  testimonialTrack.prepend(...previousClones);
  testimonialTrack.append(...nextClones);
  testimonialVisible = visible;
  testimonialIndex = visible;
  updateTestimonialCarousel();
  startTestimonialAutoplay();
}

function startTestimonialAutoplay() {
  stopTestimonialAutoplay();

  if (!reducedMotion.matches && !document.hidden) {
    testimonialTimer = window.setInterval(() => showNextTestimonial(1), 5000);
  }
}

testimonialTrack.addEventListener("transitionend", (event) => {
  if (event.target !== testimonialTrack || event.propertyName !== "transform") {
    return;
  }

  if (testimonialIndex >= testimonialVisible + testimonialCount) {
    testimonialTrack.classList.add("is-resetting");
    testimonialIndex = testimonialVisible;
    updateTestimonialCarousel();
    testimonialTrack.getBoundingClientRect();
    testimonialTrack.classList.remove("is-resetting");
  } else if (testimonialIndex < testimonialVisible) {
    testimonialTrack.classList.add("is-resetting");
    testimonialIndex = testimonialVisible + testimonialCount - 1;
    updateTestimonialCarousel();
    testimonialTrack.getBoundingClientRect();
    testimonialTrack.classList.remove("is-resetting");
  }
});

testimonialPrevious.addEventListener("click", () => showNextTestimonial(-1));
testimonialNext.addEventListener("click", () => showNextTestimonial(1));
testimonialCarousel.addEventListener("pointerenter", stopTestimonialAutoplay);
testimonialCarousel.addEventListener("pointerleave", startTestimonialAutoplay);
testimonialCarousel.addEventListener("focusin", stopTestimonialAutoplay);
testimonialCarousel.addEventListener("focusout", startTestimonialAutoplay);
window.addEventListener("resize", configureTestimonialCarousel);
document.addEventListener("visibilitychange", startTestimonialAutoplay);
reducedMotion.addEventListener("change", startTestimonialAutoplay);
configureTestimonialCarousel();

menuToggle.addEventListener("click", () => {
  const isExpanded = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!isExpanded));
  menuToggle.setAttribute("aria-label", isExpanded ? "Abrir menú" : "Cerrar menú");
  navigation.classList.toggle("is-open", !isExpanded);
});

navigation.addEventListener("click", (event) => {
  if (event.target.closest("a")) {
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Abrir menú");
    navigation.classList.remove("is-open");
  }
});

const mapDialog = document.querySelector(".map-dialog");
const mapDialogTitle = document.querySelector("#map-dialog-title");
const mapDialogFrame = mapDialog.querySelector("iframe");

document.querySelectorAll(".branch-card__map-trigger").forEach((trigger) => {
  trigger.addEventListener("click", () => {
    mapDialogTitle.textContent = trigger.dataset.mapTitle;
    mapDialogFrame.src = trigger.dataset.mapSrc;
    mapDialog.showModal();
  });
});

mapDialog.querySelector(".map-dialog__close").addEventListener("click", () => {
  mapDialog.close();
});

mapDialog.addEventListener("click", (event) => {
  if (event.target === mapDialog) {
    mapDialog.close();
  }
});

mapDialog.addEventListener("close", () => {
  mapDialogFrame.src = "about:blank";
});
