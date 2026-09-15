# Calculative Tug of War

A production-oriented React + TypeScript educational mathematics tug-of-war game.

## Phase 3 — Question Engine

This phase adds a dedicated math question engine with:

- Random addition, subtraction, multiplication, and exact division questions.
- Easy, medium, and hard difficulty configurations.
- Non-negative subtraction questions.
- Integer-only division questions.
- A typed `MathQuestion` model.
- Centralized answer validation.
- The same generated question is displayed to both teams.
- Both calculators remain independently controlled.
- A round can advance only after both teams submit.
- `Next Question` resets both answers and generates a fresh question.

## Run locally

```bash
npm install
npm run dev
```

## Production build

```bash
npm run build
npm run preview
```

## Project architecture

- `src/components/` — UI components
- `src/game/questionEngine.ts` — question generation and answer validation
- `src/game/gameReducer.ts` — game state transitions
- `src/types/game.ts` — shared application types
- `src/assets/characters/` — approved aviator artwork

Later phases will add scoring, timer control, rope physics, round progression, and final production polish without moving game rules into presentation components.


## Phase 5 — Scoring & Rope Engine

- Correct answer: +1 point.
- Correct answer: pulls the rope 40 units toward that team.
- Team 1 pulls left; Team 2 pulls right.
- Wrong answers: +0 and no rope movement.
- Timeouts: +0, no rope movement, and a fresh question/timer.
- Rope position is clamped between -240 and +240.
- Reaching either end immediately wins the match.
- A winner freezes both timers and opens the celebration overlay.
- Celebration actions reset the game through React state instead of reloading the page.
