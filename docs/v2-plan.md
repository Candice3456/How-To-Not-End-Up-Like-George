# How To Not End Up Like George - MVP Plan

## Concept
A free, gamified productivity + learning app. Combines Quizlet-style vocabulary quizzing with healthy habit tasks and daily schedule management. Completing activities earns in-game currency you can spend on reward tickets.

## Tech Stack
- **Frontend:** React 18 + Vite
- **Routing:** React Router v6
- **Styling:** CSS (custom, no framework)
- **Persistence:** localStorage (no backend for MVP)
- **State:** React Context + useReducer

## MVP Feature Checklist

### 1. App Shell & Navigation
- [x] Bottom tab navigation (Quiz, Tasks, Schedule, Rewards)
- [x] Header with app name and coin balance display
- [x] Responsive layout (mobile-first)

### 2. Quiz Feature
- [x] Create custom vocab lists (term + definition pairs)
- [x] Edit and delete vocab lists
- [x] Pre-made vocab lists (at least 3 included)
- [x] Flashcard mode (flip to reveal answer)
- [x] Multiple choice quiz mode
- [x] Quiz scoring and results screen
- [x] Earn coins for completing quizzes

### 3. Tasks Feature
- [x] Pre-defined health/wellness tasks (e.g. "Do 10 push-ups", "Drink a cup of water", "Stretch for 2 minutes")
- [x] Daily task list that refreshes each day
- [x] Check off completed tasks
- [x] Earn coins per task completed

### 4. Daily Schedule Feature
- [x] Basic daily routine schedule (brush teeth, wash face, drink water, etc.)
- [x] User profile: student vs. non-student setting
- [x] Context-aware tasks (homework only shows for students on weekends)
- [x] Check off completed schedule items
- [x] Earn coins for completing schedule items

### 5. Currency & Rewards System
- [x] In-game coin balance (persistent)
- [x] Earn coins from: quizzes, tasks, schedule items
- [x] Rewards shop with purchasable tickets
- [x] Reward categories: Gaming time, Dessert, Free time, etc.
- [x] Purchase confirmation and ticket tracking
- [x] View owned reward tickets

### 6. Onboarding
- [x] First-launch setup: enter name, student yes/no
- [x] Saved to localStorage
