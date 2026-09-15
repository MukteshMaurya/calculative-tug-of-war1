export type Difficulty = "easy" | "medium" | "hard";
export type Operation = "addition" | "subtraction" | "multiplication" | "division";

export interface MathQuestion {
  id: string;
  text: string;
  answer: number;
  operation: Operation;
}

interface Range {
  min: number;
  max: number;
}

const DIFFICULTY_RANGES: Record<Difficulty, Record<Operation, Range>> = {
  easy: {
    addition: { min: 1, max: 20 },
    subtraction: { min: 1, max: 20 },
    multiplication: { min: 1, max: 10 },
    division: { min: 1, max: 10 },
  },
  medium: {
    addition: { min: 10, max: 99 },
    subtraction: { min: 10, max: 99 },
    multiplication: { min: 2, max: 12 },
    division: { min: 2, max: 12 },
  },
  hard: {
    addition: { min: 50, max: 500 },
    subtraction: { min: 50, max: 500 },
    multiplication: { min: 10, max: 25 },
    division: { min: 5, max: 25 },
  },
};

const OPERATIONS: Operation[] = [
  "addition",
  "subtraction",
  "multiplication",
  "division",
];

function randomInteger(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function createQuestionId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

function createAddition(range: Range): MathQuestion {
  const first = randomInteger(range.min, range.max);
  const second = randomInteger(range.min, range.max);

  return {
    id: createQuestionId(),
    text: `${first} + ${second} = ?`,
    answer: first + second,
    operation: "addition",
  };
}

function createSubtraction(range: Range): MathQuestion {
  const first = randomInteger(range.min, range.max);
  const second = randomInteger(range.min, first);

  return {
    id: createQuestionId(),
    text: `${first} − ${second} = ?`,
    answer: first - second,
    operation: "subtraction",
  };
}

function createMultiplication(range: Range): MathQuestion {
  const first = randomInteger(range.min, range.max);
  const second = randomInteger(range.min, range.max);

  return {
    id: createQuestionId(),
    text: `${first} × ${second} = ?`,
    answer: first * second,
    operation: "multiplication",
  };
}

function createDivision(range: Range): MathQuestion {
  const divisor = randomInteger(range.min, range.max);
  const quotient = randomInteger(range.min, range.max);
  const dividend = divisor * quotient;

  return {
    id: createQuestionId(),
    text: `${dividend} ÷ ${divisor} = ?`,
    answer: quotient,
    operation: "division",
  };
}

export function generateQuestion(difficulty: Difficulty = "easy"): MathQuestion {
  const operation = OPERATIONS[randomInteger(0, OPERATIONS.length - 1)];
  const range = DIFFICULTY_RANGES[difficulty][operation];

  switch (operation) {
    case "addition":
      return createAddition(range);
    case "subtraction":
      return createSubtraction(range);
    case "multiplication":
      return createMultiplication(range);
    case "division":
      return createDivision(range);
  }
}

export function isAnswerCorrect(answer: string, question: MathQuestion): boolean {
  if (answer.trim() === "") return false;

  const numericAnswer = Number(answer);
  return Number.isFinite(numericAnswer) && numericAnswer === question.answer;
}
