const express = require('express');
const router = express.Router();

const usersController=require('../controllers/users_controller');

router.get('/profile',usersController.profile);

// for user posts
router.get('/post',usersController.post);

module.exports=router;