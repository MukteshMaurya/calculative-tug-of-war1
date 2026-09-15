import { CelebrationOverlay } from "../Celebration/CelebrationOverlay";
import { Calculator } from "../Calculator/Calculator";
import blueAviator from "../../assets/characters/blue-aviator.svg";
import redAviator from "../../assets/characters/red-aviator.svg";
import { WIN_ROPE_POSITION } from "../../game/scoringEngine";
import type { GameState, TeamId } from "../../types/game";

interface GameBoardProps {
  game: GameState;
  onDigit: (teamId: TeamId, digit: string) => void;
  onClear: (teamId: TeamId) => void;
  onSubmit: (teamId: TeamId) => void;
  onReset: () => void;
}

function getWinner(game: GameState): TeamId | null {
  if (game.winner) return game.winner;
  if (game.ropePosition <= -WIN_ROPE_POSITION) return "team1";
  if (game.ropePosition >= WIN_ROPE_POSITION) return "team2";
  return null;
}

export function GameBoard({ game, onDigit, onClear, onSubmit, onReset }: GameBoardProps) {
  const winner = getWinner(game);

  return (
    <main className="game-container">
      <h1 className="game-title">
        <span aria-hidden="true">🏆</span>
        TUG OF WAR: MATHEMATICS
        <span aria-hidden="true">🏆</span>
      </h1>

      <div className="game-layout">
        <Calculator
          teamId="team1"
          teamName={game.teams.team1.name}
          score={game.teams.team1.score}
          color="blue"
          question={game.teams.team1.question.text}
          answer={game.teams.team1.answer}
          submitted={game.teams.team1.submitted}
          answerStatus={game.teams.team1.answerStatus}
          onDigit={(digit) => onDigit("team1", digit)}
          onClear={() => onClear("team1")}
          onSubmit={() => onSubmit("team1")}
        />

        <section className="arena" aria-label="Tug of war arena">
          <div className="arena-header">
            <span className="team-label team-label-blue">Team 1</span>

            <span className="arena-round-label">
              LIVE MATCH · {game.ropePosition === 0
                ? "CENTER"
                : game.ropePosition < 0
                  ? `TEAM 1 +${Math.abs(game.ropePosition)}`
                  : `TEAM 2 +${game.ropePosition}`}
            </span>

            <span className="team-label team-label-red">Team 2</span>
          </div>

          <div className="arena-field">
            <div className="cloud cloud-one" aria-hidden="true" />
            <div className="cloud cloud-two" aria-hidden="true" />
            <div className="cloud cloud-three" aria-hidden="true" />

            <div className="center-line" aria-hidden="true" />

            <div
              className="rope"
              style={{
                transform: `translate(-50%, -50%) translateX(${game.ropePosition}px)`,
              }}
              aria-hidden="true"
            >
              <span className="rope-line" />
              <span className="rope-marker">▼</span>
            </div>

            <div
              className="team team-left"
              style={{ transform: `translateY(-50%) translateX(${game.ropePosition}px)` }}
              aria-label="Team 1 aviator"
            >
              <img src={blueAviator} alt="" className="aviator aviator-one" />
            </div>

            <div
              className="team team-right"
              style={{ transform: `translateY(-50%) translateX(${game.ropePosition}px)` }}
              aria-label="Team 2 aviator"
            >
              <img src={redAviator} alt="" className="aviator aviator-one" />
            </div>

            <div className="ground-shadow shadow-left" aria-hidden="true" />
            <div className="ground-shadow shadow-right" aria-hidden="true" />
          </div>

          <div className="timer-strip" aria-label="Team timers">
            <div className={`team-timer blue ${game.teams.team1.timeRemaining <= 5 ? "warning" : ""}`}>
              <span>Team 1</span>
              <strong>{game.teams.team1.timeRemaining}s</strong>
            </div>
            <div className="timer-help">Each team has an independent timer</div>
            <div className={`team-timer red ${game.teams.team2.timeRemaining <= 5 ? "warning" : ""}`}>
              <span>Team 2</span>
              <strong>{game.teams.team2.timeRemaining}s</strong>
            </div>
          </div>
        </section>

        <Calculator
          teamId="team2"
          teamName={game.teams.team2.name}
          score={game.teams.team2.score}
          color="red"
          question={game.teams.team2.question.text}
          answer={game.teams.team2.answer}
          submitted={game.teams.team2.submitted}
          answerStatus={game.teams.team2.answerStatus}
          onDigit={(digit) => onDigit("team2", digit)}
          onClear={() => onClear("team2")}
          onSubmit={() => onSubmit("team2")}
        />
      </div>

      {winner && (
        <CelebrationOverlay
          winner={winner}
          team1Score={game.teams.team1.score}
          team2Score={game.teams.team2.score}
          onNextQuestion={onReset}
          onBackToMenu={onReset}
        />
      )}
    </main>
  );
}
