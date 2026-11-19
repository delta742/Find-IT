/* FindIT – Registration Page Controller */
document.addEventListener("DOMContentLoaded", function () {
  const F = window.FindIT;
  const Auth = window.FindITAuth;
  const form = document.getElementById("registerForm");
  const alertBox = document.getElementById("registerAlert");
  const alertMsg = document.getElementById("regAlertMsg");
  const alertIcon = document.getElementById("regAlertIcon");

  const fullNameInput = document.getElementById("regFullName");
  const emailInput = document.getElementById("regEmail");
  const phoneInput = document.getElementById("regPhone");
  const collegeInput = document.getElementById("regCollege");
  const studentIdInput = document.getElementById("regStudentId");
  const passwordInput = document.getElementById("regPassword");
  const confirmPasswordInput = document.getElementById("regConfirmPassword");

  const pwdStrengthBox = document.getElementById("pwdStrengthBox");
  const pwdStrengthFill = document.getElementById("pwdStrengthFill");
  const pwdStrengthLabel = document.getElementById("pwdStrengthLabel");

  const toggleRegPwd = document.getElementById("toggleRegPwd");
  const toggleRegConfirmPwd = document.getElementById("toggleRegConfirmPwd");
  const loginRedirectLink = document.getElementById("loginRedirectLink");

  // Preserve redirect parameter if present
  const urlParams = new URLSearchParams(window.location.search);
  const redirectUrl = urlParams.get("redirect");
  if (redirectUrl && loginRedirectLink) {
    loginRedirectLink.href = `login.html?redirect=${encodeURIComponent(redirectUrl)}`;
  }

  // If already logged in, redirect to dashboard
  if (Auth.isLoggedIn()) {
    const user = Auth.getCurrentUser();
    F.toast(`You are already signed in as ${user.fullName}`);
    setTimeout(() => {
      window.location.href = "dashboard.html";
    }, 1000);
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

  // Toggle password visibility helper
  function setupPasswordToggle(button, input) {
    const openIcon = button.querySelector(".eye-open");
    const closedIcon = button.querySelector(".eye-closed");

    button.addEventListener("click", function () {
      const isPassword = input.getAttribute("type") === "password";
      input.setAttribute("type", isPassword ? "text" : "password");
      openIcon.style.display = isPassword ? "none" : "block";
      closedIcon.style.display = isPassword ? "block" : "none";
      button.setAttribute("aria-label", isPassword ? "Hide password" : "Show password");
    });
  }

  if (toggleRegPwd && passwordInput) setupPasswordToggle(toggleRegPwd, passwordInput);
  if (toggleRegConfirmPwd && confirmPasswordInput) setupPasswordToggle(toggleRegConfirmPwd, confirmPasswordInput);

  // Password strength meter
  passwordInput.addEventListener("input", function () {
    const pwd = passwordInput.value;
    if (!pwd) {
      pwdStrengthBox.style.display = "none";
      return;
    }
    pwdStrengthBox.style.display = "block";
    const evalResult = Auth.evaluatePasswordStrength(pwd);
    const percent = (evalResult.score / 3) * 100;

    pwdStrengthFill.style.width = `${percent}%`;
    pwdStrengthFill.style.backgroundColor = evalResult.color;
    pwdStrengthLabel.textContent = `Strength: ${evalResult.label}`;
    pwdStrengthLabel.style.color = evalResult.color;
  });

  // Validation rules
  const validationRules = {
    regFullName: (v) => {
      if (!v) return "Full Name is required.";
      if (v.length < 3) return "Name must be at least 3 characters long.";
      if (!/^[a-zA-Z\s.'-]+$/.test(v)) return "Name should contain letters and spaces only.";
      return "";
    },
    regEmail: (v) => {
      if (!v) return "Email address is required.";
      if (!F.isEmail(v)) return "Enter a valid campus email address (e.g. name@kiet.edu).";
      if (Auth.findUserByEmail(v)) return "An account with this email is already registered.";
      return "";
    },
    regPhone: (v) => {
      if (!v) return "Mobile number is required.";
      const clean = v.replace(/[\s-]/g, "");
      if (!/^[6-9]\d{9}$/.test(clean) && !/^\+?[0-9]{10,13}$/.test(clean)) {
        return "Enter a valid 10-digit mobile number.";
      }
      return "";
    },
    regCollege: (v) => {
      if (!v) return "College / Institution name is required.";
      if (v.length < 2) return "Please enter a valid institution name.";
      return "";
    },
    regStudentId: (v) => {
      if (!v) return "Student ID or Enrollment Number is required.";
      if (v.length < 3) return "ID must be at least 3 characters.";
      return "";
    },
    regPassword: (v) => {
      if (!v) return "Password is required.";
      if (v.length < 6) return "Password must be at least 6 characters long.";
      if (!/[a-zA-Z]/.test(v) || !/[0-9]/.test(v)) {
        return "Password must contain at least one letter and one number.";
      }
      return "";
    },
    regConfirmPassword: (v) => {
      if (!v) return "Please confirm your password.";
      if (v !== passwordInput.value) return "Passwords do not match.";
      return "";
    }
  };

  function validateField(fieldId) {
    const el = document.getElementById(fieldId);
    if (!el) return true;
    const errorEl = el.closest(".field").querySelector(".error");
    const msg = validationRules[fieldId](el.value.trim());

    el.closest(".field").classList.toggle("invalid", !!msg);
    if (errorEl) errorEl.textContent = msg;
    return !msg;
  }

  // Attach live blur & input listeners
  Object.keys(validationRules).forEach((fieldId) => {
    const el = document.getElementById(fieldId);
    if (!el) return;
    el.addEventListener("blur", () => validateField(fieldId));
    el.addEventListener("input", () => {
      if (el.closest(".field").classList.contains("invalid")) {
        validateField(fieldId);
      }
      if (fieldId === "regPassword" && confirmPasswordInput.value) {
        validateField("regConfirmPassword");
      }
    });
  });

  // Handle registration submit
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    hideAlert();

    const fields = Object.keys(validationRules);
    const isValid = fields.map(validateField).every(Boolean);

    if (!isValid) {
      const firstInvalid = form.querySelector(".invalid input");
      if (firstInvalid) firstInvalid.focus();
      showAlert("Please review and resolve the highlighted errors.", "error");
      return;
    }

    const userData = {
      fullName: fullNameInput.value.trim(),
      email: emailInput.value.trim().toLowerCase(),
      phone: phoneInput.value.trim(),
      college: collegeInput.value.trim(),
      studentId: studentIdInput.value.trim(),
      password: passwordInput.value
    };

    const res = Auth.register(userData);

    if (!res.success) {
      showAlert(res.message, "error");
      if (res.message.includes("email")) {
        document.getElementById("emailError").textContent = res.message;
        emailInput.focus();
      }
      return;
    }

    showAlert("Registration successful! Redirecting to sign in...", "success");
    F.toast("Account created successfully!");

    const submitBtn = document.getElementById("submitRegisterBtn");
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = "Redirecting to sign in...";
    }

    setTimeout(() => {
      let target = `login.html?registered=1&email=${encodeURIComponent(userData.email)}`;
      if (redirectUrl) {
        target += `&redirect=${encodeURIComponent(redirectUrl)}`;
      }
      window.location.href = target;
    }, 1000);
  });
});
