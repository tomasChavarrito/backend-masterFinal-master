const contenedorProductos = document.querySelector("#contenedorProductos");
const contenedorProductosCarrito = document.querySelector(
  "#contenedorProductosCarrito"
);
const cartItemCount = document.querySelector("#cartItemCount");
const agregarProducto = document.querySelector("#agregarProducto");
const headerAdmin = document.querySelector("#iniciarAdmin");
const contenedorPerfil = document.querySelector("#contenedorPerfil");

(async () => {
  try {
    const request = await fetch("http://localhost:8080/api/cuenta/verify");
    const { authentication } = await request.json();

    if (!authentication) {
      location.href = "./login.html";
    }
  } catch (e) {
    console.error(e.message);
  }
})();

const getCartId = async () => {
  const clientId = sessionStorage.getItem("clientId");
  const request = await fetch(`http://localhost:8080/api/carrito/${clientId}`);
  const { cartId } = await request.json();

  if (cartId) {
    sessionStorage.setItem("cartId", cartId);
  } else {
    const request = await fetch(
      `http://localhost:8080/api/carrito/?clientId=${clientId}`,
      { method: "POST" }
    );
    const { id } = await request.json();

    sessionStorage.setItem("cartId", id);
  }
};

let admin = false;

if (!admin) {
  agregarProducto.parentElement.removeChild(agregarProducto);
}

const renderPerfil = async () => {
  const request = await fetch("http://localhost:8080/api/cuenta/perfil");
  const response = await request.json();

  contenedorPerfil.innerHTML += `
  <div class="text-center">
  <img src="http://localhost:8080${response.avatar.replace(
    "/public",
    ""
  )}" alt="avatar" class="avatarImg"/>
  </div>
  <h4>Nombre</h4>
  <p>${response.name}</p>
  <h4>Correo</h4>
  <p>${response.username}</p>
  <h4>Edad</h4>
  <p>${response.age}</p>
  <h4>Direccion</h4>
  <p>${response.address}</p>
  <h4>Telefono</h4>
  <p>${response.cellphone}</p>
  
  <button class="btn btn-dark btnLogout">Cerrar Sesión</button>`;
};

const logout = async (e) => {
  if (!e.target.matches(".btnLogout")) return;

  await fetch("http://localhost:8080/api/cuenta/logout");

  location.href = "./login.html";
};

const renderCarrito = async () => {
  const cartId = sessionStorage.getItem("cartId");
  document.querySelector("#cartId").innerHTML = cartId;
  const cartRef = await fetch(
    `http://localhost:8080/api/carrito/${cartId}/productos`
  );
  const cartProducts = await cartRef.json();

  cartItemCount.innerHTML = cartProducts.length;

  const cartProductsAux = [];

  for (let p of cartProducts) {
    const indice = cartProductsAux.indexOf(
      cartProductsAux.find((product) => {
        return "_id" in p ? product._id === p._id : product.id === p.id;
      })
    );
    indice !== -1
      ? (cartProductsAux[indice] = {
          ...p,
          quantity: cartProductsAux[indice].quantity + 1,
        })
      : cartProductsAux.push({ ...p, quantity: 1 });
  }

  if (cartProductsAux.length) {
    const cartRows = cartProductsAux
      .map((product) => {
        return `<tr>
            <th scope="row">${product.quantity}</th>
            <td>${product.name}</td>
            <td>$${product.price}</td>
            <td style="cursor: pointer" data-id="${
              product.id || product._id
            }" class="btnEliminarProducto">X</td>
            </tr>`;
      })
      .join("\n");

    contenedorProductosCarrito.innerHTML = `<table class="table">
        <thead>
          <tr>
            <th scope="col">Cant</th>
            <th scope="col">Name</th>
            <th scope="col">Price</th>
            <th></th>
          </tr>
        </thead>
        <tbody id="cartTableBody">
            ${cartRows}
        </tbody>
      </table>`;
  } else {
    contenedorProductosCarrito.innerHTML = `<h4 class="text-danger">Su carrito esta vacio!</h4>`;
  }
};

