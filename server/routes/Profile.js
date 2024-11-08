const express= require('express');
const router = express.Router();

const{updateDisplayPicture , updateProfile , getAllUserDetails ,deleteAccount}= require('../controllers/Profile');
const {auth}=require('../middlewares/auth');

router.put('/updateDisplayPicture',auth ,  updateDisplayPicture);
router.put('/updateProfile',auth ,updateProfile);
router.get('/getuserdetails',auth , getAllUserDetails);
router.delete('/deleteAccount',auth , deleteAccount)


module.exports = router