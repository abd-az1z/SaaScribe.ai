# SaaScribe.ai 📄💬
**Chat with Your Files. Powered by AI.**
_“Let Your Documents Speak.”_

## 🚀 Overview

**SaaScribe.ai** is an AI-powered SaaS platform that allows users to upload PDF documents and engage in intelligent chat-based interactions with the content. This app combines file storage, document parsing, and conversational AI into a streamlined user experience.

## 💰 Pricing & Plans

### 🔍 Free Plan
- 📁 10 PDF uploads per month
- 💬 Basic AI chat
- 📊 Basic analytics
- 🔐 Secure document storage
- 📱 Mobile-responsive UI

### 🌟 Premium Plan (Coming Soon)
- 📁 100 PDF uploads per month
- 💬 Advanced AI chat
- 📊 Detailed analytics
- 📈 Document version history
- 🔐 Enterprise-grade security
- 🏃‍♂️ Priority support

## 🧠 Features

---

## 🧠 Features

- 📁 **PDF Upload & Viewer**  
  Drag-and-drop uploader with preview and page navigation powered by `react-pdf`.

- 💬 **Chat with Documents**  
  Interact with the uploaded PDF using a chat interface powered by OpenAI and LangChain.

- 🔐 **Authentication**  
  Integrated using Clerk for secure sign-in, sign-up, and session management.

- 🌐 **Real-time File Sharing**  
  Share documents and view them collaboratively via Firebase Firestore and Storage.

- 🧾 **Usage-based Billing**  
  Stripe integration for user subscription and file limits per tier.

- 🔍 **Semantic Search with Pinecone**  
  Vector embeddings using OpenAI + LangChain with Pinecone to semantically index and search document content.

- ⚡ **Modern Stack & UI**  
  Vite + Next.js 15, Tailwind CSS, ShadCN UI, and React Icons for a clean, modern interface.

---

## 🛠 Tech Stack

| Tech          | Usage                             |
|---------------|-----------------------------------|
| **Next.js 15**| Core React framework (App Router) |
| **Vite**      | Fast development environment       |
| **Clerk**     | Auth (sign in/out, session, user) |
| **Firebase**  | Firestore DB + Storage            |
| **LangChain** | AI document interaction pipeline  |
| **Pinecone**  | Vector storage for embeddings     |
| **OpenAI**    | ChatGPT document Q&A              |
| **Stripe**    | Subscription & payments           |
| **TailwindCSS**| Responsive design                |
| **ShadCN UI** | Component styling                 |

---

## 🧩 Folder Structure

/app                → Next.js App Router pages
/components         → Shared UI components
/hooks              → Custom React hooks
/lib                → Utilities (Firebase, Stripe, LangChain)
/public             → Static assets
/styles             → Tailwind config and global styles

---

## 🔧 Setup Instructions

### 1. Clone the Repo

```bash
git clone https://github.com/your-username/saascribe.ai.git
cd saascribe.ai

npm install

NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_key
CLERK_SECRET_KEY=your_secret
NEXT_PUBLIC_FIREBASE_API_KEY=your_key
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_id
OPENAI_API_KEY=your_key
STRIPE_SECRET_KEY=your_key
PINECONE_API_KEY=your_key
PINECONE_ENVIRONMENT=your_env

npm run dev

✅ Features in Progress
	•	✅ PDF Upload with Firebase
	•	✅ Full chat integration (OpenAI + LangChain)
	•	✅ Embedding & vector search (Pinecone)
	•	✅ Secure routing with Clerk
	•	✅ Stripe billing workflow
	•	✅ Document sharing with access control
	•	🔄 UI refinement, loading states, and mobile responsiveness

### Premium Features (Coming Soon)
	•	📈 Document version history
	•	🔍 Advanced search capabilities
	•	📊 Detailed analytics dashboard
	•	🎨 Document editing tools
	•	📝 Document signing
	•	👥 Team collaboration tools

⸻

📌 TODOs
	•	Add user-based document history
	•	Enable document renaming/editing
	•	Support for additional file types (e.g., DOCX)
	•	Integrate AI summaries
	•	Add usage analytics dashboard
	•	User roles and team collaboration support
👨‍💻 Author

Built with ❤️ by Abdulaziz
Connect on LinkedIn