import { Option } from "../types";
import { getPieceColor } from "./helpers";
import {
  findBishopPossibleSquares,
  findRookPossibleSquares,
} from "./possibleSquares";

function isSquareBlocked(options: Option) {
  const { currentSquare, boardState, destinationSquare } = options;
  const currentPiece = boardState[currentSquare];
  const destinationPiece = boardState[destinationSquare];

  /**
   * Checking if square is occupied by same color piece
   */
  const cColor = getPieceColor(currentPiece);
  const dColor = getPieceColor(destinationPiece);
  if (cColor && dColor && cColor === dColor) {
    return true;
  }

  switch (true) {
    case ["wk"].includes(currentPiece):
      return (
        (destinationSquare === "76" && boardState["75"]) ||
        (destinationSquare === "72" && boardState["73"])
      );
    case ["bk"].includes(currentPiece):
      return (
        (destinationSquare === "06" && boardState["05"]) ||
        (destinationSquare === "02" && boardState["03"])
      );
    case ["wn", "bn"].includes(currentPiece):
      return false;
    case ["wb", "bb"].includes(currentPiece):
      return isSquareBlockedForBishop(options);
    case ["wr", "br"].includes(currentPiece):
      return isSquareBlockedForRook(options);
    case ["wq", "bq"].includes(currentPiece):
      return isSquareBlockedForQueen(options);
    default:
      return false;
  }
}

function isSquareBlockedForRook({
  boardState,
  currentSquare,
  destinationSquare,
}: Option) {
  const rightPossibleSquares = findRookPossibleSquares(
    currentSquare,
    boardState,
    "right"
  );
  if (rightPossibleSquares.includes(destinationSquare)) {
    const piecesBetween = rightPossibleSquares
      .filter((item) => boardState[item])
      .filter((item) => parseInt(item) > parseInt(currentSquare));
    if (
      parseInt(destinationSquare) >
      Math.min(...piecesBetween.map((item) => parseInt(item)))
    )
      return true;
  }

  const leftPossibleSquares = findRookPossibleSquares(
    currentSquare,
    boardState,
    "left"
  );
  if (leftPossibleSquares.includes(destinationSquare)) {
    const piecesBetween = leftPossibleSquares
      .filter((item) => boardState[item])
      .filter((item) => parseInt(item) < parseInt(currentSquare));

    if (
      parseInt(destinationSquare) <
      Math.max(...piecesBetween.map((item) => parseInt(item)))
    )
      return true;
  }

  const upPossibleSquares = findRookPossibleSquares(
    currentSquare,
    boardState,
    "up"
  );
  if (upPossibleSquares.includes(destinationSquare)) {
    const piecesBetween = upPossibleSquares
      .filter((item) => boardState[item])
      .filter((item) => parseInt(item) < parseInt(currentSquare));

    if (
      parseInt(destinationSquare) <
      Math.max(...piecesBetween.map((item) => parseInt(item)))
    )
      return true;
  }

  const downPossibleSquares = findRookPossibleSquares(
    currentSquare,
    boardState,
    "down"
  );
  if (downPossibleSquares.includes(destinationSquare)) {
    const piecesBetween = downPossibleSquares
      .filter((item) => boardState[item])
      .filter((item) => parseInt(item) > parseInt(currentSquare));

    if (
      parseInt(destinationSquare) >
      Math.min(...piecesBetween.map((item) => parseInt(item)))
    )
      return true;
  }

  return false;
}

const bishopDirections = [
  "right-up",
  "left-up",
  "right-down",
  "left-down",
] as const;

function isSquareBlockedForBishop({
  boardState,
  currentSquare,
  destinationSquare,
}: Option) {
  for (let index = 0; index < bishopDirections.length; index++) {
    const direction = bishopDirections[index];
    const possibleSquares = findBishopPossibleSquares(
      currentSquare,
      boardState,
      direction
    );
    if (possibleSquares.includes(destinationSquare)) {
      const piecesBetween = possibleSquares.filter((item) => boardState[item]);

      const conditions = {
        "right-up":
          parseInt(destinationSquare) <
          Math.max(...piecesBetween.map((item) => parseInt(item))),
        "left-up":
          parseInt(destinationSquare) <
          Math.max(...piecesBetween.map((item) => parseInt(item))),
        "right-down":
          parseInt(destinationSquare) >
          Math.min(...piecesBetween.map((item) => parseInt(item))),
        "left-down":
          parseInt(destinationSquare) >
          Math.min(...piecesBetween.map((item) => parseInt(item))),
      };

      if (conditions[direction]) return true;
    }
  }

  return false;
}

function isSquareBlockedForQueen(option: Option) {
  return isSquareBlockedForBishop(option) || isSquareBlockedForRook(option);
}

export { isSquareBlocked };
