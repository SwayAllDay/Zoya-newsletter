const form = document.getElementById("signupForm");

const stepSignup = document.getElementById("stepSignup");
const stepDownload = document.getElementById("stepDownload");

const errorMessage = document.getElementById("errorMessage");

const audioPlayer = document.getElementById("audioPlayer");
const playPauseBtn = document.getElementById("playPauseBtn");
const progressWrap = document.querySelector(".progress-wrap");
const progressBar = document.getElementById("progressBar");
const currentTimeEl = document.getElementById("currentTime");
const durationEl = document.getElementById("duration");
const spotifyRevealBtn = document.getElementById("spotifyRevealBtn");

const GOOGLE_SCRIPT_URL =
  "https://zoya-newsletter-signup.delicate-pine-c41c.workers.dev/";

const SPOTIFY_URL = "https://open.spotify.com/artist/5eqThkuR9VjiLuYfzESTp7";

let hasTrackedPlay = false;

function getUTM(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param) || "";
}

function formatTime(seconds) {
  if (!Number.isFinite(seconds)) return "0:00";

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60)
    .toString()
    .padStart(2, "0");

  return `${minutes}:${remainingSeconds}`;
}

form.addEventListener("submit", function (e) {
  e.preventDefault();

  errorMessage.classList.add("hidden");

  const payload = {
    name: document.getElementById("name").value.trim(),
    email: document.getElementById("email").value.trim(),
    source: "Meta Ads",
    utm_source: getUTM("utm_source"),
    utm_medium: getUTM("utm_medium"),
    utm_campaign: getUTM("utm_campaign"),
    utm_content: getUTM("utm_content")
  };

  fbq("track", "Lead");

  stepSignup.classList.add("hidden");
  stepDownload.classList.remove("hidden");

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

playPauseBtn.addEventListener("click", function () {
  if (audioPlayer.paused) {
    audioPlayer.play();
  } else {
    audioPlayer.pause();
  }
});

audioPlayer.addEventListener("play", function () {
  playPauseBtn.textContent = "❚❚";

  if (!hasTrackedPlay) {
    fbq("trackCustom", "PreviewPlay");
    hasTrackedPlay = true;
  }
});

audioPlayer.addEventListener("pause", function () {
  playPauseBtn.textContent = "▶";
});

audioPlayer.addEventListener("loadedmetadata", function () {
  durationEl.textContent = formatTime(audioPlayer.duration);
});

audioPlayer.addEventListener("timeupdate", function () {
  const progress = (audioPlayer.currentTime / audioPlayer.duration) * 100;
  progressBar.style.width = `${progress || 0}%`;
  currentTimeEl.textContent = formatTime(audioPlayer.currentTime);
});

progressWrap.addEventListener("click", function (e) {
  const rect = progressWrap.getBoundingClientRect();
  const clickPosition = e.clientX - rect.left;
  const percentage = clickPosition / rect.width;

  audioPlayer.currentTime = percentage * audioPlayer.duration;
});

audioPlayer.addEventListener("ended", function () {
  playPauseBtn.textContent = "▶";
  progressBar.style.width = "0%";
});

spotifyRevealBtn.addEventListener("click", function () {

  fbq("trackCustom", "SpotifyRevealClicked");

  const appUrl = "spotify:artist:5eqThkuR9VjiLuYfzESTp7";
  const webUrl = "https://open.spotify.com/artist/5eqThkuR9VjiLuYfzESTp7";

  window.location.href = appUrl;

  setTimeout(function () {
    window.open(
      webUrl,
      "_blank",
      "noopener,noreferrer"
    );
  }, 1200);

});
