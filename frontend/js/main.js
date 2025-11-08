/* main.js
 - handles login & signup UX (frontend-only)
 - replace fetch() endpoints with your backend routes when ready.
*/

document.addEventListener("DOMContentLoaded", () => {
  // Toggle password visibility
  const toggle = document.getElementById("togglePw");
  if (toggle) {
    toggle.addEventListener("click", () => {
      const pw = document.getElementById("loginPassword");
      if (!pw) return;
      pw.type = pw.type === "password" ? "text" : "password";
    });
  }

  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const email = loginForm.email.value.trim();
      const password = loginForm.password.value;
      const msg = document.getElementById("loginMsg");
      msg.textContent = "";

      // small client-side validation
      if (!email || !password) {
        msg.textContent = "Please fill in both fields.";
        return;
      }

      // Demo behaviour:
      if (email === "demo@ecotrack.org" && password === "demo1234") {
        // local redirect for demo
        window.location.href = "dashboard.html";
      } else {
        msg.textContent =
          "Invalid credentials (demo credentials: demo@ecotrack.org / demo1234)";
      }
    });
  }

  const signupForm = document.getElementById("signupForm");
  if (signupForm) {
    signupForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const msg = document.getElementById("signupMsg");
      msg.textContent = "";
      const data = {
        firstName: signupForm.firstName.value.trim(),
        lastName: signupForm.lastName.value.trim(),
        email: signupForm.email.value.trim(),
        password: signupForm.password.value,
      };
      if (!data.email || !data.password) {
        msg.textContent = "Please provide an email and password.";
        return;
      }

      // Demo: show success and redirect
      msg.style.color = "green";
      msg.textContent = "Account created (demo). Redirecting…";
      setTimeout(() => (window.location.href = "dashboard.html"), 1000);

      // Real integration (example):
      // await fetch('/api/auth/signup', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(data)});
    });
  }

  // small stat fetch for login page
  if (document.getElementById("statSpecies")) {
    document.getElementById("statSpecies").textContent = "32";
    document.getElementById("statAnimals").textContent = "128";
  }

  // logout btn on dashboard
  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      // front-end demo; clear any session tokens in real app
      window.location.href = "../index.html";
    });
  }
});
