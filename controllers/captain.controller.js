const { validationResult } = require("express-validator");
const { createCaptain, confirmCaptain } = require("../services/captain.service");
const captainModel = require("../models/captain.model");
const jwt = require("jsonwebtoken");
const blackListTokenModel = require("../models/blackListToken.model");


module.exports.postRegisterCaptain = async (req,res,next) => {

    const errors = validationResult(req);

    if(!errors.isEmpty()){
        const error = new Error("Validation Failed");
        error.statusCode = 422;
        error.details = errors.array();
        return next(error);
    }

 
    const {firstName, lastName, email, password, color , plate , vehicleType , capacity } = req.body;

    const hashedPassword = await captainModel.hashPassword(password);

    const isAlreadyCaptain = await captainModel.findOne({email : email});

    if(isAlreadyCaptain){
        const error = new Error("Captain Already Exists");
        error.statusCode = 400;
        return next(error);
    }
    
    try {
        const creatingCaptain = await createCaptain({firstName, lastName, email, password : hashedPassword, color , plate , capacity ,vehicleType })

        if(!creatingCaptain){
            const error = new Error("Captain not created");
            error.statusCode = 400;
            return next(error);
        }

        return res.status(201).json({
            message : "Captain Created",
        });
    } catch (error) {
        error.statusCode = error.statusCode || 500;
        next(error);
    }
}


module.exports.postLogin =  async (req, res , next) => {
     
    const errors = validationResult(req);

    if(!errors.isEmpty()){
        const error = new Error("Validation Failed");
        error.statusCode = 422;
        error.details = errors.array();
        return next(error);
    }

    const {email , password} = req.body;

   
    

    try {
        
        const isCaptainToken = await confirmCaptain({email, password});
       
        return res.status(isCaptainToken.statusCode).json({
            token: isCaptainToken.token ?  isCaptainToken.token : isCaptainToken.message
        })
    } catch (error) {
        
    }
}

module.exports.getProfile = async (req, res, next) => {
       
    try {
        
        return res.status(200).json({
            captain : req.user
        })
    } catch (error) {
        error.statusCode = error.statusCode || 500;
        next(error);
    }
}


module.exports.logout = async (req, res, next) => {

    let uberToken = req.cookies.uberToken || req.headers.authorization;

    try {
        
    
    if(uberToken.startsWith("Bearer")){
        uberToken = uberToken.split(" ")[1];
    }

    const decoded = jwt.decode(uberToken, process.env.JWT_SECRET);

    if (!decoded || !decoded.exp) {
        return res.status(400).json({ message: "Invalid token" });
    }
    
    const currentTime = Math.floor(Date.now() / 1000);
    const remainingTTL = decoded.exp - currentTime;

    if (remainingTTL <= 0) {
        return res.status(400).json({ message: "Token already expired" });
    }

    await blackListTokenModel.create({token : uberToken, expiresAt : new Date(decoded.exp * 1000)});

    res.clearCookie("uberToken");
    return res.status(200).json({ message: "Logged out successfully" });


} catch (error) {
    error.statusCode = error.statusCode || 500;
    next(error);
}
}