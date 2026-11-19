/* FindIT – Login Page Controller */
document.addEventListener("DOMContentLoaded", function () {
  const F = window.FindIT;
  const Auth = window.FindITAuth;
  const form = document.getElementById("loginForm");
  const alertBox = document.getElementById("authAlert");
  const alertMsg = document.getElementById("alertMsg");
  const alertIcon = document.getElementById("alertIcon");
  const emailInput = document.getElementById("loginEmail");
  const passwordInput = document.getElementById("loginPassword");
  const rememberMeInput = document.getElementById("rememberMe");
  const togglePwdBtn = document.getElementById("toggleLoginPwd");
  const eyeIconOpen = document.getElementById("eyeIconOpen");
  const eyeIconClosed = document.getElementById("eyeIconClosed");
  const emailError = document.getElementById("emailError");
  const passwordError = document.getElementById("passwordError");
  const alreadyLoggedInState = document.getElementById("alreadyLoggedInState");
  const loggedInUserDisplay = document.getElementById("loggedInUserDisplay");
  const authLogoutBtn = document.getElementById("authLogoutBtn");
  const registerRedirectLink = document.getElementById("registerRedirectLink");

  // Check URL parameters
  const urlParams = new URLSearchParams(window.location.search);
  let redirectUrl = urlParams.get("redirect") || "dashboard.html";
  if (redirectUrl === "index.html") redirectUrl = "dashboard.html";
  const registeredParam = urlParams.get("registered");
  const reasonParam = urlParams.get("reason");
  const prefillEmail = urlParams.get("email");

  // Preserve redirect parameter when navigating to registration
  if (registerRedirectLink && urlParams.get("redirect")) {
    registerRedirectLink.href = `register.html?redirect=${encodeURIComponent(urlParams.get("redirect"))}`;
  }

  function showAlert(msg, type = "info") {
    alertBox.className = `auth-alert auth-alert-${type}`;
    alertMsg.textContent = msg;
    const iconSvg =
      type === "error"
        ? F.svgIcon("alert-circle", 18)
        : type === "success"
        ? F.svgIcon("check", 18)
        : F.svgIcon("shield-check", 18);
    alertIcon.innerHTML = iconSvg;
    alertBox.style.display = "flex";
  }

  function hideAlert() {
    alertBox.style.display = "none";
  }

  // Check if user is already logged in
  if (Auth.isLoggedIn()) {
    const user = Auth.getCurrentUser();
    form.style.display = "none";
    alreadyLoggedInState.style.display = "block";
    loggedInUserDisplay.textContent = `${user.fullName} (${user.email})`;
    const homeBtn = alreadyLoggedInState.querySelector(".btn-primary");
    if (homeBtn) {
      homeBtn.textContent = "Go to Dashboard";
      homeBtn.href = "dashboard.html";
    }
    showAlert(`You are currently signed in as ${user.fullName}.`, "info");

    authLogoutBtn.addEventListener("click", function () {
      Auth.logout();
      window.location.reload();
    });
    return;
  }

  // Handle URL notifications
  if (registeredParam === "1") {
    showAlert("Registration successful! You can now log in with your credentials.", "success");
  } else if (reasonParam === "browse_required") {
    showAlert("Access Restricted: Please sign in with your campus account to browse lost and found listings.", "info");
  } else if (reasonParam === "item_required") {
    showAlert("Access Restricted: Please sign in to view item details and claim belongings.", "info");
  } else if (reasonParam === "report-lost") {
    showAlert("Please sign in to report a lost belonging.", "info");
  } else if (reasonParam === "report-found") {
    showAlert("Please sign in to report a found campus item.", "info");
  } else if (reasonParam === "dashboard_required") {
    showAlert("Please sign in to access your student dashboard.", "info");
  } else if (reasonParam === "claim") {
    showAlert("Please sign in to submit a claim or contact the reporter.", "info");
  } else if (reasonParam === "auth_required") {
    showAlert("Please sign in to access this feature.", "info");
  }

  // Pre-fill email if remembered or passed from register
  const remembered = Auth.getRememberedEmail();
  if (prefillEmail) {
    emailInput.value = prefillEmail;
    passwordInput.focus();
  } else if (remembered) {
    emailInput.value = remembered;
    rememberMeInput.checked = true;
    passwordInput.focus();
  }

  // Toggle password visibility
  togglePwdBtn.addEventListener("click", function () {
    const isPassword = passwordInput.getAttribute("type") === "password";
    passwordInput.setAttribute("type", isPassword ? "text" : "password");
    eyeIconOpen.style.display = isPassword ? "none" : "block";
    eyeIconClosed.style.display = isPassword ? "block" : "none";
    togglePwdBtn.setAttribute("aria-label", isPassword ? "Hide password" : "Show password");
  });

  // Demo user quick-fill buttons
  document.querySelectorAll(".demo-user-btn").forEach((btn) => {
    btn.addEventListener("click", function () {
      const email = this.getAttribute("data-email");
      const pwd = this.getAttribute("data-pwd");
      emailInput.value = email;
      passwordInput.value = pwd;
      emailError.textContent = "";
      passwordError.textContent = "";
      hideAlert();
      F.toast(`Loaded demo credentials for ${email}`);
    });
  });

  // Form submit validation & login
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    hideAlert();
    emailError.textContent = "";
    passwordError.textContent = "";

    const email = emailInput.value.trim();
    const password = passwordInput.value;
    let hasError = false;

    if (!email) {
      emailError.textContent = "Please enter your email address.";
      hasError = true;
    } else if (!F.isEmail(email)) {
      emailError.textContent = "Please enter a valid email address.";
      hasError = true;
    }

    if (!password) {
      passwordError.textContent = "Please enter your password.";
      hasError = true;
    }

    if (hasError) return;

    const res = Auth.login(email, password, rememberMeInput.checked);

    if (!res.success) {
      showAlert(res.message, "error");
      if (res.message.includes("password")) {
        passwordError.textContent = res.message;
        passwordInput.focus();
      } else {
        emailError.textContent = res.message;
        emailInput.focus();
      }
      return;
    }

    // Success
    showAlert(`Welcome back, ${res.user.fullName}! Redirecting...`, "success");
    F.toast(`Signed in as ${res.user.fullName}`);

    setTimeout(() => {
      window.location.href = redirectUrl;
    }, 600);
  });

  // Forgot password dialog handling
  const forgotDialog = document.getElementById("forgotPwdDialog");
  const forgotLink = document.getElementById("forgotPwdLink");
  const closeForgotDialog = document.getElementById("closeForgotDialog");
  const cancelForgotDialog = document.getElementById("cancelForgotDialog");
  const lookupBtn = document.getElementById("lookupPwdBtn");
  const resetEmailInput = document.getElementById("resetEmailInput");
  const resetError = document.getElementById("resetError");
  const resetSuccessMsg = document.getElementById("resetSuccessMsg");

  if (forgotLink && forgotDialog) {
    forgotLink.addEventListener("click", function (e) {
      e.preventDefault();
      resetEmailInput.value = emailInput.value.trim() || "student@kiet.edu";
      resetError.textContent = "";
      resetSuccessMsg.style.display = "none";
      forgotDialog.showModal();
    });

    const closeFn = () => forgotDialog.close();
    if (closeForgotDialog) closeForgotDialog.addEventListener("click", closeFn);
    if (cancelForgotDialog) cancelForgotDialog.addEventListener("click", closeFn);

    lookupBtn.addEventListener("click", function () {
      resetError.textContent = "";
      resetSuccessMsg.style.display = "none";
      const targetEmail = resetEmailInput.value.trim().toLowerCase();

      if (!targetEmail || !F.isEmail(targetEmail)) {
        resetError.textContent = "Please enter a valid registered email address.";
        return;
      }

      const user = Auth.findUserByEmail(targetEmail);
      if (!user) {
        resetError.textContent = "No demo account found with this email. You can create a new account anytime.";
        return;
      }

      resetSuccessMsg.innerHTML = `Account: <strong>${F.esc(user.fullName)}</strong><br>Demo Password: <code>${F.esc(user.password)}</code><br><span style="font-size:0.8rem;color:var(--text-muted)">In a production backend, a secure reset token would be emailed to this address.</span>`;
      resetSuccessMsg.style.display = "block";

      emailInput.value = user.email;
      passwordInput.value = user.password;
    });
  }
});
