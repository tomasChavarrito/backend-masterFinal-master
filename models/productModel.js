const { Schema, model } = require("mongoose");

const productSchemaSQL = (table) => {
  table.increments("id").primary();
  table.string("name", 35);
  table.float("price");
  table.string("description", 255);
  table.string("photoUrl", 255);
  table.string("code", 15);
  table.integer("stock");
  table.date("timestamp");
};

const productSchema = new Schema({
  name: { type: String, required: [true, "Product name is required"], max: 50 },
  price: { type: Number, required: [true, "Product price is required"] },
  description: {
    type: String,
    required: [true, "Product description is required"],
    max: 255,
  },
  photoUrl: {
    type: String,
    required: [true, "Product Photo Url is required"],
    max: 255,
  },
  code: { type: String, required: [true, "Product code is required"] },
  stock: { type: Number, required: [true, "Product stock is required"] },
  timestamp: { type: Date, required: [true, "Product Timestamp is required"] }
});

const productModel = model("Productos", productSchema);

module.exports = {
  productSchemaSQL,
  productSchema,
  productModel,
};
