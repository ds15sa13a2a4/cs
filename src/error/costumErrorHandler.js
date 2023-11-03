import CostumeError from "./CostumError.js";
const costumeErrorHandler = (err,req,res,next) => {
    let customError = err;
    
    if (customError.name == "CastError") {
      customError = new CostumeError("Bad Request", 400);
    }
    if(customError.message == "Firebase: Error (auth/missing-password)."){
      customError = new CostumeError("The password is not valid!", 400);
    }
    if(customError.message == "Firebase: Error (auth/email-already-in-use)."){
      customError = new CostumeError("The email is exists!", 400);
    }
    
    res.status(customError.status || 500).json({
        status: false,
        message: customError.message|| "Unknowm Error!"
      })
    
  }


export default costumeErrorHandler;