const API_BASE_URL = "http://localhost:5004";
let isAdmin = false;

const checkRole = () => {
  isAdmin = !!localStorage.getItem("token");
  window.isAdmin = isAdmin;
};

function notify(type, message, duration = 5000) {
  const div = document.createElement("div");
  div.innerHTML = `<span>${message}</span><button onclick="this.parentElement.remove()">×</button>`;
  div.classList.add("notify");
  div.classList.add(type);

  // Создаем контейнер если его нет
  let container = document.getElementById("notifications");
  if (!container) {
    container = document.createElement("div");
    container.id = "notifications";
    document.body.appendChild(container);
  }

  container.appendChild(div);
  setTimeout(() => div.remove(), duration);
}

const login = async (email, password) => {
  const btn = document.querySelector("#login-form button");
  btn.disabled = true;
  try {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email.toLowerCase().trim(), password }),
    });
    if (!res.ok) throw new Error(await res.text());
    const { token } = await res.json();
    localStorage.setItem("token", token);
    localStorage.setItem("userEmail", email.toLowerCase().trim());

    console.log("userEmail:", localStorage.getItem("userEmail")); // -----------------

    location.href = "./index.html";
  } catch (e) {
    console.error(e);
  } finally {
    btn.disabled = false;
    btn.textContent = "Войти";
  }
};

const logout = () => {
  localStorage.clear();
  location.href = "./auth.html";
};

document.addEventListener("DOMContentLoaded", () => {
  checkRole();
  const path = window.location.pathname;

  if (!path.includes("product-edit.html")) {
    localStorage.removeItem("currentProduct");
  }

  if (path.includes("auth.html")) {
    if (localStorage.getItem("token")) return (location.href = "./index.html");
    document.getElementById("login-form").onsubmit = (e) => {
      e.preventDefault();
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;
      if (!email || !password) return console.error("Заполните поля");
      login(email, password);
    };
  } else if (path.includes("index.html") || path === "/") {
    if (!localStorage.getItem("token")) return (location.href = "./auth.html");
    document.getElementById("userName").textContent =
      localStorage.getItem("userEmail");
    document.getElementById("logout").addEventListener("click", logout);
  } else if (path.includes("product-edit.html")) {
    if (!localStorage.getItem("token")) return (location.href = "./auth.html");
  }

  // Object.assign(window, { checkRole, logout, API_BASE_URL, isAdmin: false });
  checkRole();
});
