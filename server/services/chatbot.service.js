const { GoogleGenAI } = require('@google/genai');
const { GoogleGenerativeAIEmbeddings } = require('@langchain/google-genai');
const { Pinecone } = require('@pinecone-database/pinecone');
const ChatMessage = require('../models/ChatMessage');
const ChatSession = require('../models/ChatSession');

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const pinecone = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });
const pineconeIndex = pinecone.Index(process.env.PINECONE_INDEX_NAME);

const embeddings = new GoogleGenerativeAIEmbeddings({
    apiKey: process.env.GEMINI_API_KEY,
    model: 'models/gemini-embedding-001',
    taskType: 'RETRIEVAL_QUERY',
});

const SYSTEM_INSTRUCTION = `You are a helpful assistant for StudyNotion, an Ed-Tech platform.
Answer questions using ONLY the provided context about StudyNotion.
Never mention "context", "documents", or "retrieval" in your answers.
Start directly with the answer.
Be friendly, concise, and helpful.
If the answer is not in the context, say: "I don't have information on that. Please contact our support team."
Never answer questions unrelated to StudyNotion.`;

async function rewriteQuery(question, history) {
    if (!history.length) return question;

    const historyText = history.map(e => `${e.role}: ${e.content}`).join('\n');

    const res = await ai.interactions.create({
        model: 'gemini-3.6-flash',
        input: question,
        system_instruction: `Rewrite the follow-up question as a standalone question using chat history.
Output ONLY the rewritten question, nothing else.

CHAT HISTORY:
${historyText}`,
    });

    return res.output_text?.trim() ?? question;
}

async function getChatbotResponse(message, conversationHistory = [], previousInteractionId) {
    // 1. Rewrite query for better retrieval
    const queryForSearch = conversationHistory.length > 0
        ? await rewriteQuery(message, conversationHistory)
        : message;

    // 2. Embed
    const queryVector = await embeddings.embedQuery(queryForSearch);

    // 3. Fetch from Pinecone
    const searchResult = await pineconeIndex.query({
        topK: 5,
        vector: queryVector,
        includeMetadata: true,
    });

    // 4. Filter low confidence
    const context = searchResult.matches
        .filter(m => (m.score ?? 0) >= 0.6)
        .map(m => m.metadata?.text)
        .filter(Boolean)
        .join('\n\n---\n\n');

    // 5. Build history text
    const historyText = conversationHistory
        .map(e => `${e.role}: ${e.content}`)
        .join('\n');

    // 6. Call Gemini
    const response = await ai.interactions.create({
        model: 'gemini-3.6-flash',
        input: message,
        system_instruction: `${SYSTEM_INSTRUCTION}

CONVERSATION HISTORY:
${historyText || 'No previous conversation.'}

CONTEXT (answer ONLY from this):
${context || 'No relevant context found.'}`,
        ...(previousInteractionId && { previous_interaction_id: previousInteractionId }),
    });

    return {
        content: response.output_text || "Sorry, I couldn't process your request.",
        interactionId: response.id
    };
}

 const sendMessage = async (req, res) => {
    try {
        const { message, sessionId } = req.body;

        if (!message?.trim()) {
            return res.status(400).json({ error: 'Message is required' });
        }

        // Get or create session
        let session;
        if (sessionId) {
            session = await ChatSession.findOne({ sessionId });
        }
        if (!session) {
            const newSessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
            session = await ChatSession.create({ sessionId: newSessionId });
        }

        // Save user message
        await ChatMessage.create({
            sessionId: session.sessionId,
            role: 'user',
            content: message,
        });

        // Fetch history for context
        const historyDocs = await ChatMessage.find({ sessionId: session.sessionId })
            .sort({ timestamp: 1 })
            .select('role content -_id');

        const history = historyDocs.map(m => ({ role: m.role, content: m.content }));

        // Get AI response
        const aiResponse = await getChatbotResponse(
            message,
            history,
            session.geminiInteractionId || undefined
        );

        // Update interaction ID
        session.geminiInteractionId = aiResponse.interactionId;
        await session.save();

        // Save AI response
        await ChatMessage.create({
            sessionId: session.sessionId,
            role: 'assistant',
            content: aiResponse.content,
        });

        // Re-fetch updated history
        const updatedHistory = await ChatMessage.find({ sessionId: session.sessionId })
            .sort({ timestamp: 1 })
            .select('role content timestamp -_id');

        return res.status(200).json({
            success: true,
            sessionId: session.sessionId,
            history: updatedHistory
        });

    } catch (err) {
        console.error('Chatbot error:', err?.message || err);
        if (err?.statusCode === 429) {
            return res.status(429).json({ error: 'Too many requests, please wait a moment.' });
        }
        res.status(500).json({ error: 'Failed to process message' });
    }
};

// Called when chat popup closes — keeps DB record, returns fresh sessionId
const clearSession = async (req, res) => {
    try {
        const newSessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
        res.json({ sessionId: newSessionId });
    } catch (err) {
        res.status(500).json({ error: 'Failed to clear session' });
    }
};

module.exports = { sendMessage, clearSession};