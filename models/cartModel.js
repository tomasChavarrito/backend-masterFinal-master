const { Schema, model } = require("mongoose");

const cartSchemaSQL = (table) => {
  table.increments("id").primary();
  table.date("timestamp");
};

const cartSchema = new Schema({
  products: [
    {
      name: {
        type: String,
        required: [true, "Product name is required"],
        max: 50,
      },
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
      timestamp: {
        type: Date,
        required: [true, "Product Timestamp is required"],
      },
      _id: { type: String, required: [true, "Product id is required"] }
    },
  ],
  timestamp: { type: Date, required: [true, "Cart Timestamp is required"] },
});

const cartModel = model("Carritos", cartSchema);

module.exports = {
  cartSchemaSQL,
  cartSchema,
  cartModel,
};
