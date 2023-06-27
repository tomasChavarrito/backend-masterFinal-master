const ContenedorSQL = require("../../contenedores/ContenedorSQL");
const { mysqlConfig } = require("../../config/dbconfigs");
const {
  productSchemaSQL: productSchema,
} = require("../../models/productModel");

module.exports = class ProductosDaosMySQL extends ContenedorSQL {
  constructor() {
    super(mysqlConfig, "products", productSchema);
  }
}
