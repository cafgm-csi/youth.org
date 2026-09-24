const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");

function closeMobileMenu() {
  navLinks.classList.remove("active");
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Open navigation");
}

menuToggle.addEventListener("click", (event) => {
  event.stopPropagation();
  const isOpen = navLinks.classList.toggle("active");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
});

const links = document.querySelectorAll(".nav-links a");
links.forEach((link) => {
  link.addEventListener("click", closeMobileMenu);
});

document.addEventListener("click", (event) => {
  if (navLinks.classList.contains("active") && !navLinks.contains(event.target)) {
    closeMobileMenu();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeMobileMenu();
  }
});

const audio = document.getElementById("bgMusic");
const musicButton = document.getElementById("musicButton");

function playMusic() {
  if (audio) {
    audio.play().catch(() => {
      console.log("Audio play was blocked until user interaction.");
    });
  }
}

if (audio && musicButton) {
  let isPlaying = false;

  musicButton.addEventListener("click", () => {
    if (isPlaying) {
      audio.pause();
      musicButton.textContent = "Music";
      isPlaying = false;
    } else {
      audio.play().catch(() => {
        console.log("Audio play was blocked until user interaction.");
      });
      musicButton.textContent = "Pause";
      isPlaying = true;
    }
  });
}

// Subukan agad
playMusic();

// Kapag may first interaction kahit saan sa page
function startOnFirstInteraction() {
  playMusic();
  document.removeEventListener("click", startOnFirstInteraction);
  document.removeEventListener("touchstart", startOnFirstInteraction);
  document.removeEventListener("scroll", startOnFirstInteraction);
}

document.addEventListener("click", startOnFirstInteraction);
document.addEventListener("touchstart", startOnFirstInteraction);
document.addEventListener("scroll", startOnFirstInteraction);

document.addEventListener("DOMContentLoaded", function () {
  const photoStack = document.getElementById("photoStack");
  const galleryCollapse = document.getElementById("galleryCollapse");
  const lightbox = document.getElementById("galleryLightbox");
  const lightboxImage = document.getElementById("lightboxImage");
  const lightboxClose = document.getElementById("lightboxClose");

  // SMARTER LAZY LOADING: I-load lang ang natitirang gallery photos kapag ginamit na ang gallery
  let isGalleryLoaded = false;
  function loadRemainingGalleryImages() {
    if (isGalleryLoaded || !photoStack) return;
    
    const lazyImages = photoStack.querySelectorAll("img[data-src]");
    lazyImages.forEach((img) => {
      img.src = img.dataset.src;
      img.removeAttribute("data-src");
    });
    
    isGalleryLoaded = true;
  }

  function closeLightbox() {
    if (!lightbox) return;

    lightbox.classList.remove("active");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.classList.remove("lightbox-open");
  }

  function openLightbox(image) {
    if (!lightbox || !lightboxImage) return;

    lightboxImage.src = image.currentSrc || image.src;
    lightboxImage.alt = image.alt;
    lightbox.classList.add("active");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.classList.add("lightbox-open");
  }

  function closeGallery() {
    if (!photoStack || !photoStack.classList.contains("open")) return;

    photoStack.classList.add("is-closing");

    setTimeout(() => {
      photoStack.classList.remove("open", "is-closing");
      photoStack.setAttribute("aria-expanded", "false");
      photoStack.setAttribute("aria-label", "Open church gallery");
    }, 260);
  }

  function expandGallery() {
    loadRemainingGalleryImages(); // Download natitirang images kapag kinlick
    photoStack.classList.add("open");
    photoStack.setAttribute("aria-expanded", "true");
    photoStack.setAttribute("aria-label", "Browse church gallery photos");
  }

  if (photoStack) {
    photoStack.querySelectorAll(".stack-photo").forEach((photo, index) => {
      photo.style.setProperty("--photo-order", index);
    });

    // I-load ang ibang images kapag itinaas ang mouse/touch sa gallery container
    photoStack.addEventListener("mouseenter", loadRemainingGalleryImages, { once: true });
    photoStack.addEventListener("touchstart", loadRemainingGalleryImages, { once: true });

    photoStack.addEventListener("click", function (event) {
      if (!photoStack.classList.contains("open")) {
        expandGallery();
        return;
      }

      const image = event.target.closest("img");
      if (image) {
        openLightbox(image);
      }
    });

    photoStack.addEventListener("keydown", function (event) {
      if ((event.key === "Enter" || event.key === " ") && !photoStack.classList.contains("open")) {
        event.preventDefault();
        expandGallery();
      }
    });
  }

  if (galleryCollapse) {
    galleryCollapse.addEventListener("click", function (event) {
      event.stopPropagation();
      closeGallery();
    });
  }

  if (lightboxClose) {
    lightboxClose.addEventListener("click", closeLightbox);
  }

  if (lightbox) {
    lightbox.addEventListener("click", function (event) {
      if (event.target === lightbox) {
        closeLightbox();
      }
    });
  }

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      if (lightbox && lightbox.classList.contains("active")) {
        closeLightbox();
      } else {
        closeGallery();
      }
    }
  });
});