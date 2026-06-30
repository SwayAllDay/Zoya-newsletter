document.addEventListener("DOMContentLoaded", function () {

  const popup = document.getElementById("listenPopup");
  const closeBtn = document.getElementById("closeListenPopup");

  const popupTitle = document.getElementById("popupTitle");
  const popupCover = document.getElementById("popupCover");

  const popupSpotify = document.getElementById("popupSpotify");
  const popupApple = document.getElementById("popupApple");
  const popupYTMusic = document.getElementById("popupYTMusic");
  const popupYouTube = document.getElementById("popupYouTube");

  const triggers = document.querySelectorAll(".music-popup-trigger");

  const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

  function openSmartLink(appLink, webLink) {
    if (!isMobile || !appLink) {
      window.open(webLink, "_blank", "noopener,noreferrer");
      return;
    }

    const start = Date.now();
    window.location.href = appLink;

    setTimeout(function () {
      if (Date.now() - start < 1800) {
        window.location.href = webLink;
      }
    }, 1200);
  }

  if (popup && popupTitle && popupCover) {
    triggers.forEach(function(trigger) {
      trigger.addEventListener("click", function () {

        popupTitle.textContent = trigger.dataset.title;

        popupCover.src = trigger.dataset.cover;
        popupCover.alt = trigger.dataset.title + " cover";

        popupSpotify.href = trigger.dataset.spotify;
        popupApple.href = trigger.dataset.apple;
        popupYTMusic.href = trigger.dataset.ytmusic;
        popupYouTube.href = trigger.dataset.youtube;

        popupSpotify.onclick = function(e) {
          e.preventDefault();
          openSmartLink(trigger.dataset.spotifyApp, trigger.dataset.spotify);
        };

        popupApple.onclick = function(e) {
          e.preventDefault();
          openSmartLink(trigger.dataset.appleApp, trigger.dataset.apple);
        };

        popupYTMusic.onclick = function(e) {
          e.preventDefault();
          openSmartLink(trigger.dataset.ytmusicApp, trigger.dataset.ytmusic);
        };

        popupYouTube.onclick = function(e) {
          e.preventDefault();
          openSmartLink(trigger.dataset.youtubeApp, trigger.dataset.youtube);
        };

        popup.classList.add("active");
      });
    });
  }

  if (closeBtn && popup) {
    closeBtn.addEventListener("click", function () {
      popup.classList.remove("active");
    });
  }

  if (popup) {
    popup.addEventListener("click", function (event) {
      if (event.target === popup) {
        popup.classList.remove("active");
      }
    });
  }

  const heroCarousel = document.getElementById("heroCarousel");

  if (heroCarousel) {
    setTimeout(function () {
      heroCarousel.classList.add("visible");
    }, 3000);
  }

  /* ZOYA INNER CIRCLE SIGNUP FLOW */

  const signupForm = document.getElementById("zoyaSignupForm");
  const signupStep = document.getElementById("zoyaSignupStep");
  const downloadStep = document.getElementById("zoyaDownloadStep");
  const unlockCard = document.querySelector(".zoya-unlock-card");

  if (signupForm && signupStep && downloadStep) {
    signupForm.addEventListener("submit", function (event) {
      event.preventDefault();

      signupStep.classList.add("hidden");
      downloadStep.classList.remove("hidden");

      if (unlockCard) {
        unlockCard.classList.add("unlocked");
      }

      if (typeof fbq === "function") {
        fbq("track", "Lead");
      }
    });
  }

  /* CUSTOM AUDIO PLAYER */

  const audioPlayer = document.getElementById("zoyaAudioPlayer");
  const playPauseBtn = document.getElementById("zoyaPlayPauseBtn");
  const progressWrap = document.querySelector(".zoya-progress-wrap");
  const progressBar = document.getElementById("zoyaProgressBar");
  const currentTimeEl = document.getElementById("zoyaCurrentTime");
  const durationEl = document.getElementById("zoyaDuration");

  function formatTime(seconds) {
    if (isNaN(seconds)) return "0:00";

    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);

    return minutes + ":" + (secs < 10 ? "0" : "") + secs;
  }

  if (audioPlayer && playPauseBtn) {
    playPauseBtn.addEventListener("click", function () {
      if (audioPlayer.paused) {
        audioPlayer.play();
        playPauseBtn.textContent = "❚❚";
      } else {
        audioPlayer.pause();
        playPauseBtn.textContent = "▶";
      }
    });

    audioPlayer.addEventListener("loadedmetadata", function () {
      if (durationEl) {
        durationEl.textContent = formatTime(audioPlayer.duration);
      }
    });

    audioPlayer.addEventListener("timeupdate", function () {
      if (progressBar) {
        const progress = (audioPlayer.currentTime / audioPlayer.duration) * 100;
        progressBar.style.width = progress + "%";
      }

      if (currentTimeEl) {
        currentTimeEl.textContent = formatTime(audioPlayer.currentTime);
      }
    });

    audioPlayer.addEventListener("ended", function () {
      playPauseBtn.textContent = "▶";

      if (progressBar) {
        progressBar.style.width = "0%";
      }
    });
  }

  if (progressWrap && audioPlayer) {
    progressWrap.addEventListener("click", function (event) {
      const rect = progressWrap.getBoundingClientRect();
      const clickX = event.clientX - rect.left;
      const width = rect.width;

      audioPlayer.currentTime = (clickX / width) * audioPlayer.duration;
    });
  }

  /* PAGE TRANSITIONS */

  const internalLinks = document.querySelectorAll("a[href]");

  internalLinks.forEach(function(link) {
    const href = link.getAttribute("href");

    if (
      href &&
      !href.startsWith("#") &&
      !href.startsWith("http") &&
      !link.hasAttribute("target")
    ) {
      link.addEventListener("click", function(event) {
        event.preventDefault();

        document.body.classList.add("page-fade-out");

        setTimeout(function() {
          window.location.href = href;
        }, 420);
      });
    }
  });

});
