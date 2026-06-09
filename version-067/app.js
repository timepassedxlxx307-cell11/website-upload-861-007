(function () {
    function ready(callback) {
        if (document.readyState !== "loading") {
            callback();
        } else {
            document.addEventListener("DOMContentLoaded", callback);
        }
    }

    function initMenu() {
        var button = document.querySelector(".menu-toggle");
        var menu = document.querySelector(".mobile-nav");
        if (!button || !menu) {
            return;
        }
        button.addEventListener("click", function () {
            var opened = menu.classList.toggle("is-open");
            button.setAttribute("aria-expanded", opened ? "true" : "false");
        });
    }

    function initHero() {
        var hero = document.querySelector("[data-hero]");
        if (!hero) {
            return;
        }
        var slides = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-slide]"));
        var dots = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-dot]"));
        var prev = hero.querySelector("[data-hero-prev]");
        var next = hero.querySelector("[data-hero-next]");
        if (!slides.length) {
            return;
        }
        var current = 0;
        var timer = null;

        function show(index) {
            current = (index + slides.length) % slides.length;
            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle("is-active", slideIndex === current);
            });
            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle("is-active", dotIndex === current);
            });
        }

        function start() {
            stop();
            timer = setInterval(function () {
                show(current + 1);
            }, 5200);
        }

        function stop() {
            if (timer) {
                clearInterval(timer);
                timer = null;
            }
        }

        if (prev) {
            prev.addEventListener("click", function () {
                show(current - 1);
                start();
            });
        }
        if (next) {
            next.addEventListener("click", function () {
                show(current + 1);
                start();
            });
        }
        dots.forEach(function (dot, index) {
            dot.addEventListener("click", function () {
                show(index);
                start();
            });
        });
        hero.addEventListener("mouseenter", stop);
        hero.addEventListener("mouseleave", start);
        show(0);
        start();
    }

    function normalize(value) {
        return String(value || "").toLowerCase().trim();
    }

    function initFilters() {
        var panels = Array.prototype.slice.call(document.querySelectorAll("[data-filter-panel]"));
        panels.forEach(function (panel) {
            var root = panel.closest("main") || document;
            var keyword = panel.querySelector("[data-filter-keyword]");
            var year = panel.querySelector("[data-filter-year]");
            var type = panel.querySelector("[data-filter-type]");
            var reset = panel.querySelector("[data-filter-reset]");
            var cards = Array.prototype.slice.call(root.querySelectorAll("[data-card]"));
            var count = root.querySelector("[data-result-count]");
            var params = new URLSearchParams(window.location.search);
            if (keyword && params.get("q")) {
                keyword.value = params.get("q");
            }

            function apply() {
                var keywordValue = normalize(keyword && keyword.value);
                var yearValue = normalize(year && year.value);
                var typeValue = normalize(type && type.value);
                var visible = 0;
                cards.forEach(function (card) {
                    var haystack = normalize(card.getAttribute("data-search"));
                    var cardYear = normalize(card.getAttribute("data-year"));
                    var cardType = normalize(card.getAttribute("data-type"));
                    var matched = true;
                    if (keywordValue && haystack.indexOf(keywordValue) === -1) {
                        matched = false;
                    }
                    if (yearValue && cardYear !== yearValue) {
                        matched = false;
                    }
                    if (typeValue && cardType !== typeValue) {
                        matched = false;
                    }
                    card.classList.toggle("is-hidden", !matched);
                    if (matched) {
                        visible += 1;
                    }
                });
                if (count) {
                    count.textContent = "当前显示 " + visible + " 部影片";
                }
            }

            [keyword, year, type].forEach(function (control) {
                if (!control) {
                    return;
                }
                control.addEventListener("input", apply);
                control.addEventListener("change", apply);
            });
            if (reset) {
                reset.addEventListener("click", function () {
                    if (keyword) {
                        keyword.value = "";
                    }
                    if (year) {
                        year.value = "";
                    }
                    if (type) {
                        type.value = "";
                    }
                    apply();
                });
            }
            apply();
        });
    }

    ready(function () {
        initMenu();
        initHero();
        initFilters();
    });
})();

function setupPlayer(streamUrl) {
    var video = document.getElementById("movie-video");
    var cover = document.getElementById("play-cover");
    if (!video || !cover || !streamUrl) {
        return;
    }
    var loaded = false;
    var hlsInstance = null;

    function attach() {
        if (loaded) {
            return Promise.resolve();
        }
        loaded = true;
        if (video.canPlayType("application/vnd.apple.mpegurl")) {
            video.src = streamUrl;
            return Promise.resolve();
        }
        if (window.Hls && window.Hls.isSupported()) {
            hlsInstance = new window.Hls({ enableWorker: true });
            hlsInstance.loadSource(streamUrl);
            hlsInstance.attachMedia(video);
            return new Promise(function (resolve) {
                hlsInstance.on(window.Hls.Events.MANIFEST_PARSED, resolve);
                setTimeout(resolve, 1200);
            });
        }
        video.src = streamUrl;
        return Promise.resolve();
    }

    function play() {
        cover.classList.add("is-hidden");
        attach().then(function () {
            var playPromise = video.play();
            if (playPromise && typeof playPromise.catch === "function") {
                playPromise.catch(function () {
                    cover.classList.remove("is-hidden");
                });
            }
        });
    }

    cover.addEventListener("click", play);
    video.addEventListener("click", function () {
        if (video.paused) {
            play();
        }
    });
    video.addEventListener("play", function () {
        cover.classList.add("is-hidden");
    });
    window.addEventListener("beforeunload", function () {
        if (hlsInstance) {
            hlsInstance.destroy();
        }
    });
}
