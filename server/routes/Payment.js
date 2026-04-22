const express= require('express');
const router = express.Router();

const { capturePayment, verifyPayment, sendPaymentSuccessEmail, webhookHandler } = require("../controllers/Payment")
const { auth, isInstructor, isStudent, isAdmin } = require("../middlewares/auth")

router.post("/capturePayment", auth, isStudent, capturePayment)
router.post(
    "/verify-payment-webhook",
    express.raw({ type: "application/json" }),
    webhookHandler
)

// Temporary debug route — no middleware at all
router.post("/webhook-test", (req, res) => {
    console.log("BASIC HIT")
    return res.status(200).json({ received: true })
})
// router.post("/verifyPayment",auth, isStudent, verifyPayment)
router.post("/sendPaymentSuccessEmail", auth, isStudent, sendPaymentSuccessEmail);

module.exports = router