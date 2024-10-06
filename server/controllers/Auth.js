 const User = require('../models/User');
 const OTP = require('../models/OTP');
 const Profile = require('../models/Profile');
 const otpGenerator = require('otp-generator');
 const bcrypt = require('bcrypt');
 const jwt = require('jsonwebtoken');
 require('dotenv').config();


 //SEND OTP 

 exports.sendOTP = async(req,res)=>{

    try{

      const {email} = req.body;

      const existingUser = await User.findOne({email});
        if(existingUser){
         return res.status(401).json({
            success:false,
            message:"User already exist"
         });
        }

        //gentare otp ; make sure we install otp generator package

        var otp = otpGenerator.generate(6,{
            upperCaseAlphabets:false,
            lowerCaseAlphabets:false,
            specialChars:false
        });

        console.log("OTP generated" , otp);

        //check generated otp is unique or not 
        let result = await OTP.findOne({otp:otp});

        
        while(result){   //if it is not unique then again generate otp 

            otp = otpGenerator.generate(6,{
                upperCaseAlphabets:false,
                lowerCaseAlphabets:false,
                specialChars:false
            });

             result = await OTP.findOne({otp:otp}); // again check it is unique or not 
              
        }

        //Create entry of otp in DB 

        const otpBody = await OTP.create({email , otp});
        console.log(otpBody);

        res.status(200).json({
            success:true,
            message:"OTP send successfully",
            otp
        })

  }

    catch(err){
        console.log(err);
        return res.status(402).json({
            success:false,
            message:err.message
        })

    }
    


 }

 //SIGNUP 

 exports.signUp = async(req,res)=>{

    try{

        //Step 1 : fetch data  
        const{firstName , lastName , confirmPassword, accountType, contactNumber, otp, email , password}= req.body;

        //Step 2 : Check Validations for email ,password

        //(i) check all filed filled or nor
        if(!firstName || !lastName || !password || !confirmPassword || !email || !otp){
            return res.status(401).json({
                success:false,
                message:"All fields required"
            })
        }

        //(ii) check password and confirm password are same or not 
        if(password!==confirmPassword){
            return res.status(401).json({
                success:false,
                message:"Password and ConfirmPassword Not matched"
            })

        }
 
        //(iii) check user already exist or not
        const existingUser = await User.findOne({email});
        if(existingUser){
            return res.status(401).json({
                success:true,
                message:"Email already exist"
            })
        }

        //STEP 3 : find most recent otp and check its validity
        const recentOtp = await OTP.find({email}).sort({createdAt:-1}).limit(1);
        console.log("Recent otp" , recentOtp);

        if(recentOtp.length==0){

            return res.status(401).json({
                success:false,
                message:"OTP not found"
            })
        }
        else if(otp !== recentOtp.otp){
            return res.status(401).json({
                success:false,
                message:"Invalid OTP"
            })       
        }


        //STEP 4 : Hash Password
        const hashedPassword = await bcrypt.hash(password, 10);

        //STEP 5: Create entry in DB

        const profile = await Profile.create({
            gender:null,
            dateOfBirth:null,
            about:null,
            contactNumber:null
        })

        const user = await User.create({
            firstName,
            lastName,
            email,
            contactNumber,
            password:hashedPassword,
            accountType,
            additionalDetails:profile._id,  // to add additional detail we must have addtionaldetail by creating profile in DB
            image:`https://api.dicebear.com/5.x/initials/svg?seed= ${firstName} ${lastName}`
        })

        //Step 6: return success resposne

        res.status(200).json({
            success:true,
            message: "User Ragistered Successfully",
            user
        })
        
        
    }
    catch(err){
        console.log(err);
        return res.status(200).json({
            success:false,
            message:'User can not be ragistered ! Please try again'
        })
    }
 }

 //login

 exports.login = async(req, res) =>{

    try{

        //Step 1 : fetch all the entered data
        const{email , password } = req.body;

        //Step 2 : check validations

        // (i) check all fields are filled or not
         if(!email || !password){
            return res.status(401).json({
                success:false,
                message:"All fields are required"
            })
         }

        //(ii) check user exist or not
        const user = await User.findOne({email})
         if(!user){
            return res.status(401).json({
                success:false,
                message:"User already exist! Please signup"
            })
         }

         //(iii) check entred passwrod and actual password matched or not if matchedd then create token 

         if(await bcrypt.compare(password , user.password)){ // here user which we create in signup
 
            //create a token
           const payload={
            email:user.email,
            id:user._id,
            accountType:user.accountType
            }

            const token = jwt.sign(payload , process.env.JWT_SECRET, {expiresIn:"2h"});

            //insert token in user
            user.token = token,
            user.password= undefined // hide password in our response 

             // create cookies 

        const options = {
            expires: new Date(Date.now() + 3 * 24 * 60*60*1000),
            httpOnly:true
        }

           res.cookie("token" , token , options).status(200).json({
            success:true,
            token,
            user,
            message:"Logged in successfully"
           })

         }

         else{
            //passowrd not matched
            return res.status(401).json({
                success:false,
                message:'Password is incorrect'
            })
         }

    }
    catch(err){
        console.log(err);
        return res.status(501).json({
            success:false,
            message:'Login Failed! Please try again'
        })
    }
 }


 //changepassword

 exports.changePassword = async(req,res)=>{

    //fethch all data
    //get oldpassword newpassword , confirmpassword
    //validationa

    //update pwd in DB 
    //send mail - password updated
    //return res

 }