/* ZOYA INNER CIRCLE SIGNUP FLOW */

window.addEventListener("load", function () {
  const signupForm = document.getElementById("zoyaSignupForm");
  const signupStep = document.getElementById("zoyaSignupStep");
  const downloadStep = document.getElementById("zoyaDownloadStep");
  const unlockCard = document.querySelector(".zoya-unlock-card");

  if (!signupForm) {
    console.error("ZOYA ERROR: signup form not found");
    return;
  }

  signupForm.onsubmit = function (event) {
    event.preventDefault();
    event.stopPropagation();

    console.log("ZOYA signup submitted");

    if (signupStep) {
      signupStep.classList.add("hidden");
    }

    if (downloadStep) {
      downloadStep.classList.remove("hidden");
      downloadStep.style.display = "flex";
    }

    if (unlockCard) {
      unlockCard.classList.add("unlocked");
    }

    if (typeof fbq === "function") {
      fbq("track", "Lead");
    }

    return false;
  };
});
