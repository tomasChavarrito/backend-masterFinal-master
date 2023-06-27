const { model, Schema } = require("mongoose");

const userSchema = new Schema({
  username: { type: "string" },
  password: { type: "string" },
  name: { type: "string" },
  age: { type: "number"},
  cellphone: { type: "number"},
  address: { type: "string"},
  avatar: { type: "string"}
});

module.exports = model("User", userSchema);