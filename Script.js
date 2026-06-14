const form = document.getElementById("signupForm");
const successBox = document.getElementById("successBox");
const errorMessage = document.getElementById("errorMessage");
const downloadBtn = document.getElementById("downloadBtn");
const spotifyBtn = document.getElementById("spotifyBtn");

const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycby05l-uEV2z0MUcS59XhnN92NHVUzfdQBwiSI4IOQUDeECm7TfsHknvLFBhMX4Mp1nA/exec";
const SPOTIFY_URL = "https://open.spotify.com/artist/5eqThkuR9VjiLuYfzESTp7";

function getUTM(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param) || "";
}

form.addEventListener("submit", async function (e) {
  e.preventDefault();

  errorMessage.classList.add("hidden");

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();

  const payload = {
    name,
    email,
    source: "Meta Ads",
    utm_campaign: getUTM("utm_campaign")
  };

  try {
    await fetch(GOOGLE_SCRIPT_URL, {
      method: "POST",
      mode: "no-cors",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    fbq("track", "Lead");

    form.classList.add("hidden");
    successBox.classList.remove("hidden");
  } catch (error) {
    errorMessage.classList.remove("hidden");
  }
});

downloadBtn.addEventListener("click", function () {
  fbq("trackCustom", "FreeDownloadClicked");

  setTimeout(() => {
    spotifyBtn.classList.remove("hidden");
  }, 800);
});

spotifyBtn.addEventListener("click", function () {
  fbq("trackCustom", "SpotifyFollowClicked");
  window.open(SPOTIFY_URL, "_blank");
});
