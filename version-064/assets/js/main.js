(function () {
  var menuButton = document.querySelector(".mobile-menu-button");
  var navMenu = document.querySelector(".nav-menu");

  if (menuButton && navMenu) {
    menuButton.addEventListener("click", function () {
      var opened = navMenu.classList.toggle("open");
      menuButton.setAttribute("aria-expanded", opened ? "true" : "false");
    });
  }

  var slides = Array.prototype.slice.call(document.querySelectorAll(".hero-slide"));
  var dots = Array.prototype.slice.call(document.querySelectorAll(".hero-dot"));
  var prev = document.querySelector(".hero-prev");
  var next = document.querySelector(".hero-next");
  var current = 0;
  var timer = null;

  function showSlide(index) {
    if (!slides.length) {
      return;
    }

    current = (index + slides.length) % slides.length;

    slides.forEach(function (slide, slideIndex) {
      slide.classList.toggle("active", slideIndex === current);
    });

    dots.forEach(function (dot, dotIndex) {
      dot.classList.toggle("active", dotIndex === current);
    });
  }

  function restartTimer() {
    if (!slides.length) {
      return;
    }

    window.clearInterval(timer);
    timer = window.setInterval(function () {
      showSlide(current + 1);
    }, 5000);
  }

  dots.forEach(function (dot) {
    dot.addEventListener("click", function () {
      showSlide(Number(dot.getAttribute("data-hero-to")) || 0);
      restartTimer();
    });
  });

  if (prev) {
    prev.addEventListener("click", function () {
      showSlide(current - 1);
      restartTimer();
    });
  }

  if (next) {
    next.addEventListener("click", function () {
      showSlide(current + 1);
      restartTimer();
    });
  }

  restartTimer();

  Array.prototype.slice.call(document.querySelectorAll(".site-search-form")).forEach(function (form) {
    form.addEventListener("submit", function (event) {
      var input = form.querySelector("input[name='q']");
      var value = input ? input.value.trim() : "";

      if (value) {
        event.preventDefault();
        window.location.href = form.getAttribute("action") + "?q=" + encodeURIComponent(value);
      }
    });
  });
})();
