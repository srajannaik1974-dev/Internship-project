# NutriMind — Backend AI Integration Guide

> **For Collaborator 3 (Backend-1)**  
> This document explains how to integrate the AI module into your Express application.

---

## What This Module Provides

| File | Purpose |
|---|---|
| `src/services/ai/gemini.service.js` | Core AI service — `analyzeFood()` and `generateDailyInsight()` |
| `src/services/ai/prompts.js` | Prompt templates (food analysis + daily insight) |
| `src/services/ai/aiParser.js` | Response validator and JSON parser |
| `src/controllers/analyze.controller.js` | Express controller (thin layer over AI service) |
| `src/routes/ai.routes.js` | Express router for `POST /api/analyze` and `GET /api/insight` |

---

## Step 1 — Environment Variable

Copy `.env.example` to `.env` and fill in:

```env
GEMINI_API_KEY=your_key_here   # Get from https://aistudio.google.com/app/apikey
PORT=5000
MONGO_URI=mongodb://localhost:27017/nutrimind
JWT_SECRET=your_jwt_secret_here
FRONTEND_URL=http://localhost:5173
```

---

## Step 2 — Load dotenv First

In your Express entry point (`src/index.js`), load `dotenv` **before** importing anything else:

```js
require('dotenv').config();           // Must be FIRST line
const express = require('express');
const aiRoutes = require('./routes/ai.routes');
// ... rest of your imports
```

---

## Step 3 — Mount the AI Routes

```js
const aiRoutes = require('./routes/ai.routes');

// Mount under /api — this exposes POST /api/analyze and GET /api/insight
app.use('/api', aiRoutes);
```

---

## Step 4 — Protect GET /api/insight with JWT

The `GET /api/insight` route needs your JWT auth middleware applied **before** the AI controller runs. Two ways to do this:

### Option A — In ai.routes.js (preferred)

```js
const { jwtAuthMiddleware } = require('../middleware/auth');  // your middleware

router.get('/insight', jwtAuthMiddleware, analyzeController.getInsight);
```

### Option B — Global middleware on the /api prefix

```js
app.use('/api', jwtAuthMiddleware);    // Protects all /api/* routes
app.use('/api', aiRoutes);
```

---

## Step 5 — Wire Up Profile and Meals in getInsight

Open `src/controllers/analyze.controller.js` and replace the stub section marked with `TODO (Backend-1)`:

```js
// ── Step 2: Retrieve profile and today's meals ────────────────────────────
// Replace the stubs below with your real DB queries:

const profile = await Profile.findOne({ userId: req.user.id });

const today     = new Date();
const startOfDay = new Date(today.setHours(0, 0, 0, 0));
const endOfDay   = new Date(today.setHours(23, 59, 59, 999));

const meals = await Food.find({
  userId:    req.user.id,
  createdAt: { $gte: startOfDay, $lte: endOfDay }
});
```

---

## Step 6 — Daily Insight Caching

The spec requires insight to be cached **per user per day** to avoid calling Gemini on every dashboard load.

Implement caching **around the AI call** in the controller:

```js
const todayKey = `insight:${req.user.id}:${new Date().toISOString().split('T')[0]}`;

// Check cache first
const cached = cache.get(todayKey);         // your cache store (Map, Redis, etc.)
if (cached) return res.status(200).json(cached);

// Generate fresh insight
const insight = await geminiService.generateDailyInsight(profile, meals);

// Store in cache (TTL = end of day or fixed 12h)
cache.set(todayKey, insight);
return res.status(200).json(insight);
```

A simple in-memory `Map` is sufficient for MVP. Redis can be added later.

---

## Step 7 — POST /api/analyze (image upload)

This route is ready to use. Multer memory storage is already configured.

The frontend sends a `multipart/form-data` request with:

| Field | Type | Required |
|---|---|---|
| `food_description` | string | No (if image provided) |
| `meal_type` | string | No |
| `quantity` | string | No |
| `image` | file | No (if description provided) |

At least one of `food_description` or `image` must be present.

---

## API Contract Summary

### POST /api/analyze

**Request (multipart/form-data):**
```
food_description = "Chicken Biryani"
meal_type        = "Lunch"
quantity         = "1 plate"
image            = <file>   (optional)
```

**Response (200):**
```json
{
  "food_name": "Chicken Biryani",
  "wellness_level": "Moderate Concern",
  "analysis": "This meal may be relatively high in calories...",
  "suggestion": "Consider a smaller portion and pair it with vegetables.",
  "estimated_nutrition": {
    "calories": 648,
    "protein": 28,
    "carbohydrates": 72,
    "fat": 24,
    "fiber": 4
  }
}
```

**Error responses:**
```json
{ "error": "Please provide either a food description or a food image for analysis." }  // 400
{ "error": "AI Service is misconfigured. Please contact support." }                     // 500
```

---

### GET /api/insight

**Auth:** JWT required (`Authorization: Bearer <token>`)

**Response (200):**
```json
{
  "title": "Balance your dinner",
  "text": "You've had a carbohydrate-heavy day. Consider a protein-rich dinner with vegetables."
}
```

---

## Calling the AI Service Directly

You can import and call the AI service functions from your own controllers:

```js
const { analyzeFood, generateDailyInsight } = require('./services/ai/gemini.service');

// Food analysis
const result = await analyzeFood({
  foodDescription: 'Chicken Biryani',
  mealType: 'Lunch',
  quantity: '1 plate',
  image: {                        // optional
    buffer: req.file.buffer,
    mimeType: req.file.mimetype
  }
});

// Daily insight
const insight = await generateDailyInsight(
  profile,   // plain object from your DB
  meals      // array of food entries from your DB
);
```

Both functions are **pure** — they do not touch `req`, `res`, or MongoDB.

---

## Running Tests

```bash
cd backend
npm test
```

All 13 tests should pass without a real Gemini API key (mocked).

---

## Medical Safety — Do Not Change the Prompts

The prompts in `src/services/ai/prompts.js` include critical medical safety constraints. Do not remove or weaken these constraints. The AI must not diagnose diseases, prescribe medication, or make absolute medical claims about food.
