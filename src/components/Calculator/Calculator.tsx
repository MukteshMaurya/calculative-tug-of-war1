import type { KeyboardEvent } from "react";
import type { AnswerStatus, TeamId, TeamColor } from "../../types/game";

interface CalculatorProps {
  teamId: TeamId;
  teamName: string;
  score: number;
  color: TeamColor;
  question: string;
  answer: string;
  submitted: boolean;
  answerStatus: AnswerStatus;
  onDigit: (digit: string) => void;
  onClear: () => void;
  onSubmit: () => void;
}

const DIGITS = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];

export function Calculator({
  teamId,
  teamName,
  score,
  color,
  question,
  answer,
  submitted,
  answerStatus,
  onDigit,
  onClear,
  onSubmit,
}: CalculatorProps) {
  const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (submitted) return;

    if (/^[0-9]$/.test(event.key)) {
      event.preventDefault();
      onDigit(event.key);
      return;
    }

    if (event.key === "Enter") {
      event.preventDefault();
      onSubmit();
      return;
    }

    if (event.key === "Backspace" || event.key === "Delete" || event.key === "Escape") {
      event.preventDefault();
      onClear();
    }
  };

  const displayValue = answer || "0";

  return (
    <section
      className={`calculator-card ${color}`}
      aria-label={`${teamName} calculator`}
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      <header className="calculator-header">
        <span>{teamName}</span>
        <strong aria-label={`${teamName} score`}>{score}</strong>
      </header>

      <div className="calculator-content">
        <div className="question" aria-label={`Question: ${question}`}>
          {question}
        </div>

        <div
          className={`display ${answerStatus}`}
          aria-live="polite"
          aria-label={`${teamName} current answer`}
        >
          {displayValue}
        </div>
<div className="keypad" aria-label={`${teamName} keypad`}>
          {DIGITS.map((digit) => (
            <button
              key={digit}
              type="button"
              className="key"
              disabled={submitted}
              onClick={() => onDigit(digit)}
              aria-label={`Enter ${digit}`}
            >
              {digit}
            </button>
          ))}

          <button
            type="button"
            className="key action clear"
            disabled={submitted}
            onClick={onClear}
            aria-label={`Clear ${teamName} answer`}
          >
            ×
          </button>

          <button
            type="button"
            className="key"
            disabled={submitted}
            onClick={() => onDigit("0")}
            aria-label="Enter 0"
          >
            0
          </button>

          <button
            type="button"
            className="key action submit"
            disabled={submitted || answer.length === 0}
            onClick={onSubmit}
            aria-label={`Submit ${teamName} answer`}
          >
            ✓
          </button>
        </div>


        <div
          className={`answer-feedback ${answerStatus}`}
          role="status"
          aria-live="assertive"
        >
          {answerStatus === "correct"
            ? "✓ Correct!"
            : answerStatus === "incorrect"
              ? "✕ Incorrect!"
              : ""}
        </div></div>
    </section>
  );
}
