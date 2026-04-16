# CarDekho AI - Smart Car Recommendation Platform

An AI-powered car recommendation app that helps Indian car buyers find their perfect car through an interactive quiz. The AI analyzes 50+ real cars against user preferences and delivers personalized recommendations with match scores and detailed explanations.

**Live flow:** Answer 5 quick questions (budget, body type, fuel, priorities, usage) → AI analyzes the full dataset → get your top 3-5 picks with pros/cons tailored to your needs → compare cars side-by-side.

## What I Built & Why

The Indian car market has 50+ popular models across 12 brands. A first-time buyer faces information overload — comparing specs, reading reviews, visiting dealerships. CarDekho AI solves this by acting as a smart advisor:

1. **AI Car Finder** — A 5-step wizard collects preferences (budget, body type, fuel, priorities like safety/mileage, usage pattern, family size). The app pre-filters the dataset, then sends matched cars + user context to Google Gemini, which returns personalized recommendations with specific reasoning.

2. **Browse & Filter** — A full catalog of 50 cars with search, filters (brand, body type, fuel, price range), sorting, and detailed spec modals — for users who prefer to explore on their own.

3. **Compare** — Select 2-3 recommended cars and view a side-by-side comparison table covering price, mileage, engine, fuel, transmission, safety rating, seating, and key features.

4. **Graceful Fallback** — If the Gemini API key is missing or the API fails, the app returns filter-based mock recommendations so the experience never breaks.

## What I Deliberately Cut

This is an MVP focused on the core recommendation loop. I intentionally skipped:

- **User authentication/accounts** — no login needed to get recommendations
- **Real car images** — used text-based cards with specs/badges instead
- **Saved shortlists/wishlists** — recommendations are generated fresh each time
- **Dealer integration** — no pricing/booking from dealerships
- **EMI calculator** — kept focus on car selection, not financing
- **Chat-based follow-up questions** — the 5-step wizard captures enough context

Each of these is a natural next step but would have diluted the core experience for v1.

## Tech Stack & Why

| Technology | Why |
|---|---|
| **Next.js 14 (App Router)** | Full-stack in one framework — API routes + SSR + static pages. Fast to build and deploy. |
| **Google Gemini API** | Free tier, powerful enough for structured car recommendations. The `gemini-1.5-flash` model is fast and follows JSON output instructions well. |
| **Tailwind CSS** | Rapid UI development with utility classes. No context-switching between CSS files. |
| **TypeScript** | Type safety for the Car interface and API contracts without ceremony. |
| **Lucide React** | Clean, consistent icon set that matches the minimal UI. |
| **JSON dataset** | Simple, no database setup needed for an MVP with 50 cars. Easy to update and version control. |

## AI Tool Usage

- Used **Claude Code** for scaffolding components, API routes, and dataset generation
- Manually reviewed and adjusted the Gemini recommendation prompt engineering — tuned the system prompt, JSON output format, and budget parsing logic
- Course-corrected UI layout decisions (card grid density, wizard step flow, comparison table structure)
- Tools helped most with boilerplate: repetitive step components, Tailwind card layouts, and the 50-car JSON dataset
- Had to manually fix TypeScript types for the Gemini SDK integration, `params` typing in Next.js dynamic routes, and edge cases in budget string parsing

## If I Had 4 More Hours

- **Real car images** — fetch from an image API or CDN, add image cards with lazy loading
- **User accounts with saved shortlists** — NextAuth + database to save and revisit recommendations
- **Chat-based follow-up** — after getting recommendations, ask the AI follow-up questions ("Is the Nexon good for highway driving?")
- **EMI/loan calculator** — input down payment + tenure, show monthly EMI for each recommended car
- **Comparison charts** — radar charts or bar graphs comparing specs visually instead of just a table
- **Expand the dataset** — add more cars, real aggregated user reviews, dealer pricing by city

## AI Integration Details

The recommendation engine works in 3 stages:

1. **Pre-filter** — `lib/cars.ts` narrows 50 cars to ~10-15 based on budget range, body type, fuel type, and family size (auto-selects 7-seaters for families > 5).

2. **AI Analysis** — The filtered cars + full user preferences are sent to Gemini with a system prompt: *"You are an expert Indian car advisor..."*. The prompt includes all car specs, features, pros, cons, and review summaries.

3. **Structured Response** — Gemini returns JSON with a summary, and for each recommended car: match score (1-100), personalized reason, pros/cons specific to the user's needs. The response is parsed and merged with the full dataset for display.

**Fallback:** If `GOOGLE_GEMINI_API_KEY` is `placeholder` or the API errors, the app returns basic filter-sorted recommendations so the UI always works.

## Project Structure

