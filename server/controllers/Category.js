const Category = require('../models/Category');


//create tags
exports.createCategory = async(req,res)=>{

    try{
        const{name , description} = req.body;

        if(!name || !description){           // no need for course , when we create course then update there entry in tag
            return res.status(401).json({
                success:false,
                message:'All fields are required'
            })
    
        }

        const categoryDetails = await Category.create({name:name,description:description});

        return res.status(200).json({
            success:true,
            message:'Category Created Successfully'
        })

    }

    catch(err){
        console.log(err);
        return res.status(500).json({
            success:false,
            message:'Something went wrong while creating category',
            error:err.message
        })
    }
}

//getAll tags handler function

exports.showAllCategories = async(req,res)=>{

    try{
        const allCategory = await Category.find({} , {name:true , description:true}) // here we got all categories im which name and desc must present
        return res.status(200).json({
            success:true,
            message:'All categories fetched sucessfully',
            allCategory
        })

    }
    catch(err){
        console.log(err);
        return res.status(500).json({
            success:false,
            message:'Something went wrong while fetching category'
        })
    }
}

//category page details
exports.categoryPageDetails= async(req,res)=>{
    try{
        //get categoryid
        const {categoryId}= req.body

        //get course for specific category
        const selectCategory = await Category.findById(categoryId).populate("courses").exec();
        
        //validations
        if(!selectCategory){
            return res.status(402).json({
                success:false,
                message:"Data Not Found"
            })
        }

        //get courses for diffrent ctegory 
        const diffrentCategory = await Category.find({_id:{$ne:categoryId}});// ne->not equal

        //top selling courses : HW 
        //return
        return res.status(200).json({
            success:true,
            data:{
                selectCategory,
                diffrentCategory
            }
        })

    }
    catch(err){
        console.log(err);
        return res.status(500).json({
            success:false,
            message:'Something went wrong while finding category page details'
        })

    }
}
