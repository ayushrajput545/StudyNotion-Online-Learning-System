const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
     
    firstName:{
        type:String,
        required:true,
        trim:true  // Whitespace at the beginning and end will be trimmed
    },

    lastName:{
        type:String,
        required:true,
        trim:true
    },

    email:{
        type:String,
        required:true,
        trim:true
    },

    password:{
        type:String,
        required:true
    },

    accountType:{
        type:String,
        enum:["Admin" , "Student" , "Instructor"],
        required:true
    },

    additionalDetails:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"Profile"  //this gonna be a new model , here its refrence is present
    },

    courses:[    // this contain many course so it must be a array
        {
             type:mongoose.Schema.Types.ObjectId,
             ref:"Course"  //course ki ids aaygi
        }
   
    ],

    image: {
        type:String, // url of image 
        required:true 
    },


    token:{
        type:String
    },

    resetPasswordExpires:{
        type:Date
    },

    courseProgress:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"courseProgress"
        }
    ]

})
module.exports = mongoose.model("User" , userSchema);


