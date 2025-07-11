# SaaScribe.ai 📄💬
**Chat with Your Files. Powered by AI.**  
_"Let Your Documents Speak."_

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Next.js](https://img.shields.io/badge/Next.js-14.0.0+-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0.0+-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.3.0+-06B6D4?logo=tailwind-css)](https://tailwindcss.com/)

## 🚀 Overview

**SaaScribe.ai** is an AI-powered SaaS platform that revolutionizes document interaction. Users can upload PDF documents and engage in intelligent, context-aware conversations about their content. Built with modern web technologies, this application combines secure file storage, advanced document parsing, and state-of-the-art conversational AI to create a seamless user experience.

🔹 **Key Benefits**
- **Instant Insights**: Get answers from your documents in seconds
- **Secure & Private**: Your documents are stored securely with enterprise-grade encryption
- **Easy to Use**: Intuitive interface that works across all devices
- **Powerful AI**: Powered by OpenAI and LangChain for accurate, contextual responses

## ✅ Project Status

SaaScribe.ai is a **fully developed and production-ready SaaS application**. All core features including PDF processing, semantic search, AI chat integration, secure authentication, and payment processing have been implemented and thoroughly tested. The platform is actively maintained with regular updates and improvements based on user feedback.

## 🔗 Live Demo

Experience SaaScribe.ai in action: [https://saascribe.vercel.app](https://saascribe.vercel.app)

> 💡 For a personalized demo or enterprise inquiries, please [contact us](#-contact).

## 💰 Pricing & Plans

### 🔍 Free Plan
- 📁 3 PDF uploads per month
- 💬 Basic AI chat with 3 Questions/Pdf
- 📱 Mobile-responsive UI

### 🌟 Premium Plan (Beta Available)
- 📁 100 PDF uploads per month
- 💬 Advanced AI chat
- 📊 Detailed analytics
- 📈 Document version history
- 🔐 Enterprise-grade security
- 🏃‍♂️ Priority support
- 🚀 Early access to new features

> 💡 Premium features are fully implemented and being rolled out to beta users. [Contact us](#-contact) for early access.

## ✨ Key Features

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

## 🗂 Project Structure

```
saascribe.ai/
├── app/                  # Next.js 14 App Router pages and API routes
│   ├── (auth)/           # Authentication related routes
│   ├── api/              # API endpoints
│   └── dashboard/        # Main application dashboard
├── actions/              # Server actions for data mutations
├── components/           # Reusable UI components
│   ├── ui/               # ShadCN UI components
│   └── ...               # Other feature components
├── firebase/             # Firebase configuration and utilities
├── hooks/                # Custom React hooks
├── lib/                  # Core application logic
│   ├── db/               # Database utilities
│   ├── langchain/         # AI and document processing
│   └── stripe/           # Payment processing
├── public/               # Static assets
├── test/                 # Test files
├── .env.local            # Environment variables
└── package.json          # Project dependencies
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18.0.0 or later
- npm or yarn
- Firebase project with Firestore and Storage enabled
- OpenAI API key
- Pinecone account
- Stripe account (for payments)
- Clerk account (for authentication)

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/abd-az1z/saascribe.ai.git
   cd saascribe.ai
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install

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