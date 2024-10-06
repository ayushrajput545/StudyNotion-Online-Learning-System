const mongoose = require('mongoose');
const mailSender= require('../util/mailSender');

const otpSchema = new mongoose.Schema({

    email:{
        type:String,
        required: true
    },

    otp:{
        type:String,
        required:true
    },

    createdAt:{
        type:Date,
        default:Date.now(),
        expires:5*60 // otp expires in 5 min
    }

})

//function to send emails 

async function sendVerificationEmail(email,otp){

    try{
         const mailResponse = await mailSender(email , "Verification email from StudyNotion" , otp);
    console.log("Mail send Seccessfully " , mailResponse);
    }
    catch(err){
        console.log("Error occures while sending mail" , err);
    }  

}

otpSchema.pre("save" , async function(next){
    await sendVerificationEmail(this.email, this.otp);  // this = reprensent current obejct
    next();
})

module.exports= mongoose.model("OTP" , otpSchema);