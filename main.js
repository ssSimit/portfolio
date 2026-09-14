const visibleProjects = projects.filter(p => p.showOnHome !== false);
const track = document.getElementById("projectGrid");
const dotsContainer = document.getElementById("carouselDots");
const counterEl = document.getElementById("carouselCounter");
const prevBtn = document.getElementById("prevSlide");
const nextBtn = document.getElementById("nextSlide");

let currentIndex = 0;
let autoSlideInterval = null;
const AUTO_SLIDE_DELAY = 10000; // Auto-slides every 10 seconds

// Mobile Touch Swipe Logic
let touchStartX = 0;
let touchEndX = 0;

const carouselWrapper = document.querySelector(".carousel-wrapper");

carouselWrapper.addEventListener("touchstart", (e) => {
  touchStartX = e.changedTouches[0].screenX;
}, { passive: true });

carouselWrapper.addEventListener("touchend", (e) => {
  touchEndX = e.changedTouches[0].screenX;
  handleSwipe();
}, { passive: true });

function handleSwipe() {
  const swipeThreshold = 50; // minimum distance in px
  if (touchStartX - touchEndX > swipeThreshold) {
    nextSlide(); // Swiped left
  } else if (touchEndX - touchStartX > swipeThreshold) {
    prevSlide(); // Swiped right
  }
}

function renderCarousel() {
  if (!visibleProjects.length) return;

  // Render slides
  track.innerHTML = visibleProjects.map((p, i) => {
    const media = p.cardMedia === "image"
      ? `<img class="featured-media" src="${p.poster}" alt="${p.title}">`
      : `<video class="featured-media" src="${p.video}" poster="${p.poster}" loop muted playsinline preload="metadata"></video>`;

    const playButton = p.playUrl
      ? `<a href="${p.playUrl}" class="btn btn-primary" target="_blank" rel="noopener">PLAY GAME →</a>`
      : "";

    return `
      <article class="featured-slide ${i === currentIndex ? 'active' : ''}">
        <div class="slide-media-container">
          ${media}
          <span class="slide-badge">[ INDEX_0${i + 1} ]</span>
        </div>
        <div class="slide-content">
          <h3 class="slide-title">${p.title}</h3>
          <p class="slide-desc">${p.shortDesc}</p>
          
          <div class="slide-tech-stack">
            <span class="tech-label">$ stack:</span>
            <div class="tech-tags">
              ${p.tech.map(t => `<span class="tag-pill">[ ${t} ]</span>`).join("")}
            </div>
          </div>

          <div class="slide-actions">
            ${playButton}
            <a href="project.html?id=${p.id}" class="btn btn-outline">VIEW DETAILS →</a>
          </div>
        </div>
      </article>
    `;
  }).join("");

  // Render navigation dots
  dotsContainer.innerHTML = visibleProjects.map((_, i) => `
    <button class="dot ${i === currentIndex ? 'active' : ''}" data-index="${i}" aria-label="Go to slide ${i + 1}"></button>
  `).join("");

  updateState();
}

function updateState() {
  const slides = document.querySelectorAll(".featured-slide");
  const dots = document.querySelectorAll(".dot");

  slides.forEach((slide, index) => {
    const video = slide.querySelector("video");
    if (index === currentIndex) {
      slide.classList.add("active");
      if (video) {
        video.currentTime = 0;
        video.play().catch(() => { });
      }
    } else {
      slide.classList.remove("active");
      if (video) video.pause();
    }
  });

  dots.forEach((dot, index) => {
    dot.classList.toggle("active", index === currentIndex);
  });

  counterEl.textContent = `[ ${String(currentIndex + 1).padStart(2, '0')} / ${String(visibleProjects.length).padStart(2, '0')} ]`;
}

function goToSlide(index) {
  currentIndex = (index + visibleProjects.length) % visibleProjects.length;
  updateState();
  resetTimer();
}

function nextSlide() {
  goToSlide(currentIndex + 1);
}

function prevSlide() {
  goToSlide(currentIndex - 1);
}

// Auto-slide Timer logic
function startTimer() {
  stopTimer();
  // autoSlideInterval = setInterval(nextSlide, AUTO_SLIDE_DELAY);
}

