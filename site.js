const navDropdowns = document.querySelectorAll("[data-nav-dropdown]");

if (navDropdowns.length) {
  const closeDropdown = (dropdown) => {
    dropdown.classList.remove("is-open");
    const toggle = dropdown.querySelector(".nav-dropdown-toggle");
    if (toggle) {
      toggle.setAttribute("aria-expanded", "false");
    }
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
    if (event.target.closest("[data-nav-dropdown]")) {
      return;
    }

    navDropdowns.forEach((dropdown) => {
      closeDropdown(dropdown);
    });
  });

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") {
      return;
    }

    navDropdowns.forEach((dropdown) => {
      closeDropdown(dropdown);
    });
  });
}
