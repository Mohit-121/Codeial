const express = require('express');
const router = express.Router();
const passport=require('passport');

const usersController=require('../controllers/users_controller');

router.get('/profile/:id', passport.checkAuthentication, usersController.profile);
router.post('/update/:id', passport.checkAuthentication, usersController.update);

// for Forgot password
router.get('/forgot-password',usersController.forgotPassword);

// for reset password
router.post('/reset-password',usersController.resetPassword);

// email directed reset password link
router.get('/reset-password/:id',usersController.resetPasswordPage);

// update password
router.post('/reset-password/:id',usersController.updatePassword);

//for user sign-up
router.get('/sign-up',usersController.signUp);

//for user sign-in
router.get('/sign-in',usersController.signIn);

//For creating a session
router.post('/create',usersController.create);

// For sign-out
router.get('/sign-out',usersController.destroySession);


// use passport as the middleware to authenticate
router.post('/create-session',passport.authenticate(
    'local',
    {failureRedirect: '/users/sign-in'},
),usersController.createSession);

router.get('/auth/google',passport.authenticate('google',{scope: ['profile', 'email']}));
router.get('/auth/google/callback',passport.authenticate('google',{failureRedirect: '/users/sign-in'}),usersController.createSession);

module.exports=router;