const CarritosDaosArchivo = require("./carritos/CarritosDaosArchivo");
const CarritosDaosFirebase = require("./carritos/CarritosDaosFirebase");
const CarritosDaosMemoria = require("./carritos/CarritosDaosMemoria");
const CarritosDaosMongo = require("./carritos/CarritosDaosMongo");
const CarritosDaosMySQL = require("./carritos/CarritosDaosMySQL");
const CarritosDaosSQLite = require("./carritos/CarritosDaosSQLite");

const ProductosDaosArchivo = require("./productos/ProductosDaosArchivo");
const ProductosDaosFirebase = require("./productos/ProductosDaosFirebase");
const ProductosDaosMemoria = require("./productos/ProductosDaosMemoria");
const ProductosDaosMongo = require("./productos/ProductosDaosMongo");
const ProductosDaosMySQL = require("./productos/ProductosDaosMySQL");
const ProductosDaosSQLite = require("./productos/ProductosDaosSQLite");

module.exports = getStorage = () => {
  const storage = process.env.STORAGE || "archivo";
  switch (storage) {
    case "archivo":
      return {
        products: new ProductosDaosArchivo(),
        carts: new CarritosDaosArchivo(),
      };
      break;
    case "memoria":
      return {
        products: new ProductosDaosMemoria(),
        carts: new CarritosDaosMemoria(),
      };
      break;
    case "firebase":
      return {
        products: new ProductosDaosFirebase(),
        carts: new CarritosDaosFirebase(),
      };
      break;
    case "mongodb":
      return {
        products: new ProductosDaosMongo(),
        carts: new CarritosDaosMongo(),
      };
      break;
    case "mysql":
      return {
        products: new ProductosDaosMySQL(),
        carts: new CarritosDaosMySQL(),
      };
      break;
    case "sqlite":
      return {
        products: new ProductosDaosSQLite(),
        carts: new CarritosDaosSQLite(),
      };
      break;
  }
};
