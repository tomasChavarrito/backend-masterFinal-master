const ContenedorMongoDB = require("../../contenedores/ContenedorMongoDB");
const { cartModel } = require("../../models/cartModel");

module.exports = class CarritosDaosMongoDB extends ContenedorMongoDB {
  constructor() {
    super(
      `mongodb+srv://Frauseano:wANgPcp1nM05DXXP@frangfdbs.vnwag.mongodb.net/?retryWrites=true&w=majority`,
      "ecommerce",
      cartModel
    );
  }
};
