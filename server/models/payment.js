// models/Payment.js
const mongoose = require("mongoose")

const paymentSchema = new mongoose.Schema({
    orderId: {
        type: String,
        required: true,
        unique: true          // prevents duplicate order records
    },
    paymentId: {
        type: String,
        default: null         // filled after payment success
    },
    webhookEventId:{
        type:String
    },
    event:{
        type:String
    },
    signature: {
        type: String,
        default: null
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    courses: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course"
    }],
    amount: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ["initiated", "success", "failed"],
        default: "initiated"   // starts as initiated
    }
}, { timestamps: true })

module.exports = mongoose.model("Payment", paymentSchema)