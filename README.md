<div align="center">

# SaaScribe.ai

**Turn any PDF into an intelligent conversation — and every contract into a risk report.**

[![Live Demo](https://img.shields.io/badge/Live%20Demo-saascribe.vercel.app-00f2fe?style=for-the-badge&logo=vercel)](https://saascribe.vercel.app)
[![Next.js](https://img.shields.io/badge/Next.js%2016-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![OpenAI](https://img.shields.io/badge/GPT--4o-412991?style=for-the-badge&logo=openai&logoColor=white)](https://openai.com/)

</div>

---

## What Is SaaScribe.ai?

SaaScribe.ai is a production-ready AI SaaS platform that lets users upload PDF documents and have natural-language conversations with them — no copy-pasting, no ctrl+F, no reading 60-page contracts line by line. It ships two core products under one roof: a **PDF Chat assistant** that answers questions grounded in your document's actual content, and a **Contract Risk Lens** that scores legal documents for risk and surfaces specific clauses that warrant attention.

The platform is fully monetized with a freemium model (Stripe subscriptions), enforces per-tier usage limits in real time, and is deployed to Vercel.

**→ [Try the live demo](https://saascribe.vercel.app)**

---

## The Problem It Solves

| Before SaaScribe.ai | After SaaScribe.ai |
|---|---|
| Read a 40-page report to find one answer | Ask a question, get the answer in seconds |
| Spend 45 minutes reviewing a contract | Get a risk score + flagged clauses in under 2 minutes |
| Email back and forth with your legal team | Understand obligations yourself, instantly |
| Lose context switching between PDF and notes | Chat history persists alongside the document |

---

## Features

### PDF Chat (RAG-powered)
- **Drag-and-drop upload** — uploads directly to Firebase Storage; processing begins immediately
- **AI Q&A with memory** — GPT-4o answers questions grounded in the document using a LangChain retrieval chain; prior conversation turns are included in context so follow-up questions work naturally
- **Split-panel view** — PDF viewer (react-pdf) on the left, live chat on the right; no context switching
- **Optimistic UI** — messages appear instantly with an animated "Thinking..." state while the AI responds
- **Per-tier limits enforced end-to-end** — both the client and server action independently enforce free (3 questions) vs. Pro (100 questions) limits

### Contract Risk Lens
- **One-click contract upload** — paste or upload a PDF contract and receive a structured risk report
- **Hybrid analysis** — rule-based keyword detection (indemnification, arbitration, auto-renewal, etc.) combined with GPT-4o for nuanced clause-level findings
- **Risk score (0–100)** — a quantified score deducted by finding severity (high: −15, medium: −5, low: −2), giving a clear signal at a glance
- **Structured findings** — each finding carries a type (`missing_clause`, `risky_clause`, `general_risk`), severity, and description, stored in NeonDB via Drizzle ORM

### Platform
- **Clerk authentication** — sign up / sign in / session management with zero boilerplate
- **Freemium billing** — Stripe Checkout + Customer Portal; webhook handler syncs subscription state back to Firestore
- **Subscription-aware UI** — pricing page, dashboard, and chat input all respond live to the user's plan
- **Responsive design** — works across mobile, tablet, and desktop; chat panel adapts to viewport height

---

## Tech Stack

| Layer | Technology | Why |
|---|---|---|
| **Framework** | Next.js 16 (App Router) | Server actions, streaming, file-based routing |
| **Language** | TypeScript 5 | End-to-end type safety across client, server, and DB |
| **Auth** | Clerk | Drop-in auth with session tokens and user management |
| **AI / LLM** | OpenAI GPT-4o via LangChain | Best-in-class reasoning; LangChain handles the RAG chain |
| **Vector DB** | Pinecone | Semantic search over document embeddings; namespace per document |
| **File Storage** | Firebase Storage | Scalable PDF storage with secure download URLs |
| **Realtime DB** | Firestore | Chat history synced in real time via `react-firebase-hooks` |
| **SQL DB** | NeonDB (Postgres) + Drizzle ORM | Structured storage for risk assessments and documents |
| **Payments** | Stripe | Subscriptions, Checkout, Customer Portal, webhooks |
| **UI** | Tailwind CSS v4, Radix UI, shadcn/ui | Accessible component primitives with utility-first styling |
| **Animation** | Framer Motion | Page transitions and micro-interactions |
| **Deployment** | Vercel | Edge-optimized Next.js hosting with env management |

---

## Architecture Overview

```
User Browser
    │
    ├─ Clerk (Auth)
    │
    └─ Next.js 16 (Vercel)
         ├─ App Router pages
         │    ├─ /dashboard          → document list (Firestore)
         │    ├─ /dashboard/files/[id] → PDF viewer + chat
         │    ├─ /risk-lens          → contract analysis tool
         │    └─ /dashboard/upgrade  → Stripe Checkout
         │
         ├─ Server Actions
         │    ├─ askQuestion         → LangChain retrieval chain → GPT-4o → Firestore
         │    ├─ generateEmbeddings  → PDF parse → chunk → OpenAI embed → Pinecone
         │    ├─ createCheckoutSession → Stripe
         │    └─ createStripePortal  → Stripe Customer Portal
         │
         └─ API Routes
              ├─ /api/upload         → Firebase Storage
              ├─ /api/documents      → NeonDB via Drizzle
              └─ /webhook            → Stripe events → Firestore sync

RAG Pipeline (per question):
  PDF (Firebase Storage)
    → pdf-parse + RecursiveCharacterTextSplitter
    → OpenAIEmbeddings
    → PineconeStore (namespace = docId)
    → similarity_search(question, k=4)
    → createRetrievalChain + ChatPromptTemplate
    → GPT-4o
    → Firestore (chat history)
```

---

## Pricing

| | **Free** | **Pro — $5.99/mo** |
|---|---|---|
| PDFs | 3 total | 30 |
| Questions per PDF | 3 | 100 |
| Page limit per file | 5 pages | Unlimited |
| Delete PDFs | — | ✓ |
| AI Chat with Memory Recall | Basic | Full |
| Priority support | — | ✓ |
| Early access to new features | — | ✓ |

---

## Running Locally

### Prerequisites

- Node.js 18+
- Accounts for: Firebase, Clerk, OpenAI, Pinecone, Stripe, NeonDB

### 1. Clone and install

```bash
git clone https://github.com/abd-az1z/saascribe.ai.git
cd saascribe.ai
npm install
```

### 2. Environment variables

Create a `.env.local` file:

```env
# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_...
CLERK_SECRET_KEY=sk_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up

# Firebase (client)
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

# Firebase Admin (server)
FIREBASE_ADMIN_PROJECT_ID=
FIREBASE_ADMIN_CLIENT_EMAIL=
FIREBASE_ADMIN_PRIVATE_KEY=

# OpenAI
OPENAI_API_KEY=sk-...

# Pinecone
PINECONE_API_KEY=
PINECONE_INDEX=projects-aziz

# Stripe
STRIPE_SECRET_KEY=sk_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRO_PRICE_ID=price_...

# NeonDB
DATABASE_URL=postgresql://...
```

### 3. Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

> **Stripe webhooks locally:** run `stripe listen --forward-to localhost:3000/webhook` in a separate terminal to test subscription flows.

### 4. Database migrations (Risk Lens)

```bash
npx drizzle-kit push
```

---

## Project Structure

```
saascribe.ai/
├── app/
│   ├── page.tsx                  # Landing page
│   ├── dashboard/                # Authenticated app
│   │   ├── page.tsx              # Document list
│   │   ├── files/[id]/page.tsx   # PDF viewer + chat
│   │   └── upgrade/page.tsx      # Upgrade flow
│   ├── risk-lens/page.tsx        # Contract Risk Lens
│   └── webhook/route.ts          # Stripe webhook handler
├── actions/
│   ├── askQuestion.ts            # RAG Q&A server action
│   ├── generateEmbeddings.ts     # Embedding pipeline
│   ├── createCheckoutSession.ts  # Stripe checkout
│   └── createStripePortal.ts     # Stripe portal
├── components/
│   ├── ChatWithPdf.tsx           # Real-time chat interface
│   ├── PdfView.tsx               # PDF renderer
│   ├── FileUploader.tsx          # Drag-and-drop upload
│   ├── PricingSection.tsx        # Plan-aware pricing UI
│   └── risk-dashboard.tsx        # Risk analysis results
├── lib/
│   ├── langChain.ts              # LangChain RAG pipeline
│   ├── pinecone.ts               # Pinecone client
│   ├── risk-engine.ts            # Contract analysis engine
│   ├── schema.ts                 # Drizzle schema
│   └── stripe-server.ts          # Stripe helpers
├── firebase/
│   ├── firebase.ts               # Client SDK
│   └── firebaseAdmin.ts          # Admin SDK
└── hooks/
    ├── useSubscription.ts        # Realtime plan state
    └── useUpload.ts              # Upload state machine
```

---

## What I Built and Learned

This project was an exercise in shipping a real product, not just writing code. Key decisions and outcomes:

- **RAG pipeline from scratch** — implemented chunking, embedding, namespace-based vector retrieval, and chat-history-aware prompting without a pre-built wrapper, which forced a deep understanding of how retrieval-augmented generation actually works
- **Dual-database architecture** — Firebase Firestore handles realtime chat sync, while NeonDB (Postgres) stores structured risk assessment data; choosing the right tool for each data shape rather than forcing one DB to do everything
- **Monetization that actually works** — subscription state is enforced on both the client (UX) and server action (security), and Stripe webhook events are idempotently synced to Firestore so the UI never gets out of sync
- **Product thinking over feature thinking** — the Contract Risk Lens feature started as a technical curiosity about hybrid AI analysis; framing it as "reduce contract review from 45 minutes to 2 minutes" turned it into a feature with a clear value proposition

---

## Contact

**Abdulaziz** — [@abd_az1z](https://twitter.com/abd_az1z) — mohdabdulaziz2023@gmail.com

Project: [github.com/abd-az1z/saascribe.ai](https://github.com/abd-az1z/saascribe.ai) · Live: [saascribe.vercel.app](https://saascribe.vercel.app)
