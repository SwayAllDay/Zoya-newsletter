const form = document.getElementById("signupForm");
const stepSignup = document.getElementById("stepSignup");
const stepDownload = document.getElementById("stepDownload");
const stepSpotify = document.getElementById("stepSpotify");
const errorMessage = document.getElementById("errorMessage");
const downloadBtn = document.getElementById("downloadBtn");
const spotifyBtn = document.getElementById("spotifyBtn");

const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycby05l-uEV2z0MUcS59XhnN92NHVUzfdQBwiSI4IOQUDeECm7TfsHknvLFBhMX4Mp1nA/exec";

function getUTM(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param) || "";
}

form.addEventListener("submit", async function (e) {
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

  try {
    await fetch(GOOGLE_SCRIPT_URL, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    fbq("track", "Lead");

    stepSignup.classList.add("hidden");
    stepDownload.classList.remove("hidden");
  } catch (error) {
    errorMessage.classList.remove("hidden");
  }
});

downloadBtn.addEventListener("click", function () {
  fbq("trackCustom", "FreeDownloadClicked");

  setTimeout(() => {
    stepDownload.classList.add("hidden");
    stepSpotify.classList.remove("hidden");
  }, 700);
});

spotifyBtn.addEventListener("click", function () {
  fbq("trackCustom", "SpotifyFollowClicked");
});
