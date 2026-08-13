# NutriMind — AI Food & Wellness Assistant (Frontend)

> **Eat smarter. Feel better. Every day.**

This is the **React + Vite frontend** for **NutriMind**, an AI-Powered Personal Food & Wellness Assistant. It includes a startup-grade public landing page, a split-screen sign-in experience, and a full-featured wellness application.

---

## Application Architecture

```
React Frontend (Vite)  ──►  Express.js REST API (Node.js)  ──►  MongoDB
```

> [!IMPORTANT]
> The React frontend communicates **exclusively** with Express.js REST API endpoints. It never connects directly to MongoDB or exposes any database credentials.

---

## Route Structure

### Public Routes (No sidebar/app shell)
| Route | Component | Description |
|-------|-----------|-------------|
| `/` | `LandingPage.jsx` | Premium AI startup landing page |
| `/signin` | `SignIn.jsx` | Split-screen sign-in & sign-up |

### Application Routes (With sidebar navigation)
| Route | Component | Description |
|-------|-----------|-------------|
| `/dashboard` | `Dashboard.jsx` | Wellness overview & today's meals |
| `/analyze` | `AnalyzeFood.jsx` | AI food analysis & image upload |
| `/diary` | `FoodDiaryPage.jsx` | Food history & date navigation |
| `/profile` | `Profile.jsx` | Health profile editor |

---

## Features

### Landing Page (`/`)
- **Sticky Navbar** — Logo, section links, Sign In & Get Started CTAs, mobile hamburger menu
- **Hero Section** — Brand headline with accent, live dashboard preview mockup card (meals + AI insight), floating AI badge, and feature checkmarks
- **Trust & Value Strip** — 3 compact value highlights (AI Analysis, Personalized Guidance, Food Diary)
- **How It Works** — 3-step numbered workflow cards with hover lift effects
- **Feature Grid** — 4 interactive feature cards (AI Analysis, Profile, Diary, Insights)
- **Personalization Section** — Dark green visual flow diagram: `Your Profile + Today's Food + Food History → Personalized Guidance`
- **CTA Banner** — High-impact sign-up call to action
- **Footer** — Brand tagline, section links, copyright

### Sign-In Page (`/signin`)
- **Desktop split-screen layout** — 50% dark brand panel + 50% white form card
- **Sign-In / Sign-Up toggle** — Switch between modes with a single link click
- **Password show/hide toggle** — Eye icon button to reveal/mask password
- **Remember Me** checkbox and "Forgot Password?" link
- **Form validation** — Client-side empty field check with friendly error message
- **Sign-in leads to `/dashboard`** — Front-end demo flow (backend auth connects to `POST /api/auth/login`)

### Wellness Application
- **Dashboard** — Personalized greeting, ProfileCard, DailyInsight, meal status tracker (Breakfast / Lunch / Snack / Dinner), today's meal cards
- **Analyze Food** — Text description + image upload (`multipart/form-data`), FoodAnalysisCard with RiskBadge, "Add to Food Diary" flow
- **Food Diary** — Date navigation (`< Previous Day / Next Day >`), meal timeline, detail modal with nutrition breakdown and delete
- **My Profile** — Health parameters form with required field validation, view/edit toggle modes, saves to `/api/profile`

---

## Tech Stack

### Frontend (This Repository)
- **Framework**: React 18
- **Build Tool**: Vite
- **Language**: JavaScript (ES6+ / JSX) — No TypeScript
- **Styling**: Vanilla CSS (custom `src/index.css` design system)
- **Routing**: `react-router-dom` v6
- **HTTP Client**: `axios`
- **Icons**: `lucide-react`

### Backend & Database (Maintained by Backend Team)
- **Backend**: Node.js + Express.js
- **Database**: MongoDB + Mongoose

---

## Folder Structure

```
frontend/
├── public/
├── src/
│   ├── components/
│   │   ├── Navbar.jsx           # Landing page sticky top navigation
│   │   ├── Sidebar.jsx          # App sidebar (desktop/tablet)
│   │   ├── MobileHeader.jsx     # Mobile app sticky top header with logo & hamburger
│   │   ├── MobileDrawer.jsx     # Slide-in mobile navigation drawer with backdrop
│   │   ├── MobileNav.jsx        # App bottom nav (mobile)
│   │   ├── Header.jsx           # Dynamic greeting header
│   │   ├── ProfileCard.jsx      # Health metrics summary card
│   │   ├── FoodInput.jsx        # Food description + meal type inputs
│   │   ├── FoodUpload.jsx       # Image drag-and-drop with preview
│   │   ├── FoodAnalysisCard.jsx # AI analysis result card + save CTA
│   │   ├── RiskBadge.jsx        # Wellness level pill badge
│   │   ├── MealCard.jsx         # Logged meal card
│   │   ├── DailyInsight.jsx     # AI daily insight banner
│   │   ├── LoadingState.jsx     # Animated loading spinner
│   │   ├── EmptyState.jsx       # Empty list state with CTA
│   │   └── ErrorState.jsx       # Friendly error state with retry
│   │
│   ├── pages/
│   │   ├── LandingPage.jsx      # Public marketing landing page
│   │   ├── SignIn.jsx           # Split-screen sign-in / sign-up
│   │   ├── Dashboard.jsx        # Main app dashboard
│   │   ├── AnalyzeFood.jsx      # Food analysis workflow
│   │   ├── FoodDiaryPage.jsx    # Food history & date navigation
│   │   └── Profile.jsx          # Health profile editor
│   │
│   ├── services/
│   │   └── api.js               # Centralized REST API service layer
│   │
│   ├── hooks/
│   │   └── useApi.js            # Custom hook for async API state
│   │
│   ├── data/
│   │   └── mockData.js          # Standalone dev fallback data
│   │
│   ├── App.jsx                  # Router + conditional layout shell
│   ├── main.jsx                 # React DOM entry point
│   └── index.css                # Full CSS design system
│
├── .env
├── .env.example
├── package.json
└── README.md
```

