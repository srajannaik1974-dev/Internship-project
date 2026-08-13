# NutriMind — Team Collaboration Plan

> **Project:** AI-Powered Personal Food & Wellness Assistant  
> **Stack:** React + Vite (Frontend) · Express.js (Backend) · MongoDB (Database)  
> **Team Size:** 4 Collaborators

---

## Architecture Overview

```
React Frontend (Vite)
        │
        ▼
Express.js REST API (Node.js)
        │
        ▼
     MongoDB
```

---

## Team Roles & Work Distribution

---

### ✅ Collaborator 1 — Frontend Developer
**Status: COMPLETED**

**Responsibility:** Core frontend application — all pages, components, routing, and design system.

#### Completed Work
| Area | Details |
|---|---|
| Landing Page | Hero section, AI cards, floating UI, CTA buttons, navbar |
| Sign In Page | Email/password form, show/hide password, sign up toggle |
| Dashboard | Greeting, profile summary, meal tracker, daily insight |
| Analyze Food | Food input, image upload, AI result card, diary action |
| Food Diary | Meal history, date navigation, wellness badges |
| My Profile | Health profile form, edit/save flow, validation |
| Responsive Design | Mobile header, hamburger drawer, bottom nav, 375–1440px |
| Design System | Warm cream `#F7F3EA`, charcoal `#211D1A`, orange `#F47C45` accent, CSS variables |
| Frontend Architecture | Components, pages, services, hooks, mock data layer |
| Hero Video Slot | `<video>` element ready at `public/videos/hero-food.mp4` |

---

### 🎨 Collaborator 2 — UI/UX Designer
**Status: IN PROGRESS**

**Responsibility:** Visual design refinements, user experience polish, and additional page/component design.

#### Assigned Tasks

##### UI Enhancements
- [ ] Review all pages for visual consistency against the NutriMind design system
- [ ] Improve micro-animations and transitions on the Landing Page
- [ ] Design and implement loading skeleton screens for Dashboard and Food Diary
- [ ] Add smooth page transition animations between routes (React Router)
- [ ] Improve the empty state illustrations for `EmptyState.jsx`
- [ ] Create/source the hero video (`public/videos/hero-food.mp4`) for the Landing Page

##### Landing Page
- [ ] Add a testimonials / social proof section
- [ ] Design and implement a proper footer with links and branding
- [ ] Refine the hero section composition on mobile (side-by-side food visual)
- [ ] Add subtle scroll-triggered animations for the Features section

##### Component Polish
- [ ] Improve `RiskBadge.jsx` styling for all three wellness levels
- [ ] Improve `FoodAnalysisCard.jsx` visual layout for the AI result
- [ ] Improve `MealCard.jsx` with richer nutritional info display
- [ ] Create a reusable `Toast` / notification component for save-success states
- [ ] Create a reusable `Modal` component for confirmations

##### Design Deliverables
- [ ] Finalize and document the full NutriMind color system in the README
- [ ] Create icon/illustration assets that match the warm food-tech aesthetic
- [ ] Ensure WCAG 2.1 AA color contrast across all components

---

### ⚙️ Collaborator 3 — Backend Developer (API & Auth)
**Status: TO DO**

**Responsibility:** Express.js server setup, authentication, user management, and core API routes.

#### Assigned Tasks

##### Project Setup
- [ ] Initialize `backend/` Node.js project with Express.js
- [ ] Configure `package.json`, `.env`, `.gitignore`
- [ ] Set up MongoDB connection via Mongoose
- [ ] Set up CORS for the React frontend (`http://localhost:5173`)
- [ ] Create base Express app with middleware (body-parser, morgan, helmet)

##### Authentication
- [ ] `POST /api/auth/register` — Register new user (name, email, password)
- [ ] `POST /api/auth/login` — Login and return JWT token
- [ ] JWT middleware for protected routes
- [ ] Password hashing with bcrypt
- [ ] User model: `name`, `email`, `password`, `createdAt`

##### User Profile API
- [ ] `GET /api/profile` — Get authenticated user's health profile
- [ ] `PUT /api/profile` — Update health profile (age, height, weight, activity, diet, allergies, conditions, notes)
- [ ] Profile model: link to User, store all health fields