```
cardekho_ai/
├── app/
│   ├── layout.tsx              # Root layout with Navbar, fonts, metadata
│   ├── page.tsx                # Landing page (hero, how-it-works, stats)
│   ├── globals.css             # Tailwind imports, smooth scroll
│   ├── finder/
│   │   ├── layout.tsx          # Finder page metadata
│   │   └── page.tsx            # 5-step AI wizard + loading + results
│   ├── cars/
│   │   ├── layout.tsx          # Browse page metadata
│   │   └── page.tsx            # Filter/search/sort grid with detail modal
│   └── api/
│       ├── cars/
│       │   ├── route.ts        # GET /api/cars — filtered car listing
│       │   └── [id]/route.ts   # GET /api/cars/:id — single car
│       └── recommend/
│           └── route.ts        # POST /api/recommend — AI recommendations
├── components/
│   ├── Navbar.tsx              # Sticky navbar with active link highlighting
│   ├── ProgressBar.tsx         # Animated step progress bar
│   ├── StepBudget.tsx          # Budget selection cards
│   ├── StepBodyType.tsx        # Body type selection with icons
│   ├── StepFuelType.tsx        # Fuel type selection with icons
│   ├── StepPriorities.tsx      # Multi-select priority cards
│   ├── StepUsage.tsx           # Usage pattern + family size
│   ├── Results.tsx             # AI results with compare feature
│   └── CarDetailModal.tsx      # Full car spec modal
├── lib/
│   ├── types.ts                # Car TypeScript interface
│   └── cars.ts                 # Data loading and filtering utilities
├── data/
│   └── cars.json               # 50 real Indian market cars dataset
└── .env.local                  # GOOGLE_GEMINI_API_KEY
```

## API Endpoints

### `GET /api/cars`

Returns filtered and sorted car list.

| Query Param | Example | Description |
|---|---|---|
| `brand` | `Tata` | Filter by make |
| `bodyType` | `SUV` | Filter by body type |
| `fuelType` | `Diesel` | Filter by fuel type |
| `transmission` | `Automatic` | Filter by transmission |
| `minPrice` | `10` | Minimum price in lakhs |
| `maxPrice` | `20` | Maximum price in lakhs |
| `sortBy` | `price_asc` | Sort: `price_asc`, `price_desc`, `mileage_desc`, `safety_desc` |

**Response:** `{ count: number, cars: Car[] }`

### `GET /api/cars/:id`

Returns a single car by ID. Returns 404 if not found.

### `POST /api/recommend`

AI-powered car recommendations.

**Request body:**
```json
{
  "budget": "12-20 Lakh",
  "bodyType": "SUV",
  "fuelType": "Petrol",
  "priorities": ["Safety", "Mileage"],
  "usage": "City Driving",
  "familySize": 4
}
```

**Response:**
```json
{
  "summary": "Based on your preferences...",
  "recommendations": [
    {
      "carId": 6,
      "carName": "Tata Nexon",
      "reason": "The Nexon's 5-star safety rating directly matches...",
      "prosForUser": ["..."],
      "consForUser": ["..."],
      "matchScore": 92
    }
  ]
}
```

## Dataset

50 real Indian market cars across 12 brands:

**Brands:** Maruti Suzuki, Tata, Mahindra, Hyundai, Honda, Kia, Toyota, MG, Skoda, Volkswagen, BMW, Mercedes-Benz

**Body Types:** SUV, Sedan, Hatchback, MPV

**Fuel Types:** Petrol, Diesel, Electric, CNG, Hybrid

Each car entry includes: make, model, variant, ex-showroom price, body type, fuel type, transmission, engine CC, mileage, NCAP safety rating (1-5), seating capacity, 5 key features, 3 pros, 3 cons, and a one-line user review summary.

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Installation

```bash
git clone <repo-url>
cd cardekho_ai
npm install
```

### Environment Setup

Edit `.env.local` and add your Gemini API key:

```
GOOGLE_GEMINI_API_KEY=your_actual_api_key_here
```

Get a free API key from [Google AI Studio](https://aistudio.google.com/apikey).

> The app works without a real API key — it falls back to filter-based recommendations.

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Production Build

```bash
npm run build
npm start
```

## Pages

| Route | Description |
|---|---|
| `/` | Landing page — hero, how-it-works, stats |
| `/finder` | AI Car Finder — 5-step wizard → AI recommendations → compare |
| `/cars` | Browse all 50 cars with search, filters, sort, and detail modals |

## Key Design Decisions

1. **Pre-filtering before AI** — Sending all 50 cars to Gemini would waste tokens and slow responses. Pre-filtering to ~10-15 relevant cars makes the AI faster and more focused.

2. **JSON dataset over database** — For 50 static car entries, a JSON file is simpler than setting up a database. It's version-controlled, zero-config, and loads instantly.

3. **Mock fallback** — The app should always work, even without an API key. This makes development, demos, and testing frictionless.

4. **Wizard over chat** — A structured 5-step form captures all needed preferences in ~30 seconds. A chat interface would be more flexible but slower for this specific use case.

5. **Compare feature in results** — Users naturally want to compare their top picks. Building comparison directly into the results page (instead of a separate page) keeps the flow tight.

## Live Demo

> [Add Vercel deployment URL here after deploying]

Deploy with one click:

```bash
npm run build   # verify build passes
npx vercel      # deploy to Vercel
```
