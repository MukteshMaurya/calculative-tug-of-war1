import { generateQuestion, isAnswerCorrect } from "./questionEngine";
import {
  applyRopeDelta,
  getPullDelta,
  getWinnerFromRope,
  CORRECT_ANSWER_POINTS,
} from "./scoringEngine";
import type { GameState, TeamId } from "../types/game";

export type GameAction =
  | { type: "INPUT_DIGIT"; teamId: TeamId; digit: string }
  | { type: "CLEAR_ANSWER"; teamId: TeamId }
  | { type: "SUBMIT_ANSWER"; teamId: TeamId }
  | { type: "COMPLETE_SUBMISSION"; teamId: TeamId }
  | { type: "TICK"; teamId: TeamId }
  | { type: "RESET_GAME" };

export const ROUND_DURATION_SECONDS = 15;
const MAX_ANSWER_LENGTH = 9;

function isDigit(value: string): boolean {
  return /^[0-9]$/.test(value);
}

function createFreshQuestionState(
  team: GameState["teams"][TeamId],
): GameState["teams"][TeamId] {
  return {
    ...team,
    question: generateQuestion("easy"),
    answer: "",
    timeRemaining: ROUND_DURATION_SECONDS,
    submitted: false,
    answerStatus: "idle",
  };
}

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case "INPUT_DIGIT": {
      const team = state.teams[action.teamId];

      if (state.winner || team.submitted || !isDigit(action.digit)) return state;
      if (team.answer.length >= MAX_ANSWER_LENGTH) return state;

      const nextAnswer =
        team.answer === "0" ? action.digit : `${team.answer}${action.digit}`;

      return {
        ...state,
        teams: {
          ...state.teams,
          [action.teamId]: {
            ...team,
            answer: nextAnswer,
            answerStatus: "idle",
          },
        },
      };
    }

    case "CLEAR_ANSWER": {
      const team = state.teams[action.teamId];

      if (state.winner || team.submitted) return state;

      return {
        ...state,
        teams: {
          ...state.teams,
          [action.teamId]: {
            ...team,
            answer: "",
            answerStatus: "idle",
          },
        },
      };
    }

    case "SUBMIT_ANSWER": {
      const team = state.teams[action.teamId];

      if (state.winner || team.submitted || team.answer.trim() === "") return state;

      const correct = isAnswerCorrect(team.answer, team.question);
      const pullDelta = getPullDelta(action.teamId, correct);
      const nextRopePosition = applyRopeDelta(state.ropePosition, pullDelta);
      const winner = getWinnerFromRope(nextRopePosition);

      const nextTeam = {
        ...team,
        score: team.score + (correct ? CORRECT_ANSWER_POINTS : 0),
        submitted: true,
        answerStatus: correct ? "correct" : "incorrect",
      };

      return {
        ...state,
        ropePosition: nextRopePosition,
        winner,
        teams: {
          ...state.teams,
          [action.teamId]: nextTeam,
        },
      };
    }

    case "COMPLETE_SUBMISSION": {
      const team = state.teams[action.teamId];
      if (state.winner || !team.submitted) return state;
      return {
        ...state,
        teams: {
          ...state.teams,
          [action.teamId]: createFreshQuestionState(team),
        },
      };
    }

    case "TICK": {
      const team = state.teams[action.teamId];

      if (state.winner || team.timeRemaining <= 0) return state;

      const nextTime = team.timeRemaining - 1;

      if (nextTime > 0) {
        return {
          ...state,
          teams: {
            ...state.teams,
            [action.teamId]: {
              ...team,
              timeRemaining: nextTime,
            },
          },
        };
      }

      return {
        ...state,
        teams: {
          ...state.teams,
          [action.teamId]: createFreshQuestionState(team),
        },
      };
    }

    case "RESET_GAME": {
      const createTeam = (
        id: TeamId,
        name: string,
        color: "blue" | "red",
      ): GameState["teams"][TeamId] => ({
        id,
        name,
        score: 0,
        answer: "",
        color,
        question: generateQuestion("easy"),
        timeRemaining: ROUND_DURATION_SECONDS,
        submitted: false,
        answerStatus: "idle",
      });

      return {
        ropePosition: 0,
        winner: null,
        teams: {
          team1: createTeam("team1", "Team 1", "blue"),
          team2: createTeam("team2", "Team 2", "red"),
        },
      };
    }

    default:
      return state;
  }
}
