# Summarie

## Overview
Summarie is a Next.js application that turns uploaded PDF documents into readable AI-generated summaries. Authenticated users can upload a PDF, let Gemini generate a structured summary, and then review past summaries from a protected dashboard.

## Features
- PDF upload flow with authenticated access control
- AI summary generation powered by Gemini
- Summary storage in Neon/PostgreSQL
- Protected dashboard for browsing and deleting saved summaries
- Stripe-backed pricing and subscription status handling
- Clerk authentication for sign-in, sign-up, and protected routes
- Responsive landing page with pricing and feature sections

## Tech Stack
Frontend
- Next.js 15 App Router
- React 19
- TypeScript
- Tailwind CSS 4
- Radix UI primitives
- Motion

Backend
- Next.js server actions
- Next.js route handlers

Database
- Neon serverless PostgreSQL
- SQL schema in [schema.sql](/E:/Downloads/Sommaire-ai-main/Sommaire-ai-main/schema.sql)

Authentication
- Clerk

File Uploads
- UploadThing

AI and Document Processing
- Google Gemini via `@google/genai`
- LangChain PDF loader

Payments
- Stripe webhooks and payment metadata persistence

## Project Structure
- [app](/E:/Downloads/Sommaire-ai-main/Sommaire-ai-main/app) contains routes, layouts, and API endpoints
- [actions](/E:/Downloads/Sommaire-ai-main/Sommaire-ai-main/actions) contains server actions for summary creation and deletion
- [components](/E:/Downloads/Sommaire-ai-main/Sommaire-ai-main/components) contains landing page, upload, and summary UI
- [lib](/E:/Downloads/Sommaire-ai-main/Sommaire-ai-main/lib) contains database, AI, payment, and summary helpers
- [utils](/E:/Downloads/Sommaire-ai-main/Sommaire-ai-main/utils) contains pricing data, prompts, formatting helpers, and UploadThing bindings
- [public](/E:/Downloads/Sommaire-ai-main/Sommaire-ai-main/public) contains static assets

## How It Works
1. A signed-in user uploads a PDF through UploadThing.
2. The upload server returns a file URL after authorization through Clerk.
3. A server action downloads the PDF, extracts text with LangChain, and sends the text to Gemini for summarization.
4. The generated summary is stored in PostgreSQL together with the original file metadata.
5. Users can review summaries in the dashboard and open a dedicated summary viewer page.

## Prerequisites
- Node.js 20 or newer recommended
- npm
- A Clerk application
- A Neon PostgreSQL database
- A Gemini API key
- An UploadThing app token
- Stripe credentials if you want pricing and webhook handling enabled

## Installation
```bash
git clone <your-repository-url>
cd Sommaire-ai-main
npm install
```

## Environment Variables
Create a local `.env` file based on [.env.example](/E:/Downloads/Sommaire-ai-main/Sommaire-ai-main/.env.example).

Required for the core app:
- `NEXT_PUBLIC_APP_URL`
- `DATABASE_URL`
- `GEMINI_API_KEY`
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `CLERK_SECRET_KEY`
- `UPLOADTHING_TOKEN`

Required for Clerk route helpers:
- `NEXT_PUBLIC_CLERK_SIGN_IN_URL`
- `NEXT_PUBLIC_CLERK_SIGN_UP_URL`

Required for Stripe-enabled pricing:
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `STRIPE_BASIC_PRICE_ID`
- `STRIPE_PRO_PRICE_ID`
- `NEXT_PUBLIC_STRIPE_BASIC_PAYMENT_LINK`
- `NEXT_PUBLIC_STRIPE_PRO_PAYMENT_LINK`

## Running Locally
Install dependencies and start the development server:

```bash
npm install
npm run dev
```

The app runs on `http://localhost:3000` by default.

## Usage
1. Sign up or sign in.
2. Open the upload page.
3. Upload a PDF under the configured size limit.
4. Wait for summarization and storage to complete.
5. Open the generated summary from the redirect or dashboard.

## API Documentation
Implemented routes:
- `POST /api/uploadthing`
  Handles UploadThing file uploads for PDFs.
- `POST /api/payments`
  Processes Stripe webhook events for completed checkout sessions and cancelled subscriptions.

## Database Setup
Run the SQL in [schema.sql](/E:/Downloads/Sommaire-ai-main/Sommaire-ai-main/schema.sql) against your PostgreSQL database to create:
- `users`
- `pdf_summaries`
- `payments`
- `updated_at` triggers

## Future Improvements
- Replace direct payment links with a first-party checkout session flow
- Add formal database migrations instead of a single schema file
- Add automated tests for upload, summary generation, and billing logic
- Improve failure handling for third-party service outages

## Contributing
Open an issue or submit a pull request with a focused change and clear description.

## Acknowledgements
- [Clerk](https://clerk.com/)
- [Google Gemini](https://ai.google.dev/)
- [LangChain](https://www.langchain.com/)
- [UploadThing](https://uploadthing.com/)
- [Neon](https://neon.com/)
