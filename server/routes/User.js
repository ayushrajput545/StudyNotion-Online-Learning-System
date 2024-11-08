const express= require('express');
const router = express.Router();

const {sendOTP} = require('../controllers/Auth');
const{signUp,login}= require('../controllers/Auth');
const{resetPasswordToken , resetPassword} = require('../controllers/ResetPassword');

router.post('/sendOTP',sendOTP);
router.post('/signup',signUp);
router.post('/login',login);

router.post('/resetpasswordtoken',resetPasswordToken);
router.post('/resetPassword',resetPassword); 

module.exports = router