---

## Setup & Installation

```bash
# 1. Navigate to the frontend folder
cd frontend

# 2. Install dependencies
npm install

# 3. Copy environment variables
cp .env.example .env

# 4. Run the dev server
npm run dev
# → http://localhost:5173
```

### Environment Variables

```env
# .env
VITE_API_URL=http://localhost:5000/api
```

> All `VITE_` prefixed variables are **exposed to the browser**. Never put API keys or private credentials here.

---

## Scripts

| Command | Action |
|---------|--------|
| `npm run dev` | Start Vite development server |
| `npm run build` | Build production bundle to `dist/` |
| `npm run preview` | Preview production build locally |

---

## REST API Contract

All API calls are centralized in `src/services/api.js` using `VITE_API_URL`.

### Profile
| Method | Endpoint | Usage |
|--------|----------|-------|
| `GET` | `/api/profile` | Load user profile |
| `POST` | `/api/profile` | Create new profile |
| `PUT` | `/api/profile` | Update existing profile |

### Food Diary
| Method | Endpoint | Usage |
|--------|----------|-------|
| `POST` | `/api/food` | Log a food entry |
| `GET` | `/api/food` | Full food history |
| `GET` | `/api/food/today` | Today's logged meals |
| `GET` | `/api/food/:id` | Single entry detail |
| `PUT` | `/api/food/:id` | Update an entry |
| `DELETE` | `/api/food/:id` | Delete an entry |

### AI Analysis
| Method | Endpoint | Usage |
|--------|----------|-------|
| `POST` | `/api/analyze-food` | Analyze food (multipart/form-data: `food_description`, `meal_type`, `quantity`, `image`) |

---

## Standalone Development (Without Backend)

When the Express backend is not running, `src/services/api.js` automatically catches connection errors and falls back to `src/data/mockData.js` + `localStorage`:

- **Profile**: Defaults to mock profile for Chashmitha (age 20, height 152cm, weight 45kg, Active)
- **Food Diary**: Seeded with Idli + Sambar (Breakfast), Rice + Dal (Lunch), Samosa (Snack)
- **Food Analysis**: Returns a mock analysis based on keywords in the food description
- **Daily Insight**: Returns a static motivational insight card

No configuration changes are needed when connecting to the live Express backend — the API layer automatically uses live endpoints when `VITE_API_URL` is reachable.

---

## Design System

Defined in `src/index.css`:

| Token | Value | Usage |
|-------|-------|-------|
| `--primary` | `#2e6d54` | Main sage-green accent |
| `--bg-app` | `#f8faf8` | App background |
| `--bg-card` | `#ffffff` | Card surface |
| `--text-main` | `#18221c` | Primary text |
| `--text-muted` | `#5e6e65` | Secondary text |
| `--border-color` | `#e5ece8` | Card/input borders |

---

_Built for Sprint 1 — NutriMind AI Food & Wellness Assistant. Frontend only; backend maintained separately._

## About the Project

This is the **React Frontend Application** for **NutriMind**, an AI-Powered Personal Food & Wellness Assistant created for Sprint 1.

The system architecture follows a decoupled three-tier pattern:
```
React Frontend (Vite)  ──►  Express.js REST API (Node.js)  ──►  MongoDB Database
```

> [!IMPORTANT]
> The frontend communicates exclusively with the Express.js REST API endpoints. The React application **never** connects directly to MongoDB or exposes database credentials.

---

## Features

- 📊 **Wellness Dashboard**: View personalized morning greetings, today's logged meal counters, food breakdown, and daily AI insight cards.
- 🥗 **AI Food Analysis**: Enter text descriptions (e.g., *"I'm eating a samosa"*) or upload food photos (PNG, JPG, JPEG, WEBP) with preview and removal features.
- 🛡️ **Non-Alarmist Risk Badging**: Color-coded wellness indicators (`Low Concern`, `Moderate Concern`, `Higher Concern`) providing constructive wellness guidance without arbitrary medical percentages or diagnoses.
- 📖 **Food Diary**: Grouped daily meal timeline with date navigation (`< Previous Day`, `Current Date`, `Next Day >`), detailed entry modals, and meal deletion capabilities.
- 👤 **My Health Profile**: Personal profile manager for height, weight, age, activity level, diet preferences, allergies, health conditions, and additional notes with full client-side validation.
- 📱 **Responsive SaaS UI**: Responsive sidebar navigation for desktop/tablet viewports and bottom navigation bar for mobile devices.
- ⚡ **Graceful Development Fallback**: Seamless local mock data fallback when running standalone without an active backend server.

