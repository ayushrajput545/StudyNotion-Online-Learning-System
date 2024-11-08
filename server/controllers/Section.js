const Section = require('../models/Section');
const Course = require('../models/Course');
const SubSection = require('../models/SubSection');

//create section
exports.createSection = async(req,res)=>{
    try{

        const{sectionName , courseId} = req.body;

        if(!sectionName || !courseId){
            return res.status(401).json({
                success:false,
                message:"All fields are required",           
            })
        }
        
 
        const newSection = await Section.create({sectionName});
        
        const updatedCourseDetail = await Course.findByIdAndUpdate(courseId , {$push:{courseContent:newSection._id}} ,{new:true}).populate('courseContent').exec();
        //HW use populate to replace sections / subsectioons both in updatedcoursedetail

        return res.status(200).json({
            success:true,
            message:"Section created",
            updatedCourseDetail
        })

    }
    catch(err){
        console.log(err);
        return res.status(500).json({
            success:false,
            message:"Something went wrong while creating section",           
        })
    }
}

//update a section ,we got some new data so we have to update it in the section
exports.updateSection= async(req,res)=>{

    try{

        const{sectionName , sectionId,courseId}= req.body;

        if(!sectionName || !sectionId){
            return res.status(401).json({
                success:false,
                message:"All fields are required",           
            })
        }

        const section = await Section.findByIdAndUpdate(sectionId ,{sectionName} , {new:true} );
        const course = await Course.findById(courseId)
		.populate({
			path:"courseContent",
			populate:{
				path:"subSection",
			},
		})
		.exec();

        return res.status(200).json({
            success:true,
            message:"Section updated",
            data:course
            
        }) 

    }
    catch(err){
        console.log(err);
        return res.status(500).json({
            success:false,
            message:"Something went wrong while creating section",           
        })
    }
}

//delete section

exports.deleteSection = async (req, res) => {
	try {

		const { sectionId, courseId }  = req.body;
		await Course.findByIdAndUpdate(courseId, {
			$pull: {
				courseContent: sectionId,
			}
		})
		const section = await Section.findById(sectionId);
		console.log(sectionId, courseId);
		if(!section) {
			return res.status(404).json({
				success:false,
				message:"Section not Found",
			})
		}

		//delete sub section
		await SubSection.deleteMany({_id: {$in: section.subSection}});

		await Section.findByIdAndDelete(sectionId);

		//find the updated course and return 
		const course = await Course.findById(courseId).populate({
			path:"courseContent",
			populate: {
				path: "subSection"
			}
		})
		.exec();

		res.status(200).json({
			success:true,
			message:"Section deleted",
			data:course
		});
	} catch (error) {
		console.error("Error deleting section:", error);
		res.status(500).json({
			success: false,
			message: "Internal server error",
		});
	}
};   