/* FindIT – Report Lost & Found Form Controller */
document.addEventListener("DOMContentLoaded", function () {
  const F = window.FindIT;
  const Auth = window.FindITAuth;
  const form = document.getElementById("reportForm");
  if (!form) return;

  const type = form.dataset.type;

  // Route protection: Only logged-in users can report items
  if (Auth && !Auth.isLoggedIn()) {
    const returnUrl = type === "lost" ? "report-lost.html" : "report-found.html";
    const reason = type === "lost" ? "report-lost" : "report-found";
    window.location.replace(`login.html?redirect=${encodeURIComponent(returnUrl)}&reason=${reason}`);
    return;
  }

  // Pre-fill reporter contact details from logged-in session
  const currentUser = Auth ? Auth.getCurrentUser() : null;
  if (currentUser) {
    if (form.contactName && !form.contactName.value) {
      form.contactName.value = currentUser.fullName;
    }
    if (form.contact && !form.contact.value) {
      form.contact.value = currentUser.email || currentUser.phone;
    }
  }

  // Populate categories dropdown
  const cat = form.category;
  if (cat) {
    cat.innerHTML = '<option value="">Select a category</option>' +
      F.CATEGORIES.map((c) => `<option value="${F.esc(c.id)}">${F.esc(c.label)}</option>`).join("");
  }

  if (form.date) {
    form.date.max = F.today();
    form.date.value = F.today();
  }

  const counter = document.getElementById("count");
  if (form.description && counter) {
    form.description.addEventListener("input", () => (counter.textContent = form.description.value.length));
  }

  /* ---------- Image Upload & Preview Handler ---------- */
  let uploadedImageDataUrl = "";
  const fileInput = document.getElementById("itemImage");
  const dropzone = document.getElementById("uploadDropzone");
  const previewBox = document.getElementById("imagePreviewBox");
  const previewImg = document.getElementById("previewImg");
  const fileNameDisplay = document.getElementById("fileNameDisplay");
  const fileSizeDisplay = document.getElementById("fileSizeDisplay");
  const removeImgBtn = document.getElementById("removeImgBtn");

  if (dropzone && fileInput) {
    dropzone.addEventListener("click", () => fileInput.click());
    dropzone.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        fileInput.click();
      }
    });

    // Drag and drop events
    ["dragenter", "dragover"].forEach((eventName) => {
      dropzone.addEventListener(eventName, (e) => {
        e.preventDefault();
        e.stopPropagation();
        dropzone.classList.add("dragover");
      });
    });

    ["dragleave", "drop"].forEach((eventName) => {
      dropzone.addEventListener(eventName, (e) => {
        e.preventDefault();
        e.stopPropagation();
        dropzone.classList.remove("dragover");
      });
    });

    dropzone.addEventListener("drop", (e) => {
      const dt = e.dataTransfer;
      const files = dt.files;
      if (files && files.length) {
        handleFileSelect(files[0]);
      }
    });

    fileInput.addEventListener("change", function () {
      if (this.files && this.files.length) {
        handleFileSelect(this.files[0]);
      }
    });
  }

  function handleFileSelect(file) {
    if (!file.type.startsWith("image/")) {
      F.toast("Please select an image file (PNG, JPG, WebP).");
      return;
    }
    if (file.size > 4 * 1024 * 1024) {
      F.toast("Image file is too large (maximum 4MB).");
      return;
    }

    const reader = new FileReader();
    reader.onload = function (e) {
      uploadedImageDataUrl = e.target.result;
      if (previewImg) previewImg.src = uploadedImageDataUrl;
      if (fileNameDisplay) fileNameDisplay.textContent = file.name;
      if (fileSizeDisplay) fileSizeDisplay.textContent = `${(file.size / 1024).toFixed(1)} KB`;
      if (previewBox) previewBox.style.display = "flex";
      if (dropzone) dropzone.style.display = "none";
    };
    reader.readAsDataURL(file);
  }

  if (removeImgBtn) {
    removeImgBtn.addEventListener("click", () => {
      uploadedImageDataUrl = "";
      if (fileInput) fileInput.value = "";
      if (previewBox) previewBox.style.display = "none";
      if (dropzone) dropzone.style.display = "block";
    });
  }

  /* ---------- Form Validation Rules ---------- */
  const rules = {
    name: (v) => (v.length < 3 ? "Enter a descriptive item name (at least 3 characters)." : ""),
    category: (v) => (!v ? "Please choose a category." : ""),
    date: (v) => (!v ? "Please pick a date." : v > F.today() ? "Date cannot be in the future." : ""),
    location: (v) => (v.length < 3 ? "Enter the campus location." : ""),
    description: (v) => (v.length < 10 ? "Add a descriptive summary (at least 10 characters)." : ""),
    contactName: (v) => (v.length < 2 ? "Enter your name." : ""),
    contact: (v) => (!v ? "Enter an email or phone number." : F.isEmail(v) || F.isPhone(v) ? "" : "Enter a valid email or 10-digit phone number.")
  };

  function check(name) {
    const el = form[name];
    if (!el) return true;
    const msg = rules[name](el.value.trim());
    F.setError(el.closest(".field"), msg);
    return !msg;
  }

  Object.keys(rules).forEach((n) => {
    if (form[n]) {
      form[n].addEventListener("blur", () => check(n));
      form[n].addEventListener("input", () => form[n].closest(".field").classList.contains("invalid") && check(n));
    }
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    const ok = Object.keys(rules).map(check).every(Boolean);
    if (!ok) {
      const bad = form.querySelector(".invalid input, .invalid select, .invalid textarea");
      if (bad) bad.focus();
      F.toast("Please fix the highlighted errors before submitting.");
      return;
    }

    const selectedCategory = form.category.value;
    const finalImage = uploadedImageDataUrl || F.CATEGORY_DEFAULT_IMAGES[selectedCategory] || F.CATEGORY_DEFAULT_IMAGES["Other"];

    const item = F.addItem({
      id: F.uid(),
      type,
      name: form.name.value.trim(),
      category: selectedCategory,
      location: form.location.value.trim(),
      date: form.date.value,
      description: form.description.value.trim(),
      contactName: form.contactName.value.trim(),
      contact: form.contact.value.trim(),
      image: finalImage,
      createdBy: currentUser ? currentUser.id : null,
      userId: currentUser ? currentUser.id : null,
      status: "open",
      createdAt: Date.now(),
      claims: []
    });

    F.toast(`Your ${type} report has been published.`);
    setTimeout(() => {
      location.href = "item.html?id=" + encodeURIComponent(item.id) + "&new=1";
    }, 400);
  });

  form.addEventListener("reset", () => {
    setTimeout(() => {
      if (form.date) form.date.value = F.today();
      if (counter) counter.textContent = "0";
      form.querySelectorAll(".field").forEach((f) => F.setError(f, ""));
      uploadedImageDataUrl = "";
      if (fileInput) fileInput.value = "";
      if (previewBox) previewBox.style.display = "none";
      if (dropzone) dropzone.style.display = "block";

      // Restore user details
      if (currentUser) {
        if (form.contactName) form.contactName.value = currentUser.fullName;
        if (form.contact) form.contact.value = currentUser.email || currentUser.phone;
      }
    });
  });
});
