const Course = require('../models/Course');
const User = require('../models/User');
const Category = require('../models/Category');
const {uploadImageToCloudinary} = require('../util/imageUploader');
require('dotenv').config();

//create courses by instructor
exports.createCourse = async(req, res)=>{

    try{

        //fetch data
        let{courseName , courseDescription, whatYouWillLearn , price, tag: _tag , category , status, instructions:_instructions} = req.body;
        const thumbnail = req.files.thumnailImage;

         

         // Convert the tag and instructions from stringified Array to Array
         const tag = JSON.parse(_tag);
         const instructions = JSON.parse(_instructions);

       

        //check validations
        if(!courseName || !courseDescription || !whatYouWillLearn || !price || !tag.length){
            return res.status(401).json({
                success:false,
                message:"All fileds required"
            })
        }

         if (!status || status === undefined) {
            status = "Draft"
          }

        //check for instructor by id if that user is instructore and store its entry in DB
        //user already login --> we need to get that user id --> we pass our user id in payload while creating token
        // now while authentication we pass our payload in req.user (req.user = decode or req.user=payload) 
        //now payload contain that loggedin user id so req.user.id(payload.id) is our required user id
        const userId =req.user.id 
        const instructorDeatils = await User.findById(userId,{accountType:"Instructor"});
        console.log("Instructor Details", instructorDeatils);  // all details of that user(instructore) prints
        //TODO:Verify that userId and instructorDetail._id are same or diffrent ??

        if(!instructorDeatils){
            return res.status(401).json({
                success:false,
                message:"Instrcution Details Not found"
            })      
        }

        //check for tag its type id id type in schemma
        const categoryDetails = await Category.findById(category);
        if(!categoryDetails){
            return res.status(401).json({
                success:false,
                message:"Category Details Not Found"
            })
        }

        //upload file to cloudonary
        const thumnailDetails = await uploadImageToCloudinary(thumbnail, process.env.FOLDER_NAME);
        console.log(thumnailDetails);

        //create entry for new course
        const newCourse = await Course.create({
            courseName,
            courseDescription,
            instructor:instructorDeatils._id, // instructor id type tha 
            whatYouWillLearn,
            price,
            tag,
            category:categoryDetails._id,
            thumbnail:thumnailDetails.secure_url,
            status,
            instructions,
        })

        //update course in User shcema

        await User.findByIdAndUpdate({_id:instructorDeatils._id} , {$push : {courses:newCourse._id}} , {new:true});

        //update course in category schema
        await Category.findByIdAndUpdate({_id:category} , {$push:{courses:newCourse._id}})

        return res.status(200).json({
            success:true,
            message:" Course Created Succesfully",
            data:newCourse
        })

        
    }
    catch(err){
        console.log(err);
        return res.status(500).json({
            success:false,
            message:"failed to create course",
            error:err.message
        })

    }
}

//get All courses

exports.showAllCourses = async(req,res)=>{

    try{

        const allCourses = await Course.find({},{courseName:true, price:true, thumbnail:true,instructor:true,ratingAndReviews:true , studentEnrolled:true}).populate('instructor').exec();

        return res.status(200).json({
            success:true,
            message:"Data of All courses fetched succesfully",
            data:allCourses
        })

    }
    catch(err){
        console.log(err);
        return res.status(500).json({
            success:false,
            message:"Something went wrong while fetching all courses",
            error:err.message
        })
    }
}

//getcourseDetails

exports.getCourseDetails = async(req,res)=>{

    try{
        const {courseId}= req.body;
        const courseDetails = await Course.find({_id:courseId})
                                               .populate({path:"instructor" , populate:{path:"additionalDetails"}})
                                            //    .populate("category")
                                            //    .populate("ratingAndReviews")
                                               .populate({path:"courseContent",populate:{path:"subSection" , select: "-videoUrl",}})
                                               .exec();

        if(!courseDetails){
            return res.status(403).json({
                success:false,
                message:`Could not find course Details with ${courseId}`
            })
        }

        return res.status(200).json({
            sucess:true,
            message:"Course Details fetched Successfully",
            data:courseDetails
        })

    }
    catch(err){
        console.log(err);
        return res.status(500).json({
            sucess:false,
            message:"Something went wrong while fetching course details",
            error:err.message 
        })


    }
}