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
