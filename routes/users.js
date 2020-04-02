const express = require('express');
const router = express.Router();

const usersController=require('../controllers/users_controller');

router.get('/profile',usersController.profile);

// for user posts
router.get('/post',usersController.post);

//for user sign-up
router.get('/sign-up',usersController.signUp);

//for user sign-in
router.get('/sign-in',usersController.signIn);

router.post('/create',usersController.create);

module.exports=router;