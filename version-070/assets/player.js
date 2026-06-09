const MoviePlayer = (function () {
  const attached = new WeakSet();

  function load(video, streamUrl) {
    if (attached.has(video)) {
      return;
    }

    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = streamUrl;
      attached.add(video);
      return;
    }

    if (window.Hls && window.Hls.isSupported()) {
      const hls = new window.Hls({
        enableWorker: true,
        lowLatencyMode: true
      });
      hls.loadSource(streamUrl);
      hls.attachMedia(video);
      attached.add(video);
    }
  }

  function setup(videoId, buttonId, coverId, streamUrl) {
    const video = document.getElementById(videoId);
    const button = document.getElementById(buttonId);
    const cover = document.getElementById(coverId);

    if (!video || !button || !cover || !streamUrl) {
      return;
    }

    const start = function () {
      load(video, streamUrl);
      cover.classList.add("hide");
      const request = video.play();

      if (request && typeof request.catch === "function") {
        request.catch(function () {});
      }
    };

    button.addEventListener("click", function (event) {
      event.preventDefault();
      event.stopPropagation();
      start();
    });

    cover.addEventListener("click", start);

    cover.addEventListener("keydown", function (event) {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        start();
      }
    });

    video.addEventListener("click", function () {
      if (video.paused) {
        start();
      }
    });
  }

  return {
    setup: setup
  };
})();
