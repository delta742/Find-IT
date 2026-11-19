/* FindIT – Browse Items & Search Controller */
document.addEventListener("DOMContentLoaded", function () {
  const F = window.FindIT;
  const Auth = window.FindITAuth;

  // Route Protection: Browsing campus item listings is strictly restricted to authenticated members
  if (Auth && !Auth.isLoggedIn()) {
    Auth.requireAuth("search.html", "browse_required");
    return;
  }

  const $ = (id) => document.getElementById(id);
  const params = new URLSearchParams(location.search);

  // Populate categories filter
  const catSelect = $("cat");
  if (catSelect) {
    catSelect.innerHTML = '<option value="">All categories</option>' +
      F.CATEGORIES.map((c) => `<option value="${F.esc(c.id)}">${F.esc(c.label)}</option>`).join("");
  }

  let type = ["lost", "found"].includes(params.get("type")) ? params.get("type") : "all";
  if ($("q")) $("q").value = params.get("q") || "";
  if ($("cat")) $("cat").value = params.get("category") || "";
  if ($("loc")) $("loc").value = params.get("loc") || "";
  if ($("since")) $("since").max = F.today();

  const tabs = document.querySelectorAll(".tabs button");
  function syncTabs() {
    tabs.forEach((b) => {
      const on = b.dataset.type === type;
      b.classList.toggle("on", on);
      b.setAttribute("aria-selected", on);
    });
  }

  tabs.forEach((b) =>
    b.addEventListener("click", () => {
      type = b.dataset.type;
      syncTabs();
      render();
    })
  );

  function render() {
    const q = $("q").value.trim().toLowerCase();
    const cat = $("cat").value;
    const loc = $("loc").value.trim().toLowerCase();
    const since = $("since").value;
    const showReturned = $("showReturned").checked;
    const sort = $("sort").value;

    let list = F.loadItems().filter((it) => {
      if (type !== "all" && it.type !== type) return false;
      if (!showReturned && it.status === "returned") return false;
      if (cat && it.category !== cat) return false;
      if (loc && !it.location.toLowerCase().includes(loc)) return false;
      if (since && it.date < since) return false;
      if (q) {
        const hay = (it.name + " " + it.description + " " + it.category + " " + it.location).toLowerCase();
        if (!q.split(/\s+/).every((w) => hay.includes(w))) return false;
      }
      return true;
    });

    list.sort((a, b) =>
      sort === "az"
        ? a.name.localeCompare(b.name)
        : sort === "old"
          ? a.createdAt - b.createdAt
          : b.createdAt - a.createdAt
    );

    $("count").textContent = `Showing ${list.length} ${list.length === 1 ? "listing" : "listings"}`;

    const resultsEl = $("results");
    if (list.length) {
      resultsEl.innerHTML = list.map(F.cardHTML).join("");
    } else {
      resultsEl.innerHTML = `
        <div class="empty" style="grid-column: 1 / -1;">
          <div class="empty-icon" aria-hidden="true">${F.svgIcon("search", 44)}</div>
          <h3>No items match your active filters</h3>
          <p>Try refining your search terms, campus location, or clearing applied filters.</p>
          <div style="display:flex;gap:12px;justify-content:center;margin-top:16px;flex-wrap:wrap;">
            <button class="btn btn-outline btn-sm" id="emptyResetBtn" type="button">Reset All Filters</button>
            <a class="btn btn-primary btn-sm" href="report-lost.html">Report Lost Item</a>
          </div>
        </div>`;
      const resetBtn = $("emptyResetBtn");
      if (resetBtn) resetBtn.addEventListener("click", clearFilters);
    }
  }

  function clearFilters() {
    $("q").value = "";
    $("cat").value = "";
    $("loc").value = "";
    $("since").value = "";
    $("showReturned").checked = false;
    $("sort").value = "new";
    type = "all";
    syncTabs();
    render();
  }

  ["q", "cat", "loc", "since", "showReturned", "sort"].forEach((id) => {
    const el = $(id);
    if (el) {
      el.addEventListener("input", render);
      el.addEventListener("change", render);
    }
  });

  const clearBtn = $("clear");
  if (clearBtn) clearBtn.addEventListener("click", clearFilters);

  syncTabs();
  render();
});
