const userModel = require("../models/users.model");
const { createUser, existingUser, confirmUser } = require("../services/user.service");
const {validationResult} = require("express-validator")

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

        return res.status(isconfirmUserToken.statusCode).json({
            token : isconfirmUserToken.token,

    })

    } catch (error) {
        
        error.statusCode = error.statusCode || 500;
        next(error);
    }

}