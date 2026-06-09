(function () {
  const menuButton = document.querySelector(".menu-toggle");
  const mobileNav = document.querySelector(".mobile-nav");

  if (menuButton && mobileNav) {
    menuButton.addEventListener("click", function () {
      const isOpen = mobileNav.classList.toggle("open");
      menuButton.setAttribute("aria-expanded", String(isOpen));
    });
  }

  const backTop = document.querySelector(".back-top");

  if (backTop) {
    window.addEventListener("scroll", function () {
      if (window.scrollY > 320) {
        backTop.classList.add("show");
      } else {
        backTop.classList.remove("show");
      }
    });

    backTop.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  const carousel = document.querySelector("[data-hero-carousel]");

  if (carousel) {
    const slides = Array.from(carousel.querySelectorAll(".hero-slide"));
    const dots = Array.from(carousel.querySelectorAll(".hero-dot"));
    let current = 0;
    let timer = null;

    const showSlide = function (index) {
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle("active", slideIndex === current);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle("active", dotIndex === current);
      });
    };

    const play = function () {
      timer = window.setInterval(function () {
        showSlide(current + 1);
      }, 5200);
    };

    const restart = function () {
      if (timer) {
        window.clearInterval(timer);
      }
      play();
    };

    dots.forEach(function (dot) {
      dot.addEventListener("click", function () {
        showSlide(Number(dot.getAttribute("data-slide")) || 0);
        restart();
      });
    });

    if (slides.length > 1) {
      play();
    }
  }

  const cards = Array.from(document.querySelectorAll("[data-movie-card]"));
  const searchInput = document.getElementById("movieSearch");
  const clearButton = document.getElementById("clearSearch");
  const categoryFilter = document.getElementById("categoryFilter");
  const typeFilter = document.getElementById("typeFilter");
  const yearFilter = document.getElementById("yearFilter");

  if (cards.length && searchInput) {
    const params = new URLSearchParams(window.location.search);
    const initialQuery = params.get("q");

    if (initialQuery) {
      searchInput.value = initialQuery;
    }

    const makeText = function (card) {
      return [
        card.getAttribute("data-title"),
        card.getAttribute("data-tags"),
        card.getAttribute("data-region"),
        card.getAttribute("data-type"),
        card.getAttribute("data-year")
      ].join(" ").toLowerCase();
    };

    const filterCards = function () {
      const query = searchInput.value.trim().toLowerCase();
      const category = categoryFilter ? categoryFilter.value : "";
      const type = typeFilter ? typeFilter.value : "";
      const year = yearFilter ? yearFilter.value : "";
      let visible = 0;

      cards.forEach(function (card) {
        const text = makeText(card);
        const cardCategory = card.getAttribute("data-category") || "";
        const cardType = card.getAttribute("data-type") || "";
        const cardYear = card.getAttribute("data-year") || "";
        const matchedQuery = !query || text.indexOf(query) !== -1;
        const matchedCategory = !category || cardCategory === category;
        const matchedType = !type || cardType.indexOf(type) !== -1;
        const matchedYear = !year || cardYear === year;
        const matched = matchedQuery && matchedCategory && matchedType && matchedYear;

        card.style.display = matched ? "" : "none";
        if (matched) {
          visible += 1;
        }
      });

      const holder = cards[0].parentElement;
      let empty = holder.querySelector(".no-result");

      if (!visible) {
        if (!empty) {
          empty = document.createElement("div");
          empty.className = "no-result";
          empty.textContent = "没有找到匹配的影片";
          holder.appendChild(empty);
        }
      } else if (empty) {
        empty.remove();
      }
    };

    [searchInput, categoryFilter, typeFilter, yearFilter].forEach(function (control) {
      if (control) {
        control.addEventListener("input", filterCards);
        control.addEventListener("change", filterCards);
      }
    });

    if (clearButton) {
      clearButton.addEventListener("click", function () {
        searchInput.value = "";
        if (categoryFilter) {
          categoryFilter.value = "";
        }
        if (typeFilter) {
          typeFilter.value = "";
        }
        if (yearFilter) {
          yearFilter.value = "";
        }
        filterCards();
      });
    }

    filterCards();
  }
})();
