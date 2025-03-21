const userModel = require("../models/users.model");

module.exports.createUser = async ({firstName , lastName , email , password}) => {
       
    if(!firstName || !email || !password){
        throw new Error("All fields are required");
    }

    const user = await userModel.create({
        firstName,
        lastName,
        email,
        password
    })

    return user;
}

module.exports.existingUser = async (email) => {
    if(!email){
        throw new Error("Email is Required")
    }

    const user = await userModel.findOne({email : email});

    return user;
}

module.exports.confirmUser = async (email, password) => {
      
    if (!email || !password) {
       return {
              message : "Email or Password is empty",
              statusCode : 400
       }
    }

    const user = await userModel.findOne({ email }).select("+password");
     
   
    
    if(!user){
        return {
            message : "User Not Found",
            statusCode : 404
        };
    }
    

   const isConfirm = await user.comparePassword(password);

   if(!isConfirm){
     return {
        message : "Password is incorrect",
        statusCode : 401
     }
   }

   const token = await user.generateAuthToken()

   return {
         token : token,
         statusCode : 200
   }

}