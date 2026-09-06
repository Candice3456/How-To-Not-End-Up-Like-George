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
- [ ] Bottom tab navigation (Quiz, Tasks, Schedule, Rewards)
- [ ] Header with app name and coin balance display
- [ ] Responsive layout (mobile-first)

### 2. Quiz Feature
- [ ] Create custom vocab lists (term + definition pairs)
- [ ] Edit and delete vocab lists
- [ ] Pre-made vocab lists (at least 3 included)
- [ ] Flashcard mode (flip to reveal answer)
- [ ] Multiple choice quiz mode
- [ ] Quiz scoring and results screen
- [ ] Earn coins for completing quizzes

### 3. Tasks Feature
- [ ] Pre-defined health/wellness tasks (e.g. "Do 10 push-ups", "Drink a cup of water", "Stretch for 2 minutes")
- [ ] Daily task list that refreshes each day
- [ ] Check off completed tasks
- [ ] Earn coins per task completed

### 4. Daily Schedule Feature
- [ ] Basic daily routine schedule (brush teeth, wash face, drink water, etc.)
- [ ] User profile: student vs. non-student setting
- [ ] Context-aware tasks (homework only shows for students on weekends)
- [ ] Check off completed schedule items
- [ ] Earn coins for completing schedule items

### 5. Currency & Rewards System
- [ ] In-game coin balance (persistent)
- [ ] Earn coins from: quizzes, tasks, schedule items
- [ ] Rewards shop with purchasable tickets
- [ ] Reward categories: Gaming time, Dessert, Free time, etc.
- [ ] Purchase confirmation and ticket tracking
- [ ] View owned reward tickets

### 6. Onboarding
- [ ] First-launch setup: enter name, student yes/no
- [ ] Saved to localStorage
