const ContenedorMemoria = require('../../contenedores/ContenedorMemoria');

module.exports = class ProductosDaosMemoria extends ContenedorMemoria{
    constructor(){
        super([]);
    }
}