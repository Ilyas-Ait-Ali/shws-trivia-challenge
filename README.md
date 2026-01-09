# SHWS Trivia Challenge

A polished trivia game built with a **React + Vite frontend** and a **Next.js backend**, powered by the Open Trivia DB API.  
The game features staged difficulty progression, scoring, lives (hearts), animations, metrics, and a modern dark/light UI.

---

## Tech Stack

### Frontend
- React + Vite
- TypeScript
- Tailwind CSS
- Custom hooks and reusable UI components

### Backend
- Next.js (API Routes)
- TypeScript
- Open Trivia DB (external API)
- Retry and timeout handling for reliability

---

## Features

### Core Gameplay
- Supports **multiple choice** and **true / false** questions
- Automatic difficulty progression: **Easy → Medium → Hard**
- Clear **win condition** (reach 10 correct answers)
- **Loss condition** via a lives (hearts) system
- Manual progression: user explicitly clicks **Next** after each answer

### Scoring & Progression
- Difficulty-based scoring:
  - Easy: +10
  - Medium: +20
  - Hard: +30
- Stage-based progression with required correct answers per stage
- Progress indicators for:
  - Overall run
  - Current stage

### UI / UX
- Dark and light themes
- Animated transitions (questions, feedback, cards)
- Pixel-style hearts with:
  - Loss animation
  - Low-life warning
- Keyboard support:
  - `1–4` to select answers
  - `T / F` for boolean questions
  - `Enter` to continue
- Polished win and loss screens

### Metrics
- Success rate by **difficulty**
- Success rate by **category**
- Accuracy, score, and streak tracking
- Top categories summary

---

## Achievements Completed

### Main Achievements
- Boolean (true/false) questions with feedback
- Multiple choice questions with feedback
- Support for multiple questions and progression
- Multiple difficulty levels
- Win condition with a congratulations screen

### Stretch Achievements
- Difficulty-based scoring
- Question categories
- Animations for improved UX
- Metrics by difficulty and category
- Lives (hearts) system with loss condition

---

## Project Structure
```bash
backend/
src/app/api/
categories/route.ts # Fetches trivia categories
questions/route.ts # Fetches and normalizes questions
```

```bash
frontend/
src/
components/ui.tsx # Reusable UI components
hooks/useTriviaGame.ts # Core game logic
theme.ts # Dark / light theme handling
App.tsx # Main application UI
main.tsx # App bootstrap
index.css # Tailwind + global styles
```

---

## Running the Project Locally

### Backend
```bash
cd backend
npm install
npm run dev
```
Runs on http://localhost:3000

### Frontend
```bash
cd frontend
npm install
npm run dev
```
Runs on http://localhost:5173