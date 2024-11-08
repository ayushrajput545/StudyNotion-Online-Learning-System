
const User = require('../models/User');
const mailSender = require('../util/mailSender');
const crypto = require('crypto');
const bcrypt = require('bcrypt');

//we create token for reseting password
exports.resetPasswordToken = async(req,res)=>{
 try{

         //fetch email and check its existence
    const{email}= req.body;

    const user = await User.findOne({email:email});

    if(!user){
        return res.status(404).json({
            success:false,
            message:"User not found ! Please signup"
        })
    }

    //generate token --> we intsall npm crypto it generate a unique id 
    const token = crypto.randomBytes(20).toString("hex"); 

    //Add this generated token or uid and its expiry time to the User schema(make new elements in User)
    const updatedDetails = await User.findOneAndUpdate({email} , {token:token , resetPasswordExpires:Date.now() + 5 * 60 * 1000 }  , {new:true}); // updated document returns

    //create url that will send to the mail
    const url =`http://localhost:3000/update-password/${token}`

    //send mail containing this url (frontend url)
    await mailSender(email , "Forgot Password Link" ,  `Forgot password link : ${url}`);

    res.status(200).json({
        success:true,
        message:'Email sent successfully! Please check email and change password'
    })

    }
    catch(err){
        console.log(err);
        return res.status(501).json({
            sucess:false,
            message:'Something went wrong  while sending forgot password link'
        })
    }

}

//on click the link on email then reset your password 
exports.resetPassword= async(req,res)=>{

    try{

        //data fetthc
        const{password,confirmPassword , token}= req.body; // token ko req body meh frontend ne dala 

        //validations
        if(password!==confirmPassword){
            return res.status(402).json({
                success:false,
                message:'Passowrd not matching'
            })
        }

        //get userdetails from db using token thats why we store token in our db
        const userDetails = await User.findOne({token:token})
        if(!userDetails){
            return res.status(402).json({
                success:false,
                message:'Token Invalid'
            })
        }

        //token expires time check

        if(userDetails.resetPasswordExpires < Date.now()){
            return res.status(402).json({
                success:false,
                message:'Token Expired ! Please regenerate your token again'
            })
        }

        //hash the password and update it in User
        const hashedPassword = await bcrypt.hash(password,10);

        await User.findOneAndUpdate({token:token} , {password:hashedPassword} , {new:true});

        return res.status(200).json({
            success:true,
            message:'Passowrd changed' 
        })

    }
    catch(err){
        console.log(err);
        return res.status(501).json({
            sucess:false,
            message:'Something went wrong  while sending forgot password link'
        })

    }
}