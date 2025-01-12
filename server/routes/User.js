const express= require('express');
const router = express.Router();

const {sendOTP} = require('../controllers/Auth');
const{signUp,login , changePassword}= require('../controllers/Auth');
const{resetPasswordToken , resetPassword} = require('../controllers/ResetPassword');
const {auth} = require('../middlewares/auth')

router.post('/sendOTP',sendOTP);
router.post('/signup',signUp);
router.post('/login',login);

router.post('/reset-password-token',resetPasswordToken);
router.post('/reset-password',resetPassword); 

router.post("/changepassword", auth, changePassword)

module.exports = router