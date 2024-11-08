const {instance} = require('../config/razorpay');
const Course = require('../models/Course');
const User = require('../models/User');
const mailSender = require('../util/mailSender'); // we sent mail when payment is done
const mongoose = require('mongoose');

//capture the payment and initiate razorpay order
exports.capturePayment = async(req,res)=>{

    try{
        //get courseid and get userid
    const{course_id}= req.body;
    const userid = req.user.id;

    //validation
    if(!course_id){
        return res.status(401).json({
            success:false,
            message:'Course Id not found'
        })
    }

    //if we got course id then find course details 

    let course ;
    try{
        course = await Course.findById(course_id);
        if(!course){
            return res.status(401).json({
                success:false,
                message:'Course not found'
            })
        }

          //check wheather course is aleready purchased by same user or not
        const uid = new mongoose.Types.ObjectId(userid); // convert string userid into object type because we have obejct type user id course model
       if(course.studentEnrolled.includes(uid)){
        return res.status(401).json({
            success:false,
            message:'Student already enrolled'
        })
    }

    }
    catch(err){
         console.log(err);
         return res.status(501).json({
            success:false,
            message:'Something went wrong while fetching course details'
        })
    }

    //create order now ; amount and currency are mandatory while reciept and notes are optional 
    const amount = course.price;
    const currency = 'INR';

    const options = {
        amount : amount * 100 ,
        currency,
        receipt:Math.random(Date.now()).toString(),
        notes:{
            courseId:course_id,
            userid
        }
    };


  try{
        //initialte payment using razorpay
        const paymentResponse = await instance.orders.create(options);
        console.log(paymentResponse);

        return res.status(200).json({
            success:true,
            message:'Order initiated sucessfully',
            courseName : course.courseName,
            courseDescription: courseDescription,
            thumnail:course.thumbnail,
            orderId :paymentResponse.id,  // this is for tracking our order
            currency:paymentResponse.currency,
            amount:paymentResponse.amount
        })
    }
    catch(err){
        console.log(err);
        res.json({
            success:false,
            message:'Could not initiate order'
        })
    }
  


}
catch(err){
    console.log(err);
    return res.status(501).json({
        success:false,
        message:'Something went worng creating order'
    })
}
    }


    //verify signature

    exports.verifySignature= async(req,res)=>{

        try{

            //server secretkey or webhook
            const webhookSecret = "12345678";

            const signature = req.headers["x-razorpay-signature"]; // syntax from razorpay

            const shasum = crypto.createHmac("sha256", webhookSecret);
            shasum.update(JSON.stringify(req.body));
            const digest = shasum.digest("hex");

            if(signature== digest){
                console.log("Payment is authorized");

                const{courseId , userId}= req.body.payload.payment.entity.notes;
                try{

                    //find the course and enrolled the studetn in it 
                    const enrolledCourse = await Course.findOneAndUpdate({_id:courseId}, {$push:{studentEnrolled:userId}}, {new:true});

                    if(!enrolledCourse){
                        return res.status(404).josn({
                            success:false,
                            message:"Course Not Found"
                        });
                    }

                    console.log(enrolledCourse);

                    //find the user bu userid and update its courseId in courses array
                    const enrolledStudent = await User.findOneAndUpdate({_id:userId}, {$push:{courses:courseId}} , {new:true});
                    console.log(enrolledStudent);

                    //send the mail that student enrolled for course
                    const emailResponse = await mailSender(enrolledStudent.email , "Congratulation from Codehelp" , "Congratulation you are enrolled in new course");
                    console.log(emailResponse);

                    return res.status(200).json({
                        success:true,
                        message:"Signature Varified and Course Added"
                    });

                }
                catch(err){

                    console.log(err);
                    return res.status(402).json({
                        success:false,
                        message:"Signaure not varifield"
                    });


                }
            }

        }
        catch(err){
            console.log(err);
            return res.status(500).json({
                success:false,
                message:"Something went wronf while varifying signeture"
            });

        }
    }

    