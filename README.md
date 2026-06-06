# Instagram Profile Analyzer

An AI-powered Instagram Profile Analyzer that provides deep insights into Instagram accounts, including profile overview, niche detection, content analysis, engagement metrics, audience insights, and growth recommendations.

## Features

* Profile Overview Analysis
* Niche Detection
* Posting Frequency Analysis
* Content Theme Identification
* Engagement Analysis
* Audience Type Detection
* Top Performing Post Analysis
* AI-Powered Growth Recommendations
* Clean Modern UI
* Real-Time Analysis via n8n Workflow

## Tech Stack

### Frontend

* React
* Vite
* JavaScript
* Tailwind CSS

### Backend & Automation

* n8n
* AI Models (Groq/OpenAI)
* Apify Instagram Scraper

### Database

* Supabase

## How It Works

1. User enters an Instagram username.
2. Frontend sends a request to an n8n webhook.
3. n8n triggers the Instagram scraper.
4. Profile data is processed using AI.
5. Analysis is generated and returned to the frontend.
6. User receives a complete Instagram growth report.

## Installation

Clone the repository:

```bash
git clone https://github.com/Rishitmanchhani/instagram-profile-analyzer.git
```

Navigate to the project:

```bash
cd instagram-profile-analyzer
```

Install dependencies:

```bash
npm install
```

Start development server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Preview production build:

```bash
npm run preview
```

## Environment Variables

Create a `.env` file:

```env
VITE_N8N_WEBHOOK_URL=your_webhook_url
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Live Demo

Add your deployed Vercel URL here.

## Author

**Rishit Manchhani**

Applied AI Developer | AI Automation Developer | Full Stack Developer

LinkedIn: https://linkedin.com/in/rishitmanchhani

GitHub: https://github.com/Rishitmanchhani
