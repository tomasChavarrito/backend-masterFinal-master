module.exports = class ContenedorSQL {
  constructor(config, tableName, tableSchema) {
    this.knex = require("knex")(config);
    this.tableName = tableName;
    this.tableSchema = tableSchema;
  }

  verifyTable = async () => {
    try {
      const tableExists = await this.knex.schema.hasTable(this.tableName);

      tableExists ||
        (await this.knex.schema.createTable(this.tableName, this.tableSchema));
    } catch (e) {
      console.error(e.message);
    }
  };

  save = async (object) => {
    try {
      await this.verifyTable();
      await this.knex(`${this.tableName}`).insert(object);
    } catch (e) {
      console.error(e.message);
    }
  };

  getAll = async () => {
    try {
      await this.verifyTable();
      const dataPackets = await this.knex.select("*").from(`${this.tableName}`);
      return dataPackets.map((dataPacket) => ({ ...dataPacket }));
    } catch (e) {
      console.error(e.message);
      return [];
    }
  };

  update = async (object, id) => {
    try {
      await this.verifyTable();
      await this.knex.update(object).from(`${this.tableName}`).where("id", id);
    } catch (e) {
      console.error(e.message);
    }
  };

  getById = async (id) => {
    try {
      await this.verifyTable();
      return await this.knex
        .select("*")
        .from(`${this.tableName}`)
        .where("id", id);
    } catch (e) {
      console.error(e.message);
    }
  };

  deleteById = async (id) => {
    try {
      await this.verifyTable();
      await this.knex.del().from(`${this.tableName}`).where("id", id);
    } catch (e) {
      console.error(e.message);
    }
  };

  deleteAll = async () => {
    try {
      await this.verifyTable();
      await this.knex.del().from(`${this.tableName}`);
    } catch (e) {
      console.error(e.message);
    }
  };

  disconnect = async () => {
    await this.knex.destroy();
  }
};
