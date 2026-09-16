import { useEffect, useReducer } from "react";
import { GameBoard } from "./components/GameBoard/GameBoard";
import { gameReducer, ROUND_DURATION_SECONDS } from "./game/gameReducer";
import { generateQuestion } from "./game/questionEngine";
import type { GameState, TeamId } from "./types/game";

function createInitialGameState(): GameState {
  return {
    ropePosition: 0,
    winner: null,
    teams: {
      team1: {
        id: "team1",
        name: "Team 1",
        score: 0,
        answer: "",
        color: "blue",
        question: generateQuestion("easy"),
        timeRemaining: ROUND_DURATION_SECONDS,
        submitted: false,
        answerStatus: "idle",
      },
      team2: {
        id: "team2",
        name: "Team 2",
        score: 0,
        answer: "",
        color: "red",
        question: generateQuestion("easy"),
        timeRemaining: ROUND_DURATION_SECONDS,
        submitted: false,
        answerStatus: "idle",
      },
    },
  };
}

function App() {
  const [game, dispatch] = useReducer(gameReducer, undefined, createInitialGameState);

  // Define team IDs with explicit TeamId[] type to avoid implicit string indexing errors
  const teamIds: TeamId[] = ["team1", "team2"];

  // Each team owns its own one-second timer. A submission or timeout resets only
  // that team's timer and question; the other team continues uninterrupted.
  useEffect(() => {
    if (game.winner) return;

    const timerId = window.setInterval(() => {
      dispatch({ type: "TICK", teamId: "team1" });
      dispatch({ type: "TICK", teamId: "team2" });
    }, 1000);

    return () => window.clearInterval(timerId);
  }, [game.winner]);

  useEffect(() => {
    const submittedTeams = teamIds.filter(
      (teamId) => game.teams[teamId].submitted,
    );

    if (game.winner || submittedTeams.length === 0) return;

    const timers = submittedTeams.map((teamId) =>
      window.setTimeout(() => {
        dispatch({ type: "COMPLETE_SUBMISSION", teamId });
      }, 500),
    );

    return () => timers.forEach((timer) => window.clearTimeout(timer));
  }, [game.winner, game.teams.team1.submitted, game.teams.team2.submitted]);

  return (
    <GameBoard
      game={game}
      onDigit={(teamId, digit) => dispatch({ type: "INPUT_DIGIT", teamId, digit })}
      onClear={(teamId) => dispatch({ type: "CLEAR_ANSWER", teamId })}
      onSubmit={(teamId) => dispatch({ type: "SUBMIT_ANSWER", teamId })}
      onReset={() => dispatch({ type: "RESET_GAME" })}
    />
  );
}

export default App;