const {instance} = require('../config/razorpay');
const Course = require('../models/Course');
const User = require('../models/User');
const mailSender = require('../util/mailSender'); // we sent mail when payment is done
const mongoose = require('mongoose');
const { paymentSuccessEmail } = require("../mail/paymentSuccessEmail")
const crypto = require("crypto")
const CourseProgress = require("../models/courseProgress")
const { courseEnrollmentEmail} = require("../mail/courseEnrollmentEmail")
const Payment = require("../models/payment")



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
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET  // set this in Razorpay dashboard

    console.log("webhooksecret",webhookSecret)

    // Step 1: Get the signature Razorpay sent in headers
    const razorpaySignature = req.headers["x-razorpay-signature"]

    // Step 2: Verify it's actually from Razorpay (not a fake request)
    const expectedSignature = crypto
        .createHmac("sha256", webhookSecret)
        .update(req.body.toString())   // raw body string
        .digest("hex")

    if (razorpaySignature !== expectedSignature) {
        console.log("FAKE WEBHOOK — Rejected")
        return res.status(400).json({ success: false })
    }

    // Step 3: Parse the event
    const event = JSON.parse(req.body)
    console.log("Webhook Event Received:", event.event)

    // Step 4: Handle payment.captured event
    if (event.event === "payment.captured") {
        const { order_id, id: payment_id, amount } = event.payload.payment.entity

        try {
            // Step 5: Find the payment record in DB
            const paymentRecord = await Payment.findOne({ orderId: order_id })

            if (!paymentRecord) {
                console.log("No payment record found for order:", order_id)
                return res.status(200).json({ received: true }) // still return 200
            }

            // Step 6: Handle Duplicate — if already success, skip
            if (paymentRecord.status === "success") {
                console.log("Duplicate webhook — already processed")
                return res.status(200).json({ received: true })
            }

            // Step 7: Update payment record to success
            await Payment.findOneAndUpdate(
                { orderId: order_id },
                {
                    paymentId: payment_id,
                    status: "success"
                }
            )

            // Step 8: Enroll the students
            await enrollStudents(paymentRecord.courses, paymentRecord.userId, res)

            console.log("Student enrolled via webhook ✅")

        } catch (error) {
            console.log("Webhook processing error:", error)
            return res.status(500).json({ success: false })
        }
    }

    // Always return 200 to Razorpay — else it retries
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

    