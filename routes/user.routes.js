const express = require('express')

const router = express.Router();
const {body} = require('express-validator');
const userController = require('../controllers/user.controller');
const authMiddleware = require('../middlewares/isAuth.middleware')


//POST -> registration
router.post("/registration" , [
    body('email').isEmail().withMessage("Email is Invalid"),
    body('firstName').isLength({min : 3}).withMessage("First Name must be 3 Character Long"),
    body('password').isLength({min : 3}).withMessage('Password must be 5 Character Long')
] , userController.postRegisterUser )


//POST -> login

router.post("/login" , [
    body("email").isEmail().withMessage("Email is invalid or empty"),
    body("password").isLength({min : 3}).withMessage("Password Character must be of  character")
], userController.postLogin)


//Get => profile
router.get("/profile" , authMiddleware.isAuth("user") , userController.getProfile)

//Get => logout
router.get('/logout' , authMiddleware.isAuth("user") , userController.logout)


module.exports = router