const renderProductos = async () => {
  const productosRef = await fetch("http://localhost:8080/api/productos");
  const productos = await productosRef.json();
  contenedorProductos.innerHTML = "";
  for (let p of productos) {
    const card = document.createElement("div");
    card.classList = "col-8 col-lg-5 col-xl-3 mb-5";
    card.innerHTML = `<div class="card h-100">
        <!-- Product image-->
        <img class="card-img-top p-2" style="height: 200px" src=${
          p.photoUrl
        } alt=${p.description} />
        <!-- Product details-->
        <div class="card-body p-4">
            <div class="text-center">
                <!-- Product name-->
                <h5 class="fw-bolder">${p.name}</h5>
                <!-- Product info-->
                <p>${p.description}</p>
                <p>Stock: ${p.stock}</p>
                <p>Codigo: ${p.code}</p>
                <p>Actualizado: ${p.timestamp}</p>
                <!-- Product price-->
                $${p.price}
            </div>
        </div>
        <!-- Product actions-->
        <div class="card-footer p-4 pt-0 border-top-0 bg-transparent">
            <div class="text-center">
            <a class="btn btn-outline-dark mt-auto btnAgregar" data-id="${
              p.id || p._id
            }">Add to cart</a>
            <a class="btn btn-outline-dark mt-auto btnBorrarProducto bi bi-trash ${
              admin ? "" : "disabled"
            }" data-id="${p.id || p._id}"></a>
            <a class="btn btn-outline-dark mt-auto btnEditarProducto bi bi-pencil ${
              admin ? "" : "disabled"
            }" data-id="${p.id || p._id}"></a>
            </div>
        </div>
    </div>`;
    contenedorProductos.appendChild(card);
  }
};

const agregarAlCarrito = async (e) => {
  if (!e.target.matches(".btnAgregar")) return;
  const cartId = sessionStorage.getItem("cartId");
  const idProducto = e.target.dataset.id;
  const productoRef = await fetch(
    `http://localhost:8080/api/productos/${idProducto}`
  );
  const producto = await productoRef.json();
  if ("_id" in producto) {
    producto.id = producto._id;
    delete producto._id;
  }
  const cartRef = await fetch(
    `http://localhost:8080/api/carrito/${cartId}/productos`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(producto),
    }
  );
  renderCarrito();
};

const eliminarDelCarrito = async (e) => {
  if (!e.target.matches(".btnEliminarProducto")) return;
  const cartId = sessionStorage.getItem("cartId");
  const idProducto = e.target.dataset.id;
  const cartRef = await fetch(
    `http://localhost:8080/api/carrito/${cartId}/productos/${idProducto}`,
    {
      method: "DELETE",
    }
  );
  renderCarrito();
};

const crearCarrito = async (e) => {
  if (!e.target.matches(".btnCrearCarrito")) return;
  const cartId = sessionStorage.getItem("cartId");
  localStorage.clear();
  cartId = 0;
  renderCarrito();
};

const eliminarCarrito = async (e) => {
  if (!e.target.matches(".btnEliminarCarrito")) return;
  const cartId = sessionStorage.getItem("cartId");
  const cartRef = await fetch(`http://localhost:8080/api/carrito/${cartId}`, {
    method: "DELETE",
  });
  localStorage.clear();
  if (cartId.id > 1) {
    cartId.id = cartId.id - 1;
    localStorage.setItem("cartId", JSON.stringify(cartId));
  } else {
    cartId = 0;
  }
  renderCarrito();
};

const comprarCarrito = async (e) => {
  if (!e.target.matches(".btnComprarCarrito")) return;
  const cartId = sessionStorage.getItem("cartId");

  const request = await fetch(
    `http://localhost:8080/api/carrito/${cartId}/purchase`
  );
  const response = await request.json();

  if (response.success) {
    alert("Gracias por su compra!");
    renderCarrito();
  } else {
    alert("Hubo un error al procesar su compra vuelva a intentarlo!");
    location.reload();
  }
};

