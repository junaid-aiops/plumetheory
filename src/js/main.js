document.addEventListener("DOMContentLoaded", function () {
  console.log("Wedding Photography Site Loaded");

  // Intersection Observer for Scroll Animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("revealed");
        observer.unobserve(entry.target); // Only animate once
      }
    });
  }, observerOptions);

  const revealElements = document.querySelectorAll(".reveal, .reveal-up, .reveal-left, .reveal-right");
  revealElements.forEach((el) => observer.observe(el));

  // Adaptive Header on Scroll
  const header = document.querySelector(".header");
  if (header) {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 50) {
        header.classList.add("scrolled");
      } else {
        header.classList.remove("scrolled");
      }
    });
  }

  // Hero Slider Logic
  const slides = document.querySelectorAll(".hero .slide");
  if (slides.length > 0) {
    let currentSlide = 0;
    setInterval(() => {
      slides[currentSlide].classList.remove("active");
      currentSlide = (currentSlide + 1) % slides.length;
      slides[currentSlide].classList.add("active");
    }, 5000);
  }

  // Lightbox Implementation
  const portfolioItems = document.querySelectorAll(".portfolio-item img");
  if (portfolioItems.length > 0) {
    const lightbox = document.createElement("div");
    lightbox.id = "lightbox";
    lightbox.innerHTML = `
      <div class="lightbox-content">
        <img src="" alt="Full size image">
        <div class="lightbox-close">&times;</div>
        <div class="lightbox-nav prev">&#10094;</div>
        <div class="lightbox-nav next">&#10095;</div>
      </div>
    `;
    document.body.appendChild(lightbox);

    let currentImgIndex = 0;
    const portfolioImgs = Array.from(portfolioItems).map(img => img.src);

    portfolioItems.forEach((img, index) => {
      img.addEventListener("click", () => {
        currentImgIndex = index;
        updateLightbox();
        lightbox.classList.add("active");
      });
    });

    const updateLightbox = () => {
      const imgTarget = lightbox.querySelector("img");
      if (imgTarget) {
        imgTarget.src = portfolioImgs[currentImgIndex];
      }
    };

    lightbox.querySelector(".lightbox-close").addEventListener("click", () => {
      lightbox.classList.remove("active");
    });

    lightbox.querySelector(".next").addEventListener("click", (e) => {
      e.stopPropagation();
      currentImgIndex = (currentImgIndex + 1) % portfolioImgs.length;
      updateLightbox();
    });

    lightbox.querySelector(".prev").addEventListener("click", (e) => {
      e.stopPropagation();
      currentImgIndex = (currentImgIndex - 1 + portfolioImgs.length) % portfolioImgs.length;
      updateLightbox();
    });

    lightbox.addEventListener("click", () => lightbox.classList.remove("active"));
  }

  // Mobile Navigation Toggle
  const navToggle = document.querySelector(".nav-toggle");
  const navList = document.querySelector(".nav-list");
  const navLinks = document.querySelectorAll(".nav-list a");

  if (navToggle && navList) {
    navToggle.addEventListener("click", function () {
      this.classList.toggle("active");
      navList.classList.toggle("active");
    });

    navLinks.forEach(link => {
      link.addEventListener("click", () => {
        navToggle.classList.remove("active");
        navList.classList.remove("active");
      });
    });
  }

  // Active Service Card Highlight (Mobile)
  const serviceCards = document.querySelectorAll(".service-card");
  if (serviceCards.length > 0 && window.innerWidth < 768) {
    const serviceObserverOptions = {
      root: document.querySelector(".services-grid"),
      threshold: 0.7
    };

    const serviceObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("revealed");

          // Only one active at a time for focus
          if (entry.intersectionRatio > 0.7) {
            serviceCards.forEach(card => card.classList.remove("active"));
            entry.target.classList.add("active");
          }
        }
      });
    }, serviceObserverOptions);

    serviceCards.forEach(card => serviceObserver.observe(card));
  }
  // Services Slider Logic
  const servicesSection = document.querySelector(".services");
  const servicesSlider = document.querySelector(".services-slider");

  if (servicesSlider && servicesSection) {
    const track = servicesSlider.querySelector(".slider-track");
    const slides = servicesSlider.querySelectorAll(".service-slide");
    const prevBtn = servicesSection.querySelector(".slider-arrow.prev");
    const nextBtn = servicesSection.querySelector(".slider-arrow.next");

    let currentServiceSlide = 0;
    let autoScrollInterval;
    const intervalTime = 4000; // 4 seconds

    const goToSlide = (index) => {
      // Handle wrapping
      if (index < 0) {
        currentServiceSlide = slides.length - 1;
      } else if (index >= slides.length) {
        currentServiceSlide = 0;
      } else {
        currentServiceSlide = index;
      }

      // Move track
      track.style.transform = `translateX(-${currentServiceSlide * 100}%)`;

      // Update active classes to trigger CSS reveal animations
      slides.forEach((slide, i) => {
        if (i === currentServiceSlide) {
          slide.classList.add("active");
        } else {
          slide.classList.remove("active");
        }
      });
    };

    const startAutoScroll = () => {
      autoScrollInterval = setInterval(() => {
        goToSlide(currentServiceSlide + 1);
      }, intervalTime);
    };

    const stopAutoScroll = () => {
      clearInterval(autoScrollInterval);
    };

    // Event Listeners (User Interaction STOPS AutoScroll)
    if (prevBtn) {
      prevBtn.addEventListener("click", () => {
        goToSlide(currentServiceSlide - 1);
        stopAutoScroll();
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener("click", () => {
        goToSlide(currentServiceSlide + 1);
        stopAutoScroll();
      });
    }

    // Initialize Auto-scroll
    startAutoScroll();
  }
});