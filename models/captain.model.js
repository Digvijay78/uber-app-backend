const mongoose = require('mongoose');
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

const captainSchema = new mongoose.Schema({
     
    firstName : {
        type : String,
        requried : true,
        minLength : [3,"First Name should be of 3 Characters Long"],
    }, 
    lastName : {
        type : String,
        minLength : [3, "Last Name should be of 3 Characters Long"]
    },
    email : {
        type : String,
        required : true,
        unique : true
    },
    socketId : {
        type : String
    }, 

    password : {
        type : String,
        required : true,
        select : false,
        // minLength : ["Password Should be of 5 Characters Long"]
    },

    isCaptain : {
        type : Boolean,
        default : true
    },

    status : {
        type : String,
        enum : ["active" , "inactive"],
        default : "active"
    },

    vehicle : {
       color : {
              type : String,
              required : true,
              minLength : [3, "Color should be of 3 Characters Long"]
            },
        plate : {
                type : String,
                required : true,
                minLength : [3, "Plate should be of 3 Characters Long"]
                },
        capacity : {
            type : String,
            required : true,
            min : [1, "Capacity should be atleast 1"]
        },
        vehicleType : {
            type : String,
            enum : ["car" , "bike" , "auto"],
            required : true
        }
    },

    location : {
        lat : {
            type : Number,
           
        },
        long : {
            type : Number,        
        }
    }
})



// this function needs a instance to call , => const user = User.finById("asdasas") |||||||  => ab user.genrateAuthToken so
// this._id is the id of the user which is find
captainSchema.methods.generateAuthToken = function (){
    const token = jwt.sign({_id : this._id }, process.env.JWT_SECRET, {expiresIn : '2h'})
    return token;
}

// same this, it requires a instance to call, and that instance has a password which this.password
captainSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password)
}

// this can directly be called on the Model, => const hashedPassword = await User.hashPassword("mypassword")
captainSchema.statics.hashPassword = async function (password) {
    return await bcrypt.hash(password, 12);
}

const captainModel = mongoose.model("Captain", captainSchema)


module.exports = captainModel