const cargarProducto = async (e) => {
  if (!e.target.matches("#formCargarProducto")) return;
  e.preventDefault();
  const name = e.target[0].value;
  const price = e.target[1].value;
  const stock = e.target[2].value;
  const code = e.target[3].value;
  const description = e.target[4].value;
  const photoUrl = e.target[5].value;

  const productRef = await fetch(`http://localhost:8080/api/productos/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name,
      price,
      stock,
      code,
      description,
      photoUrl,
      admin: true,
    }),
  });
  renderProductos();
};

const iniciarAdmin = (e) => {
  if (!e.target.matches("#formIniciarAdmin")) return;
  e.preventDefault();
  const pass = e.target[0].value;

  if (pass === "asd123") {
    admin = true;
    headerAdmin.replaceWith(agregarProducto);
    renderProductos();
  } else {
    document.querySelector(".infoPass").innerHTML = "Contraseña incorrecta!";
  }
};

const editarProducto = async (e) => {
  if (!e.target.matches("#formEditarProducto")) return;
  e.preventDefault();
  const name = e.target[0].value;
  const price = e.target[1].value;
  const stock = e.target[2].value;
  const code = e.target[3].value;
  const description = e.target[4].value;
  const photoUrl = e.target[5].value;
  const idProducto = e.target.dataset.id;

  const productRef = await fetch(
    `http://localhost:8080/api/productos/${idProducto}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        price,
        stock,
        code,
        description,
        photoUrl,
        admin: true,
      }),
    }
  );
  renderProductos();
};

const borrarProducto = async (e) => {
  if (!e.target.matches(".btnBorrarProducto")) return;
  const idProducto = e.target.dataset.id;

  const productRef = await fetch(
    `http://localhost:8080/api/productos/${idProducto}`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ admin: true }),
    }
  );
  renderProductos();
};

const renderEditarProducto = async (e) => {
  if (!e.target.matches(".btnEditarProducto")) return;
  const idProducto = e.target.dataset.id;
  const productoRef = await fetch(
    `http://localhost:8080/api/productos/${idProducto}`
  );
  const producto = await productoRef.json();
  contenedorProductos.innerHTML = `<form class="row justify-content-center bg-light p-4" id="formEditarProducto" data-id="${
    producto.id || producto._id
  }">
    <h4>Actualizar Producto</h4>
    <div class="mb-3 col-auto">
      <label for="nombre" class="form-label">Nombre</label>
      <input type="text" class="form-control" name="nombre" value="${
        producto.name
      }" required>
    </div>
    <div class="mb-3 col-auto">
      <label for="precio" class="form-label">Precio</label>
      <input type="number" class="form-control" name="precio" value="${
        producto.price
      }" required>
    </div>
    <div class="mb-3 col-auto">
        <label for="stock" class="form-label">Stock</label>
        <input type="number" class="form-control" name="stock" value="${
          producto.stock
        }" required>
      </div>
      <div class="mb-3 col-auto">
                        <label for="stock" class="form-label">Codigo</label>
                        <input type="number" class="form-control" name="code" value="${
                          producto.code
                        }" required>
      </div>
    <div class="mb-3 col-7">
      <label for="description" class="form-label">Descripcion</label>
      <input type="text" class="form-control" name="description" value="${
        producto.description
      }" required>
    </div>
    <div class="mb-3 col-7">
        <label for="imagen" class="form-label">URL de imagen</label>
        <input type="text" class="form-control" name="imagen" value="${
          producto.photoUrl
        }" required>
      </div>
    <button type="submit" class="btn btn-primary">Cargar</button>
  </form>`;
};

window.addEventListener("load", () => {
  renderProductos();
  getCartId();
  renderCarrito();
  renderPerfil();
});

document.addEventListener("click", (e) => {
  agregarAlCarrito(e);
  eliminarDelCarrito(e);
  eliminarCarrito(e);
  crearCarrito(e);
  comprarCarrito(e);
  borrarProducto(e);
  renderEditarProducto(e);
  logout(e);
});

document.addEventListener("submit", (e) => {
  cargarProducto(e);
  editarProducto(e);
  iniciarAdmin(e);
});
