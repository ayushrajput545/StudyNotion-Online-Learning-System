const SubSection= require('../models/SubSection');
const Section = require('../models/Section');
const {uploadImageToCloudinary} = require('../util/imageUploader');
require('dotenv').config();


exports.createSubSection = async(req,res)=>{

    try{
   
        //fetch data
        const{sectionId ,title, timeDuration ,description }= req.body;
        const video = req.files.videoFile;

        if(!title || !timeDuration || !description || !video){
            return res.status(401).json({
                success:false,
                message:"All fields required"
            })
        }

    const uploadDetails = await uploadImageToCloudinary(video , process.env.FOLDER_NAME);

    const SubSectionDetails = await SubSection.create({
        title:title,
        timeDuration:timeDuration,
        description:description,
        videoUrl:uploadDetails.secure_url
    })

    const updateSection = await Section.findByIdAndUpdate({_id:sectionId} , {$push:{subSection:SubSectionDetails._id}} , {new:true})
    //hw: log updated section here , after adding populate query

    return res.status(200).json({
        success:true,
        message:"Sub Section Created",
        updateSection
    })


    }

    catch(err){
        console.log(err);
        return res.status(401).json({
            success:false,
            message:"Something went wrong while creating subsection"
        })
    }
}

//HW : update subsection 

//HW : Delete subsetion
