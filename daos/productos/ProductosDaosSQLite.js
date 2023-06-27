const ContenedorSQL = require("../../contenedores/ContenedorSQL");
const { sqliteConfig } = require("../../config/dbconfigs");
const {
  productSchemaSQL: productSchema,
} = require("../../models/productModel");

module.exports = class ProductosDaosMySQL extends ContenedorSQL {
  constructor() {
    super(sqliteConfig, "products", productSchema);
  }
};
