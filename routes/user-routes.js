const express = require("express");

const { check } = require("express-validator");

//IMPORT FILES MIDDLEWARE
const fileUpload= require("../middlewares/file-upload");

//CREATER ROUTER OBJECT
const route = express.Router();

//FUNCTIONS ARE WRITTEN IN CONTROLLER
const userControler = require("../controllers/users-controller");

//DECLARE ROUTER SOME GET AND POST METHODS
route.get("/", userControler.Home);

// CALL FILE UPLOAD MIDDLE WARE TO CONVERT IMAGE ATTRIBUTE WHICH IS BINARY
// TO ACTUAL IMAGE
route.post("/signup",fileUpload.single("image")  ,[
    check("email").normalizeEmail().isEmail(),
    check("password").isLength({ min: 5 }),
  ] ,userControler.createUser);

route.post(
  "/login",
  userControler.loginUser
);

module.exports = route;
