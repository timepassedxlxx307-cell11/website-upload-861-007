(function () {
  var menuButton = document.querySelector('[data-menu-button]');
  var mobileNav = document.querySelector('[data-mobile-nav]');

  if (menuButton && mobileNav) {
    menuButton.addEventListener('click', function () {
      mobileNav.classList.toggle('is-open');
    });
  }

  document.querySelectorAll('.poster-image').forEach(function (image) {
    if (image.complete && image.naturalWidth > 0) {
      image.classList.add('is-loaded');
    }

    image.addEventListener('load', function () {
      image.classList.add('is-loaded');
    });
  });

  var hero = document.querySelector('[data-hero]');

  if (hero) {
    var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
    var prev = hero.querySelector('[data-hero-prev]');
    var next = hero.querySelector('[data-hero-next]');
    var active = 0;
    var timer = null;

    function show(index) {
      if (!slides.length) {
        return;
      }

      active = (index + slides.length) % slides.length;

      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('is-active', slideIndex === active);
      });

      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('is-active', dotIndex === active);
      });
    }

    function start() {
      stop();
      timer = window.setInterval(function () {
        show(active + 1);
      }, 5000);
    }

    function stop() {
      if (timer) {
        window.clearInterval(timer);
      }
    }

    if (prev) {
      prev.addEventListener('click', function () {
        show(active - 1);
        start();
      });
    }

    if (next) {
      next.addEventListener('click', function () {
        show(active + 1);
        start();
      });
    }

    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        show(Number(dot.getAttribute('data-hero-dot')) || 0);
        start();
      });
    });

    hero.addEventListener('mouseenter', stop);
    hero.addEventListener('mouseleave', start);
    start();
  }

  var filter = document.querySelector('[data-movie-filter]');
  var cards = Array.prototype.slice.call(document.querySelectorAll('[data-movie-card]'));
  var count = document.querySelector('[data-filter-count]');

  function applyFilter() {
    if (!filter || !cards.length) {
      return;
    }

    var keyword = filter.value.trim().toLowerCase();
    var visible = 0;

    cards.forEach(function (card) {
      var haystack = [
        card.getAttribute('data-title') || '',
        card.getAttribute('data-tags') || '',
        card.getAttribute('data-year') || '',
        card.getAttribute('data-region') || ''
      ].join(' ').toLowerCase();
      var matched = !keyword || haystack.indexOf(keyword) !== -1;
      card.classList.toggle('is-hidden', !matched);
      if (matched) {
        visible += 1;
      }
    });

    if (count) {
      count.textContent = visible + ' 部可浏览';
    }
  }

  if (filter) {
    filter.addEventListener('input', applyFilter);
    applyFilter();
  }
})();