---

## Tech Stack

### Frontend (Maintained in this repository)
- **Framework**: React 18
- **Build Tool**: Vite
- **Language**: JavaScript (ES6+ / JSX)
- **Styling**: Vanilla CSS (Tailored SaaS Design System in `src/index.css`)
- **Routing**: `react-router-dom` v6
- **HTTP Client**: `axios`
- **Iconography**: `lucide-react`

### Backend & Database (Maintained by Backend Team)
- **Backend Framework**: Node.js + Express.js
- **Database**: MongoDB + Mongoose

---

## Folder Structure

```
frontend/
├── public/                # Static public assets
├── src/
│   ├── components/        # Reusable UI Components
│   │   ├── Sidebar.jsx          # Desktop/Tablet navigation drawer & branding
│   │   ├── Header.jsx           # Dynamic greeting header with time of day & user name
│   │   ├── ProfileCard.jsx      # Health metrics overview card
│   │   ├── FoodInput.jsx        # Food description, meal type & quantity input fields
│   │   ├── FoodUpload.jsx       # Image drag-and-drop & file picker with preview
│   │   ├── FoodAnalysisCard.jsx # AI analysis breakdown, RiskBadge, suggestion & save CTA
│   │   ├── RiskBadge.jsx        # Low / Moderate / Higher Concern pill component
│   │   ├── MealCard.jsx         # Card item for logged meals
│   │   ├── FoodDiary.jsx        # Grouped meal timeline list
│   │   ├── DailyInsight.jsx     # AI daily recommendation banner
│   │   ├── LoadingState.jsx     # Animated loading spinner with custom label
│   │   ├── EmptyState.jsx       # Illustrated empty list notification with call-to-action
│   │   ├── ErrorState.jsx       # User-friendly error message container with retry option
│   │   └── MobileNav.jsx        # Fixed bottom navigation bar for mobile screens
│   │
│   ├── pages/             # Main Application Views
│   │   ├── Dashboard.jsx        # Main overview dashboard
│   │   ├── AnalyzeFood.jsx      # Food input, image upload & AI analysis flow
│   │   ├── FoodDiaryPage.jsx    # Date navigation & meal history management
│   │   └── Profile.jsx          # Wellness profile viewer and editor
│   │
│   ├── services/          # Centralized API Service Layer
│   │   └── api.js               # Axios REST API calls with fallback logic
│   │
│   ├── hooks/             # Custom React Hooks
│   │   └── useApi.js            # Custom hook for request state management (data, loading, error)
│   │
│   ├── data/              # Mock Data Store
│   │   └── mockData.js          # Standalone development fallback data
│   │
│   ├── App.jsx            # Main app shell & router configuration
│   ├── main.jsx           # React DOM entry point
│   └── index.css          # Core CSS tokens, utility classes & responsive styles
│
├── .env                   # Active environment variables
├── .env.example           # Environment template file
├── package.json           # Node dependencies & script definitions
├── vite.config.js         # Vite configuration settings
└── README.md              # Project documentation
```

---

## Installation & Setup

1. **Navigate to the frontend directory**:
   ```bash
   cd frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
   Ensure `VITE_API_URL` points to your team's Express backend API:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

4. **Run the Development Server**:
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:5173`.

5. **Build for Production**:
   ```bash
   npm run build
   ```

---

## REST API Endpoints Contract

The frontend communicates with the backend via the following REST endpoints:

### User Profile
- **`GET /api/profile`**: Fetch current user wellness profile.
- **`POST /api/profile`**: Create a new user profile.
- **`PUT /api/profile`**: Update an existing profile.

### Food Diary
- **`POST /api/food`**: Save a logged food item to diary.
- **`GET /api/food`**: Fetch full food diary history.
- **`GET /api/food/today`**: Fetch today's logged meals.
- **`GET /api/food/:id`**: Fetch details for a specific food log entry.
- **`PUT /api/food/:id`**: Update a food log entry.
- **`DELETE /api/food/:id`**: Delete a food log entry.

### AI Food Analysis
- **`POST /api/analyze-food`**: Submit food details (text description, meal type, quantity, image) via `multipart/form-data` for AI analysis response containing `food_name`, `wellness_level`, `analysis`, `suggestion`, and `estimated_nutrition`.

---

## Standalone Development & Mock Data

When developing the frontend without the Express backend server running:
- `src/services/api.js` automatically catches connection errors and falls back to `src/data/mockData.js`.
- All operations (updating profile, analyzing food like samosas/idlis, saving to diary, date filtering, deleting entries) function smoothly in local storage.
- No modifications are needed when connecting to the live Express server; as soon as `http://localhost:5000/api` is running, `api.js` sends live requests directly to the server.

---

## License & Team Notes

Built for Sprint 1 of AI Personal Food & Wellness Assistant. Dedicated strictly to frontend React implementation.
