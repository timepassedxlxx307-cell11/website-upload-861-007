document.addEventListener("DOMContentLoaded", function () {
    var navToggle = document.querySelector(".nav-toggle");

    if (navToggle) {
        navToggle.addEventListener("click", function () {
            document.body.classList.toggle("nav-open");
        });
    }

    document.querySelectorAll(".site-nav a").forEach(function (link) {
        link.addEventListener("click", function () {
            document.body.classList.remove("nav-open");
        });
    });

    setupHeroSlider();
    setupCatalogFilter();
    setupPlayers();
    setupBackToTop();
});

function setupHeroSlider() {
    var slides = Array.prototype.slice.call(document.querySelectorAll("[data-hero-slide]"));
    var dots = Array.prototype.slice.call(document.querySelectorAll("[data-hero-dot]"));

    if (!slides.length || !dots.length) {
        return;
    }

    var current = 0;
    var timer = null;

    function showSlide(index) {
        current = (index + slides.length) % slides.length;

        slides.forEach(function (slide, slideIndex) {
            slide.classList.toggle("active", slideIndex === current);
        });

        dots.forEach(function (dot, dotIndex) {
            dot.classList.toggle("active", dotIndex === current);
        });
    }

    function startTimer() {
        stopTimer();
        timer = window.setInterval(function () {
            showSlide(current + 1);
        }, 5200);
    }

    function stopTimer() {
        if (timer) {
            window.clearInterval(timer);
            timer = null;
        }
    }

    dots.forEach(function (dot, index) {
        dot.addEventListener("click", function () {
            showSlide(index);
            startTimer();
        });
    });

    var slider = document.querySelector(".hero-slider");

    if (slider) {
        slider.addEventListener("mouseenter", stopTimer);
        slider.addEventListener("mouseleave", startTimer);
    }

    showSlide(0);
    startTimer();
}

function setupCatalogFilter() {
    var search = document.getElementById("movieSearch");
    var filter = document.getElementById("categoryFilter");
    var cards = Array.prototype.slice.call(document.querySelectorAll(".catalog-card"));
    var empty = document.getElementById("emptyState");

    if (!cards.length) {
        return;
    }

    function applyFilter() {
        var query = search ? search.value.trim().toLowerCase() : "";
        var category = filter ? filter.value : "all";
        var visible = 0;

        cards.forEach(function (card) {
            var text = (card.getAttribute("data-search") || "").toLowerCase();
            var cardCategory = card.getAttribute("data-category") || "";
            var matchText = !query || text.indexOf(query) !== -1;
            var matchCategory = category === "all" || category === cardCategory;
            var isVisible = matchText && matchCategory;

            card.style.display = isVisible ? "" : "none";

            if (isVisible) {
                visible += 1;
            }
        });

        if (empty) {
            empty.classList.toggle("show", visible === 0);
        }
    }

    if (search) {
        search.addEventListener("input", applyFilter);
    }

    if (filter) {
        filter.addEventListener("change", applyFilter);
    }

    applyFilter();
}

function setupPlayers() {
    document.querySelectorAll(".player-card").forEach(function (card) {
        var video = card.querySelector("video");
        var overlay = card.querySelector(".player-overlay");
        var streamUrl = card.getAttribute("data-stream-url");
        var hlsInstance = null;
        var initialized = false;

        if (!video || !streamUrl) {
            return;
        }

        function playVideo() {
            overlay && overlay.classList.add("hidden");
            var promise = video.play();

            if (promise && typeof promise.catch === "function") {
                promise.catch(function () {});
            }
        }

        function startPlayback() {
            if (!initialized) {
                initialized = true;

                if (video.canPlayType("application/vnd.apple.mpegurl")) {
                    video.src = streamUrl;
                    playVideo();
                    return;
                }

                if (window.Hls && window.Hls.isSupported()) {
                    hlsInstance = new window.Hls({
                        enableWorker: true,
                        lowLatencyMode: true
                    });
                    hlsInstance.loadSource(streamUrl);
                    hlsInstance.attachMedia(video);
                    hlsInstance.on(window.Hls.Events.MANIFEST_PARSED, playVideo);
                    hlsInstance.on(window.Hls.Events.ERROR, function (eventName, data) {
                        if (data && data.fatal && hlsInstance) {
                            hlsInstance.destroy();
                            hlsInstance = null;
                            video.src = streamUrl;
                            playVideo();
                        }
                    });
                    return;
                }

                video.src = streamUrl;
            }

            playVideo();
        }

        if (overlay) {
            overlay.addEventListener("click", startPlayback);
        }

        video.addEventListener("click", function () {
            if (video.paused) {
                startPlayback();
            }
        });
    });
}

function setupBackToTop() {
    var button = document.createElement("button");
    button.className = "back-to-top";
    button.type = "button";
    button.setAttribute("aria-label", "回到顶部");
    button.textContent = "↑";
    document.body.appendChild(button);

    function toggleButton() {
        button.classList.toggle("show", window.scrollY > 420);
    }

    button.addEventListener("click", function () {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });

    window.addEventListener("scroll", toggleButton, { passive: true });
    toggleButton();
}
