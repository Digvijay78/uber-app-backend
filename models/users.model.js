

const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

const Schema = mongoose.Schema;

const userSchema = new Schema({

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

    password : {
        type : String,
        required : true,
        select : false,
        // minLength : ["Password Should be of 5 Characters Long"]
    },

    socketId : {
        type : String
    }

})

// this function needs a instance to call , => const user = User.finById("asdasas") |||||||  => ab user.genrateAuthToken so
// this._id is the id of the user which is find
userSchema.methods.generateAuthToken = function (){
    const token = jwt.sign({_id : this._id }, process.env.JWT_SECRET)
    return token;
}

// same this, it requires a instance to call, and that instance has a password which this.password
userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password)
}

// this can directly be called on the Model, => const hashedPassword = await User.hashPassword("mypassword")
userSchema.statics.hashPassword = async function (password) {
    return await bcrypt.hash(password, 12);
}

const userModel = mongoose.model("Users", userSchema)

module.exports = userModel
