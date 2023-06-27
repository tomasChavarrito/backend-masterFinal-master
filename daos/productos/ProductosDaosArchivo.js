const ContenedorArchivo = require('../../contenedores/ContenedorArchivo');

module.exports = class ProductosDaosArchivo extends ContenedorArchivo{
    constructor(){
        super(`./DB/productos.json`);
    }
}