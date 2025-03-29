const userModel = require("../models/users.model");
const { createUser, existingUser, confirmUser } = require("../services/user.service");
const {validationResult} = require("express-validator")
const blackListTokenModel = require("../models/blackListToken.model");
const jwt = require("jsonwebtoken");

module.exports.postRegisterUser =  async (req, res, next) => {
    
    const errors = validationResult(req);

    if(!errors.isEmpty()){
        let error = new Error("Validation Error");
        error.statusCode = 422;
        error.details = errors.array(); 
        return next(error);
    }

    const {firstName , lastName , email , password }
 = req.body;

  const existUser = await existingUser(email);
 
 if(existUser) {
    return res.status(404).json({
        message : "Email already already"
    })
 }

   const hashedPassword = await userModel.hashPassword(password);



    try {
        const newUser = await createUser({firstName, lastName, email, password: hashedPassword});
        
        const jwtToken = await newUser.generateAuthToken();
        newUser.save();

        return res.status(201).json({token : jwtToken});


    } catch (error) {
        
        error.statusCode = error.statusCode || 500;  
        next(error);
    }

}


module.exports.postLogin =  async (req,res,next) => {
      
    const {email, password} = req.body;

    try {

        const isconfirmUserToken = await confirmUser(email, password)
        
        
        if(!isconfirmUserToken.token){
            return res.status(isconfirmUserToken.statusCode).json({message : isconfirmUserToken.message})
        }
         
        res.cookie("uberToken", isconfirmUserToken.token, {
            // httpOnly : true,
            // secure : true,
            // sameSite : "none"
        })
        return res.status(isconfirmUserToken.statusCode).json({
            token : isconfirmUserToken.token,

    })

    } catch (error) {
        
        error.statusCode = error.statusCode || 500;
        next(error);
    }

}


module.exports.getProfile = async (req, res, next) => {

    try {
        
        return res.status(200).json({user : req.user})

    } catch (error) {
        
        error.statusCode = error.statusCode || 500;
        next(error);
    }
}

module.exports.logout = async (req, res, next) => {
    try {
        
        let uberToken = req.cookies.uberToken || req.headers.authorization ;

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

       // Store token in blacklist with dynamic TTL
       await blackListTokenModel.create({ token: uberToken, expiresAt: new Date(decoded.exp * 1000) });
        
        res.clearCookie("uberToken");
        return res.status(200).json({message : "Logout Successfully"})

    } catch (error) {
        
        error.statusCode = error.statusCode || 500;
        next(error);
    }
}