import { useEffect, useReducer, useState } from "react";
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
  const teamIds: TeamId[] = ["team1", "team2"];

  // Game Status State
  const [appStatus, setAppStatus] = useState<"idle" | "countdown" | "playing">("idle");
  const [countdown, setCountdown] = useState(5);

  // 1. Countdown Logic
  useEffect(() => {
    if (appStatus !== "countdown") return;

    if (countdown === 0) {
      setAppStatus("playing");
      return;
    }

    const timer = window.setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => window.clearTimeout(timer);
  }, [appStatus, countdown]);

  // 2. Physical Keyboard Listener (Isolated per team to prevent double inputs and leaks)
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Ignore keypresses if the game isn't active
      if (appStatus !== "playing" || game.winner) return;

      // Blur active elements so physical keyboard events don't trigger focused UI elements twice
      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur();
      }

      // ===================================================
      // TEAM 1: Top-Row Numbers (Digit1-Digit0), Enter, Backspace
      // ===================================================
      if (!game.teams.team1.submitted) {
        if (/^Digit[0-9]$/.test(event.code)) {
          event.preventDefault();
          event.stopPropagation();
          const digit = event.code.replace("Digit", "");
          dispatch({ type: "INPUT_DIGIT", teamId: "team1", digit });
          return;
        } 
        
        if (event.code === "Enter") {
          event.preventDefault();
          event.stopPropagation();
          dispatch({ type: "SUBMIT_ANSWER", teamId: "team1" });
          return;
        } 
        
        if (event.code === "Backspace") {
          event.preventDefault();
          event.stopPropagation();
          dispatch({ type: "CLEAR_ANSWER", teamId: "team1" });
          return;
        }
      }

      // ===================================================
      // TEAM 2: Numpad Keys (Numpad0-Numpad9), NumpadEnter, Delete
      // ===================================================
      if (!game.teams.team2.submitted) {
        if (/^Numpad[0-9]$/.test(event.code)) {
          event.preventDefault();
          event.stopPropagation();
          const digit = event.code.replace("Numpad", "");
          dispatch({ type: "INPUT_DIGIT", teamId: "team2", digit });
          return;
        } 
        
        if (event.code === "NumpadEnter") {
          event.preventDefault();
          event.stopPropagation();
          dispatch({ type: "SUBMIT_ANSWER", teamId: "team2" });
          return;
        } 
        
        if (event.code === "NumpadSubtract" || event.code === "Delete") {
          event.preventDefault();
          event.stopPropagation();
          dispatch({ type: "CLEAR_ANSWER", teamId: "team2" });
          return;
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown, true);
    return () => window.removeEventListener("keydown", handleKeyDown, true);
  }, [appStatus, game.winner, game.teams.team1.submitted, game.teams.team2.submitted]);

  // 3. Question Timer
  useEffect(() => {
    if (appStatus !== "playing" || game.winner) return;

    const timerId = window.setInterval(() => {
      dispatch({ type: "TICK", teamId: "team1" });
      dispatch({ type: "TICK", teamId: "team2" });
    }, 1000);

    return () => window.clearInterval(timerId);
  }, [appStatus, game.winner]);

  // 4. Submission Feedback Delay Timer
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
    <>
      <GameBoard
        game={game}
        onDigit={(teamId, digit) => dispatch({ type: "INPUT_DIGIT", teamId, digit })}
        onClear={(teamId) => dispatch({ type: "CLEAR_ANSWER", teamId })}
        onSubmit={(teamId) => dispatch({ type: "SUBMIT_ANSWER", teamId })}
        onReset={() => {
          dispatch({ type: "RESET_GAME" });
          setAppStatus("idle");
        }}
      />

      {/* 5. Start Screen & Countdown Overlay */}
      {appStatus !== "playing" && (
        <div className="celebration-backdrop" style={{ zIndex: 1000 }}>
          {appStatus === "idle" ? (
            <div className="celebration-card" style={{ padding: "40px 20px" }}>
              <h2 style={{ fontSize: "2.5rem", marginBottom: "30px", color: "#096fbe" }}>
                Ready for Tug of War?
              </h2>
              <button
                onPointerDown={() => {
                  setAppStatus("countdown");
                  setCountdown(5);
                }}
                className="primary-action"
                style={{ fontSize: "1.4rem", padding: "16px 48px", cursor: "pointer" }}
              >
                START GAME
              </button>
            </div>
          ) : (
            <div 
              key={countdown} 
              style={{ 
                fontSize: "10rem", 
                fontWeight: 900, 
                color: "white", 
                textShadow: "0 10px 40px rgba(0,0,0,0.5)",
                animation: "celebration-pop 900ms ease-out" 
              }}
            >
              {countdown > 0 ? countdown : "GO!"}
            </div>
          )}
        </div>
      )}
    </>
  );
}

export default App;