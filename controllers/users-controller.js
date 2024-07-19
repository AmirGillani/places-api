const HttpsError = require("../models/https-errors");

const { validationResult } = require("express-validator");

const USER_MODEL = require("../models/users");

const HttpsErrors = require("../models/https-errors");

const bcrypt = require("bcryptjs");

const jwt = require("jsonwebtoken");

const Home = async (req, res) => {
  // PASSWORDS WILL NOT BE FETCHED

  const users = await USER_MODEL.find({}, { password: 0 });

  res.status(200).json({
    users: users.map((user) => {
      return user.toObject({ getters: true });
    }),
  });
};

const createUser = async (req, res, next) => {
  const result = validationResult(req);

  if (!result.isEmpty()) {
    throw new HttpsError("Validation Error", 403);
  }

  const { name, email, password, places } = req.body;

  let foundUser;

  try {
    foundUser = await USER_MODEL.findOne({ email: email });
  } catch (error) {
    error = new HttpsErrors("error while signup", 400);
    return error;
  }

  if (foundUser) {
    return next(new HttpsError("User Exits", 401));
  }

  let hashPassword;

  try {
    hashPassword = await bcrypt.hash(password, 12);
  } catch (err) {
    const error = new HttpsError("Signup failed try again later !!", 500);

    return next(error);
  }

  const newUser = new USER_MODEL({
    name: name,
    email: email,

    // REQ.FILE.PATH VALUE EQUALS TO UPLOADS/IMAGES/IMAGNAME.JPG
    image: req.file.path,
    password: hashPassword,
    places: places,
  });

  try {
    newUser.save();
  } catch (err) {}

  let token;

  try {
    token = jwt.sign(
      { userId: newUser.id, userEmail: newUser.email },
      "supersecret_dont_share",
      { expiresIn: "1h" }
    );
  } catch (err) {
    const error = new HttpsError("Signup failed try again later !!", 500);

    return next(error);
  }

  res
    .status(201)
    .json({ userId: newUser.id, email: newUser.email, token: token });
};

const loginUser = async (req, res, next) => {
  const { email, password } = req.body;

  let foundUser;

  try {
    foundUser = await USER_MODEL.findOne({ email: email });
  } catch (error) {
    error = new HttpsErrors("error while signup", 400);
    return error;
  }

  if (!foundUser) {
    return next(new HttpsError("Invalid Credentials", 401));
  }

  let isValid;

  try {
    isValid = await bcrypt.compare(password, foundUser.password);
  } catch (err) {
    return next(new HttpsError("Error while loging in !!", 500));
  }

  if (!isValid) {
    return next(new HttpsError("Invalid Credentials", 401));
  }

  let token;

  try {
    token = jwt.sign(
      { userId: foundUser.id, userEmail: foundUser.email },
      "supersecret_dont_share",
      { expiresIn: "1h" }
    );
  } catch (err) {
    const error = new HttpsError("Login failed try again later !!", 500);

    return next(error);
  }

  res.status(200).json({ userId:foundUser.id , useEmail: foundUser.email , token: token  });
};

module.exports.Home = Home;
module.exports.createUser = createUser;
module.exports.loginUser = loginUser;
