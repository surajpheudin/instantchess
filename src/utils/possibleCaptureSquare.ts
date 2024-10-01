import { Coordinates, GameState, LastMove, Option } from "../types";
import { checkEnPassant } from "./enpassant";
import {
  getCleanCoordinates,
  getPieceColor,
  getXYCoordinates,
} from "./helpers";
import { findPossibleSquares } from "./possibleSquares";

const findPossibleCaptureSquare = ({
  boardState,
  currentSquare,
  lastMove,
  gameState,
}: Omit<Option, "destinationSquare"> & {
  lastMove: LastMove | null;
  gameState: GameState;
}) => {
  const doesOppositeColorPieceExist = (destinationSquare: Coordinates) => {
    const cColor = getPieceColor(boardState[currentSquare]);
    const dPiece = boardState[destinationSquare];
    if (!dPiece) return false;
    const dColor = getPieceColor(boardState[destinationSquare]);
    return dColor !== cColor;
  };

  const cPiece = boardState[currentSquare];
  const [x, y] = getXYCoordinates(currentSquare);

  if (cPiece === "bp") {
    /**
     * Black Pawn
     */
    const moves = getCleanCoordinates([
      `${x + 1}${y + 1}`,
      `${x + 1}${y - 1}`,
    ]).filter(doesOppositeColorPieceExist);
    if (
      lastMove &&
      checkEnPassant({
        boardState,
        currentSquare,
        lastMove,
      })
    ) {
      moves.push(`${+lastMove?.from - 10}` as Coordinates);
    }
    return moves;
  } else if (cPiece === "wp") {
    /**
     * White Pawn
     */
    const moves = getCleanCoordinates([
      `${x - 1}${y + 1}`,
      `${x - 1}${y - 1}`,
    ]).filter(doesOppositeColorPieceExist);
    if (
      lastMove &&
      checkEnPassant({
        boardState,
        currentSquare,
        lastMove,
      })
    ) {
      moves.push(`${+lastMove?.from + 10}` as Coordinates);
    }
    return moves;
  } else {
    /**
     * Everything Else
     */
    const pSquares = findPossibleSquares(currentSquare, boardState, gameState);
    const pCaptureSquares = pSquares.filter(doesOppositeColorPieceExist);

    return pCaptureSquares;
  }
};

export { findPossibleCaptureSquare };
