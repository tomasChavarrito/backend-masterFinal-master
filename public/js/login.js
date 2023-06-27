(async () => {
  try {
    const request = await fetch("http://localhost:8080/api/cuenta/verify");
    const { authentication } = await request.json();

    if (authentication) {
      location.href = "./";
    }
  } catch (e) {
    console.error(e.message);
  }
})();

const login = async (e) => {
  if (!e.target.matches(".loginForm")) return;
  e.preventDefault();

  const { username, password } = e.target;

  const request = await fetch("http://localhost:8080/api/cuenta/login", {
    method: "POST",
    body: JSON.stringify({
      username: username.value,
      password: password.value,
    }),
    headers: { "Content-Type": "application/json" },
  });
  const response = await request.json();

  if (response.success) {
    sessionStorage.setItem("clientId", response.clientId);
    alert("Ingresaste correctamente!");
    location.href = "./";
  } else {
    alert("Error al iniciar sesión!");
  }
};

const createNew = async (e) => {
  if (!e.target.matches(".newForm")) return;
  e.preventDefault();

  const avatar = e.target.avatar.files[0];
  const { username, password, cellphone, address, name, age } = e.target;

  const formData = new FormData();

  formData.append("avatar", avatar);
  formData.append("username", username.value);
  formData.append("password", password.value);
  formData.append("address", address.value);
  formData.append("name", name.value);
  formData.append("cellphone", cellphone.value);
  formData.append("age", age.value);

  const request = await fetch("http://localhost:8080/api/cuenta/nuevo", {
    method: "POST",
    body: formData,
  });
  const response = await request.json();

  if (response.success) {
    alert("Se creo la cuenta correctamente!");
    location.href = "./login.html";
  } else {
    alert("Error al crear la cuenta!");
  }
};

document.addEventListener("submit", (e) => {
  login(e);
  createNew(e);
});
