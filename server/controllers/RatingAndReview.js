const RatingAndReview = require('../models/RatingAndReviews');
const Course = require('../models/Course');
const { default: mongoose } = require('mongoose');

exports.createRating = async(req,res)=>{
    try{

        //get user id who want to give review
        const userId = req.user.id;
        //fetch data from req body
        const{rating , review , courseId} = req.body;
        
        //check user is enrolled or not -> only entrolled user give rating to that course
        const courseDetails = await Course.findOne({_id:courseId,studentEnrolled:{$elemMatch:{eq:userId}}});

          if(!courseDetails){
            return res.status(400).json({
                success:false,
                message:"Student is not enrolled in the coourse"
            })
          }

          //check if user already reviwed the course
          const alreadyReviewed = await RatingAndReview.findOne({ user: userId, course:courseId});
            if(alreadyReviewed){
                return res.status(402).json({
                    success:false,
                    message:"Course is already reviwed by the user"
                });
            }

            //create rating and review
            const ratingReview = await RatingAndReview.create({rating, review , course:courseId , user:userId});

            //update course with this rating review 
            const updatedCourseDetails = await Course.findByIdAndUpdate({_id:courseId} , {$push:{ratingAndReviews:ratingReview._id}}, {new:true});
      

           //return resposne
           return res.status(200).json({
            sucess:false,
            message:"Rating and Review created succesfully",
            ratingReview,
           })



    }
    catch(err){
        console.log(err);
        return res.status(500).json({
            success:false,
            message:"Something went wrong while creating rating and review"
        });

    }
}

//get average rating

exports.getAverageRating = async(req,res)=>{

    try{
        //get course id
        const courseId = req.body.courseId;

        //calculate average rating 
        const result = await RatingAndReview.aggregate([
            {
                $match:{
                    course:new mongoose.Types.ObjectId(courseId),
                }
            },
            {
                $group:{
                    _id:null,
                    averageRating:{$avg:"rating"},
                }
            }
        ]);

        //return aveerage rating 
        if(result.length>0){
            return res.status(200).json({
                success:true,
                averageRating:result[0].averageRating
            })
        }

        //if no rating review exist
        return res.status(200).json({
            success:true,
            message:"Average Rating 0 , no rating is given till now",
            averageRating:0
        })

    }
    catch(err){
        console.log(err);
        return res.status(500).json({
            success:false,
            message:"Something went wrong while calculating average rating"
        });
    }
}

//get ALl ratings and review
exports.getAllRating = async(req,res)=>{
    try{
         
        const allReviews = RatingAndReview.find({}).sort({rating:"desc"})
                                                   .populate({path:"user",select:"firstName lastName email image"})
                                                   .populate({path:"course", select:"courseName"})
                                                   .exec();
        
         return res.status(200).json({
            success:true,
            message:"All Reviewed fetched successfully",
            data:allReviews
         })
                                            

    }
    catch(err){

    }
}