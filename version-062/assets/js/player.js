import { H as Hls } from './hls.js';

(function () {
  function initPlayer(shell) {
    var video = shell.querySelector('video');
    var button = shell.querySelector('.play-cover');
    var stream = shell.getAttribute('data-stream');
    var attached = false;
    var hlsInstance = null;

    function attach() {
      if (attached || !video || !stream) {
        return;
      }

      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = stream;
      } else if (Hls && Hls.isSupported()) {
        hlsInstance = new Hls();
        hlsInstance.loadSource(stream);
        hlsInstance.attachMedia(video);
      } else {
        video.src = stream;
      }

      attached = true;
    }

    function play() {
      attach();

      if (button) {
        button.classList.add('is-hidden');
      }

      video.controls = true;
      var action = video.play();

      if (action && typeof action.catch === 'function') {
        action.catch(function () {});
      }
    }

    if (button) {
      button.addEventListener('click', play);
    }

    video.addEventListener('click', function () {
      if (!attached) {
        play();
      }
    });

    video.addEventListener('play', function () {
      if (button) {
        button.classList.add('is-hidden');
      }
    });

    window.addEventListener('pagehide', function () {
      if (hlsInstance && typeof hlsInstance.destroy === 'function') {
        hlsInstance.destroy();
      }
    });
  }

  document.querySelectorAll('.player-shell').forEach(initPlayer);
})();
