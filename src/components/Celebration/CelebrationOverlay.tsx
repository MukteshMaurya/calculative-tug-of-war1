import { useEffect, useMemo } from "react";
import type { CSSProperties } from "react";
import type { TeamId } from "../../types/game";

interface CelebrationOverlayProps {
  winner: TeamId;
  team1Score: number;
  team2Score: number;
  onNextQuestion?: () => void;
  onBackToMenu?: () => void;
}

function playCheerSound(): void {
  const AudioContextClass =
    window.AudioContext ??
    (window as typeof window & {
      webkitAudioContext?: typeof AudioContext;
    }).webkitAudioContext;

  if (!AudioContextClass) return;

  const context = new AudioContextClass();
  const now = context.currentTime;

  const master = context.createGain();
  master.gain.setValueAtTime(0.0001, now);
  master.gain.exponentialRampToValueAtTime(0.18, now + 0.03);
  master.gain.exponentialRampToValueAtTime(0.0001, now + 1.25);
  master.connect(context.destination);

  // Short ascending "cheer" tones. No external audio file is required.
  [523.25, 659.25, 783.99, 1046.5].forEach((frequency, index) => {
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    const start = now + index * 0.12;

    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(frequency, start);

    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(0.12, start + 0.025);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.22);

    oscillator.connect(gain);
    gain.connect(master);

    oscillator.start(start);
    oscillator.stop(start + 0.24);
  });

  window.setTimeout(() => {
    void context.close();
  }, 1600);
}

export function CelebrationOverlay({
  winner,
  team1Score,
  team2Score,
  onNextQuestion,
  onBackToMenu,
}: CelebrationOverlayProps) {
  const winnerName = winner === "team1" ? "Team 1" : "Team 2";
  const winnerColor = winner === "team1" ? "blue" : "red";
  const winnerCharacter = winner === "team1"
    ? "/assets/characters/blue-aviator.svg"
    : "/assets/characters/red-aviator.svg";

  const confetti = useMemo(
    () =>
      Array.from({ length: 36 }, (_, index) => ({
        id: index,
        left: `${(index * 37) % 100}%`,
        delay: `${(index % 12) * 0.08}s`,
        duration: `${2.4 + (index % 5) * 0.35}s`,
        rotation: `${(index * 29) % 360}deg`,
      })),
    []
  );

  useEffect(() => {
    playCheerSound();
  }, []);

  return (
    <div className="celebration-backdrop" role="dialog" aria-modal="true">
      <div className="confetti-layer" aria-hidden="true">
        {confetti.map((piece) => (
          <span
            key={piece.id}
            className="confetti"
            style={
              {
                "--left": piece.left,
                "--delay": piece.delay,
                "--duration": piece.duration,
                "--rotation": piece.rotation,
              } as CSSProperties
            }
          />
        ))}
      </div>

      <section className={`celebration-card ${winnerColor}`}>
        <div className="trophy" aria-hidden="true">🏆</div>

        <div className="celebration-characters" aria-hidden="true">
          <img
            src={winnerCharacter}
            alt=""
            className="celebration-character winner-character"
          />
          <img
            src={winnerCharacter}
            alt=""
            className="celebration-character winner-character second"
          />
        </div>

        <p className="celebration-kicker">MATCH COMPLETE</p>
        <h2>{winnerName} Wins!</h2>
        <p className="celebration-message">
          Great job! Your team won the tug of war.
        </p>

        <div className="final-score">
          <div className="final-score-team team-one">
            <span>Team 1</span>
            <strong>{team1Score}</strong>
          </div>

          <span className="score-dash">—</span>

          <div className="final-score-team team-two">
            <span>Team 2</span>
            <strong>{team2Score}</strong>
          </div>
        </div>

        <div className="celebration-actions">
          <button
            type="button"
            className="primary-action"
            onClick={onNextQuestion}
          >
            ↻ Next Question
          </button>

          <button
            type="button"
            className="secondary-action"
            onClick={onBackToMenu}
          >
            ⌂ Back to Menu
          </button>
        </div>

        <div className="sound-status" aria-label="Celebration sound enabled">
          🔊 Cheer sound
        </div>
      </section>
    </div>
  );
}
