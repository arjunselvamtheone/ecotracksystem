// main.js — simple demo login/signup UX (replace with real auth later)
document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const email = loginForm.email.value.trim();
      const password = loginForm.password.value.trim();
      const msg = document.getElementById("loginMsg");
      if (email === "demo@ecotrack.org" && password === "demo1234") {
        location.href = "dashboard.html";
      } else {
        msg.textContent =
          "Invalid credentials (demo: demo@ecotrack.org / demo1234)";
      }
    });
  }

  const signupForm = document.getElementById("signupForm");
  if (signupForm) {
    signupForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const msg = document.getElementById("signupMsg");
      msg.style.color = "#2e8a56";
      msg.textContent = "Account created (demo). Redirecting…";
      setTimeout(() => (location.href = "dashboard.html"), 900);
    });
  }
});
