const dotenv = require("dotenv");
dotenv.config();

const { PDFLoader } = require("@langchain/community/document_loaders/fs/pdf");
const { RecursiveCharacterTextSplitter } = require("@langchain/textsplitters");
const { GoogleGenerativeAIEmbeddings } = require("@langchain/google-genai");
const { Pinecone } = require("@pinecone-database/pinecone");
const { PineconeStore } = require("@langchain/pinecone");

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function indexDocument(){

    const pdfLoader = new PDFLoader("./rag_training_documentation.pdf");
    const rawDocs = await pdfLoader.load();
    console.log("PDF loaded:", rawDocs.length, "pages");

    const splitter = new RecursiveCharacterTextSplitter({ chunkSize: 1000, chunkOverlap: 200 });
    const chunks = await splitter.splitDocuments(rawDocs);
    const filteredChunks = chunks.filter(d => d.pageContent.trim().length > 0);
    console.log("Chunks:", filteredChunks.length);

    const embeddings = new GoogleGenerativeAIEmbeddings({ //convert chunks into vector using gemini model
        apiKey: process.env.GEMINI_API_KEY,
        model: 'models/gemini-embedding-001',
        taskType: 'RETRIEVAL_DOCUMENT',
    });

    const pinecone = new Pinecone();
    const pineconeIndex = pinecone.Index(process.env.PINECONE_INDEX_NAME);

    const BATCH_SIZE = 5;
    const DELAY_MS = 13000;

    for (let i = 0; i < filteredChunks.length; i += BATCH_SIZE) { // upload only 5 document in 1 min cuz of RPM of gemini api
        const batch = filteredChunks.slice(i, i + BATCH_SIZE);
        const batchNum = Math.floor(i / BATCH_SIZE) + 1;
        const totalBatches = Math.ceil(filteredChunks.length / BATCH_SIZE);
        console.log(`Upserting batch ${batchNum}/${totalBatches}...`);

        await PineconeStore.fromDocuments(batch, embeddings, {
            pineconeIndex,
        });

        if (i + BATCH_SIZE < filteredChunks.length) {
            await sleep(DELAY_MS);
        }
    }

    console.log("Done! Data stored in Pinecone.");
}

indexDocument();