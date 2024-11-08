const express= require('express');
const router = express.Router();

const{createCategory , showAllCategories} = require('../controllers/Category');
const {auth ,isAdmin, isInstructor}= require('../middlewares/auth');
const{createCourse ,getCourseDetails}= require('../controllers/Course');
const{createSection ,updateSection ,deleteSection} = require('../controllers/Section');
const{createSubSection} = require('../controllers/SubSection');

router.post("/createCategory" ,auth ,isAdmin, createCategory);
router.get("/showAllCategories",showAllCategories);

router.post("/createCourse",auth , isInstructor , createCourse);
router.get("/getCourseDetails",getCourseDetails);

router.post("/createSection" ,auth , isInstructor, createSection);
router.put('/updateSection',auth, isInstructor, updateSection);
router.delete('/deleteSection' , auth , isInstructor, deleteSection);


router.post('/createSubSection' ,auth, isInstructor, createSubSection);


module.exports = router