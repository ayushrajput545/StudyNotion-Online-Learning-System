const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({

    courseName:{
        type:String,
        trim:true
    },

    courseDescription:{
        type:String,
        trim:true
    },

    instructor:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },

    whatYouWillLearn:{
        type:String
    },

    courseContent:[  // section contain many diffrent parts or info of particular course
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Section"
        }
    ],

    ratingAndReviews:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"RatingAndReviews"
        }
    ],

    price:{
        type:Number

    },

    thumbnail:{
        type:String
    },

    tag:{
        
        type:[String],
        required:true,
    },

    instructions: {
		type:[String],
	},

    category:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"category"
    },

    studentsEnrolled:[
        {
            type:mongoose.Schema.Types.ObjectId,
            required:true,
            ref:"User"
        }
    ],

    status:{
        type:String,
        enum:["Draft" , "Published"]
    },

    createdAt: {
		type:Date,
		default:Date.now
	},

});
module.exports=mongoose.model('Course' , courseSchema);