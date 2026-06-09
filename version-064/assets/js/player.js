function startPlayer(mediaUrl) {
  var video = document.querySelector(".js-video");
  var cover = document.querySelector(".js-player-cover");
  var button = document.querySelector(".js-play-button");
  var attached = false;
  var hlsInstance = null;

  if (!video || !mediaUrl) {
    return;
  }

  function attachMedia() {
    if (attached) {
      return;
    }

    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = mediaUrl;
    } else if (window.Hls && window.Hls.isSupported()) {
      hlsInstance = new window.Hls({
        enableWorker: true,
        lowLatencyMode: true
      });
      hlsInstance.loadSource(mediaUrl);
      hlsInstance.attachMedia(video);
    } else {
      video.src = mediaUrl;
    }

    attached = true;
  }

  function playVideo() {
    attachMedia();
    video.setAttribute("controls", "controls");

    if (cover) {
      cover.classList.add("is-hidden");
    }

    var request = video.play();

    if (request && typeof request.catch === "function") {
      request.catch(function () {});
    }
  }

  if (cover) {
    cover.addEventListener("click", playVideo);
  }

  if (button) {
    button.addEventListener("click", playVideo);
  }

  video.addEventListener("click", function () {
    if (!attached) {
      playVideo();
    }
  });

  window.addEventListener("beforeunload", function () {
    if (hlsInstance && typeof hlsInstance.destroy === "function") {
      hlsInstance.destroy();
    }
  });
}
