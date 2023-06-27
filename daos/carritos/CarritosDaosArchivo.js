const ContenedorArchivo = require('../../contenedores/ContenedorArchivo');

module.exports = class CarritosDaosArchivo extends ContenedorArchivo{
    constructor(){
        super(`./DB/carritos.json`);
    }
}