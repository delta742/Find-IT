/* FindIT – Authentication Module (Demo LocalStorage/SessionStorage)
   Provides registration, login, session persistence, demo users, and route guards.
   NOTE: In a production environment, authentication would be handled by a secure backend
   (Node.js/Express, Python/Django, etc.) with encrypted HTTPS, salted password hashing (bcrypt),
   and HTTP-only secure JWT/session cookies.
*/
(function () {
  "use strict";

  const USERS_KEY = "findit_users_v1";
  const SESSION_KEY = "findit_session_v1";
  const REMEMBER_KEY = "findit_remember_email_v1";

  // Pre-configured demo student accounts
  const DEFAULT_USERS = [
    {
      id: "usr_kiet_aarav",
      fullName: "Aarav Mehta",
      email: "student@kiet.edu",
      phone: "9876500011",
      college: "KIET Deemed To Be University",
      studentId: "2100290140001",
      password: "Password123",
      createdAt: 1700000000000
    },
    {
      id: "usr_kiet_riya",
      fullName: "Riya Sharma",
      email: "riya.sharma@kiet.edu",
      phone: "9811122233",
      college: "KIET Deemed To Be University",
      studentId: "2100290140002",
      password: "Password123",
      createdAt: 1700100000000
    }
  ];

  /* ---------- User Storage Operations ---------- */
  function getUsers() {
    try {
      const raw = localStorage.getItem(USERS_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn("Could not read users from storage", e);
    }
    // Seed default demo accounts
    saveUsers(DEFAULT_USERS);
    return DEFAULT_USERS;
  }

  function saveUsers(users) {
    try {
      localStorage.setItem(USERS_KEY, JSON.stringify(users));
    } catch (e) {
      console.error("Could not save users to localStorage", e);
    }
  }

  function findUserByEmail(email) {
    if (!email) return null;
    const clean = String(email).trim().toLowerCase();
    const users = getUsers();
    return users.find((u) => u.email.trim().toLowerCase() === clean) || null;
  }

  /* ---------- Registration ---------- */
  function register(userData) {
    const { fullName, email, phone, college, studentId, password } = userData;

    // Check if email already registered
    const existing = findUserByEmail(email);
    if (existing) {
      return {
        success: false,
        message: "An account with this email address already exists. Please log in instead."
      };
    }

    const newUser = {
      id: "usr_" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
      fullName: String(fullName).trim(),
      email: String(email).trim().toLowerCase(),
      phone: String(phone).trim(),
      college: String(college).trim(),
      studentId: String(studentId).trim(),
      password: String(password), // In production, password must be hashed on backend
      createdAt: Date.now()
    };

    const users = getUsers();
    users.push(newUser);
    saveUsers(users);

    return {
      success: true,
      user: newUser,
      message: "Registration successful! You can now log in."
    };
  }

  /* ---------- Login & Session Management ---------- */
  function login(email, password, rememberMe) {
    const cleanEmail = String(email).trim().toLowerCase();
    const user = findUserByEmail(cleanEmail);

    if (!user) {
      return {
        success: false,
        message: "No account found with this email. Please check your email or register."
      };
    }

    if (user.password !== password) {
      return {
        success: false,
        message: "Incorrect password. Please verify and try again."
      };
    }

    // Safe session payload (without exposed sensitive data)
    const sessionUser = {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
      college: user.college,
      studentId: user.studentId,
      loginAt: Date.now()
    };

    try {
      // Primary session in sessionStorage (expires when tab/browser closes)
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(sessionUser));

      if (rememberMe) {
        // Also persist in localStorage if Remember Me is checked
        localStorage.setItem(SESSION_KEY, JSON.stringify(sessionUser));
        localStorage.setItem(REMEMBER_KEY, user.email);
      } else {
        localStorage.removeItem(SESSION_KEY);
        localStorage.removeItem(REMEMBER_KEY);
      }
    } catch (e) {
      console.warn("Storage write error during login", e);
    }

    return {
      success: true,
      user: sessionUser,
      message: `Welcome back, ${user.fullName}!`
    };
  }

  function getCurrentUser() {
    try {
      // Check active tab session first
      let raw = sessionStorage.getItem(SESSION_KEY);
      if (raw) return JSON.parse(raw);

      // Check persisted "remember me" session
      raw = localStorage.getItem(SESSION_KEY);
      if (raw) {
        const u = JSON.parse(raw);
        // Hydrate sessionStorage for current tab
        sessionStorage.setItem(SESSION_KEY, raw);
        return u;
      }
    } catch (e) {
      console.warn("Error reading current user session", e);
    }
    return null;
  }

  function isLoggedIn() {
    return !!getCurrentUser();
  }

  function logout() {
    try {
      sessionStorage.removeItem(SESSION_KEY);
      localStorage.removeItem(SESSION_KEY);
    } catch (e) {}
    return true;
  }

  function getRememberedEmail() {
    try {
      return localStorage.getItem(REMEMBER_KEY) || "";
    } catch (e) {
      return "";
    }
  }

  /* ---------- Route Protection ---------- */
  function requireAuth(redirectPath, reason = "auth_required") {
    if (!isLoggedIn()) {
      const returnUrl = redirectPath || (window.location.pathname.split("/").pop() + window.location.search);
      window.location.replace(`login.html?redirect=${encodeURIComponent(returnUrl)}&reason=${encodeURIComponent(reason)}`);
      return false;
    }
    return true;
  }

  /* ---------- Password Reset (Demo) ---------- */
  function resetPassword(email, newPassword) {
    const cleanEmail = String(email).trim().toLowerCase();
    const users = getUsers();
    const userIndex = users.findIndex((u) => u.email.trim().toLowerCase() === cleanEmail);

    if (userIndex === -1) {
      return {
        success: false,
        message: "No account found with this email address."
      };
    }

    users[userIndex].password = newPassword;
    saveUsers(users);

    return {
      success: true,
      message: "Password reset successfully! You can now log in with your new password."
    };
  }

  /* ---------- Password Strength Evaluator ---------- */
  function evaluatePasswordStrength(password) {
    const val = String(password || "");
    if (!val) return { score: 0, label: "Enter a password", color: "#ccc" };

    let score = 0;
    if (val.length >= 6) score += 1;
    if (val.length >= 8) score += 1;
    if (/[A-Z]/.test(val) && /[a-z]/.test(val)) score += 1;
    if (/[0-9]/.test(val)) score += 1;
    if (/[^A-Za-z0-9]/.test(val)) score += 1;

    if (score <= 2) return { score: 1, label: "Weak (add letters & numbers)", color: "#e0542f" };
    if (score <= 3) return { score: 2, label: "Medium (good, can be stronger)", color: "#f5b53f" };
    return { score: 3, label: "Strong password", color: "#0a8a4f" };
  }

  // Ensure default users are initialized on first load
  getUsers();

  window.FindITAuth = {
    getUsers,
    saveUsers,
    findUserByEmail,
    register,
    login,
    logout,
    getCurrentUser,
    isLoggedIn,
    requireAuth,
    getRememberedEmail,
    resetPassword,
    evaluatePasswordStrength,
    DEFAULT_USERS
  };
})();
