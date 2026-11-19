/* FindIT – Core Application Logic & Professional SaaS UI Helpers */
(function () {
  "use strict";

  const KEY = "findit_items_v1";
  const MSG_KEY = "findit_messages_v1";

  /* ---------- Category Metadata & SVG Icons ---------- */
  const CATEGORIES = [
    { id: "Phone", iconName: "phone", label: "Phone" },
    { id: "Wallet", iconName: "wallet", label: "Wallet" },
    { id: "ID Card", iconName: "id-card", label: "ID Card" },
    { id: "Keys", iconName: "keys", label: "Keys" },
    { id: "Books", iconName: "books", label: "Books" },
    { id: "Bag", iconName: "bag", label: "Bag" },
    { id: "Electronics", iconName: "electronics", label: "Electronics" },
    { id: "Clothing", iconName: "clothing", label: "Clothing" },
    { id: "Other", iconName: "other", label: "Other" }
  ];

  const CATEGORY_DEFAULT_IMAGES = {
    "Phone": "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&auto=format&fit=crop&q=80",
    "Wallet": "https://images.unsplash.com/photo-1627123424574-724758594e93?w=600&auto=format&fit=crop&q=80",
    "ID Card": "https://images.unsplash.com/photo-1589330694653-dad6d3240a2a?w=600&auto=format&fit=crop&q=80",
    "Keys": "https://images.unsplash.com/photo-1582139329536-e7284fece509?w=600&auto=format&fit=crop&q=80",
    "Books": "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80",
    "Bag": "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&auto=format&fit=crop&q=80",
    "Electronics": "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&auto=format&fit=crop&q=80",
    "Clothing": "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&auto=format&fit=crop&q=80",
    "Other": "https://images.unsplash.com/photo-1586769852044-692d6e3703f0?w=600&auto=format&fit=crop&q=80"
  };

  /* ---------- Clean SVG Icon Library (Lucide Style) ---------- */
  function svgIcon(name, size = 18, className = "") {
    const s = size;
    const cls = className ? ` class="${className}"` : "";
    const icons = {
      "phone": `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"${cls}><rect width="14" height="20" x="5" y="2" rx="2" ry="2"/><path d="M12 18h.01"/></svg>`,
      "wallet": `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"${cls}><path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"/><path d="M3 5v14a2 2 0 0 0 2 2h16v-5"/><path d="M18 12a2 2 0 0 0 0 4h4v-4Z"/></svg>`,
      "id-card": `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"${cls}><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>`,
      "keys": `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"${cls}><path d="m21 2-2 2m-1.5 1.5L16 7l-2-2m-4.5 4.5L11 8l-2-2m-3.5 3.5a5 5 0 1 0 7.07 7.07l9.43-9.43-2.12-2.14Z"/></svg>`,
      "books": `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"${cls}><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z"/><path d="M6 6h10"/><path d="M6 10h10"/></svg>`,
      "bag": `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"${cls}><rect width="20" height="14" x="2" y="7" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>`,
      "electronics": `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"${cls}><path d="M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a9 9 0 0 1 18 0v7a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3"/></svg>`,
      "clothing": `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"${cls}><path d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z"/></svg>`,
      "other": `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"${cls}><path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>`,
      "map-pin": `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"${cls}><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>`,
      "calendar": `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"${cls}><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>`,
      "search": `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"${cls}><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>`,
      "arrow-right": `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"${cls}><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>`,
      "check": `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"${cls}><polyline points="20 6 9 17 4 12"/></svg>`,
      "shield-check": `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"${cls}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>`,
      "user": `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"${cls}><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`,
      "trash": `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"${cls}><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>`,
      "pencil": `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"${cls}><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>`
    };
    return icons[name] || icons["other"];
  }

  function iconFor(cat) {
    const found = CATEGORIES.find((c) => c.id === cat);
    return svgIcon(found ? found.iconName : "other", 16);
  }

  /* ---------- String & Date Helpers ---------- */
  const esc = (s) =>
    String(s == null ? "" : s).replace(/[&<>"']/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch]));

  const isoDate = (d) => {
    const x = new Date(d.getTime() - d.getTimezoneOffset() * 60000);
    return x.toISOString().slice(0, 10);
  };
  const today = () => isoDate(new Date());
  const daysAgo = (n) => { const d = new Date(); d.setDate(d.getDate() - n); return isoDate(d); };

  const fmtDate = (s) => {
    if (!s) return "";
    const d = new Date(s + (s.length === 10 ? "T00:00:00" : ""));
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };
  const fmtDateTime = (ts) =>
    new Date(ts).toLocaleString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });

  const uid = () => "it_" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);

  /* ---------- Seed Items with Actual Real-World Photos ---------- */
  function seed() {
    const mk = (type, name, category, location, ago, description, contactName, contact, image) => ({
      id: uid(), type, name, category, location, date: daysAgo(ago), description,
      contactName, contact, image, status: "open", createdAt: Date.now() - ago * 864e5, claims: []
    });

    return [
      mk(
        "lost",
        "Black iPhone 13",
        "Phone",
        "Library, 2nd floor",
        2,
        "Black iPhone 13 with a cracked transparent case. Lock screen displays a golden retriever.",
        "Aarav Mehta",
        "aarav.m@example.com",
        "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=600&auto=format&fit=crop&q=80"
      ),
      mk(
        "found",
        "Black smartphone with clear case",
        "Phone",
        "Library reading hall",
        1,
        "Found on a study desk near the window. Phone is locked, clear protective case with small corner crack.",
        "Library Help Desk",
        "9876500011",
        "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&auto=format&fit=crop&q=80"
      ),
      mk(
        "lost",
        "Brown leather bi-fold wallet",
        "Wallet",
        "Central Canteen",
        4,
        "Brown leather wallet containing college student ID card, metro smart card, and some cash.",
        "Riya Sharma",
        "9811122233",
        "https://images.unsplash.com/photo-1627123424574-724758594e93?w=600&auto=format&fit=crop&q=80"
      ),
      mk(
        "found",
        "Student ID Card – MCA Department",
        "ID Card",
        "Main Campus Gate",
        3,
        "KIET ID card belonging to a 2nd year MCA student. Handed over to Campus Security cabin.",
        "Security Office",
        "security@kiet.edu",
        "https://images.unsplash.com/photo-1589330694653-dad6d3240a2a?w=600&auto=format&fit=crop&q=80"
      ),
      mk(
        "lost",
        "Bike key with blue keychain",
        "Keys",
        "Parking Lot B",
        5,
        "Honda motorcycle key attached to a blue rubber lanyard and miniature bottle opener.",
        "Karan Singh",
        "9899900011",
        "https://images.unsplash.com/photo-1582139329536-e7284fece509?w=600&auto=format&fit=crop&q=80"
      ),
      mk(
        "found",
        "Set of keys with red carabiner tag",
        "Keys",
        "Block A Corridor",
        2,
        "Ring of three keys with an anodized red carabiner tag. Found near the department notice board.",
        "Neha Gupta",
        "neha.g@example.com",
        "https://images.unsplash.com/photo-1584824486509-112e4181ff6b?w=600&auto=format&fit=crop&q=80"
      ),
      mk(
        "lost",
        "Data Structures & Algorithms textbook",
        "Books",
        "Lecture Hall 204",
        6,
        "Data Structures in C textbook by Reema Thareja. Student name written inside the front cover.",
        "Vikram Rao",
        "vikram.r@example.com",
        "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80"
      ),
      mk(
        "found",
        "Grey laptop backpack",
        "Bag",
        "Bus stop near Gate 2",
        1,
        "Grey canvas laptop backpack containing spiral notebooks and a 65W USB-C fast charger.",
        "Sana Khan",
        "9822211100",
        "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&auto=format&fit=crop&q=80"
      ),
      mk(
        "lost",
        "Wireless earbuds (white charging case)",
        "Electronics",
        "Sports Ground Pavilion",
        3,
        "Matte white earbuds case with subtle scratch near the hinge. Lost during evening badminton practice.",
        "Dev Malhotra",
        "dev.m@example.com",
        "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&auto=format&fit=crop&q=80"
      )
    ];
  }

  /* ---------- Storage Management ---------- */
  function loadItems() {
    let items = [];
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        items = JSON.parse(raw);
      }
    } catch (e) {
      console.warn("Storage read error, reseeding", e);
    }

    if (!items || !items.length) {
      items = seed();
      saveItems(items);
    } else {
      // Ensure existing saved items without images receive default real photos
      let changed = false;
      items.forEach((it) => {
        if (!it.image) {
          it.image = CATEGORY_DEFAULT_IMAGES[it.category] || CATEGORY_DEFAULT_IMAGES["Other"];
          changed = true;
        }
      });
      if (changed) saveItems(items);
    }
    return items;
  }

  function saveItems(items) {
    try {
      localStorage.setItem(KEY, JSON.stringify(items));
    } catch (e) {
      toast("Could not save to browser storage.");
    }
  }

  /* ---------- Ownership Authorization & Listing Storage Operations ---------- */
  function isItemOwner(item, userOrUserId) {
    if (!item || !userOrUserId) return false;
    const uid = typeof userOrUserId === "object" ? userOrUserId.id : String(userOrUserId).trim();
    if (!uid) return false;
    // Ownership is strictly defined by creator's unique user ID (createdBy or userId alias)
    const ownerId = item.createdBy || item.userId;
    return Boolean(ownerId && String(ownerId).trim() === uid);
  }

  const getItem = (id) => loadItems().find((i) => i.id === id);

  function addItem(item) {
    if (!item.image) {
      item.image = CATEGORY_DEFAULT_IMAGES[item.category] || CATEGORY_DEFAULT_IMAGES["Other"];
    }
    const curUser = (window.FindITAuth && window.FindITAuth.getCurrentUser) ? window.FindITAuth.getCurrentUser() : null;
    if (!item.createdBy && curUser && curUser.id) {
      item.createdBy = curUser.id;
    }
    if (!item.userId && item.createdBy) {
      item.userId = item.createdBy;
    }
    if (!Array.isArray(item.claims)) {
      item.claims = [];
    }
    const all = loadItems();
    all.unshift(item);
    saveItems(all);
    return item;
  }

  function resolveRequestingUser(userOrId) {
    if (userOrId && typeof userOrId === "object" && userOrId.id) return userOrId;
    if (typeof userOrId === "string" && userOrId.trim()) return { id: userOrId.trim() };
    if (window.FindITAuth && window.FindITAuth.getCurrentUser) {
      return window.FindITAuth.getCurrentUser();
    }
    return null;
  }

  function updateItem(id, updateDataOrFn, requestingUserOrId) {
    const all = loadItems();
    const it = all.find((i) => i.id === id);
    if (!it) {
      console.warn(`[FindIT Auth] Update failed: Listing "${id}" not found.`);
      return { success: false, error: "Listing not found." };
    }

    const user = resolveRequestingUser(requestingUserOrId);
    if (!user || !user.id) {
      const msg = "Unauthorized: You must be logged in to edit this listing.";
      console.warn(`[FindIT Auth] ${msg}`);
      return { success: false, error: msg };
    }

    if (!isItemOwner(it, user)) {
      const msg = "Permission denied: You can only edit listings that you personally created.";
      console.warn(`[FindIT Auth] ${msg} (Item: ${id}, Owner: ${it.createdBy || it.userId}, Attempted by: ${user.id})`);
      return { success: false, error: msg };
    }

    // Preserve immutable attributes: id, createdBy, userId, createdAt, type
    const originalId = it.id;
    const originalCreatedBy = it.createdBy;
    const originalUserId = it.userId;
    const originalCreatedAt = it.createdAt;
    const originalType = it.type;

    if (typeof updateDataOrFn === "function") {
      updateDataOrFn(it);
    } else if (typeof updateDataOrFn === "object" && updateDataOrFn !== null) {
      if (updateDataOrFn.name !== undefined) it.name = String(updateDataOrFn.name).trim();
      if (updateDataOrFn.category !== undefined) it.category = updateDataOrFn.category;
      if (updateDataOrFn.location !== undefined) it.location = String(updateDataOrFn.location).trim();
      if (updateDataOrFn.description !== undefined) it.description = String(updateDataOrFn.description).trim();
      if (updateDataOrFn.date !== undefined) it.date = updateDataOrFn.date;
      if (updateDataOrFn.contactName !== undefined) it.contactName = String(updateDataOrFn.contactName).trim();
      if (updateDataOrFn.contact !== undefined) it.contact = String(updateDataOrFn.contact).trim();
      if (updateDataOrFn.status !== undefined) it.status = updateDataOrFn.status;
      if (updateDataOrFn.image !== undefined) it.image = updateDataOrFn.image;
    }

    // Strictly enforce ownership immutability
    it.id = originalId;
    it.createdBy = originalCreatedBy;
    it.userId = originalUserId;
    it.createdAt = originalCreatedAt;
    it.type = originalType;
    it.updatedAt = Date.now();

    saveItems(all);
    return { success: true, item: it };
  }

  function deleteItem(id, requestingUserOrId) {
    const all = loadItems();
    const it = all.find((i) => i.id === id);
    if (!it) {
      console.warn(`[FindIT Auth] Delete failed: Listing "${id}" not found.`);
      return { success: false, error: "Listing not found." };
    }

    const user = resolveRequestingUser(requestingUserOrId);
    if (!user || !user.id) {
      const msg = "Unauthorized: You must be logged in to delete a listing.";
      console.warn(`[FindIT Auth] ${msg}`);
      return { success: false, error: msg };
    }

    if (!isItemOwner(it, user)) {
      const msg = "Permission denied: You can only delete listings that you personally created.";
      console.warn(`[FindIT Auth] ${msg} (Item: ${id}, Owner: ${it.createdBy || it.userId}, Attempted by: ${user.id})`);
      return { success: false, error: msg };
    }

    saveItems(all.filter((i) => i.id !== id));
    return { success: true, id };
  }

  function addClaim(id, claimData, requestingUserOrId) {
    const all = loadItems();
    const it = all.find((i) => i.id === id);
    if (!it) {
      return { success: false, error: "Listing not found." };
    }

    const user = resolveRequestingUser(requestingUserOrId);
    if (!user || !user.id) {
      return { success: false, error: "Authentication required: Please sign in to submit a claim." };
    }

    if (!Array.isArray(it.claims)) {
      it.claims = [];
    }

    it.claims.push({
      userId: user.id,
      name: String(claimData.name || "").trim(),
      contact: String(claimData.contact || "").trim(),
      message: String(claimData.message || "").trim(),
      at: claimData.at || Date.now()
    });

    saveItems(all);
    return { success: true, item: it };
  }

  function saveMessage(m) {
    let list = [];
    try { list = JSON.parse(localStorage.getItem(MSG_KEY)) || []; } catch (e) {}
    list.push(m);
    try { localStorage.setItem(MSG_KEY, JSON.stringify(list)); } catch (e) {}
  }

  function resetDemoData() {
    try {
      localStorage.removeItem(KEY);
      localStorage.removeItem(MSG_KEY);
    } catch (e) {}
  }

  /* ---------- Intelligent Item Matching Engine ---------- */
  const STOP = new Set("a an the and or of with in on at near to is it my has have for from by was this that its i in".split(" "));
  const words = (s) => String(s).toLowerCase().replace(/[^a-z0-9 ]/g, " ").split(/\s+/).filter((w) => w.length > 2 && !STOP.has(w));

  function matchScore(a, b) {
    if (a.type === b.type || a.category !== b.category) return 0;
    let score = 40; // Same category baseline
    const wa = new Set(words(a.name + " " + a.description));
    const wb = new Set(words(b.name + " " + b.description));
    let common = 0;
    wa.forEach((w) => { if (wb.has(w)) common++; });
    score += Math.min(30, common * 8);

    const la = new Set(words(a.location)), lb = words(b.location);
    if (lb.some((w) => la.has(w))) score += 15;

    const gap = Math.abs(new Date(a.date) - new Date(b.date)) / 864e5;
    if (gap <= 2) score += 15; else if (gap <= 7) score += 8;

    return Math.min(100, score);
  }

  function findMatches(item) {
    return loadItems()
      .filter((o) => o.id !== item.id && o.status === "open")
      .map((o) => ({ item: o, score: matchScore(item, o) }))
      .filter((m) => m.score >= 50)
      .sort((x, y) => y.score - x.score)
      .slice(0, 4);
  }

  /* ---------- Toast Notification ---------- */
  function toast(msg) {
    let t = document.getElementById("toast");
    if (!t) {
      t = document.createElement("div");
      t.id = "toast";
      t.className = "toast";
      t.setAttribute("role", "status");
      document.body.appendChild(t);
    }
    t.innerHTML = `${svgIcon("check", 16)} <span>${esc(msg)}</span>`;
    t.classList.add("show");
    clearTimeout(toast._t);
    toast._t = setTimeout(() => t.classList.remove("show"), 2800);
  }

  /* ---------- Professional Item Card Component ---------- */
  function cardHTML(it) {
    const isLost = it.type === "lost";
    const statusBadge = isLost
      ? `<span class="badge lost"><span class="badge-dot"></span> Lost</span>`
      : `<span class="badge found"><span class="badge-dot"></span> Found</span>`;
    const returnedBadge = it.status === "returned"
      ? `<span class="badge returned">Returned</span>`
      : "";

    const imgSrc = it.image || CATEGORY_DEFAULT_IMAGES[it.category] || CATEGORY_DEFAULT_IMAGES["Other"];

    return `
      <article class="card ${esc(it.type)} ${it.status === "returned" ? "returned" : ""}">
        <div class="card-image-wrap">
          <img class="card-img" src="${esc(imgSrc)}" alt="${esc(it.name)}" loading="lazy" onerror="this.src='${CATEGORY_DEFAULT_IMAGES["Other"]}'">
          <div class="card-badge-overlay">
            ${statusBadge}
            ${returnedBadge}
          </div>
        </div>
        <div class="card-body">
          <div class="card-cat">
            ${iconFor(it.category)}
            <span>${esc(it.category)}</span>
          </div>
          <h3>${esc(it.name)}</h3>
          <p>${esc(it.description)}</p>
          <div class="card-meta">
            <div class="meta-row">
              ${svgIcon("map-pin", 14)}
              <span>${esc(it.location)}</span>
            </div>
            <div class="meta-row">
              ${svgIcon("calendar", 14)}
              <span>${esc(fmtDate(it.date))}</span>
            </div>
          </div>
        </div>
        <div class="card-footer">
          <a class="card-view-btn" href="item.html?id=${encodeURIComponent(it.id)}">
            <span>View Details</span>
            ${svgIcon("arrow-right", 14)}
          </a>
        </div>
      </article>`;
  }

  /* ---------- Modern Navigation & Footer Layout ---------- */
  function renderLayout() {
    const page = document.body.dataset.page || "";
    const currentUser = window.FindITAuth ? window.FindITAuth.getCurrentUser() : null;

    let navLinksHtml = "";

    if (currentUser) {
      // Authenticated Navigation: Dashboard | Browse Items | Report Lost | Report Found | My Reports | Profile | Logout
      const authLinks = [
        ["dashboard", "dashboard.html", "Dashboard"],
        ["search", "search.html", "Browse Items"],
        ["lost", "report-lost.html", "Report Lost"],
        ["found", "report-found.html", "Report Found"],
        ["my-reports", "my-reports.html", "My Reports"]
      ];

      const firstName = esc(currentUser.fullName ? currentUser.fullName.split(" ")[0] : "User");
      const initial = esc(currentUser.fullName ? currentUser.fullName.charAt(0).toUpperCase() : "U");

      navLinksHtml = `
        ${authLinks.map(([k, href, label]) => `<li><a href="${href}" class="${page === k ? "active" : ""}" ${page === k ? 'aria-current="page"' : ""}>${label}</a></li>`).join("")}
        <li class="nav-user-item">
          <button id="navProfileBtn" class="nav-user-chip" type="button" title="View Student Profile" aria-label="Student Profile" style="cursor:pointer;border:1px solid var(--border);font-family:inherit;">
            <span class="nav-avatar" aria-hidden="true">${initial}</span>
            <span class="nav-user-name">${firstName}</span>
          </button>
          <button id="navLogoutBtn" class="nav-btn-logout" type="button" title="Sign out of account">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
            <span>Logout</span>
          </button>
        </li>`;
    } else {
      // Public / Guest Navigation: Home | How It Works | About Us | FAQ | Contact | Sign In | Register
      const publicLinks = [
        ["home", "index.html", "Home"],
        ["how-it-works", "index.html#how-it-works", "How It Works"],
        ["about", "about.html", "About Us"],
        ["faq", "index.html#faq", "FAQ"],
        ["contact", "about.html#contact", "Contact"]
      ];

      navLinksHtml = `
        ${publicLinks.map(([k, href, label]) => `<li><a href="${href}" class="${page === k ? "active" : ""}">${label}</a></li>`).join("")}
        <li class="nav-auth-item">
          <a href="login.html" class="nav-link-login ${page === "login" ? "active" : ""}">Sign In</a>
        </li>
        <li class="nav-auth-item">
          <a href="register.html" class="nav-btn-register ${page === "register" ? "active" : ""}">Register</a>
        </li>`;
    }

    const header = document.getElementById("site-header");
    if (header) {
      header.className = "site-header";
      header.innerHTML = `
        <div class="container nav">
          <a class="logo" href="${currentUser ? "dashboard.html" : "index.html"}" aria-label="FindIT Homepage">
            <div class="logo-icon-svg" aria-hidden="true">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="11" cy="11" r="7"/>
                <path d="m21 21-4.3-4.3"/>
              </svg>
            </div>
            <span>Find<b>IT</b></span>
          </a>
          <button class="nav-toggle" id="navToggle" aria-label="Toggle navigation menu" aria-expanded="false">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" x2="21" y1="6" y2="6"/><line x1="3" x2="21" y1="12" y2="12"/><line x1="3" x2="21" y1="18" y2="18"/></svg>
          </button>
          <ul class="nav-links" id="navLinks">
            ${navLinksHtml}
          </ul>
        </div>`;

      const btn = document.getElementById("navToggle");
      const ul = document.getElementById("navLinks");
      if (btn && ul) {
        btn.addEventListener("click", () => {
          const o = ul.classList.toggle("open");
          btn.setAttribute("aria-expanded", o);
        });
      }

      const logoutBtn = document.getElementById("navLogoutBtn");
      if (logoutBtn) {
        logoutBtn.addEventListener("click", () => {
          if (confirm("Are you sure you want to log out of FindIT?")) {
            if (window.FindITAuth) window.FindITAuth.logout();
            toast("You have successfully signed out.");
            setTimeout(() => {
              window.location.href = "index.html";
            }, 300);
          }
        });
      }

      const profileBtn = document.getElementById("navProfileBtn");
      if (profileBtn && currentUser) {
        profileBtn.addEventListener("click", () => {
          showProfileModal(currentUser);
        });
      }
    }

    const footer = document.getElementById("site-footer");
    if (footer) {
      footer.className = "site-footer";
      footer.innerHTML = `
        <div class="container">
          <div class="footer-grid">
            <div class="footer-brand">
              <a class="logo" href="${currentUser ? "dashboard.html" : "index.html"}">
                <div class="logo-icon-svg" aria-hidden="true">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/>
                  </svg>
                </div>
                <span>Find<b>IT</b></span>
              </a>
              <p>A reliable campus lost &amp; found management system designed to connect student belongings with their rightful owners quickly, safely, and transparently.</p>
            </div>
            <div class="footer-col">
              <h4>${currentUser ? "Student Portal" : "Campus Platform"}</h4>
              <ul>
                ${
                  currentUser
                    ? `<li><a href="dashboard.html">Dashboard</a></li>
                       <li><a href="search.html">Browse All Items</a></li>
                       <li><a href="report-lost.html">Report Lost</a></li>
                       <li><a href="report-found.html">Report Found</a></li>
                       <li><a href="my-reports.html">My Reports</a></li>`
                    : `<li><a href="index.html">Home</a></li>
                       <li><a href="index.html#how-it-works">How It Works</a></li>
                       <li><a href="about.html">About Us</a></li>
                       <li><a href="login.html">Sign In</a></li>
                       <li><a href="register.html">Register</a></li>`
                }
              </ul>
            </div>
            <div class="footer-col">
              <h4>Support &amp; Campus</h4>
              <ul>
                <li><a href="about.html">About FindIT</a></li>
                <li><a href="index.html#faq">Platform FAQs</a></li>
                <li><a href="about.html#contact">Campus Help Desk</a></li>
                <li><a href="#" id="privacyPolicyLink">Privacy Policy</a></li>
                <li><a href="#" id="termsPolicyLink">Terms &amp; Conditions</a></li>
              </ul>
            </div>
            <div class="footer-col">
              <h4>Institutional Affiliation</h4>
              <p style="font-size:0.88rem;color:var(--text-muted);margin:0 0 10px;">
                Department of Computer Applications (MCA)<br>
                KIET Deemed To Be University<br>
                Course: Front End Web Development (26CA205PCB)
              </p>
              <div style="font-size:0.84rem;color:var(--text-muted);">
                Support: <a href="mailto:support.findit@kiet.edu" style="color:var(--primary);font-weight:600;">support.findit@kiet.edu</a>
              </div>
            </div>
          </div>
          <div class="footer-bottom">
            <span>&copy; ${new Date().getFullYear()} FindIT – Campus Lost &amp; Found Platform. All rights reserved.</span>
            <span>Developed for KIET Campus Community</span>
          </div>
        </div>`;

      // Attach Privacy & Terms Modal Listeners
      const pLink = document.getElementById("privacyPolicyLink");
      const tLink = document.getElementById("termsPolicyLink");
      if (pLink) {
        pLink.addEventListener("click", (e) => {
          e.preventDefault();
          showPolicyModal("Privacy Policy", `
            <p><strong>FindIT Data Privacy Commitment:</strong></p>
            <p>FindIT prioritizes student privacy and campus security. Actual lost and found listings are strictly restricted to authenticated students and faculty.</p>
            <ul>
              <li><strong>Contact Safeguards:</strong> Personal phone numbers and email addresses are only displayed on item listings to authenticated campus members to facilitate verified claims.</li>
              <li><strong>Claim Verifications:</strong> When claiming an item, never share private credentials, passwords, or bank PINs. Use item-specific physical identifiers.</li>
              <li><strong>Data Retention:</strong> You can clear all cached campus listings anytime via the About &gt; Reset Demo Data option.</li>
            </ul>
          `);
        });
      }
      if (tLink) {
        tLink.addEventListener("click", (e) => {
          e.preventDefault();
          showPolicyModal("Terms & Conditions", `
            <p><strong>Campus Community Usage Guidelines:</strong></p>
            <ul>
              <li><strong>Authentic Reports:</strong> Users must only report genuine lost or found items located within campus premises.</li>
              <li><strong>Campus Turn-in Protocol:</strong> Found identification cards, wallets, and high-value electronics must be deposited with Central Campus Security or the Department Help Desk.</li>
              <li><strong>Claim Accuracy:</strong> False or fraudulent claims are subject to student conduct review by the university administration.</li>
            </ul>
          `);
        });
      }
    }
  }

  function showProfileModal(user) {
    let d = document.getElementById("profileDialog");
    if (!d) {
      d = document.createElement("dialog");
      d.id = "profileDialog";
      d.innerHTML = `
        <div class="dialog-content">
          <div class="dialog-head">
            <h3>Student Profile</h3>
            <button class="btn btn-outline btn-sm" id="closeProfileDialog" type="button">&times;</button>
          </div>
          <div id="profileDialogBody"></div>
          <div class="dialog-actions">
            <a class="btn btn-primary btn-sm" href="my-reports.html">Manage My Reports</a>
            <button class="btn btn-outline btn-sm" id="ackProfileBtn" type="button">Close</button>
          </div>
        </div>`;
      document.body.appendChild(d);
      const close = () => d.close();
      document.getElementById("closeProfileDialog").addEventListener("click", close);
      document.getElementById("ackProfileBtn").addEventListener("click", close);
    }
    const body = document.getElementById("profileDialogBody");
    if (body && user) {
      body.innerHTML = `
        <div style="display:flex;align-items:center;gap:14px;margin-bottom:18px;padding-bottom:14px;border-bottom:1px solid var(--border);">
          <div style="width:48px;height:48px;border-radius:50%;background:var(--primary);color:#fff;display:grid;place-items:center;font-size:1.2rem;font-weight:700;">
            ${esc(user.fullName.charAt(0).toUpperCase())}
          </div>
          <div>
            <div style="font-weight:700;font-size:1.1rem;color:var(--text-main);">${esc(user.fullName)}</div>
            <div style="font-size:0.86rem;color:var(--text-muted);">${esc(user.email)}</div>
          </div>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;font-size:0.88rem;">
          <div><strong style="display:block;color:var(--text-muted);font-size:0.78rem;text-transform:uppercase;">Student / Roll ID</strong><span style="font-weight:600;color:var(--text-main);">${esc(user.studentId || "N/A")}</span></div>
          <div><strong style="display:block;color:var(--text-muted);font-size:0.78rem;text-transform:uppercase;">Mobile Number</strong><span style="font-weight:600;color:var(--text-main);">${esc(user.phone || "N/A")}</span></div>
          <div style="grid-column:1/-1;"><strong style="display:block;color:var(--text-muted);font-size:0.78rem;text-transform:uppercase;">Institution</strong><span style="font-weight:600;color:var(--text-main);">${esc(user.college || "KIET Deemed To Be University")}</span></div>
          <div style="grid-column:1/-1;margin-top:4px;"><span class="badge found" style="font-size:0.78rem;">✓ Verified Active Campus Member</span></div>
        </div>`;
    }
    d.showModal();
  }

  function showPolicyModal(title, htmlContent) {
    let d = document.getElementById("policyDialog");
    if (!d) {
      d = document.createElement("dialog");
      d.id = "policyDialog";
      d.innerHTML = `
        <div class="dialog-content">
          <div class="dialog-head">
            <h3 id="policyDialogTitle"></h3>
            <button class="btn btn-ghost btn-sm" id="closePolicyDialog" type="button">&times;</button>
          </div>
          <div id="policyDialogBody" style="font-size:0.92rem;color:var(--text-body);line-height:1.6;"></div>
          <div class="dialog-actions">
            <button class="btn btn-primary btn-sm" id="ackPolicyBtn" type="button">Understood</button>
          </div>
        </div>`;
      document.body.appendChild(d);
      const close = () => d.close();
      document.getElementById("closePolicyDialog").addEventListener("click", close);
      document.getElementById("ackPolicyBtn").addEventListener("click", close);
    }
    document.getElementById("policyDialogTitle").textContent = title;
    document.getElementById("policyDialogBody").innerHTML = htmlContent;
    d.showModal();
  }

  /* ---------- Form Validation Helpers ---------- */
  function setError(fieldEl, msg) {
    if (!fieldEl) return;
    fieldEl.classList.toggle("invalid", !!msg);
    const e = fieldEl.querySelector(".error");
    if (e) e.textContent = msg || "";
  }
  const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
  const isPhone = (v) => /^\+?[0-9][0-9\s-]{8,13}$/.test(v);

  /* ---------- Expose FindIT Global API ---------- */
  window.FindIT = {
    CATEGORIES,
    CATEGORY_DEFAULT_IMAGES,
    iconFor,
    svgIcon,
    esc,
    today,
    fmtDate,
    fmtDateTime,
    uid,
    loadItems,
    getItem,
    isItemOwner,
    addItem,
    updateItem,
    deleteItem,
    addClaim,
    saveMessage,
    resetDemoData,
    findMatches,
    matchScore,
    cardHTML,
    toast,
    setError,
    isEmail,
    isPhone,
    renderLayout
  };

  document.addEventListener("DOMContentLoaded", () => {
    renderLayout();
  });
})();
