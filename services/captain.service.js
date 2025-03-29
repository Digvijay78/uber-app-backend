
const captainModel = require('../models/captain.model');

module.exports.createCaptain = async ({
    firstName,
    lastName,
    email,
    password,
    color,
    plate,
    capacity,
    vehicleType
}) => {

    if(!firstName || !lastName || !email || !password || !color || !plate || !capacity || !vehicleType){
        throw new Error(`All Fields are Required`)
    }

    const captain = await captainModel.create({
        firstName,
        lastName,
        email,
        password,
        vehicle : {
            color,
            plate,
            capacity,
            vehicleType
        }
    })

    return captain;

}


module.exports.confirmCaptain = async ({email , password}) => {
       

    try {
        
        if(!email || !password){
            return {
                message : "Email or Password is empty",
                statusCode : 400
            }
        }

        const captain  = await captainModel.findOne({email}).select("+password");

        

        if(!captain){
            return {
                message : "Captain Not Found",
                statusCode : 404
            }
        }

        if(captain.locked){
            return {
                message : "Captain is locked",
                statusCode : 403
            }
        }

        const isCorrectPassword = await captain.comparePassword(password);
          
        console.log("IS CORRECT PASSWORD" , isCorrectPassword);
        
        if(!isCorrectPassword){
            return {
                message : "Password is incorrect",
                statusCode : 401
            }
        }
          
        const jwttoken = await captain.generateAuthToken();

        return {
            token : jwttoken,
            statusCode : 200
        }
    } catch (error) {
        error.statusCode = error.statusCode || 500;
        next(error)
    }
}