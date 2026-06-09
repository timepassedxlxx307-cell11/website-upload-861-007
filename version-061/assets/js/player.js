(function() {
    function ready(callback) {
        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", callback);
        } else {
            callback();
        }
    }

    function setupPlayer() {
        const shell = document.querySelector("[data-player-src]");
        const video = document.getElementById("video-player");
        const button = document.querySelector("[data-play-button]");
        if (!shell || !video || !button) {
            return;
        }
        const src = shell.getAttribute("data-player-src");
        let hlsInstance = null;
        let initialized = false;

        function attach() {
            if (initialized) {
                return;
            }
            initialized = true;
            if (video.canPlayType("application/vnd.apple.mpegurl")) {
                video.src = src;
                return;
            }
            if (window.Hls && window.Hls.isSupported()) {
                hlsInstance = new window.Hls({
                    maxBufferLength: 30,
                    backBufferLength: 30
                });
                hlsInstance.loadSource(src);
                hlsInstance.attachMedia(video);
                return;
            }
            video.src = src;
        }

        function play() {
            attach();
            button.classList.add("is-hidden");
            const promise = video.play();
            if (promise && typeof promise.catch === "function") {
                promise.catch(function() {
                    button.classList.remove("is-hidden");
                });
            }
        }

        button.addEventListener("click", play);
        video.addEventListener("click", function() {
            if (video.paused) {
                play();
            }
        });
        video.addEventListener("play", function() {
            button.classList.add("is-hidden");
        });
        video.addEventListener("pause", function() {
            if (!video.ended) {
                button.classList.remove("is-hidden");
            }
        });
        window.addEventListener("beforeunload", function() {
            if (hlsInstance) {
                hlsInstance.destroy();
            }
        });
    }

    ready(setupPlayer);
})();
