const fs = require("fs/promises");

module.exports = class ContenedorArchivo {
  constructor(route) {
    this.route = route;
  }

  save = async (object) => {
    const objects = await this.getAll();
    const currentId = objects.length + 1;
    const currentObject = { ...object, id: currentId };
    await fs.writeFile(
      this.route,
      JSON.stringify([...objects, currentObject], null, 4),
      "utf8"
    );
    return currentObject;
  };

  getAll = async () => {
    try {
      const file = await fs.readFile(this.route, "utf8");
      return JSON.parse(file);
    } catch {
      console.error("No se encontró el archivo, se creará uno");
      await fs.writeFile(this.route, JSON.stringify([], null, 4), "utf8");
      return [];
    }
  };

  getById = async (reqId) => {
    const objects = await this.getAll();
    return objects.find(({id}) => id == reqId);
  };

  update = async (id, updatedObject) => {
      const objects = await this.getAll();
      const objectsAux = objects.map(object => {
        return object.id == id 
            ? {...object, ...updatedObject, id}
            : object;
      })
      await fs.writeFile(this.route, JSON.stringify(objectsAux, null, 4), "utf8");
      return objectsAux;
  }

  deleteById = async (id) => {
    const objects = await this.getAll();
    const objectsAux = objects.filter(object => object.id != id);
    await fs.writeFile(this.route, JSON.stringify(objectsAux, null, 4), "utf8");
    return objectsAux;
  };

  deleteAll = async () => await fs.writeFile(this.route, JSON.stringify([], null, 4), "utf8");
}

