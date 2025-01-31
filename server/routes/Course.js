const express= require('express');
const router = express.Router();

const{createCategory , showAllCategories ,categoryPageDetails} = require('../controllers/Category');
const {auth ,isAdmin, isStudent, isInstructor}= require('../middlewares/auth');
const{createCourse ,getCourseDetails , getAllCourses ,
      getFullCourseDetails, getInstructorCourses, editCourse , deleteCourse}= require('../controllers/Course');
const{createSection ,updateSection ,deleteSection} = require('../controllers/Section');
const{createSubSection,updateSubSection, deleteSubSection} = require('../controllers/SubSection');
const { createRating , getAverageRating, getAllRating} = require("../controllers/RatingAndReview")
const{ updateCourseProgress} = require("../controllers/courseProgress")

router.post("/createCategory" ,auth ,isAdmin, createCategory);
router.get("/showAllCategories",showAllCategories);
router.post("/getCategoryPageDetails", categoryPageDetails)

router.post("/createCourse",auth , isInstructor , createCourse);
router.post("/getCourseDetails",getCourseDetails);
router.get("/getAllCourses", getAllCourses)
router.post("/getFullCourseDetails", auth, getFullCourseDetails)
router.get("/getInstructorCourses", auth, isInstructor, getInstructorCourses)
router.post("/editCourse", auth, isInstructor, editCourse)
router.delete("/deleteCourse", deleteCourse)
router.post("/updateCourseProgress", auth, isStudent, updateCourseProgress);

router.post("/addSection", auth, isInstructor, createSection)
router.put('/updateSection',auth, isInstructor, updateSection);
router.post('/deleteSection' , auth , isInstructor, deleteSection);


router.post("/addSubSection", auth, isInstructor, createSubSection);
router.post("/updateSubSection", auth, isInstructor, updateSubSection)
router.post("/deleteSubSection", auth, isInstructor, deleteSubSection)

router.post("/createRating", auth, isStudent, createRating)
router.get("/getAverageRating", getAverageRating)
router.get("/getReviews", getAllRating)


module.exports = router