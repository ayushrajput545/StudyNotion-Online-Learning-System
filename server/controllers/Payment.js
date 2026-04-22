const {instance} = require('../config/razorpay');
const Course = require('../models/Course');
const User = require('../models/User');
const mailSender = require('../util/mailSender'); // we sent mail when payment is done
const mongoose = require('mongoose');
const { paymentSuccessEmail } = require("../mail/paymentSuccessEmail")
const crypto = require("crypto")
const CourseProgress = require("../models/courseProgress")
const { courseEnrollmentEmail} = require("../mail/courseEnrollmentEmail")
const Payment = require("../models/payment");
const { validateWebhookSignature } = require('razorpay');



// Capture the payment and initiate the Razorpay order
exports.capturePayment = async (req, res) => {
    const { courses } = req.body
    const userId = req.user.id
    if (courses.length === 0) {
      return res.json({ success: false, message: "Please Provide Course ID" })
    }
  
    let total_amount = 0
  
    for (const course_id of courses) {
      let course
      try {
        // Find the course by its ID
        course = await Course.findById(course_id)
  
        // If the course is not found, return an error
        if (!course) {
          return res
            .status(200)
            .json({ success: false, message: "Could not find the Course" })
        }
  
        // Check if the user is already enrolled in the course
        const uid = new mongoose.Types.ObjectId(userId)
        if (course.studentsEnrolled.includes(uid)) {
          return res
            .status(200)
            .json({ success: false, message: "Student is already Enrolled" })
        }
  
        // Add the price of the course to the total amount
        total_amount += course.price
      } catch (error) {
        console.log(error)
        return res.status(500).json({ success: false, message: error.message })
      }
    }
  
    const options = {
      amount: total_amount * 100,
      currency: "INR",
      receipt: Math.random(Date.now()).toString(),
    }
  
    try {
      // Initiate the payment using Razorpay
      const paymentResponse = await instance.orders.create(options)
      const payment = await Payment.create({
          orderId: paymentResponse.id,   // Razorpay's order ID
          userId: userId,
          courses: courses,
          amount: total_amount,
          status: "initiated"            // not paid yet
      })
      // console.log(paymentResponse)
      res.json({
        success: true,
        data: paymentResponse,
      })
    } catch (error) {
      console.log(error)
      res
        .status(500)
        .json({ success: false, message: "Could not initiate order." , error:error})
    }
  }



// controllers/paymentController.js
exports.webhookHandler = async (req, res) => {

  console.log("HITTTTTTINGGGGGGGGGGG WEBHOOOOOOOOKK");
    
    const webhookbody = req.body;
    const razorpaySignature = req.get("X-Razorpay-Signature");
    const webhookEventId = req.get("X-Razorpay-Event-Id");
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET  // set this in Razorpay dashboard

    if(!validateWebhookSignature(JSON.stringify(webhookbody) , razorpaySignature , webhookSecret)){
      console.log("Validation Error")
      return res.status(400);
    }

    const payment = await Payment.find({webhookEventId});
    if(payment.webhookEventId === webhookEventId){
      console.log("Duplicate Webhook");
      return res.status(400);
    }

    const event = webhookbody.event;
    const paymentId = webhookbody.payload.payment.entity.id;
    const orderId = webhookbody.payload.payment.entity.order_id;
    
    if(!event || !paymentId || !orderId){
      console.log("Missing field");
      return res.status(400);
    }

    if(event === "payment.captured"){

        await Payment.findOneAndUpdate(
            { orderId: order_id },
            {
                paymentId: payment_id,
                status: "success"
            }
        )

        await enrollStudents(paymentRecord.courses, paymentRecord.userId, res)

        console.log("Student enrolled via webhook ✅")

    }

    if(event === "payment.failed"){
      console.log("Payment Failed");
      await Payment.findOneAndUpdate(
            { orderId: order_id },
            {
                paymentId: payment_id,
                status: "failed"
            }
        )
    }

    return res.status(200).json({ received: true })
}




    //verify Payment
    exports.verifyPayment = async (req, res) => {
      const razorpay_order_id = req.body?.razorpay_order_id
      const razorpay_payment_id = req.body?.razorpay_payment_id
      const razorpay_signature = req.body?.razorpay_signature
      const courses = req.body?.courses
    
      const userId = req.user.id
    
      if (
        !razorpay_order_id ||
        !razorpay_payment_id ||
        !razorpay_signature ||
        !courses ||
        !userId
      ) {
        return res.status(200).json({ success: false, message: "Payment Failed" })
      }
    
      let body = razorpay_order_id + "|" + razorpay_payment_id
    
      const expectedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_SECRET)
        .update(body.toString())
        .digest("hex")
    
      if (expectedSignature === razorpay_signature) {
        await enrollStudents(courses, userId, res)
        return res.status(200).json({ success: true, message: "Payment Verified" })
      }
    
      return res.status(200).json({ success: false, message: "Payment Failed" })
    }



// Send Payment Success Email
exports.sendPaymentSuccessEmail = async (req, res) => {
  const { orderId, paymentId, amount } = req.body

  const userId = req.user.id

  if (!orderId || !paymentId || !amount || !userId) {
    return res
      .status(400)
      .json({ success: false, message: "Please provide all the details" })
  }

  try {
    const enrolledStudent = await User.findById(userId)

    await mailSender(
      enrolledStudent.email,
      `Payment Received`,
      paymentSuccessEmail(
        `${enrolledStudent.firstName} ${enrolledStudent.lastName}`,
        amount / 100,
        orderId,
        paymentId
      )
    )
  } catch (error) {
    console.log("error in sending mail", error)
    return res
      .status(400)
      .json({ success: false, message: "Could not send email" })
  }
}



// enroll the student in the courses
const enrollStudents = async (courses, userId, res) => {
  if (!courses || !userId) {
    return res
      .status(400)
      .json({ success: false, message: "Please Provide Course ID and User ID" })
  }

  for (const courseId of courses) {
    try {
      // Find the course and enroll the student in it
      const enrolledCourse = await Course.findOneAndUpdate(
        { _id: courseId },
        { $push: {  studentsEnrolled: userId } },
        { new: true }
      )

      if (!enrolledCourse) {
        return res
          .status(500)
          .json({ success: false, error: "Course not found" })
      }
      console.log("Updated course: ", enrolledCourse)

      const courseProgress = await CourseProgress.create({
        courseID: courseId,
        userId: userId,
        completedVideos: [],
      })
      // Find the student and add the course to their list of enrolled courses
      const enrolledStudent = await User.findByIdAndUpdate(
        userId,
        {
          $push: {
            courses: courseId,
            courseProgress: courseProgress._id,
          },
        },
        { new: true }
      )

      console.log("Enrolled student: ", enrolledStudent)
      // Send an email notification to the enrolled student
      const emailResponse = await mailSender(
        enrolledStudent.email,
        `Successfully Enrolled into ${enrolledCourse.courseName}`,
        courseEnrollmentEmail(
          enrolledCourse.courseName,
          `${enrolledStudent.firstName} ${enrolledStudent.lastName}`
        )
      )

      console.log("Email sent successfully: ", emailResponse)
    } catch (error) {
      console.log(error)
      return res.status(400).json({ success: false, error: error.message })
    }
  }
}

    