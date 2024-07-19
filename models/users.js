const mongoose = require("mongoose");

const uniqueValidator = require("mongoose-unique-validator");

const schema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, min: 3 },
  image: { type: String, required: true },
  places: [{ type: mongoose.Types.ObjectId , ref:"place"}],
});

schema.plugin(uniqueValidator);

const USER_MODEL = mongoose.model("user", schema);

module.exports = USER_MODEL;