##### Meals / Food Diary API
- [ ] `GET /api/foods` — Get all food entries for authenticated user (with optional date filter)
- [ ] `POST /api/foods` — Create a new food entry (save to diary after analysis)
- [ ] `DELETE /api/foods/:id` — Delete a specific food entry
- [ ] Food entry model: `userId`, `food_name`, `meal_type`, `quantity`, `wellness_level`, `analysis`, `suggestion`, `estimated_nutrition`, `createdAt`

##### Error Handling
- [ ] Global error handling middleware
- [ ] Validation middleware (express-validator)
- [ ] Standardized JSON error response format

---

### 🤖 Collaborator 4 — Backend Developer (AI Integration & Analysis)
**Status: TO DO**

**Responsibility:** AI food analysis integration, food processing logic, and daily insight generation.

#### Assigned Tasks

##### AI Food Analysis API
- [ ] `POST /api/analyze` — Accept food description + optional image, return AI wellness analysis
  - Input: `food_description`, `meal_type`, `quantity`, optional `image` (multipart)
  - Output: `food_name`, `wellness_level` (`Low Concern` / `Moderate Concern` / `High Concern`), `analysis`, `suggestion`, `estimated_nutrition`
- [ ] Integrate with Google Gemini API (or OpenAI) for food analysis
- [ ] Build structured prompt template for consistent AI responses
- [ ] Parse and validate AI JSON response before returning to frontend
- [ ] Handle image uploads using `multer` middleware
- [ ] Image pre-processing before sending to Vision API

##### Daily Insight API
- [ ] `GET /api/insight` — Generate a personalized daily insight based on:
  - User's health profile (from Collaborator 3's profile API)
  - Today's logged meals (from Collaborator 3's food diary API)
  - Return: `title`, `text`
- [ ] Cache insight per user per day (avoid re-calling AI on every dashboard load)

##### Nutrition Estimation
- [ ] Return structured `estimated_nutrition` object with:
  - `calories`, `protein`, `carbohydrates`, `fat`, `fiber`
- [ ] All values should be approximate and AI-generated

##### Integration & Testing
- [ ] Write integration tests for `/api/analyze` endpoint
- [ ] Handle API rate limits and timeout errors gracefully
- [ ] Return meaningful fallback messages if AI is unavailable
- [ ] Document all AI-related environment variables in `.env.example`

---

## Frontend ↔ Backend API Contract

The frontend (`src/services/api.js`) already expects these endpoints:

| Method | Endpoint | Used By | Status |
|---|---|---|---|
| `POST` | `/api/auth/login` | Sign In page | ⏳ Collaborator 3 |
| `POST` | `/api/auth/register` | Sign Up flow | ⏳ Collaborator 3 |
| `GET` | `/api/profile` | Dashboard, Profile page | ⏳ Collaborator 3 |
| `PUT` | `/api/profile` | Profile page save | ⏳ Collaborator 3 |
| `GET` | `/api/foods` | Food Diary page | ⏳ Collaborator 3 |
| `POST` | `/api/foods` | Save to diary action | ⏳ Collaborator 3 |
| `DELETE` | `/api/foods/:id` | Food Diary delete | ⏳ Collaborator 3 |
| `POST` | `/api/analyze` | Analyze Food page | ⏳ Collaborator 4 |
| `GET` | `/api/insight` | Dashboard insight card | ⏳ Collaborator 4 |

---

## Environment Variables Required

### Frontend (`frontend/.env`)
```
VITE_API_BASE_URL=http://localhost:5000/api
```

### Backend (`backend/.env`)
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/nutrimind
JWT_SECRET=your_jwt_secret_here
GEMINI_API_KEY=your_gemini_api_key_here
FRONTEND_URL=http://localhost:5173
```

---

## Git Workflow

```
main          — stable, reviewed code only
develop       — integration branch
feature/name  — individual feature branches
```

**Branch naming convention:**
- `feature/collab2-ui-animations`
- `feature/collab3-auth-api`
- `feature/collab4-ai-analysis`

**Never commit directly to `main`.**  
Open a pull request into `develop`, then `develop` → `main` after review.

---

## Progress Tracker

| Collaborator | Role | Status |
|---|---|---|
| Collaborator 1 | Frontend Developer | ✅ Done |
| Collaborator 2 | UI/UX Designer | 🔄 In Progress |
| Collaborator 3 | Backend — Auth & API | ⏳ To Do |
| Collaborator 4 | Backend — AI Integration | ⏳ To Do |
