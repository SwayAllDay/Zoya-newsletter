window.addEventListener("load", function () {
  alert("ZOYA script loaded");

  const form = document.getElementById("zoyaSignupForm");
  const signupStep = document.getElementById("zoyaSignupStep");
  const downloadStep = document.getElementById("zoyaDownloadStep");
  const card = document.querySelector(".zoya-unlock-card");

  if (!form) {
    alert("Form not found");
    return;
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    alert("Form submitted");

    signupStep.classList.add("hidden");
    downloadStep.classList.remove("hidden");

    if (card) {
      card.classList.add("unlocked");
    }
  });
});
