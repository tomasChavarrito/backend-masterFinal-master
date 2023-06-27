const ContenedorSQL = require('../../contenedores/ContenedorSQL');
const { mysqlConfig } = require('../../config/dbconfigs');
const {
    cartSchemaSQL: cartSchema,
  } = require("../../models/cartModel");

module.exports = class CarritosDaosMySQL extends ContenedorSQL{
    constructor(){
        super(mysqlConfig, 'carts', cartSchema);
    }
}