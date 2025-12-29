class User {
  async register(userData) {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      notify("error", `HTTP error! status: ${response.status}`);
    } else {
      notify("success", "Успешно");
    }
  }
}

const user = new User();
document.addEventListener("DOMContentLoaded", async () => {
  if (localStorage.getItem("token")) {
    const usersPanel = document.getElementById("user-panel");
    usersPanel.insertAdjacentHTML(
      "afterbegin",
      `<div class="user-btn-container" id="user-btn-container">
        <button class="user-btn" id="open-form">Добавить</button>
      </div>
      <div class="form-container invisible" id="form-container">
        <form class="register-form" id="register-form">
            <div class="form-item"><label for="">E-mail</label> <input id="new-email" type="email" /></div>
            <div class="form-item"><label for="">Пароль</label> <input id="new-password" type="password" /></div>
            <button class="register" type="submit" id="register">Зарегистрировать</button>
        </form>
    </div>`
    );

    const openFormBtn = document.getElementById("open-form");
    openFormBtn.addEventListener("click", async () => {
      const registerForm = document.getElementById("form-container");
      registerForm.classList.remove("invisible");
    });

    document.getElementById("register").addEventListener("click", async (e) => {
      e.preventDefault();

      const email = document.getElementById("new-email").value;
      const password = document.getElementById("new-password").value;

      const userData = {
        email: email,
        password: password,
      };

      await user.register(userData);
      const registerForm = document.getElementById("form-container");
        document.getElementById("register-form").reset();
      registerForm.classList.add("invisible");
    });
  }
});
