/* FindIT – My Reports Page Controller */
document.addEventListener("DOMContentLoaded", function () {
  const F = window.FindIT;
  const Auth = window.FindITAuth;

  // Route Protection
  if (Auth && !Auth.isLoggedIn()) {
    Auth.requireAuth("my-reports.html", "dashboard_required");
    return;
  }

  const currentUser = Auth.getCurrentUser();
  if (!currentUser) return;

  const grid = document.getElementById("reportsGrid");
  const tabs = document.querySelectorAll("#reportTypeTabs button");
  let activeTab = "all";

  function getUserItems() {
    // Strictly filter by authenticated user ID ownership
    return F.loadItems().filter((i) => F.isItemOwner(i, currentUser));
  }

  function render() {
    const myItems = getUserItems();
    let filtered = myItems;

    if (activeTab === "lost") {
      filtered = myItems.filter((i) => i.type === "lost" && i.status !== "returned");
    } else if (activeTab === "found") {
      filtered = myItems.filter((i) => i.type === "found" && i.status !== "returned");
    } else if (activeTab === "returned") {
      filtered = myItems.filter((i) => i.status === "returned");
    }

    if (filtered.length === 0) {
      grid.innerHTML = `
        <div class="empty" style="grid-column: 1 / -1; padding: 48px 20px;">
          <div class="empty-icon" aria-hidden="true">${F.svgIcon("bag", 44)}</div>
          <h3>No reports found under this filter</h3>
          <p>You can create a new lost or found report anytime using the buttons below.</p>
          <div style="display:flex;gap:10px;justify-content:center;margin-top:16px;">
            <a class="btn btn-primary btn-sm" href="report-lost.html">Report Lost</a>
            <a class="btn btn-outline btn-sm" href="report-found.html">Report Found</a>
          </div>
        </div>`;
      return;
    }

    grid.innerHTML = filtered
      .map((it) => {
        const isLost = it.type === "lost";
        const statusBadge = isLost
          ? `<span class="badge lost"><span class="badge-dot"></span> Lost</span>`
          : `<span class="badge found"><span class="badge-dot"></span> Found</span>`;
        const returnedBadge = it.status === "returned" ? `<span class="badge returned">Returned</span>` : "";
        const imgSrc = it.image || F.CATEGORY_DEFAULT_IMAGES[it.category] || F.CATEGORY_DEFAULT_IMAGES["Other"];
        const claimsCount = it.claims ? it.claims.length : 0;

        return `
          <article class="card ${F.esc(it.type)} ${it.status === "returned" ? "returned" : ""}">
            <div class="card-image-wrap">
              <img class="card-img" src="${F.esc(imgSrc)}" alt="${F.esc(it.name)}" loading="lazy">
              <div class="card-badge-overlay">
                ${statusBadge}
                ${returnedBadge}
              </div>
            </div>
            <div class="card-body">
              <div class="card-cat">
                ${F.iconFor(it.category)}
                <span>${F.esc(it.category)}</span>
              </div>
              <h3>${F.esc(it.name)}</h3>
              <p>${F.esc(it.description)}</p>
              <div class="card-meta">
                <div class="meta-row">${F.svgIcon("map-pin", 14)} <span>${F.esc(it.location)}</span></div>
                <div class="meta-row">${F.svgIcon("calendar", 14)} <span>${F.esc(F.fmtDate(it.date))}</span></div>
                ${claimsCount > 0 ? `<div class="meta-row" style="color:var(--primary);font-weight:600;"><span>💬 ${claimsCount} claim ${claimsCount === 1 ? "message" : "messages"}</span></div>` : ""}
              </div>
            </div>
            <div class="card-footer" style="gap:8px;justify-content:space-between;padding-top:10px;border-top:1px solid var(--border-subtle);flex-wrap:wrap;">
              <a class="btn btn-outline btn-sm" href="item.html?id=${encodeURIComponent(it.id)}">View Details</a>
              <div style="display:flex;gap:6px;flex-wrap:wrap;">
                <button class="btn btn-outline btn-sm edit-report-btn" data-id="${F.esc(it.id)}" type="button">
                  ${F.svgIcon("pencil", 13)} Edit
                </button>
                ${
                  it.status !== "returned"
                    ? `<button class="btn btn-primary btn-sm mark-return-btn" data-id="${F.esc(it.id)}" type="button">Mark Returned</button>`
                    : ""
                }
                <button class="btn btn-danger btn-sm delete-report-btn" data-id="${F.esc(it.id)}" type="button">
                  ${F.svgIcon("trash", 13)} Delete
                </button>
              </div>
            </div>
          </article>`;
      })
      .join("");

    // Edit Modal Elements
    const editDialog = document.getElementById("editDialog");
    const editForm = document.getElementById("editForm");
    const editItemId = document.getElementById("editItemId");
    const editName = document.getElementById("editName");
    const editCategory = document.getElementById("editCategory");
    const editLocation = document.getElementById("editLocation");
    const editDescription = document.getElementById("editDescription");

    // Attach Action Listeners
    document.querySelectorAll(".edit-report-btn").forEach((b) => {
      b.addEventListener("click", function () {
        const itemId = this.dataset.id;
        const it = F.getItem(itemId);
        if (!it) return;
        if (!F.isItemOwner(it, currentUser)) {
          F.toast("Permission denied: You can only edit listings you personally created.");
          return;
        }
        if (editItemId) editItemId.value = it.id;
        if (editName) editName.value = it.name;
        if (editLocation) editLocation.value = it.location;
        if (editDescription) editDescription.value = it.description;
        if (editCategory) {
          editCategory.innerHTML = F.CATEGORIES.map(
            (c) => `<option value="${F.esc(c.id)}" ${c.id === it.category ? "selected" : ""}>${F.esc(c.label)}</option>`
          ).join("");
        }
        if (editForm) {
          editForm.querySelectorAll(".field").forEach((f) => F.setError(f, ""));
        }
        if (editDialog) editDialog.showModal();
      });
    });

    const editCancel = document.getElementById("editCancel");
    const editCancelBtn = document.getElementById("editCancelBtn");
    if (editCancel && editDialog) editCancel.onclick = () => editDialog.close();
    if (editCancelBtn && editDialog) editCancelBtn.onclick = () => editDialog.close();

    if (editForm) {
      editForm.onsubmit = function (e) {
        e.preventDefault();
        const itemId = editItemId ? editItemId.value : "";
        const nameVal = editName ? editName.value.trim() : "";
        const locVal = editLocation ? editLocation.value.trim() : "";
        const descVal = editDescription ? editDescription.value.trim() : "";
        const catVal = editCategory ? editCategory.value : "";

        const errs = [
          [editName, nameVal.length < 3 ? "Item name must be at least 3 characters." : ""],
          [editLocation, locVal.length < 2 ? "Please provide a campus location." : ""],
          [editDescription, descVal.length < 5 ? "Please provide a description." : ""]
        ];

        errs.forEach(([el, msg]) => el && F.setError(el.closest(".field"), msg));
        if (errs.some(([, msg]) => msg)) return;

        const res = F.updateItem(
          itemId,
          {
            name: nameVal,
            category: catVal,
            location: locVal,
            description: descVal
          },
          currentUser
        );

        if (res.success) {
          if (editDialog) editDialog.close();
          F.toast("Listing updated successfully.");
          render();
        } else {
          F.toast(res.error || "Failed to update listing.");
        }
      };
    }

    document.querySelectorAll(".mark-return-btn").forEach((b) => {
      b.addEventListener("click", function () {
        const itemId = this.dataset.id;
        if (confirm("Mark this item as successfully returned?")) {
          const res = F.updateItem(itemId, (x) => (x.status = "returned"), currentUser);
          if (res.success) {
            F.toast("Listing updated to Returned 🎉");
            render();
          } else {
            F.toast(res.error || "Failed to update listing.");
          }
        }
      });
    });

    document.querySelectorAll(".delete-report-btn").forEach((b) => {
      b.addEventListener("click", function () {
        const itemId = this.dataset.id;
        if (confirm("Permanently delete this report?")) {
          const res = F.deleteItem(itemId, currentUser);
          if (res.success) {
            F.toast("Report has been deleted.");
            render();
          } else {
            F.toast(res.error || "Permission denied.");
          }
        }
      });
    });
  }

  tabs.forEach((tabBtn) => {
    tabBtn.addEventListener("click", function () {
      tabs.forEach((b) => b.classList.remove("on"));
      this.classList.add("on");
      activeTab = this.dataset.tab;
      render();
    });
  });

  render();
});
