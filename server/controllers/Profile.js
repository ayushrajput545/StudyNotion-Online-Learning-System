const Profile = require('../models/Profile');
const User = require('../models/User');
const { uploadImageToCloudinary } = require("../util/imageUploader");
require('dotenv').config();
const Course = require('../models/Course');

exports.updateProfile = async (req, res) => {
  try {
    const {
      firstName = "",
      lastName = "",
      dateOfBirth = "",
      about = "",
      contactNumber = "",
      gender = "",
    } = req.body;
    const id = req.user.id;

    const userDetails = await User.findById(id);
    const profile = await Profile.findById(userDetails.additionalDetails);

    const user = await User.findByIdAndUpdate(id, {
      firstName,
      lastName,
    });
    await user.save();

    profile.dateOfBirth = dateOfBirth;
    profile.about = about;
    profile.contactNumber = contactNumber;
    profile.gender = gender;

    await profile.save();

    const updatedUserDetails = await User.findById(id)
      .populate("additionalDetails")
      .exec();

    return res.json({
      success: true,
      message: "Profile updated successfully",
      updatedUserDetails,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};


//update profile picture
exports.updateDisplayPicture = async (req, res) => {
    try {
      const displayPicture = req.files.displayPicture
      const userId = req.user.id
      const image = await uploadImageToCloudinary(
        displayPicture,
        process.env.FOLDER_NAME,
        1000,
        1000
      )
      
      console.log(image)
    
      const updatedProfile = await User.findByIdAndUpdate(
        { _id: userId },
        { image: image.secure_url },
        { new: true }
      )
      res.send({
        success: true,
        message: `Image Updated successfully`,
        data: updatedProfile,
      })
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      })
    }
  }
  


//delete User account from user id 

exports.deleteAccount = async(req,res)=>{

    try{

        //get user id
        const id = req.user.id;

        const userDetails = await User.findById(id);
        if(!userDetails){
            return res.status(404).json({
                success:false,
                message:"User not found"
            })
        }

        //delete profile
        await Profile.findByIdAndDelete({_id:userDetails.additionalDetails});

        // Decrease emrolled student value 
        for (const courseId of userDetails.courses) {
          await Course.findByIdAndUpdate(
            courseId,
            { $pull: { studentsEnroled: id } },
            { new: true }
          )
        }
        //delete user
        await User.findByIdAndDelete({_id:id});

        return res.status(200).json({
            success:true,
            message:"Account Deleted"
        })

    }
    catch(err){
        console.log(err);
        return res.status(501).json({
            success:false,
            message:"Something went wrong while Delting Account",
            error:err.message
        })

    }
}

//get user details 

exports.getAllUserDetails = async(req,res)=>{

    try{

        const id = req.user.id;

       const userDetails= await User.findById(id).populate('additionalDetails').exec();

       return res.status(200).json({
        success:true,
        message:'All details of user fetched successfully',
        userDetails
       
       })



    }
    catch(err){

        console.log(err);
        return res.status(200).json({
            success:true,
            message:'Something went worng while fetching user detials'
        })

    }
}