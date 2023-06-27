const ContenedorFirebase = require("../../contenedores/ContenedorFirebase");

module.exports = class CarritosDaosFirebase extends ContenedorFirebase {
  constructor() {
    super("carritos");
  }
}
