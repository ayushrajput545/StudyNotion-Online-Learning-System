const express= require('express');
const router = express.Router();

const{updateDisplayPicture , updateProfile , getAllUserDetails ,deleteAccount ,getEnrolledCourses , instructorDashboard}= require('../controllers/Profile');
const {auth , isInstructor}=require('../middlewares/auth');

router.put('/updateDisplayPicture',auth ,  updateDisplayPicture);
router.put('/updateProfile',auth ,updateProfile);
router.get('/getuserdetails',auth , getAllUserDetails);
router.delete('/deleteAccount',auth , deleteAccount)
router.get("/getEnrolledCourses", auth, getEnrolledCourses)
router.get("/instructorDashboard", auth, isInstructor, instructorDashboard)



module.exports = router 