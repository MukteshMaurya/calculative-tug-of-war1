import type { MathQuestion } from "../game/questionEngine";

export type TeamId = "team1" | "team2";
export type TeamColor = "blue" | "red";
export type AnswerStatus = "idle" | "correct" | "incorrect";

export interface TeamState {
  id: TeamId;
  name: string;
  score: number;
  answer: string;
  color: TeamColor;
  question: MathQuestion;
  timeRemaining: number;
  submitted: boolean;
  answerStatus: AnswerStatus;
}

export interface GameState {
  ropePosition: number;
  winner: TeamId | null;
  teams: Record<TeamId, TeamState>;
}
