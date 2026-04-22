const express= require('express');
const router = express.Router();

const { capturePayment, verifyPayment, sendPaymentSuccessEmail, webhookHandler } = require("../controllers/Payment")
const { auth, isInstructor, isStudent, isAdmin } = require("../middlewares/auth")

router.post("/capturePayment", auth, isStudent, capturePayment)
router.post("/verify-payment-webhook", auth , isStudent , webhookHandler)
// router.post("/verifyPayment",auth, isStudent, verifyPayment)
router.post("/sendPaymentSuccessEmail", auth, isStudent, sendPaymentSuccessEmail);

module.exports = router