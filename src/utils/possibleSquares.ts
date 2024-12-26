import {
  BoardState,
  Coordinate,
  GameState,
  LastMove,
  Option,
  PieceName,
} from "../types";
import { isSquareBlocked } from "./blockedSquare";
import { isLongCastlingPossible, isShortCastlingPossible } from "./castling";
import {
  addZeroPrefix,
  getCleanCoordinates,
  getPieceColor,
  getXYCoordinates,
} from "./helpers";
import { findPossibleCaptureSquare } from "./possibleCaptureSquare";

const findBlackPawnPossibleSquares = (
  currentSquare: Coordinate,
  boardState: BoardState
) => {
  const squares = [`${+currentSquare + 10}` as Coordinate];
  if (
    currentSquare.startsWith("1") &&
    !boardState[`${+currentSquare + 10}` as Coordinate] &&
    !boardState[`${+currentSquare + 20}` as Coordinate]
  ) {
    squares.push(`${+currentSquare + 20}` as Coordinate);
  }
  return getCleanCoordinates(squares);
};

const findWhitePawnPossibleSquares = (
  currentSquare: Coordinate,
  boardState: BoardState
) => {
  const newCoordinates = `${+currentSquare - 10}` as Coordinate;
  const squares = [addZeroPrefix(newCoordinates)];
  if (
    currentSquare.startsWith("6") &&
    !boardState[`${+currentSquare - 10}` as Coordinate] &&
    !boardState[`${+currentSquare - 20}` as Coordinate]
  ) {
    squares.push(`${+currentSquare - 20}` as Coordinate);
  }
  return getCleanCoordinates(squares);
};

const findRookPossibleSquares = (
  currentSquare: Coordinate,
  boardState: BoardState,
  variant?: "right" | "left" | "down" | "up"
) => {
  const [x, y] = getXYCoordinates(currentSquare);

  const filter = (squares: Coordinate[]) => {
    return squares.filter((item) => {
      return !isSquareBlocked({
        boardState,
        currentSquare,
        destinationSquare: item,
      });
    });
  };
  const left = new Array(7)
    .fill(0)
    .map((_, i) => `${x}${Math.abs(y - (i + 1))}` as const);
  const right = new Array(7)
    .fill(0)
    .map((_, i) => `${x}${y + (i + 1)}` as const);
  const up = new Array(7)
    .fill(0)
    .map((_, i) => `${Math.abs(x - (i + 1))}${y}` as const);
  const down = new Array(7).fill(0).map((_, i) => `${x + i + 1}${y}` as const);

  let result: Coordinate[] = [];
  switch (variant) {
    case "left":
      result = left;
      break;

    case "right":
      result = right;
      break;

    case "up":
      result = up;
      break;

    case "down":
      result = down;
      break;

    default:
      result = [
        ...filter(left),
        ...filter(right),
        ...filter(up),
        ...filter(down),
      ];
      break;
  }

  return getCleanCoordinates(result);
};

const findKnightPossibleSquares = (
  currentSquare: Coordinate,
  boardState: BoardState
) => {
  const filter = (squares: Coordinate[]) => {
    return squares.filter((item) => {
      return !isSquareBlocked({
        boardState,
        currentSquare,
        destinationSquare: item,
      });
    });
  };

  const [x, y] = getXYCoordinates(currentSquare);

  const x1 = x - 2;
  const y1 = y - 1;
  const x2 = x - 2;
  const y2 = y + 1;
  const x3 = x - 1;
  const y3 = y - 2;
  const x4 = x - 1;
  const y4 = y + 2;
  const x5 = x + 1;
  const y5 = y - 2;
  const x6 = x + 2;
  const y6 = y - 1;
  const x7 = x + 1;
  const y7 = y + 2;
  const x8 = x + 2;
  const y8 = y + 1;

  return getCleanCoordinates(
    filter([
      `${x1}${y1}`,
      `${x2}${y2}`,
      `${x3}${y3}`,
      `${x4}${y4}`,
      `${x5}${y5}`,
      `${x6}${y6}`,
      `${x7}${y7}`,
      `${x8}${y8}`,
    ])
  );
};

const findBishopPossibleSquares = (
  currentSquare: Coordinate,
  boardState: BoardState,
  variant?: "right-up" | "left-up" | "right-down" | "left-down"
): Coordinate[] => {
  const [x, y] = getXYCoordinates(currentSquare);

  const filter = (squares: Coordinate[]) => {
    return squares.filter((item) => {
      return !isSquareBlocked({
        boardState,
        currentSquare,
        destinationSquare: item,
      });
    });
  };
  const leftUp = new Array(7)
    .fill(0)
    .map((_, i) => `${x - (i + 1)}${y - (i + 1)}` as const);
  const rightUp = new Array(7)
    .fill(0)
    .map((_, i) => `${x - (i + 1)}${y + i + 1}` as const);
  const leftDown = new Array(7)
    .fill(0)
    .map((_, i) => `${x + i + 1}${y - (i + 1)}` as const);
  const rightDown = new Array(7)
    .fill(0)
    .map((_, i) => `${x + i + 1}${y + i + 1}` as const);

  let result: Coordinate[] = [];

  switch (variant) {
    case "right-up":
      result = rightUp;
      break;

    case "left-up":
      result = leftUp;
      break;

    case "right-down":
      result = rightDown;
      break;

    case "left-down":
      result = leftDown;
      break;

    default:
      result = [
        // left-up diagonal
        ...filter(leftUp),
        // right-up diagonal
        ...filter(rightUp),
        // left-down diagonal
        ...filter(leftDown),
        // right-down diagonal
        ...filter(rightDown),
      ];
      break;
  }

  return getCleanCoordinates(result);
};

