const jwt = require('jsonwebtoken');
const userModel = require('../models/users.model');
const blackListTokenModel = require('../models/blackListToken.model');
const captainModel = require('../models/captain.model');

module.exports.isAuth = (requiredRole = null) => {

return async (req, res, next) => {
    
    let token = req.cookies.uberToken || req.headers.authorization;
    const notAuthorizedStatus = 401;
    const notAuthorizedMessage = "You are not authorized";

    if(!token){
        return res.status(notAuthorizedStatus).json({message : notAuthorizedMessage})
    }
    
   

    if(token.startsWith("Bearer")){
        token = token.split(" ")[1];
    }
 
    try {
     
       const blackListToken = await blackListTokenModel.findOne({token : token});

      
       
       if(blackListToken){
           return res.status(403).json({message : "Forbidden"})
       } 
    
       
    const decodeed = jwt.verify(token, process.env.JWT_SECRET);
      
    

    if(!decodeed){
        return res.status(notAuthorizedStatus).json({message : notAuthorizedMessage})
    }

    const user =  requiredRole === "user" ? await userModel.findById(decodeed._id) : await captainModel.findById(decodeed._id); ;

    console.log("USer", user);
    

    if(!user){
        return res.status(notAuthorizedStatus).json({message : notAuthorizedMessage})
    }

    req.user = user;
    return next();

    } catch (error) {
         
        next(error);
    }

}

}