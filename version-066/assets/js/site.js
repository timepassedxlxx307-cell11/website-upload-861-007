(function () {
  function qs(selector, scope) {
    return (scope || document).querySelector(selector);
  }

  function qsa(selector, scope) {
    return Array.prototype.slice.call((scope || document).querySelectorAll(selector));
  }

  function normalize(value) {
    return (value || '').toString().trim().toLowerCase();
  }

  var menuButton = qs('.menu-toggle');
  var mobilePanel = qs('.mobile-panel');
  if (menuButton && mobilePanel) {
    menuButton.addEventListener('click', function () {
      var open = mobilePanel.classList.toggle('is-open');
      menuButton.setAttribute('aria-expanded', open ? 'true' : 'false');
      menuButton.textContent = open ? '×' : '☰';
    });
  }

  qsa('[data-hero]').forEach(function (hero) {
    var slides = qsa('.hero-slide', hero);
    var dots = qsa('.hero-dot', hero);
    var prev = qs('[data-hero-prev]', hero);
    var next = qs('[data-hero-next]', hero);
    var index = 0;
    if (!slides.length) {
      return;
    }
    function show(nextIndex) {
      index = (nextIndex + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle('is-active', i === index);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle('is-active', i === index);
      });
    }
    if (prev) {
      prev.addEventListener('click', function () {
        show(index - 1);
      });
    }
    if (next) {
      next.addEventListener('click', function () {
        show(index + 1);
      });
    }
    dots.forEach(function (dot, i) {
      dot.addEventListener('click', function () {
        show(i);
      });
    });
    window.setInterval(function () {
      show(index + 1);
    }, 5000);
  });

  qsa('img').forEach(function (image) {
    image.addEventListener('error', function () {
      image.style.opacity = '0';
    }, { once: true });
  });

  function initFilterPanel(panel) {
    var cards = qsa('[data-card]');
    if (!cards.length) {
      return;
    }
    var keyword = qs('[data-filter-keyword]', panel);
    var region = qs('[data-filter-region]', panel);
    var type = qs('[data-filter-type]', panel);
    var year = qs('[data-filter-year]', panel);
    var reset = qs('[data-filter-reset]', panel);
    var count = qs('[data-filter-count]');
    var params = new URLSearchParams(window.location.search);
    if (keyword && params.get('q')) {
      keyword.value = params.get('q');
    }
    if (region && params.get('region')) {
      region.value = params.get('region');
    }
    if (type && params.get('type')) {
      type.value = params.get('type');
    }
    if (year && params.get('year')) {
      year.value = params.get('year');
    }
    function apply() {
      var kw = normalize(keyword && keyword.value);
      var rg = normalize(region && region.value);
      var tp = normalize(type && type.value);
      var yr = normalize(year && year.value);
      var shown = 0;
      cards.forEach(function (card) {
        var text = normalize([
          card.dataset.title,
          card.dataset.region,
          card.dataset.type,
          card.dataset.year,
          card.dataset.genre,
          card.textContent
        ].join(' '));
        var match = true;
        if (kw && text.indexOf(kw) === -1) {
          match = false;
        }
        if (rg && normalize(card.dataset.region) !== rg) {
          match = false;
        }
        if (tp && normalize(card.dataset.type) !== tp) {
          match = false;
        }
        if (yr && normalize(card.dataset.year) !== yr) {
          match = false;
        }
        card.classList.toggle('is-hidden-card', !match);
        if (match) {
          shown += 1;
        }
      });
      if (count) {
        count.textContent = '当前显示 ' + shown + ' 部影片';
      }
    }
    [keyword, region, type, year].forEach(function (control) {
      if (control) {
        control.addEventListener('input', apply);
        control.addEventListener('change', apply);
      }
    });
    if (reset) {
      reset.addEventListener('click', function () {
        if (keyword) keyword.value = '';
        if (region) region.value = '';
        if (type) type.value = '';
        if (year) year.value = '';
        apply();
      });
    }
    apply();
  }

  qsa('[data-filter-panel]').forEach(initFilterPanel);

  function movieCard(movie) {
    var href = 'movie/' + movie.file;
    return '<article class="movie-card medium" data-card data-title="' + escapeHtml(movie.title) + '" data-region="' + escapeHtml(movie.region) + '" data-type="' + escapeHtml(movie.type) + '" data-year="' + escapeHtml(movie.year) + '" data-genre="' + escapeHtml(movie.genre) + '">' +
      '<a href="' + href + '" class="poster-link" aria-label="观看 ' + escapeHtml(movie.title) + '">' +
      '<span class="poster-frame"><img src="' + movie.cover + '" alt="' + escapeHtml(movie.title) + '" loading="lazy"><span class="poster-shade"></span><span class="poster-play">▶</span><span class="poster-type">' + escapeHtml(movie.type) + '</span><span class="poster-year">' + escapeHtml(movie.year) + '</span></span></a>' +
      '<div class="card-body"><h3><a href="' + href + '">' + escapeHtml(movie.title) + '</a></h3><p>' + escapeHtml(movie.oneLine || movie.summary || '') + '</p><div class="card-meta"><span>' + escapeHtml(movie.region) + '</span><span>' + escapeHtml(movie.genre) + '</span></div></div></article>';
  }

  function escapeHtml(value) {
    return (value || '').toString().replace(/[&<>"']/g, function (char) {
      return {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
      }[char];
    });
  }

  var resultBox = qs('[data-search-results]');
  if (resultBox && window.MOVIES) {
    var params = new URLSearchParams(window.location.search);
    var query = normalize(params.get('q'));
    var title = qs('[data-search-title]');
    var count = qs('[data-search-count]');
    var input = qs('.hero-search input[name="q"]');
    if (input && params.get('q')) {
      input.value = params.get('q');
    }
    if (query) {
      var results = window.MOVIES.filter(function (movie) {
        return normalize([
          movie.title,
          movie.region,
          movie.type,
          movie.year,
          movie.genre,
          movie.tags,
          movie.oneLine,
          movie.summary
        ].join(' ')).indexOf(query) !== -1;
      }).slice(0, 240);
      resultBox.innerHTML = results.map(movieCard).join('');
      if (title) {
        title.textContent = '搜索结果';
      }
      if (count) {
        count.textContent = '找到 ' + results.length + ' 部相关影片';
      }
    }
  }

  function preparePlayer(video) {
    var source = video.getAttribute('data-src');
    if (!source || video.dataset.ready === '1') {
      return;
    }
    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = source;
      video.dataset.ready = '1';
      return;
    }
    if (window.Hls && window.Hls.isSupported()) {
      var hls = new window.Hls({ enableWorker: true, lowLatencyMode: true });
      hls.loadSource(source);
      hls.attachMedia(video);
      hls.on(window.Hls.Events.ERROR, function (_, data) {
        if (!data.fatal) {
          return;
        }
        if (data.type === window.Hls.ErrorTypes.NETWORK_ERROR) {
          hls.startLoad();
        } else if (data.type === window.Hls.ErrorTypes.MEDIA_ERROR) {
          hls.recoverMediaError();
        } else {
          hls.destroy();
        }
      });
      video.dataset.ready = '1';
    }
  }

  qsa('.player-card').forEach(function (card) {
    var video = qs('.hls-player', card);
    var button = qs('.player-start', card);
    if (!video) {
      return;
    }
    function play() {
      preparePlayer(video);
      var action = video.play();
      if (action && typeof action.catch === 'function') {
        action.catch(function () {});
      }
      if (button) {
        button.classList.add('is-hidden');
      }
    }
    video.addEventListener('click', function () {
      if (video.paused) {
        play();
      }
    });
    video.addEventListener('play', function () {
      if (button) {
        button.classList.add('is-hidden');
      }
    });
    video.addEventListener('pause', function () {
      if (button) {
        button.classList.remove('is-hidden');
      }
    });
    if (button) {
      button.addEventListener('click', play);
    }
  });
})();
