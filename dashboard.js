/* FindIT – Authenticated Student Dashboard Controller */
document.addEventListener("DOMContentLoaded", function () {
  const F = window.FindIT;
  const Auth = window.FindITAuth;

  // Route Protection: Restricted strictly to authenticated members
  if (Auth && !Auth.isLoggedIn()) {
    Auth.requireAuth("dashboard.html", "dashboard_required");
    return;
  }

  const currentUser = Auth.getCurrentUser();
  if (!currentUser) return;

  // Populate Header Identity
  const nameEl = document.getElementById("userNameDisplay");
  const idEl = document.getElementById("userStudentIdDisplay");
  const emailEl = document.getElementById("userEmailDisplay");
  const collegeEl = document.getElementById("userCollegeDisplay");

  if (nameEl) nameEl.textContent = currentUser.fullName;
  if (idEl) idEl.textContent = currentUser.studentId || "Verified Student";
  if (emailEl) emailEl.textContent = currentUser.email;
  if (collegeEl && currentUser.college) collegeEl.textContent = currentUser.college;

  const allItems = F.loadItems();
  const openItems = allItems.filter((i) => i.status === "open");

  // Determine user's items strictly by verified creator ownership
  const myItems = allItems.filter((i) => F.isItemOwner(i, currentUser));

  // Calculate matches for user's open items
  let totalMatchAlerts = 0;
  myItems.filter((i) => i.status === "open").forEach((myIt) => {
    const matches = F.findMatches(myIt);
    totalMatchAlerts += matches.length;
  });

  // Populate Metrics
  const activeCountEl = document.getElementById("mActiveListings");
  const myReportsEl = document.getElementById("mMyReports");
  const recoveredEl = document.getElementById("mRecovered");
  const matchAlertsEl = document.getElementById("mUserMatches");

  if (activeCountEl) activeCountEl.textContent = openItems.length;
  if (myReportsEl) myReportsEl.textContent = myItems.length;
  if (recoveredEl) recoveredEl.textContent = allItems.filter((i) => i.status === "returned").length;
  if (matchAlertsEl) matchAlertsEl.textContent = totalMatchAlerts;

  // Render My Reported Items
  const myGrid = document.getElementById("myItemsGrid");
  if (myGrid) {
    if (myItems.length > 0) {
      myGrid.innerHTML = myItems.map(F.cardHTML).join("");
    } else {
      myGrid.innerHTML = `
        <div class="empty" style="grid-column: 1 / -1; padding: 36px 20px;">
          <div class="empty-icon" aria-hidden="true">${F.svgIcon("bag", 38)}</div>
          <h3 style="margin-bottom:6px;">You haven't reported any items yet</h3>
          <p style="margin-bottom:16px;">Have you misplaced a personal belonging or found something unattended on campus?</p>
          <div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap;">
            <a class="btn btn-primary btn-sm" href="report-lost.html">Report a Lost Item</a>
            <a class="btn btn-outline btn-sm" href="report-found.html">Report a Found Item</a>
          </div>
        </div>`;
    }
  }

  // Render Recent Campus Listings (Unlocked for Authenticated Member)
  const recentGrid = document.getElementById("recentCampusGrid");
  if (recentGrid) {
    const recentItems = allItems.slice().sort((a, b) => b.createdAt - a.createdAt).slice(0, 6);
    recentGrid.innerHTML = recentItems.map(F.cardHTML).join("");
  }
});
