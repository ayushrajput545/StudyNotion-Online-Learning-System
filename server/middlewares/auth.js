const jwt = require('jsonwebtoken');
require('dotenv').config();

//auth 
exports.auth = async(req,res,next)=>{

    try{
        //extract token
        const token = req.cookies.token || req.body.token || req.header("Authorisation").replace("Bearer" , "");

        //if token missing then return response 
        if(!token){
            return res.status(401).json({
                success:false,
                message:"Token is missing"
            })
        }

        //verify the token 
        try{
            const decode = jwt.verify(token , process.env.JWT_SECRET);
            console.log(decode);
            req.user = decode
        }
        catch(err){
              
            return res.status(401).json({
                success:false,
                message:"Token is invalid",
                error:err.message

            })

        }
        next();

    }
    catch(err){
        console.log(err);
        return res.status(501).json({
            success:true,
            message:"Something went wrong while validating token"
        })

    }
}



//isStudent 

exports.isStudent = async(req,res, next)=>{
    try{

        if(req.user.accountType !== 'Student'){
            return res.status(401).json({
                success:false,
                message:"This is protected routes for students only"
            });
        }
        next();

    }
    catch(err){
        console.log(err);
        return res.status(500).json({
            success:false,
            message:"User role can not be varified ! Please try again"
        })

    }
}

//isInstructor

exports.isInstructor = async(req,res, next)=>{
    try{

        if(req.user.accountType !== 'Instructor'){
            return res.status(401).json({
                success:false,
                message:"This is protected routes for instructors only"
            });
        }
        next();

    }
    catch(err){
        console.log(err);
        return res.status(500).json({
            success:false,
            message:"User role can not be varified ! Please try again"
        })

    }
}

//is Admin

exports.isAdmin = async(req,res, next)=>{
    try{

        if(req.user.accountType !== 'Admin'){
            return res.status(401).json({
                success:false,
                message:"This is protected routes for Admins only"
            });
        }
        next();

    }
    catch(err){
        console.log(err);
        return res.status(500).json({
            success:false,
            message:"User role can not be varified ! Please try again"
        })

    }
}