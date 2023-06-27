const ContenedorSQL = require("../../contenedores/ContenedorSQL");
const { sqliteConfig } = require("../../config/dbconfigs");
const { cartSchemaSQL: cartSchema } = require("../../models/cartModel");

module.exports = class CarritosDaosMySQL extends ContenedorSQL {
  constructor() {
    super(sqliteConfig, "carts", cartSchema);
  }
};
