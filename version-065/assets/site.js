(function () {
    var menuToggle = document.querySelector('[data-menu-toggle]');
    var mobilePanel = document.querySelector('[data-mobile-panel]');

    if (menuToggle && mobilePanel) {
        menuToggle.addEventListener('click', function () {
            mobilePanel.classList.toggle('is-open');
        });
    }

    document.querySelectorAll('[data-global-search]').forEach(function (form) {
        form.addEventListener('submit', function (event) {
            var input = form.querySelector('input[name="q"]');
            if (!input || !input.value.trim()) {
                event.preventDefault();
                window.location.href = './movies.html';
            }
        });
    });

    var hero = document.querySelector('[data-hero]');
    if (hero) {
        var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
        var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
        var prev = hero.querySelector('[data-hero-prev]');
        var next = hero.querySelector('[data-hero-next]');
        var current = 0;
        var timer = null;

        function show(index) {
            if (!slides.length) {
                return;
            }
            current = (index + slides.length) % slides.length;
            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle('is-active', slideIndex === current);
            });
            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle('is-active', dotIndex === current);
            });
        }

        function restart() {
            if (timer) {
                window.clearInterval(timer);
            }
            timer = window.setInterval(function () {
                show(current + 1);
            }, 5200);
        }

        if (prev) {
            prev.addEventListener('click', function () {
                show(current - 1);
                restart();
            });
        }

        if (next) {
            next.addEventListener('click', function () {
                show(current + 1);
                restart();
            });
        }

        dots.forEach(function (dot) {
            dot.addEventListener('click', function () {
                show(Number(dot.getAttribute('data-hero-dot')) || 0);
                restart();
            });
        });

        show(0);
        restart();
    }

    var cards = Array.prototype.slice.call(document.querySelectorAll('[data-movie-card]'));
    var searchInput = document.querySelector('[data-card-search]');
    var emptyState = document.querySelector('[data-empty-state]');
    var activeCategory = 'all';
    var activeType = 'all';

    function applyInitialSearch() {
        if (!searchInput) {
            return;
        }
        var params = new URLSearchParams(window.location.search);
        var query = params.get('q');
        if (query) {
            searchInput.value = query;
        }
    }

    function filterCards() {
        if (!cards.length) {
            return;
        }
        var query = searchInput ? searchInput.value.trim().toLowerCase() : '';
        var visible = 0;

        cards.forEach(function (card) {
            var text = [
                card.getAttribute('data-title') || '',
                card.getAttribute('data-type') || '',
                card.getAttribute('data-region') || '',
                card.getAttribute('data-keywords') || ''
            ].join(' ').toLowerCase();
            var category = card.getAttribute('data-category') || '';
            var type = card.getAttribute('data-type') || '';
            var matchesQuery = !query || text.indexOf(query) !== -1;
            var matchesCategory = activeCategory === 'all' || category === activeCategory;
            var matchesType = activeType === 'all' || type === activeType;
            var shouldShow = matchesQuery && matchesCategory && matchesType;

            card.style.display = shouldShow ? '' : 'none';
            if (shouldShow) {
                visible += 1;
            }
        });

        if (emptyState) {
            emptyState.classList.toggle('is-visible', visible === 0);
        }
    }

    applyInitialSearch();

    if (searchInput) {
        searchInput.addEventListener('input', filterCards);
    }

    document.querySelectorAll('[data-filter-category]').forEach(function (button) {
        button.addEventListener('click', function () {
            activeCategory = button.getAttribute('data-filter-category') || 'all';
            document.querySelectorAll('[data-filter-category]').forEach(function (item) {
                item.classList.toggle('is-active', item === button);
            });
            filterCards();
        });
    });

    document.querySelectorAll('[data-filter-type]').forEach(function (button) {
        button.addEventListener('click', function () {
            activeType = button.getAttribute('data-filter-type') || 'all';
            document.querySelectorAll('[data-filter-type]').forEach(function (item) {
                item.classList.toggle('is-active', item === button);
            });
            filterCards();
        });
    });

    filterCards();

    document.querySelectorAll('[data-player]').forEach(function (box) {
        var video = box.querySelector('video');
        var button = box.querySelector('[data-play-button]');
        var src = box.getAttribute('data-src');
        var hlsInstance = null;
        var attached = false;

        function attachSource() {
            if (!video || !src || attached) {
                return;
            }
            attached = true;

            if (window.Hls && window.Hls.isSupported()) {
                hlsInstance = new window.Hls({ enableWorker: true });
                hlsInstance.loadSource(src);
                hlsInstance.attachMedia(video);
                hlsInstance.on(window.Hls.Events.MANIFEST_PARSED, function () {
                    video.play().catch(function () {});
                });
            } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
                video.src = src;
                video.addEventListener('loadedmetadata', function () {
                    video.play().catch(function () {});
                }, { once: true });
            } else {
                video.src = src;
                video.play().catch(function () {});
            }
        }

        function startPlayer() {
            attachSource();
            box.classList.add('is-playing');
            if (video) {
                video.play().catch(function () {});
            }
        }

        if (button) {
            button.addEventListener('click', function (event) {
                event.preventDefault();
                event.stopPropagation();
                startPlayer();
            });
        }

        box.addEventListener('click', function (event) {
            if (event.target && event.target.tagName && event.target.tagName.toLowerCase() === 'video') {
                return;
            }
            startPlayer();
        });

        window.addEventListener('beforeunload', function () {
            if (hlsInstance) {
                hlsInstance.destroy();
            }
        });
    });
}());
