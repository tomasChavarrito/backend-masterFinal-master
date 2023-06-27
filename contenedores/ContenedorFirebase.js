module.exports = class ContenedorFirebase {
  constructor(collectionName) {
    this.admin = require('firebase-admin');
    this.db = this.admin.firestore();
    this.collection = this.db.collection(collectionName);
  }

  save = async (object) => {
    try {
      await this.collection.add(object);
    } catch (err) {
      console.error(err.message);
    }
  };

  getAll = async () => {
    try {
      const getDocs = await this.collection.get();
      return getDocs.docs.map((doc) => {
        return { ...doc.data(), id: doc.id };
      });
    } catch (err) {
      console.error(err.message);
    }
  };

  getById = async (id) => {
    try {
      const findQuery = this.collection.doc(`${id}`);
      const doc = await findQuery.get();
      return {...doc.data(), id: doc.id};
    } catch (err) {
      console.error(err.message);
    }
  };

  update = async (id, object) => {
    try {
      const findQuery = this.collection.doc(`${id}`);
      const doc = await findQuery.update({ ...object });
    } catch (err) {
      console.error(err.message);
    }
  };

  deleteById = async (id) => {
    try {
      const findQuery = this.collection.doc(`${id}`);
      await findQuery.delete();
    } catch (err) {
      console.error(err.message);
    }
  };

  deleteAll = async () => {
    try {
      const batch = this.db.batch();
      const snapshot = await this.collection.get();

      snapshot.docs.forEach((doc) => {
        batch.delete(doc.ref);
      });

      await batch.commit();
    } catch (err) {
      console.error(err.message);
    }
  };
};
