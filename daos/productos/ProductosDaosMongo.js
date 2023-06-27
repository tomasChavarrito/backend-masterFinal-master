const ContenedorMongoDB = require("../../contenedores/ContenedorMongoDB");
const { productModel } = require("../../models/productModel");

module.exports = class ProductosDaosMongoDB extends ContenedorMongoDB {
  constructor() {
    super(
      `mongodb+srv://Frauseano:wANgPcp1nM05DXXP@frangfdbs.vnwag.mongodb.net/?retryWrites=true&w=majority`,
      "ecommerce",
      productModel
    );
  }
};