const findQueenPossibleSquares = (
  currentSquare: Coordinate,
  boardState: BoardState
) => {
  return [
    ...findBishopPossibleSquares(currentSquare, boardState),
    ...findRookPossibleSquares(currentSquare, boardState),
  ];
};

export const willKingBeInCheck = ({
  boardState,
  currentSquare,
  destinationSquare,
  gameState,
  lastMove,
}: Option & { gameState: GameState; lastMove: LastMove | null }) => {
  const newBoardState = structuredClone(boardState);
  const cPiece = boardState[currentSquare];
  newBoardState[destinationSquare] = cPiece;
  newBoardState[currentSquare] = null as unknown as PieceName;

  const cColor = getPieceColor(cPiece);
  const oppositeColor = cColor === "white" ? "b" : "w";
  const oppositePieceSquares = Object.entries(newBoardState).reduce(
    (acc, [square, piece]) => {
      if (piece && piece.startsWith(oppositeColor)) {
        acc.push(square as Coordinate);
      }
      return acc;
    },
    [] as Coordinate[]
  );

  const kingSquare = Object.entries(newBoardState).find(
    ([, piece]) =>
      (cColor === "white" && piece === "wk") ||
      (cColor === "black" && piece === "bk")
  )?.[0];

  return oppositePieceSquares.some((item) => {
    const pSquares = findPossibleCaptureSquare({
      currentSquare: item,
      boardState: newBoardState,
      gameState,
      lastMove,
    });
    if (pSquares.includes(kingSquare as Coordinate)) return true;
    return false;
  });
};

const findKingPossibleSquares = (
  currentSquare: Coordinate,
  boardState: BoardState,
  gameState: GameState
) => {
  const filter = (squares: Coordinate[]) => {
    return squares.filter((item) => {
      return !isSquareBlocked({
        boardState,
        currentSquare,
        destinationSquare: item,
      });
    });
  };

  const [x, y] = getXYCoordinates(currentSquare);

  const x1 = x - 1;
  const y1 = y - 1;
  const x2 = x - 1;
  const y2 = y;
  const x3 = x - 1;
  const y3 = y + 1;
  const x4 = x;
  const y4 = y - 1;
  const x5 = x;
  const y5 = y + 1;
  const x6 = x + 1;
  const y6 = y - 1;
  const x7 = x + 1;
  const y7 = y;
  const x8 = x + 1;
  const y8 = y + 1;

  const moves = getCleanCoordinates(
    filter([
      `${x1}${y1}`,
      `${x2}${y2}`,
      `${x3}${y3}`,
      `${x4}${y4}`,
      `${x5}${y5}`,
      `${x6}${y6}`,
      `${x7}${y7}`,
      `${x8}${y8}`,
    ])
  );

  if (
    isShortCastlingPossible({
      boardState,
      currentSquare,
      gameState,
    })
  ) {
    const cColor = getPieceColor(boardState[currentSquare]);

    if (cColor === "white") moves.push("76");
    else if (cColor === "black") moves.push("06");
  }

  if (
    isLongCastlingPossible({
      boardState,
      currentSquare,
      gameState,
    })
  ) {
    const cColor = getPieceColor(boardState[currentSquare]);

    if (cColor === "white") moves.push("72");
    else if (cColor === "black") moves.push("02");
  }
  return moves;
};

const findPossibleSquares = (
  currentSquare: Coordinate,
  boardState: BoardState,
  gameState: GameState
) => {
  const currentPiece = boardState[currentSquare];
  if (!currentPiece) return [];

  let result: Coordinate[] = [];
  switch (true) {
    case currentPiece === "wp":
      result = findWhitePawnPossibleSquares(currentSquare, boardState);
      break;
    case currentPiece === "bp":
      result = findBlackPawnPossibleSquares(currentSquare, boardState);
      break;
    case ["wb", "bb"].includes(currentPiece):
      result = findBishopPossibleSquares(currentSquare, boardState);
      break;
    case ["wk", "bk"].includes(currentPiece):
      result = findKingPossibleSquares(currentSquare, boardState, gameState);
      break;
    case ["wn", "bn"].includes(currentPiece):
      result = findKnightPossibleSquares(currentSquare, boardState);
      break;
    case ["wr", "br"].includes(currentPiece):
      result = findRookPossibleSquares(currentSquare, boardState);
      break;
    case ["wq", "bq"].includes(currentPiece):
      result = findQueenPossibleSquares(currentSquare, boardState);
      break;
  }

  return result;
};

export {
  findWhitePawnPossibleSquares,
  findBlackPawnPossibleSquares,
  findRookPossibleSquares,
  findKnightPossibleSquares,
  findBishopPossibleSquares,
  findQueenPossibleSquares,
  findKingPossibleSquares,
  findPossibleSquares,
};
