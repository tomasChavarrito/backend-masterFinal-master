module.exports = class ContenedorMemoria {
  constructor(objects = []) {
    this.objects = objects;
  }

  save = (object) => {
    const currentObject = { ...object, id: this.objects.length + 1 };
    this.objects.push(currentObject);
    return currentObject;
  };

  getAll = () => this.objects;

  getById = (reqId) => {
    if (this.objects.some(({ id }) => id == reqId)) {
      return this.objects.find(({ id }) => id == reqId);
    } else {
      throw new Error("ID not found");
    }
  };

  update = (reqId, updatedObject) => {
    if (this.objects.some(({ id }) => id == reqId)) {
      this.objects = this.objects.map((object) => {
        return object.id == reqId
          ? { ...object, ...updatedObject, id: reqId }
          : object;
      });
      return this.getAll();
    } else {
      throw new Error("ID not found");
    }
  };

  deleteById = (reqId) => {
    if (this.objects.some(({ id }) => id == reqId)) {
      this.objects.splice(
        this.objects.indexOf(
          this.objects.find((object) => object.id == reqId)
        ),
        1
      );
    } else {
      throw new Error("ID not found");
    }
  };

  deleteAll = () => (this.objects = []);
};
