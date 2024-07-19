// THIS API SHOULD CREATE COORDINATES FROM GIVEN ADDRSS
// BUT WE DONT HAVE API KEY THATS WHY THIS MODULE IS NOT
// ATTACHED TO OUR APP

const axios = require("axios");
const HttpError = require("c:/users/administrator/downloads/compressed/node-backend-14-address-to-coordinates/models/http-error");

const API_KEY = "";

async function coordinateCalculator(address) {
  const responce = await axios.get(
    `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
      address
    )}&key=${API_KEY}`
  );
  
  if (!responce.data || responce.data.status == "ZERO_RESULTS") {
    throw new HttpError("invalid address", 422);
  }
  const coordinates = responce.data.results[0].geomatry.location;

  return coordinates;
}

module.exports.coordinateCalculator = coordinateCalculator;
