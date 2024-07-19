const jwt = require('jsonwebtoken');

const HttpError = require("../models/https-errors");

function checkToken(req,res,next)
{

  // THIS METHOD IS SENT BY BROWSER BEFORE SENDING ACTUAL GET,POST,PATH
  // REQUESTS TO OUR SERVER SO TO IGNORE IT JUST WRITE THIS
  
  if(req.method === "OPTIONS")
  {
    return next();
  }

 try {
    
    // SPLIT AUTHORIZATION HEADER AND GET SECOND ELEMENT VALUE
    // AUTHORIZATION WOULD HAVE RETURNED [A STRING  TOKEN]

    const token = req.headers.authorization.split(" ")[1];

    // IF HEADERS HAVE NO TOKEN THEN THROW ERROR

    if (!token) {
      throw new Error('Authentication failed!');
    }

    // IF REQUEST HAS HEADERS THEN DECODE TOKEN WITH SECREAT KEY

    const decodedToken = jwt.verify(token, 'supersecret_dont_share');

    // ADD USERDATA PROPERTY TO REQ OBJECT WHICH HAS USERID

    req.userData = { userId: decodedToken.userId };

    next();
    
  } catch (err) {
    const error = new HttpError('Authentication failed!', 401);
    return next(error);
  }
}

module.exports = checkToken;