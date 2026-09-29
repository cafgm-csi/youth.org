const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");

const announcement = document.getElementById("announcement");
const announcementClose = document.getElementById("announcementClose");

if (announcement && announcementClose) {
  const storageKey = "announcementDismissed:" + announcement.dataset.id;

  try {
    if (localStorage.getItem(storageKey) === "1") {
      announcement.hidden = true;
    }
  } catch (error) {}

  announcementClose.addEventListener("click", () => {
    announcement.hidden = true;
    try {
      localStorage.setItem(storageKey, "1");
    } catch (error) {}
  });
}
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

// MUSIC: opt-in only. Walang forced autoplay — mas malinis at hindi nakakagulat sa users.
const audio = document.getElementById("bgMusic");
const musicButton = document.getElementById("musicButton");
let isPlaying = false;

function setMusicButtonState(playing) {
  isPlaying = playing;
  if (!musicButton) return;
  musicButton.textContent = playing ? "Pause" : "Music";
  musicButton.setAttribute("aria-label", playing ? "Pause background music" : "Play background music");
}

function playMusic() {
  if (!audio) return;
  audio
    .play()
    .then(() => setMusicButtonState(true))
    .catch(() => {
      console.log("Audio play was blocked.");
    });
}

if (audio && musicButton) {
  musicButton.addEventListener("click", () => {
    if (isPlaying) {
      audio.pause();
      setMusicButtonState(false);
    } else {
      playMusic();
    }
  });
}

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("service-worker.js").catch(() => {});
  });
}

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

    // Gawing keyboard-accessible ang bawat photo pagkatapos mag-expand
    photoStack.querySelectorAll(".stack-photo img").forEach((img) => {
      img.setAttribute("tabindex", "0");
      img.setAttribute("role", "button");
      img.setAttribute("aria-label", `Open ${img.alt || "photo"} in full size`);
    });
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
        return;
      }

      // Keyboard support para sa bawat photo pagka-expand na
      if ((event.key === "Enter" || event.key === " ") && photoStack.classList.contains("open")) {
        const image = event.target.closest("img");
        if (image) {
          event.preventDefault();
          openLightbox(image);
        }
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

  const shareButton = document.getElementById("shareButton");

if (shareButton) {
  shareButton.addEventListener("click", async () => {
    const shareData = {
      title: "CSI Youth Org.",
      text: "Connect, Serve, Inspire. Check out our church youth page!",
      url: "https://cafgm-csi.github.io/youth.org/"
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(shareData.url);
        shareButton.textContent = "Link copied!";
        setTimeout(() => {
          shareButton.textContent = "Share";
        }, 2000);
      }
    } catch (error) {
      console.log("Share cancelled or failed.");
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