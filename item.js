/* FindIT – Item Details Page Controller */
document.addEventListener("DOMContentLoaded", function () {
  const F = window.FindIT;
  const Auth = window.FindITAuth;

  // Route Protection: Viewing item details is strictly restricted to authenticated members
  if (Auth && !Auth.isLoggedIn()) {
    const returnUrl = "item.html" + location.search;
    Auth.requireAuth(returnUrl, "item_required");
    return;
  }

  const view = document.getElementById("view");
  const id = new URLSearchParams(location.search).get("id");
  const dialog = document.getElementById("claimDialog");
  const form = document.getElementById("claimForm");

  function render() {
    const it = id && F.getItem(id);
    if (!it) {
      view.innerHTML = `
        <div class="empty" style="margin: 64px auto; max-width: 520px;">
          <div class="empty-icon" aria-hidden="true">${F.svgIcon("alert-circle", 48)}</div>
          <h2>Item Not Found</h2>
          <p>This report may have been deleted or the listing link is invalid.</p>
          <div style="margin-top: 18px;">
            <a class="btn btn-primary btn-sm" href="search.html">Back to Browse Items</a>
          </div>
        </div>`;
      return;
    }

    document.title = `${it.name} – FindIT`;
    const currentUser = Auth ? Auth.getCurrentUser() : null;
    const isOwner = F.isItemOwner(it, currentUser);
    const isLost = it.type === "lost";
    const statusLabel = isLost ? "Lost" : "Found";
    const matches = F.findMatches(it);
    const returned = it.status === "returned";
    const isNew = new URLSearchParams(location.search).get("new");
    const imgSrc = it.image || F.CATEGORY_DEFAULT_IMAGES[it.category] || F.CATEGORY_DEFAULT_IMAGES["Other"];

    view.innerHTML = `
      <div class="crumbs">
        <a href="index.html">Home</a>
        <span>&rsaquo;</span>
        <a href="search.html">Browse Items</a>
        <span>&rsaquo;</span>
        <span style="color:var(--text-main);font-weight:600;">${F.esc(it.name)}</span>
      </div>

      <div class="detail">
        <!-- Main Column: Image, Details & Actions -->
        <article class="detail-main">
          <div class="detail-image-box">
            <img src="${F.esc(imgSrc)}" alt="${F.esc(it.name)}" onerror="this.src='${F.CATEGORY_DEFAULT_IMAGES["Other"]}'">
          </div>

          <div class="detail-body">
            <div class="detail-head">
              <div>
                <div style="display:flex;gap:8px;align-items:center;margin-bottom:8px;">
                  <span class="badge ${F.esc(it.type)}">
                    <span class="badge-dot"></span> ${statusLabel}
                  </span>
                  ${returned ? '<span class="badge returned">Returned to Owner</span>' : '<span class="badge found">Active Listing</span>'}
                  <span class="card-cat" style="margin:0 0 0 6px;">
                    ${F.iconFor(it.category)} ${F.esc(it.category)}
                  </span>
                </div>
                <h1>${F.esc(it.name)}</h1>
              </div>
            </div>

            ${
              isNew
                ? `<div class="auth-alert auth-alert-success" style="margin-bottom:20px;">
                    <span>${F.svgIcon("check", 16)}</span>
                    <span>Your ${statusLabel.toLowerCase()} report has been saved and published to the campus board.</span>
                  </div>`
                : ""
            }

            <p class="detail-desc">${F.esc(it.description)}</p>

            <!-- Structured Metadata Table -->
            <div class="detail-meta-table">
              <div class="meta-item">
                <span class="meta-label">Campus Location</span>
                <span class="meta-val">${F.svgIcon("map-pin", 14)} ${F.esc(it.location)}</span>
              </div>
              <div class="meta-item">
                <span class="meta-label">Date ${statusLabel}</span>
                <span class="meta-val">${F.svgIcon("calendar", 14)} ${F.esc(F.fmtDate(it.date))}</span>
              </div>
              <div class="meta-item">
                <span class="meta-label">Reported By</span>
                <span class="meta-val">${F.svgIcon("user", 14)} ${F.esc(it.contactName)}</span>
              </div>
              <div class="meta-item">
                <span class="meta-label">Verified Contact</span>
                <span class="meta-val">${F.esc(it.contact)}</span>
              </div>
            </div>

            <!-- Ownership Banner (if creator) -->
            ${
              isOwner
                ? `<div style="display:inline-flex;align-items:center;gap:6px;background:#f0fdf4;color:#166534;border:1px solid #bbf7d0;padding:6px 12px;border-radius:6px;font-size:0.84rem;font-weight:600;margin-bottom:16px;">
                    ${F.svgIcon("shield-check", 15)}
                    <span>You created this report. You can edit details or delete this listing anytime.</span>
                  </div>`
                : ""
            }

            <!-- Action Buttons -->
            <div class="form-actions">
              ${
                returned
                  ? `<div class="badge returned" style="padding:10px 16px;font-size:0.9rem;">
                      ✓ This item has been successfully resolved and returned.
                    </div>`
                  : isOwner
                    ? `<button class="btn btn-outline" id="returnBtn" type="button">Mark as Returned</button>`
                    : `<button class="btn btn-primary" id="claimBtn" type="button">
                        ${isLost ? "I Found This Item (Contact Owner)" : "This Is Mine – Claim Item"}
                      </button>`
              }
              ${
                isOwner
                  ? `<button class="btn btn-outline" id="editBtn" type="button">${F.svgIcon("pencil", 14)} Edit Listing</button>
                     <button class="btn btn-danger" id="deleteBtn" type="button">${F.svgIcon("trash", 14)} Delete Listing</button>`
                  : ""
              }
            </div>
          </div>
        </article>

        <!-- Right Column: Possible Matches & Claim Messages -->
        <aside class="side">
          <!-- Possible Matches -->
          <section class="panel">
            <h3 style="font-size:1.05rem;display:flex;align-items:center;gap:6px;">
              ${F.svgIcon("shield-check", 18)}
              <span>Suggested Matches</span>
            </h3>
            <p class="hint" style="margin:0 0 14px;">
              Smart match algorithm compares category, keywords, location, and dates with opposite reports.
            </p>
            ${
              matches.length
                ? matches
                    .map((m) => {
                      const mImg = m.item.image || F.CATEGORY_DEFAULT_IMAGES[m.item.category] || F.CATEGORY_DEFAULT_IMAGES["Other"];
                      return `
                      <a class="match" href="item.html?id=${encodeURIComponent(m.item.id)}">
                        <img class="match-thumb" src="${F.esc(mImg)}" alt="${F.esc(m.item.name)}">
                        <div class="match-info">
                          <strong>${F.esc(m.item.name)}</strong>
                          <small>${F.esc(m.item.location)} · ${F.esc(F.fmtDate(m.item.date))}</small>
                        </div>
                        <span class="match-score-badge">${m.score}% match</span>
                      </a>`;
                    })
                    .join("")
                : '<p class="hint" style="padding:10px 0;">No potential match detected yet. The system checks automatically whenever new reports are posted.</p>'
            }
          </section>

          <!-- Claims & Message History -->
          <section class="panel">
            <h3 style="font-size:1.05rem;margin-bottom:6px;">Claim &amp; Contact Activity</h3>
            ${
              it.claims && it.claims.length
                ? `<ul class="timeline">${it.claims
                    .map(
                      (c) => `
                    <li>
                      <strong>${F.esc(c.name)}</strong> (${F.esc(c.contact)})<br>
                      ${F.esc(c.message)}
                      <small>${F.esc(F.fmtDateTime(c.at))}</small>
                    </li>`
                    )
                    .join("")}</ul>`
                : '<p class="hint" style="margin-top:6px;">No claim messages received yet.</p>'
            }
          </section>
        </aside>
      </div>`;

    const on = (sel, fn) => {
      const el = document.getElementById(sel);
      if (el) el.addEventListener("click", fn);
    };

    on("claimBtn", () => {
      if (Auth && !Auth.isLoggedIn()) {
        if (confirm("You must be signed in to submit a claim or contact the reporter. Proceed to sign in?")) {
          window.location.href = `login.html?redirect=${encodeURIComponent("item.html?id=" + id)}&reason=claim`;
        }
        return;
      }
      form.reset();
      form.querySelectorAll(".field").forEach((f) => F.setError(f, ""));
      const cur = Auth ? Auth.getCurrentUser() : null;
      if (cur) {
        const n = document.getElementById("cName");
        const c = document.getElementById("cContact");
        if (n && !n.value) n.value = cur.fullName;
        if (c && !c.value) c.value = cur.email || cur.phone;
      }
      dialog.showModal();
    });

    on("returnBtn", () => {
      if (!isOwner) {
        F.toast("Permission denied: Only the listing creator can mark it as returned.");
        return;
      }
      if (confirm("Mark this item as successfully resolved and returned to its rightful owner?")) {
        const res = F.updateItem(id, (x) => (x.status = "returned"), currentUser);
        if (res.success) {
          F.toast("Item marked as returned 🎉");
          history.replaceState(null, "", "item.html?id=" + id);
          render();
        } else {
          F.toast(res.error || "Failed to update status.");
        }
      }
    });

    on("deleteBtn", () => {
      if (!isOwner) {
        F.toast("Permission denied: You can only delete listings that you personally created.");
        return;
      }
      if (confirm("Are you sure you want to permanently delete this report? This action cannot be undone.")) {
        const res = F.deleteItem(id, currentUser);
        if (res.success) {
          F.toast("Report has been removed.");
          setTimeout(() => {
            location.href = "my-reports.html";
          }, 450);
        } else {
          F.toast(res.error || "Failed to delete listing.");
        }
      }
    });

    // Edit Modal Wiring
    const editDialog = document.getElementById("editDialog");
    const editForm = document.getElementById("editForm");
    const editName = document.getElementById("editName");
    const editCategory = document.getElementById("editCategory");
    const editLocation = document.getElementById("editLocation");
    const editDescription = document.getElementById("editDescription");

    on("editBtn", () => {
      if (!isOwner) {
        F.toast("Permission denied: You can only edit listings that you personally created.");
        return;
      }
      if (editCategory) {
        editCategory.innerHTML = F.CATEGORIES.map(
          (c) => `<option value="${F.esc(c.id)}" ${c.id === it.category ? "selected" : ""}>${F.esc(c.label)}</option>`
        ).join("");
      }
      if (editName) editName.value = it.name;
      if (editLocation) editLocation.value = it.location;
      if (editDescription) editDescription.value = it.description;
      if (editForm) {
        editForm.querySelectorAll(".field").forEach((f) => F.setError(f, ""));
      }
      if (editDialog) editDialog.showModal();
    });

    const editCancel = document.getElementById("editCancel");
    const editCancelBtn = document.getElementById("editCancelBtn");
    if (editCancel && editDialog) editCancel.onclick = () => editDialog.close();
    if (editCancelBtn && editDialog) editCancelBtn.onclick = () => editDialog.close();

    if (editForm) {
      editForm.onsubmit = function (e) {
        e.preventDefault();
        if (!isOwner) {
          if (editDialog) editDialog.close();
          F.toast("Permission denied: You can only edit listings that you personally created.");
          return;
        }

        const nameVal = editName ? editName.value.trim() : "";
        const locVal = editLocation ? editLocation.value.trim() : "";
        const descVal = editDescription ? editDescription.value.trim() : "";
        const catVal = editCategory ? editCategory.value : it.category;

        const errs = [
          [editName, nameVal.length < 3 ? "Item name must be at least 3 characters." : ""],
          [editLocation, locVal.length < 2 ? "Please provide a campus location." : ""],
          [editDescription, descVal.length < 5 ? "Please provide a description." : ""]
        ];

        errs.forEach(([el, msg]) => el && F.setError(el.closest(".field"), msg));
        if (errs.some(([, msg]) => msg)) return;

        const res = F.updateItem(
          id,
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
  }

  const closeDialogBtn = document.getElementById("cCancel");
  const cancelBtn = document.getElementById("cCancelBtn");
  if (closeDialogBtn) closeDialogBtn.addEventListener("click", () => dialog.close());
  if (cancelBtn) cancelBtn.addEventListener("click", () => dialog.close());

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    if (Auth && !Auth.isLoggedIn()) {
      dialog.close();
      window.location.href = `login.html?redirect=${encodeURIComponent("item.html?id=" + id)}&reason=claim`;
      return;
    }

    const n = document.getElementById("cName");
    const c = document.getElementById("cContact");
    const m = document.getElementById("cMsg");

    const errs = [
      [n, n.value.trim().length < 2 ? "Please enter your name." : ""],
      [c, !(F.isEmail(c.value.trim()) || F.isPhone(c.value.trim())) ? "Enter a valid email address or phone number." : ""],
      [m, m.value.trim().length < 8 ? "Provide ownership proof details (at least 8 characters)." : ""]
    ];

    errs.forEach(([el, msg]) => F.setError(el.closest(".field"), msg));
    if (errs.some(([, msg]) => msg)) return;

    const cur = Auth ? Auth.getCurrentUser() : null;
    const res = F.addClaim(
      id,
      {
        name: n.value.trim(),
        contact: c.value.trim(),
        message: m.value.trim()
      },
      cur
    );

    if (res.success) {
      dialog.close();
      F.toast("Claim message submitted. The reporter has been notified.");
      render();
    } else {
      F.toast(res.error || "Failed to submit claim.");
    }
  });

  render();
});
