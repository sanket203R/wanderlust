const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../Models/user.js');
const wrapAsync = require('../utils/wrapAsync.js');
const ExpressError = require('../utils/ExpressError.js');
const {listingSchema,reviewSchema} = require('../schema.js');
const  {saveRedirectUrl}  = require('../middleware.js');
const userController = require('../controller/users.js');

//register

router
    .route('/signup')
        .get(userController.renderSignupForm)
        .post(wrapAsync(userController.signup));

router
    .route('/login')
        .get(userController.renderLoginForm)
        .post(saveRedirectUrl ,passport.authenticate('local',{failureFlash:true,failureRedirect:'/login'}),userController.login);


router.get('/logout',userController.logout);

module.exports = router;