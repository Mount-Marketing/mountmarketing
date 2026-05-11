const siteHeader = document.querySelector(".site-header");
let navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelector(".nav-links");
const navDropdowns = document.querySelectorAll("[data-nav-dropdown]");
const mobileNavQuery = window.matchMedia("(max-width: 860px)");

if (siteHeader && navLinks && !navToggle) {
  const nav = siteHeader.querySelector(".nav");
  navToggle = document.createElement("button");
  navToggle.className = "nav-toggle";
  navToggle.type = "button";
  navToggle.setAttribute("aria-expanded", "false");
  navToggle.setAttribute("aria-label", "Toggle navigation");
  navToggle.innerHTML = "<span></span>";

  if (!navLinks.id) {
    navLinks.id = "primary-navigation";
  }

  navToggle.setAttribute("aria-controls", navLinks.id);

  if (nav) {
    nav.insertBefore(navToggle, navLinks);
  }
}

const closeDropdown = (dropdown) => {
  dropdown.classList.remove("is-open");
  const toggle = dropdown.querySelector(".nav-dropdown-toggle");
  if (toggle) {
    toggle.setAttribute("aria-expanded", "false");
  }
};

const closeAllDropdowns = () => {
  navDropdowns.forEach((dropdown) => {
    closeDropdown(dropdown);
  });
};

const closeNav = () => {
  if (!siteHeader || !navToggle) {
    closeAllDropdowns();
    return;
  }

  siteHeader.classList.remove("is-nav-open");
  navToggle.setAttribute("aria-expanded", "false");
  closeAllDropdowns();
};

const openDropdown = (dropdown) => {
  const toggle = dropdown.querySelector(".nav-dropdown-toggle");

  navDropdowns.forEach((item) => {
    if (item !== dropdown) {
      closeDropdown(item);
    }
  });

  dropdown.classList.add("is-open");
  if (toggle) {
    toggle.setAttribute("aria-expanded", "true");
  }
};

if (navToggle && siteHeader && navLinks) {
  navToggle.addEventListener("click", () => {
    const isOpen = siteHeader.classList.toggle("is-nav-open");
    navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");

    if (!isOpen) {
      closeAllDropdowns();
    }
  });

  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      if (mobileNavQuery.matches) {
        closeNav();
      }
    });
  });
}

if (navDropdowns.length) {
  navDropdowns.forEach((dropdown) => {
    const toggle = dropdown.querySelector(".nav-dropdown-toggle");
    if (!toggle) {
      return;
    }

    toggle.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();

      if (dropdown.classList.contains("is-open")) {
        closeDropdown(dropdown);
        return;
      }

      openDropdown(dropdown);
    });
  });

  document.addEventListener("click", (event) => {
    if (siteHeader && !siteHeader.contains(event.target)) {
      closeNav();
      return;
    }

    if (event.target.closest("[data-nav-dropdown]")) {
      return;
    }

    if (!mobileNavQuery.matches) {
      closeAllDropdowns();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") {
      return;
    }

    closeNav();
  });

  const handleViewportChange = (event) => {
    if (!event.matches) {
      closeNav();
    }
  };

  if (typeof mobileNavQuery.addEventListener === "function") {
    mobileNavQuery.addEventListener("change", handleViewportChange);
  } else if (typeof mobileNavQuery.addListener === "function") {
    mobileNavQuery.addListener(handleViewportChange);
  }
}

const mobileCarousels = document.querySelectorAll("[data-mobile-carousel]");

if (mobileCarousels.length) {
  const rotationDelay = 6500;
  const carouselInstances = [];

  const resetProofCards = (carousel) => {
    carousel.querySelectorAll("[data-proof-card]").forEach((card) => {
      card.classList.remove("is-flipped");
      card.setAttribute("aria-expanded", "false");
      card.querySelectorAll(".proof-button").forEach((button) => {
        button.tabIndex = -1;
      });
    });
  };

  mobileCarousels.forEach((carousel) => {
    const viewport = carousel.closest(".mobile-carousel-viewport");
    const items = Array.from(carousel.children);
    const controls = viewport?.nextElementSibling?.matches("[data-carousel-controls]")
      ? viewport.nextElementSibling
      : null;
    const prev = controls?.querySelector("[data-carousel-prev]");
    const next = controls?.querySelector("[data-carousel-next]");
    const counter = controls?.querySelector("[data-carousel-counter]");
    let activeIndex = 0;
    let timer = null;
    let isInView = !("IntersectionObserver" in window);

    const stop = () => {
      if (timer) {
        window.clearInterval(timer);
        timer = null;
      }
    };

    const update = () => {
      carousel.style.setProperty("--carousel-index", activeIndex);
      items.forEach((item, index) => {
        item.classList.toggle("is-active", index === activeIndex);
      });

      if (counter) {
        counter.textContent = `${activeIndex + 1} of ${items.length}`;
      }

      resetProofCards(carousel);
    };

    const start = () => {
      stop();

      if (!mobileNavQuery.matches || document.hidden || !isInView || items.length < 2) {
        return;
      }

      timer = window.setInterval(() => {
        activeIndex = (activeIndex + 1) % items.length;
        update(1);
      }, rotationDelay);
    };

    const move = (direction) => {
      activeIndex = (activeIndex + direction + items.length) % items.length;
      update(direction);
      start();
    };

    carousel.classList.add("is-carousel-ready");
    if (controls) {
      controls.classList.add("is-carousel-ready");
    }
    update();
    start();

    if (prev) {
      prev.addEventListener("click", () => {
        move(-1);
      });
    }

    if (next) {
      next.addEventListener("click", () => {
        move(1);
      });
    }

    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          isInView = entry.isIntersecting;

          if (isInView) {
            start();
            return;
          }

          stop();
        });
      }, {
        rootMargin: "160px 0px",
        threshold: 0
      });

      observer.observe(carousel);
    }

    carouselInstances.push({ start, stop, update });
  });

  const restartCarousels = () => {
    carouselInstances.forEach((instance) => {
      instance.update();
      instance.start();
    });
  };

  document.addEventListener("visibilitychange", () => {
    carouselInstances.forEach((instance) => {
      if (document.hidden) {
        instance.stop();
        return;
      }

      instance.start();
    });
  });

  if (typeof mobileNavQuery.addEventListener === "function") {
    mobileNavQuery.addEventListener("change", restartCarousels);
  } else if (typeof mobileNavQuery.addListener === "function") {
    mobileNavQuery.addListener(restartCarousels);
  }
}
