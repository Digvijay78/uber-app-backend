const express = require('express')

const router = express.Router();
const {body} = require('express-validator');
const captainController = require('../controllers/captain.controller');
const authMiddleware = require('../middlewares/isAuth.middleware')


//POST -> registration
router.post("/registration" , [
    body('email').isEmail().withMessage("Email is Invalid"),
    body('firstName').isLength({min : 3}).withMessage("First Name must be 3 Character Long"),
    body('password').isLength({min : 3}).withMessage('Password must be 5 Character Long'),
    body('color').isLength({min : 3}).withMessage("Color must be 3 Character Long"),
    body('plate').isLength({min : 3}).withMessage("Plate must be 3 Character Long"),
    body('capacity').isNumeric().withMessage("Capacity must be a number"),
    body('vehicleType').isIn(["car" , "bike" , "auto"]).withMessage("Vehicle Type must be car or bike or auto")
] , captainController.postRegisterCaptain )


//POST -> login
router.post("/login" , [
    body('email').isEmail().withMessage("Email is Invalid"),
    body('password').isLength({min : 3}).withMessage('Password must be 5 Character Long')
] , captainController.postLogin)


//Get => profile
router.get('/captain-profile', authMiddleware.isAuth("captain"), captainController.getProfile)


//Get => logout
router.get('/logout' , authMiddleware.isAuth("captain") , captainController.logout)



module.exports = router;