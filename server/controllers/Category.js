
const redisClient = require('../config/redis');
const Category = require('../models/Category');


function getRandomInt(max) {
    return Math.floor(Math.random() * max)
  }


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

exports.showAllCategories = async (req, res) => {
	try {
        console.log("INSIDE SHOW ALL CATEGORIES");
		const allCategorys = await Category.find({});
		res.status(200).json({
			success: true,
			data: allCategorys,
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: error.message,
		});
	}
}


//category page details
exports.categoryPageDetails = async (req, res) => {
    try {
      const { categoryId } = req.body
      // console.log("PRINTING CATEGORY ID: ", categoryId);
      // Get courses for the specified category

      //1. Check data present in redis or not if present return that 
      const cacheKey = `categoryDetailPage:${categoryId}`;
      const cachedData = await redisClient.get(cacheKey);

      if(cachedData){
        console.log("CACHE HIT");
        return res.status(200).json(JSON.parse(cachedData));
      }

      const selectedCategory = await Category.findById(categoryId)
        .populate({
          path: "courses",
        //   match: { status: "Published" },
        //   populate: "ratingAndReviews",
        })
        .exec()
  
      // console.log("SELECTED COURSE", selectedCategory)
      // Handle the case when the category is not found
      if (!selectedCategory) {
        console.log("Category not found.")
        return res
          .status(404)
          .json({ success: false, message: "Category not found" })
      }
      // Handle the case when there are no courses
      if (selectedCategory.courses.length === 0) {
        console.log("No courses found for the selected category.")
        return res.status(404).json({
          success: false,
          message: "No courses found for the selected category.",
        })
      }
  
      // Get courses for other categories
      const categoriesExceptSelected = await Category.find({
        _id: { $ne: categoryId },
      })
      let differentCategory = await Category.findOne(
        categoriesExceptSelected[getRandomInt(categoriesExceptSelected.length)]
          ._id
      )
        .populate({
          path: "courses",
          match: { status: "Published" },
        })
        .exec()
        //console.log("Different COURSE", differentCategory)
      // Get top-selling courses across all categories
      const allCategories = await Category.find()
        .populate({
          path: "courses",
          match: { status: "Published" },
          populate: {
            path: "instructor",
        },
        })
        .exec()
      const allCourses = allCategories.flatMap((category) => category.courses)
      const mostSellingCourses = allCourses
        .sort((a, b) => b.sold - a.sold)
        .slice(0, 10)
       // console.log("mostSellingCourses COURSE", mostSellingCourses)

      const response = {
        success: true,
        data: {
          selectedCategory,
          differentCategory,
          mostSellingCourses,
        },
      };

      //2. Add data in redis if not present : 
        //Store in Redis (5 min)
        //IMp: When course/category changes:--> await redisClient.del(`categoryPage:${categoryId}`);, when course created , update
      await redisClient.set(
        cacheKey,
        JSON.stringify(response),
        "EX",
        300 // 300 sec
      );

      res.status(200).json({
        success: true,
        data: {
          selectedCategory,
          differentCategory,
          mostSellingCourses,
        },
      })


    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message,
      })
    }
  }