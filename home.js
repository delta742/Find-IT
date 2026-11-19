/* FindIT – Public Home Page Controller */
document.addEventListener("DOMContentLoaded", function () {
  const Auth = window.FindITAuth;

  // Check if authenticated user visited homepage and adapt hero callouts
  if (Auth && Auth.isLoggedIn()) {
    const user = Auth.getCurrentUser();
    const banner = document.getElementById("authBanner");
    const bannerName = document.getElementById("authBannerUserName");
    const heroBtn = document.getElementById("heroPrimaryBtn");

    if (banner && bannerName && user) {
      bannerName.textContent = user.fullName;
      banner.style.display = "block";
    }
    if (heroBtn) {
      heroBtn.textContent = "Go to Your Dashboard →";
      heroBtn.href = "dashboard.html";
    }
  }
});
