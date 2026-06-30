document.addEventListener("DOMContentLoaded", function () {

  /* MUSIC POPUP */

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


  /* HERO CAROUSEL */

  const heroCarousel = document.getElementById("heroCarousel");

  if (heroCarousel) {
    setTimeout(function () {
      heroCarousel.classList.add("visible");
    }, 3000);
  }


  /* ZOYA INNER CIRCLE SIGNUP FLOW */

  const form = document.getElementById("zoyaSignupForm");

  if (form) {
    const stepSignup = document.getElementById("zoyaSignupStep");
    const stepDownload = document.getElementById("zoyaDownloadStep");
    const errorMessage = document.getElementById("zoyaErrorMessage");
    const unlockCard = document.querySelector(".zoya-unlock-card");

    const audioPlayer = document.getElementById("zoyaAudioPlayer");
    const playPauseBtn = document.getElementById("zoyaPlayPauseBtn");
    const progressWrap = document.querySelector(".zoya-progress-wrap");
    const progressBar = document.getElementById("zoyaProgressBar");
    const currentTimeEl = document.getElementById("zoyaCurrentTime");
    const durationEl = document.getElementById("zoyaDuration");
    const spotifyRevealBtn = document.getElementById("zoyaSpotifyRevealBtn");

    const GOOGLE_SCRIPT_URL =
      "https://zoya-newsletter-signup.delicate-pine-c41c.workers.dev/";

    let hasTrackedPlay = false;

    function getUTM(param) {
      const urlParams = new URLSearchParams(window.location.search);
      return urlParams.get(param) || "";
    }

    function formatTime(seconds) {
      if (!Number.isFinite(seconds)) return "0:00";

      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = Math.floor(seconds % 60).toString().padStart(2, "0");

      return `${minutes}:${remainingSeconds}`;
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      if (errorMessage) {
        errorMessage.classList.add("hidden");
      }

      const payload = {
        name: document.getElementById("zoyaName").value.trim(),
        email: document.getElementById("zoyaEmail").value.trim(),
        source: "Website",

        utm_source: getUTM("utm_source") || "website",
        utm_medium: getUTM("utm_medium") || "homepage",
        utm_campaign: getUTM("utm_campaign") || "organic_traffic",
        utm_adset: getUTM("utm_adset") || "organic_followers",
        utm_content: getUTM("utm_content") || "fan"
      };

      if (typeof fbq === "function") {
        fbq("track", "Lead");
      }

      if (stepSignup) {
        stepSignup.classList.add("hidden");
      }

      if (stepDownload) {
        stepDownload.classList.remove("hidden");
      }

      if (unlockCard) {
        unlockCard.classList.add("unlocked");
      }

      if (audioPlayer) {
        audioPlayer.load();
      }

      fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      }).catch(function (error) {
        console.error("Google Sheets save failed:", error);
      });
    });

    if (playPauseBtn && audioPlayer) {
      playPauseBtn.addEventListener("click", function () {
        if (audioPlayer.paused) {
          audioPlayer.play();
        } else {
          audioPlayer.pause();
        }
      });

      audioPlayer.addEventListener("play", function () {
        playPauseBtn.textContent = "❚❚";

        if (!hasTrackedPlay && typeof fbq === "function") {
          fbq("trackCustom", "PreviewPlay");
          hasTrackedPlay = true;
        }
      });

      audioPlayer.addEventListener("pause", function () {
        playPauseBtn.textContent = "▶";
      });

      audioPlayer.addEventListener("loadedmetadata", function () {
        if (durationEl) {
          durationEl.textContent = formatTime(audioPlayer.duration);
        }
      });

      audioPlayer.addEventListener("timeupdate", function () {
        const progress = (audioPlayer.currentTime / audioPlayer.duration) * 100;

        if (progressBar) {
          progressBar.style.width = `${progress || 0}%`;
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
      progressWrap.addEventListener("click", function (e) {
        const rect = progressWrap.getBoundingClientRect();
        const clickPosition = e.clientX - rect.left;
        const percentage = clickPosition / rect.width;

        audioPlayer.currentTime = percentage * audioPlayer.duration;
      });
    }

    if (spotifyRevealBtn) {
      spotifyRevealBtn.addEventListener("click", function () {
        if (typeof fbq === "function") {
          fbq("trackCustom", "SpotifyRevealClicked");
        }

        const appUrl = "spotify:artist:5eqThkuR9VjiLuYfzESTp7";
        const webUrl = "https://open.spotify.com/artist/5eqThkuR9VjiLuYfzESTp7";

        window.location.href = appUrl;

        setTimeout(function () {
          window.open(webUrl, "_blank", "noopener,noreferrer");
        }, 1200);
      });
    }
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
