const ContenedorFirebase = require('../../contenedores/ContenedorFirebase');

module.exports = class ProductosDaosFirebase extends ContenedorFirebase{
    constructor(){
        super('productos');
    }
}