import type { TeamId } from "../types/game";

export const WIN_ROPE_POSITION = 240;
export const CORRECT_ANSWER_POINTS = 1;
export const PULL_PER_CORRECT_ANSWER = 40;

export function getPullDelta(teamId: TeamId, correct: boolean): number {
  if (!correct) return 0;
  return teamId === "team1" ? -PULL_PER_CORRECT_ANSWER : PULL_PER_CORRECT_ANSWER;
}

export function applyRopeDelta(position: number, delta: number): number {
  return Math.max(
    -WIN_ROPE_POSITION,
    Math.min(WIN_ROPE_POSITION, position + delta),
  );
}

export function getWinnerFromRope(position: number): TeamId | null {
  if (position <= -WIN_ROPE_POSITION) return "team1";
  if (position >= WIN_ROPE_POSITION) return "team2";
  return null;
}
