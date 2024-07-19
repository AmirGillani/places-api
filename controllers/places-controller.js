const HttpsErrors = require("../models/https-errors");

const PLACE_MODEL = require("../models/places");

const USER_MODEL = require("../models/users");

const { validationResult } = require("express-validator");

const claudinary =require('cloudinary').v2;

const mongoose = require("mongoose");

const fs = require("fs");

const uuid = require("uuid");

function Home(req, res) {
  res.json({ routes: "home" });
}

async function foundPlaceById(req, res, next) {
  const placeId = req.params.placeid;

  let found;

  try {
    found = await PLACE_MODEL.findById(placeId);
  } catch (err) {
    const error = new HttpsErrors("Not Found Place", 500);
    return next(error);
  }
  if (!found) {
    return next(new HttpsErrors("Not Found", 404));
  }
  res.status(200).json({ place: found.toObject({ getters: true }) });
}

async function foundUserPlaces(req, res, next) {
  const userid = req.params.userid;
  let found;
  try {
    found = await PLACE_MODEL.find({ creator: userid });
  } catch (err) {
    const error = new HttpsErrors("could not find user places", 500);
    return next(error);
  }

  if (!found) {
    // return res.status(404).json({ message: "Not Found" });
    const error = new Error("User Places Not Found");
    error.code = "404";
    // throw error;
    return next(error);
  }
  res.status(201).json(found.map((place)=>{return place.toObject({ getters: true })}));
}

async function createPlace(req, res, next) {
  const result = validationResult(req);

  let uploadResult='';

  try {

    // Upload an image
    uploadResult = await claudinary.uploader
   .upload(req.file.path);
    
  } catch (error) {
   
     // throw error;
     return next(error);
  }

  if (!result.isEmpty()) {
    throw new HttpsErrors("Validation Error", 403);
  }

  const { title, description, location, creator } = req.body;

  console.log("creator id :" + creator);
  
  const newPost = new PLACE_MODEL({
    title: title,
    description: description,
    img: uploadResult.secure_url,
    location: location,
    coordinates: {
      lat: 48.8674,
      lng: -2.7836,
    },
    creator: creator,
  });

  let creatorUser;

  try {
    creatorUser = await USER_MODEL.findById(creator);
    console.log("Creator :" + creatorUser);
  } catch (err) {
    const error = new HttpsErrors("User Not Found", 404);
    return next(error);
  }

  if(!creatorUser)
  {
    const error = new HttpsErrors("creating new place failed", 500);
    return next(error);
  }
  try {
    await newPost.save();

    creatorUser.places.push(newPost);

    await creatorUser.save();
  } catch (err) {
    const error = new HttpsErrors("creating new place failed", 500);
    return next(error);
  }

  return res.status(201).json(newPost);
}

async function updatePlace(req, res, next) {
  const { title, description } = req.body;

  const foundId = req.params.placeid;

  //foundPlace will store orignal data of DUMMY_PLACES
  //as DUMMY_PLACES is array of objects and both are reference data types
  //so if we change foundPlace then DUMMY_PLACES will be changed directly
  //so we should have a copy of DUMMY_PLACES by using spread operator
  let foundPlace;

  try {
    foundPlace = await PLACE_MODEL.findById(foundId);
    console.log(foundPlace);
  } catch (error) {
    error = new HttpsErrors("Error while updating !!", 500);
    return next(error);
  }

   // CHECK IF USER UPDATING POST IS ACTUALLY CREATOR OF THE POST OR NOT

  if(foundPlace.creator.toString() !== req.userData.userId)
  {
    error = new HttpsErrors("You are not the owner !!", 401);
    return next(error);
  }

  foundPlace.title = title;
  foundPlace.description = description;
  try {
    await foundPlace.save();
  } catch (error) {
    error = new HttpsErrors("Error while updating", 500);
    return next(error);
  }
  res.status(200).json(foundPlace.toObject({ getters: true }));
}

async function deletePlace(req, res, next) {

  const placeId = req.params.placeid;

  const foundRecord = await PLACE_MODEL.findById(placeId).populate("creator");

  console.log(foundRecord);

  if(!foundRecord)
  {
    error = new HttpsErrors("Place id not found", 404);
    return next(error);
  }

     // CHECK IF USER UPDATING POST IS ACTUALLY CREATOR OF THE POST OR NOT
   
     if(foundRecord.creator.id.toString() !== req.userData.userId)
     {
       error = new HttpsErrors("You are not the owner !!", 401);
       return next(error);
     }

  try {

    foundRecord.creator.places.pull(foundRecord);

    await foundRecord.creator.save();

    await PLACE_MODEL.deleteOne({_id:foundRecord._id});
    

  } catch (error) {
    console.log(error)
    error = new HttpsErrors("Error while deleting place", 500);
    return next(error);
  }

  // REMOVE FILE FROM UPLOADS FOLDER TOO
  
  fs.unlink( foundRecord.img , (err)=>{console.log(err)});

  res.status(200).json({ message: "deleted" });
}
module.exports.Home = Home;
module.exports.foundPlaceById = foundPlaceById;
module.exports.foundUserPlaces = foundUserPlaces;
module.exports.createPlace = createPlace;
module.exports.updatePlace = updatePlace;
module.exports.deletePlace = deletePlace;
