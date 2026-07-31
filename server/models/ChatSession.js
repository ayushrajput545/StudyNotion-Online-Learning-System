// models/ChatSession.js — updated
const mongoose = require('mongoose');

const ChatSessionSchema = new mongoose.Schema({
    sessionId: { type: String, required: true, unique: true, index: true },
    geminiInteractionId: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('ChatSession', ChatSessionSchema);