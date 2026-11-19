/* About / Contact page */
document.addEventListener("DOMContentLoaded", function () {
  const F = window.FindIT;
  const form = document.getElementById("contactForm");

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    const n = document.getElementById("mName"), em = document.getElementById("mEmail"), m = document.getElementById("mMsg");
    const errs = [
      [n, n.value.trim().length < 2 ? "Enter your name." : ""],
      [em, !F.isEmail(em.value.trim()) ? "Enter a valid email." : ""],
      [m, m.value.trim().length < 10 ? "Write at least 10 characters." : ""]
    ];
    errs.forEach(([el, msg]) => F.setError(el.closest(".field"), msg));
    if (errs.some(([, msg]) => msg)) return;
    F.saveMessage({ name: n.value.trim(), email: em.value.trim(), message: m.value.trim(), at: Date.now() });
    form.reset();
    F.toast("Thanks! Your message has been saved.");
  });

  document.getElementById("resetLink").addEventListener("click", function (e) {
    e.preventDefault();
    if (confirm("Erase all reports in this browser and restore demo data?")) {
      F.resetDemoData();
      F.toast("Demo data restored.");
    }
  });
});
