const mongoose = require("mongoose");

const placeSchema = mongoose.Schema({
  title: { type: String, require: true },
  description: { type: String, require: true },
  img: { type: String, require: true },
  location: { type: String, require: true },
  coordinates: {
    lat: { type: Number, require: true },
    lng: { type: Number, require: true },
  },
  creator: { type: mongoose.Types.ObjectId, require: true, ref: "user" },
});

const PLACE_MODEL = mongoose.model("place", placeSchema);

module.exports = PLACE_MODEL;
