# StudyNotion-Online learning system

StudyNotion is a comprehensive Ed-Tech platform (Learning Management System) that empowers students to purchase, manage, and engage with educational content while allowing instructors to create, upload, and sell courses. It includes features like course ratings, seamless learning management, and an intuitive user experience. 
🚀 **New Feature:** Integrated an AI-powered StudyNotion Assistant using **Retrieval-Augmented Generation (RAG)** with **Google Gemini**, **Pinecone Vector Database**, and **LangChain**, enabling users to ask natural language questions about the platform, course purchasing, account management, and other features.

![StudyNotion Screenshot](https://github.com/ayushrajput545/StudyNotion-Ed-Tech-Platform/blob/main/Screenshot%202025-02-01%20211931.png)

## Workflow
1. **User Signup:** Users can sign up as either a student or an instructor.
2. **Student Features:**
   - Purchase courses.
   - Add courses to the cart.
   - Access course content and watch lectures.
   - Provide ratings and feedback on courses.
3. **Instructor Features:**
   - Create courses, add sections and subsections (upload lectures).
   - Publish courses as drafts or make them publicly available.
   - View generated income and enrolled student data on their dashboard.
4. **Common Features:**
   - Both instructors and students can edit their profiles.
5. **AI Assistant (RAG Chatbot):**
   - Ask questions about StudyNotion in natural language.
   - Provides platform guidance, walkthroughs, and FAQs.
   - Maintains conversation history for contextual responses.
   - Retrieves relevant information from a vector database before generating answers.

## Tech Stack
### Frontend:
- **React.js:** A JavaScript library for building user interfaces.
- **Tailwind CSS:** A utility-first CSS framework for styling.
- **Redux:** A state management tool for React applications.
- **Axios:** A promise-based HTTP client for API requests.
- **Chart.js:** A JavaScript library for data visualization.
- **React Markdown:** Rich rendering of chatbot responses.

### Backend:
- **Node.js:** A JavaScript runtime for server-side applications.
- **Express.js:** A lightweight framework for building web applications.
- **MongoDB:** A NoSQL database for data storage.
- **Cloudinary:** A cloud-based service for managing media files.
- **Google Gemini API:** LLM for conversational responses.
- **LangChain:** Document loading, chunking, embeddings, and retrieval.
- **Pinecone:** Vector database for semantic search.

## Functionality
1. **User Authentication & Authorization:** OTP-based authentication and password recovery.
2. **Course Management:** Instructors can create, edit, and manage courses.
3. **Payment Integration:** Razorpay integration for seamless transactions.
4. **Cloud-Based Media Management:** Efficient handling of media files via Cloudinary.
5. **Profile Management:** Users can view and edit their profile details.

## AI-Powered StudyNotion Assistant (RAG)

The platform includes an AI chatbot that helps users navigate StudyNotion by answering questions related to platform features, account management, course purchasing, payments, instructor workflows, and more.

### Features

- Context-aware conversational chatbot
- Retrieval-Augmented Generation (RAG)
- Semantic search using Pinecone
- Google Gemini powered responses
- Conversation history support
- Follow-up question understanding
- Platform-specific answers only
- Floating chatbot available across all pages

## RAG Pipeline

The chatbot follows a Retrieval-Augmented Generation pipeline:

1. User submits a question.
2. Previous conversation history is used to rewrite follow-up questions into standalone queries.
3. The rewritten query is converted into vector embeddings using **Gemini Embeddings**.
4. Similar documents are retrieved from **Pinecone Vector Database**.
5. Relevant context is combined with conversation history.
6. **Gemini** generates a final response strictly using the retrieved platform documentation.
7. The conversation is stored for future context-aware interactions.

### Indexing Pipeline

- Load platform documentation (PDF)
- Split documents into semantic chunks
- Generate embeddings using Gemini
- Store vectors inside Pinecone
- Retrieve top matching chunks during inference

## AI Technologies

- Google Gemini 1.5 Flash
- Gemini Embedding Model
- LangChain
- Pinecone Vector Database
- Retrieval-Augmented Generation (RAG)
- Semantic Search
- Prompt Engineering

<p align="center">
  <img src="https://github.com/ayushrajput545/StudyNotion-Online-Learning-System/blob/main/Screenshot%202026-07-31%20225153.png" height="300" />

  <img src="https://github.com/ayushrajput545/StudyNotion-Online-Learning-System/blob/main/Screenshot%202026-07-31%20224432.png" height="300" />
</p>

## Chatbot Architecture

```text
User
   │
   ▼
React Chatbot UI
   │
   ▼
Node.js API
   │
   ▼
Rewrite Follow-up Query
   │
   ▼
Gemini Embeddings
   │
   ▼
Pinecone Vector Search
   │
   ▼
Relevant Documentation
   │
   ▼
Gemini 1.5 Flash
   │
   ▼
Response
```

## Deployment
- **Frontend:** Netlify
- **Backend:** Render

## Live Link
[StudyNotion Live](https://studynotion-edtec.netlify.app/) 

## Screenshots
![Dashboard Screenshot](https://github.com/ayushrajput545/StudyNotion-Ed-Tech-Platform/blob/main/Screenshot%202025-02-01%20211957.png)

![Course Page Screenshot](https://github.com/ayushrajput545/StudyNotion-Ed-Tech-Platform/blob/main/Screenshot%202025-02-01%20212936.png)

### Feel free to fork the repository and submit a pull request.
   ```bash
   git clone https://github.com/your-username/StudyNotion-Online-Learning-System-app.git
   cd tomato-StudyNotion-Online-Learning-System
   ```
