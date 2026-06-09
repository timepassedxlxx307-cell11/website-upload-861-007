(function () {
  var menuButton = document.querySelector('[data-menu-button]');
  var mobileNav = document.querySelector('[data-mobile-nav]');
  if (menuButton && mobileNav) {
    menuButton.addEventListener('click', function () {
      mobileNav.classList.toggle('open');
    });
  }

  var slides = Array.prototype.slice.call(document.querySelectorAll('.hero-slide'));
  var dots = Array.prototype.slice.call(document.querySelectorAll('.hero-dot'));
  if (slides.length > 1) {
    var active = 0;
    var showSlide = function (index) {
      active = index;
      slides.forEach(function (slide, i) {
        slide.classList.toggle('active', i === active);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle('active', i === active);
      });
    };
    dots.forEach(function (dot, i) {
      dot.addEventListener('click', function () {
        showSlide(i);
      });
    });
    window.setInterval(function () {
      showSlide((active + 1) % slides.length);
    }, 5200);
  }

  var filters = Array.prototype.slice.call(document.querySelectorAll('[data-filter]'));
  var cards = Array.prototype.slice.call(document.querySelectorAll('.movie-card'));
  if (filters.length && cards.length) {
    filters.forEach(function (button) {
      button.addEventListener('click', function () {
        var value = button.getAttribute('data-filter');
        filters.forEach(function (item) {
          item.classList.toggle('active', item === button);
        });
        cards.forEach(function (card) {
          var matched = value === 'all' || card.getAttribute('data-type') === value || card.getAttribute('data-year') === value || card.getAttribute('data-region') === value;
          card.style.display = matched ? '' : 'none';
        });
      });
    });
  }

  var searchInput = document.querySelector('[data-local-search]');
  if (searchInput && cards.length) {
    searchInput.addEventListener('input', function () {
      var value = searchInput.value.trim().toLowerCase();
      cards.forEach(function (card) {
        var pool = [
          card.getAttribute('data-title'),
          card.getAttribute('data-region'),
          card.getAttribute('data-type'),
          card.getAttribute('data-year'),
          card.getAttribute('data-genre')
        ].join(' ').toLowerCase();
        card.style.display = !value || pool.indexOf(value) !== -1 ? '' : 'none';
      });
    });
  }

  var resultBox = document.querySelector('[data-search-results]');
  var globalSearch = document.querySelector('[data-global-search]');
  if (resultBox && globalSearch && window.SITE_MOVIES) {
    var params = new URLSearchParams(window.location.search);
    var query = params.get('q') || '';
    globalSearch.value = query;
    var render = function (value) {
      var keyword = value.trim().toLowerCase();
      if (!keyword) {
        resultBox.innerHTML = '<div class="empty-result">输入片名、类型、地区或年份即可查找影片。</div>';
        return;
      }
      var matched = window.SITE_MOVIES.filter(function (movie) {
        return [movie.title, movie.region, movie.type, movie.year, movie.genre, movie.tags, movie.one_line].join(' ').toLowerCase().indexOf(keyword) !== -1;
      }).slice(0, 80);
      if (!matched.length) {
        resultBox.innerHTML = '<div class="empty-result">暂未找到匹配影片。</div>';
        return;
      }
      resultBox.innerHTML = matched.map(function (movie) {
        return '<article class="rank-item"><a href="./' + movie.file + '"><img src="' + movie.image + '" alt="' + escapeHtml(movie.title) + '" loading="lazy"></a><div><div class="rank-badge">' + escapeHtml(movie.year) + ' · ' + escapeHtml(movie.region) + '</div><h3><a href="./' + movie.file + '">' + escapeHtml(movie.title) + '</a></h3><p>' + escapeHtml(movie.one_line) + '</p></div></article>';
      }).join('');
    };
    var escapeHtml = function (text) {
      return String(text).replace(/[&<>"']/g, function (char) {
        return {
          '&': '&amp;',
          '<': '&lt;',
          '>': '&gt;',
          '"': '&quot;',
          "'": '&#39;'
        }[char];
      });
    };
    render(query);
    globalSearch.addEventListener('input', function () {
      render(globalSearch.value);
    });
  }
})();
