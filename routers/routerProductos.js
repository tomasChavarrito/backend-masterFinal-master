const { Router } = require("express");
const routerProductos = Router();
const { products: contenedorProductos } = require("../daos")();
const middlewares = require("../middlewares.js");

module.exports = routerProductos.get("/", async (req, res) => {
  try {
    const productos = await contenedorProductos.getAll();
    res.json(productos);
  } catch {
    res.status(404).send({ error: "Couldn't get products!" });
  }
});

routerProductos.get("/:id", async (req, res) => {
  try {
    const producto = await contenedorProductos.getById(req.params.id);
    res.json(producto);
  } catch {
    res.status(404).send({ error: "Product not found!" });
  }
});

routerProductos.post("/", middlewares.validarProducto(), async (req, res) => {
  const { admin } = req.body;
  const { name, price, description, photoUrl, stock, code } = req.body;
  const timestamp = new Date(Date.now()).toLocaleString();
  admin
    ? await contenedorProductos.save(
        {
          name,
          price,
          description,
          photoUrl,
          stock,
          code,
          timestamp,
        },
        res.json({ success: true })
      )
    : res.status(401).json({
        error: "Unauthorized - You don't have permission to post products",
      });
});

routerProductos.put("/:id", async (req, res) => {
  const { admin } = req.body;
  const object = req.body;
  delete object.admin;
  const timestamp = new Date(Date.now()).toLocaleString();
  try {
    admin
      ? (await contenedorProductos.update(req.params.id, {
          ...object,
          timestamp,
        }),
        res.json(await contenedorProductos.getById(req.params.id)))
      : res.status(401).json({
          error: "Unauthorized - You don't have permission to update products",
        });
  } catch {
    res.status(404).json({ error: "Product not found!" });
  }
});

routerProductos.delete("/:id", async (req, res) => {
  const { admin } = req.body;
  try {
    admin
      ? (await contenedorProductos.deleteById(req.params.id),
        res.json({ success: true }))
      : res.status(401).json({
          error: "Unauthorized - You don't have permission to delete products",
        });
  } catch {
    res.status(404).json({ error: "Product not found!" });
  }
});