function stopTimer() {
  if (autoSlideInterval) clearInterval(autoSlideInterval);
}

function resetTimer() {
  startTimer();
}

// Event Listeners
prevBtn.addEventListener("click", prevSlide);
nextBtn.addEventListener("click", nextSlide);

dotsContainer.addEventListener("click", (e) => {
  if (e.target.classList.contains("dot")) {
    const idx = parseInt(e.target.dataset.index, 10);
    goToSlide(idx);
  }
});

// Pause timer when hovering over the carousel
const sectionEl = document.getElementById("projects");
sectionEl.addEventListener("mouseenter", stopTimer);
sectionEl.addEventListener("mouseleave", startTimer);
// Mobile menu toggle
const menuToggle = document.getElementById("menuToggle");
const navLinks = document.querySelector(".nav-links");

if (menuToggle && navLinks) {
  menuToggle.addEventListener("click", () => {
    navLinks.classList.toggle("open");
  });

  // Automatically close dropdown when a nav link is clicked
  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("open");
    });
  });
}

// Copy Email functionality
const copyBtn = document.getElementById("copyEmailBtn");
const copyBtnText = document.getElementById("copyBtnText");
const emailAddress = document.getElementById("emailAddress")?.textContent || "simitchamling@gmail.com";

if (copyBtn && copyBtnText) {
  copyBtn.addEventListener("click", () => {
    navigator.clipboard.writeText(emailAddress).then(() => {
      copyBtnText.textContent = "[ COPIED TO CLIPBOARD! ]";
      copyBtn.classList.add("copied");

      setTimeout(() => {
        copyBtnText.textContent = "[ COPY EMAIL ]";
        copyBtn.classList.remove("copied");
      }, 2500);
    }).catch(err => {
      console.error("Failed to copy email: ", err);
    });
  });
}

// Animated Number Counter for Y8 Gameplay Token
document.addEventListener("DOMContentLoaded", () => {
  const counter = document.querySelector(".counter");
  if (!counter) return;

  const target = +counter.getAttribute("data-target");
  const duration = 1500; // ms
  const stepTime = 20;
  const steps = duration / stepTime;
  const increment = target / steps;
  let current = 0;

  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      counter.textContent = target;
      clearInterval(timer);
    } else {
      counter.textContent = Math.ceil(current);
    }
  }, stepTime);
});

// Initialize
renderCarousel();
startTimer();

// Playable Demo Launcher & Controls
document.addEventListener("DOMContentLoaded", () => {
  const startBtn = document.getElementById("startPlayableBtn");
  const overlay = document.getElementById("playableOverlay");
  const iframe = document.getElementById("playableIframe");
  const replayBtn = document.getElementById("replayGameBtn");
  const fullscreenBtn = document.getElementById("fullscreenGameBtn");
  const phoneWrapper = document.getElementById("phoneWrapper");

  // 1. Launch Game
  if (startBtn && iframe && overlay) {
    startBtn.addEventListener("click", () => {
      const dataSrc = iframe.getAttribute("data-src");
      if (dataSrc) {
        iframe.setAttribute("src", dataSrc);
      }
      overlay.classList.add("hidden");
    });
  }

  // 2. Replay Game
  if (replayBtn && iframe) {
    replayBtn.addEventListener("click", () => {
      if (overlay && overlay.classList.contains("hidden")) {
        const currentSrc = iframe.getAttribute("src");
        if (currentSrc) {
          iframe.setAttribute("src", currentSrc);
        }
      } else if (startBtn) {
        startBtn.click();
      }
    });
  }

  // 3. Fullscreen Toggle (Targeting wrapper to maintain 9:16 aspect ratio)
  if (fullscreenBtn && phoneWrapper) {
    fullscreenBtn.addEventListener("click", () => {
      if (!document.fullscreenElement && !document.webkitFullscreenElement) {
        if (phoneWrapper.requestFullscreen) {
          phoneWrapper.requestFullscreen();
        } else if (phoneWrapper.webkitRequestFullscreen) {
          phoneWrapper.webkitRequestFullscreen();
        }
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
          document.webkitExitFullscreen();
        }
      }
    });
  }
});