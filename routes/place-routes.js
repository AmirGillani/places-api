const express = require("express");

const fileUpload = require("../middlewares/file-upload");

// IMPORT CHECK METHOD
const { check } = require("express-validator");

const checkAuth = require("../middlewares/check-auth");

//CREATER ROUTER OBJECT
const route = express.Router();

//FUNCTIONS ARE WRITTEN IN CONTROLLER
const placeControler = require("../controllers/places-controller");

//DECLARE ROUTER SOME GET AND POST METHODS

route.get("/", placeControler.Home);

route.get("/:placeid", placeControler.foundPlaceById);

route.get("/user/:userid", placeControler.foundUserPlaces);

// CALL MIDDLEWARE TO CHECK USER HAS TOKEN OR NOT

route.use(checkAuth);


//APPLY CHECK METHOD FOR VALIDATION

//check('title').not().isEmpty(), check("description").isLength({ min: 5 })
route.post(
  "/",fileUpload.single("image"),
  [check('title').not().isEmpty(), check("description").isLength({ min: 5 })],
  placeControler.createPlace
);

route.patch("/:placeid", placeControler.updatePlace);

route.delete("/:placeid", placeControler.deletePlace);

module.exports = route;
