const mongoose = require("mongoose");

module.exports = class ContenedorMongoDB {
  constructor(url, collectionName, model) {
    this.collectionName = collectionName;
    this.URL = `${url}/${collectionName}?retryWrites=true&w=majority`;
    this.model = model;
  }

  save = async (object) => {
    try {
      await mongoose.connect(this.URL, { useNewUrlParser: true }, (err) => {
        if (err) throw new Error(err.message);
      });
      const document = this.model(object);
      const validation = await document.validate();
      if (!validation) {
        return await document.save();
      } else {
        throw new Error(validation);
      }
    } catch (err) {
      console.error(err.message);
    }
  };

  getAll = async () => {
    try {
      await mongoose.connect(this.URL, { useNewUrlParser: true }, (err) => {
        if (err) throw new Error(err.message);
      });
      const objects = await this.model.find();
      return objects;
    } catch (err) {
      console.error(err.message);
    }
  };

  getById = async (id) => {
    try {
      await mongoose.connect(this.URL, { useNewUrlParser: true }, (err) => {
        if (err) throw new Error(err.message);
      });
      const object = await this.model.findOne({
        _id: mongoose.Types.ObjectId(id),
      });
      return object;
    } catch (err) {
      console.error(err.message);
    }
  };

  update = async (id, object) => {
    try {
      await mongoose.connect(this.URL, { useNewUrlParser: true }, (err) => {
        if (err) throw new Error(err.message);
      });
      const updatedObject = await this.model.updateOne(
        { _id: mongoose.Types.ObjectId(id) },
        { $set: { ...object } }
      );
      return updatedObject;
    } catch (err) {
      console.error(err.message);
    }
  };

  deleteById = async (id) => {
    try {
      await mongoose.connect(this.URL, { useNewUrlParser: true }, (err) => {
        if (err) throw new Error(err.message);
      });
      await this.model.deleteOne({ _id: mongoose.Types.ObjectId(id) });
    } catch (err) {
      console.error(err.message);
    }
  };

  deleteAll = async () => {
    try {
      await mongoose.connect(this.URL, { useNewUrlParser: true }, (err) => {
        if (err) throw new Error(err.message);
      });
      await this.model.deleteMany({});
    } catch (err) {
      console.error(err.message);
    }
  };
};
