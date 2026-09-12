# How To Not End Up Like George

**A free, gamified app that quizzes you on vocab, keeps you healthy with daily tasks, and rewards you with in-game currency for not being lazy.**

## Who it's for
Students and young people who want a fun way to study vocabulary, build healthy habits, and stay on top of a daily routine — without paying for Quizlet or needing a parent to nag them.

## What makes it fun
You earn coins for everything — finishing a quiz, doing push-ups, checking off your morning routine. Then you spend those coins on reward tickets like gaming time, dessert, or a sleep-in pass. It turns boring daily stuff into a game.

## Core Features (MVP Checklist)

### Onboarding / Login
- [x] Email input with real validation (must be a valid email format)
- [x] Name, student yes/no, athletic yes/no, bedtime question
- [x] If athletic: ask how many push-ups, sit-ups, squats, pull-ups they can do
- [x] If not athletic: skip fitness questions (gets beginner progressions automatically)
- [x] Profile saved locally

### Quiz
- [x] Create your own vocab lists (term + definition pairs)
- [x] Edit and delete custom lists
- [x] 3 pre-made lists included (Spanish, SAT, Science)
- [x] Flashcard mode (tap to flip)
- [x] Multiple choice quiz mode (4 options)
- [x] Score screen with coins earned (up to 30 per quiz)

### Tasks
- [x] Personalized exercise tasks based on fitness assessment:
  - Athletic: uses their actual numbers to set challenging-but-doable targets (e.g. if they can do 20 push-ups, task might be "Do 15 strict push-ups")
  - Not athletic: beginner progressions (knee push-ups, wall push-ups, assisted squats, dead hangs instead of pull-ups)
- [x] Non-exercise health tasks too (drink water, eat fruit, stretch)
- [x] Daily reset — tasks refresh every day
- [x] Check off to complete, earn 10-15 coins each
- [x] Progress bar showing how many done

### Daily Schedule
- [x] Ordered morning/daily routine (brush teeth, wash face, eat breakfast…)
- [x] Context-aware: homework tasks only show for students on weekends
- [x] Check off items, earn 5-20 coins each
- [x] Progress bar

### Currency & Rewards
- [x] Coin balance shown in header at all times
- [x] Earn coins from quizzes, tasks, and schedule
- [x] Rewards shop with tickets to buy (gaming time, dessert, free time, movie night, sleep-in)
- [x] "My Tickets" tab to view and use purchased tickets

### App Shell
- [x] Bottom tab navigation: Quiz, Tasks, Schedule, Rewards
- [x] Header with app name + coin count
- [x] Mobile-first layout (max 480px centered)
- [x] Dark mode support (auto, follows system)

## Screens

| Screen | Description |
|---|---|
| **Onboarding** | Multi-step signup: name, email, student?, athletic?, bedtime |
| **Quiz Home** | Browse pre-made + custom vocab lists, create new list |
| **Flashcard Mode** | Flip-card UI, prev/next navigation |
| **Multiple Choice** | 4-option quiz with instant feedback, score at end |
| **Tasks** | Daily health task checklist with progress bar |
| **Schedule** | Ordered daily routine checklist, context-aware |
| **Rewards Shop** | Grid of buyable reward tickets by category |
| **My Tickets** | List of owned tickets with "Use" button |

## Data Model

### UserProfile
- `name` (string)
- `email` (string)
- `isStudent` (boolean)
- `isAthletic` (boolean)
- `bedtime` (string, e.g. "22:00")
- `fitnessLevel` (object, only if athletic) — `{ pushups, situps, squats, pullups }` (integers — how many they can do)

### VocabList
- `id` (string)
- `name` (string)
- `description` (string)
- `isPremade` (boolean)
- `terms[]` — each has `term` and `definition`

### CompletedTasks / CompletedSchedule
- `date` (string, YYYY-MM-DD)
- `ids[]` (list of completed item IDs for that day)

### OwnedTicket
- `id` (string)
- `rewardId` (string)
- `name` (string)
- `emoji` (string)
- `category` (string)
- `purchasedAt` (ISO date)

### CoinBalance
- Single integer, persisted

## Not Now (Save for Later)
- Real authentication (Firebase/Supabase login)
- Cloud sync across devices
- Multiplayer quiz battles
- Custom task creation (user adds their own tasks)
- Streak tracking and streak rewards
- Leaderboard / friends list
- Push notification reminders
- Spaced repetition algorithm for flashcards
- Import vocab lists from Quizlet
- Parental controls / approval for reward usage
