import { BoardState, Coordinates, LastMove } from "../types";

const checkEnPassant = ({
  currentSquare,
  lastMove,
  boardState,
}: {
  boardState: BoardState;
  currentSquare: Coordinates;
  lastMove: LastMove | null;
}) => {
  if (!lastMove) return false;

  // 1. Check if last move was pawn move.
  const lastMovedPiece = boardState[lastMove.to];
  if (!["wp", "bp"].includes(lastMovedPiece)) return false;

  // 2. Check if the piece ready to move is white or black pawn.
  const currentPiece = boardState[currentSquare];
  const whitePawnIsReady = currentPiece === "wp" && currentSquare[0] === "3";
  const blackPawnIsReady = currentPiece === "bp" && currentSquare[0] === "4";
  if (!whitePawnIsReady && !blackPawnIsReady) return false;

  // 3. Check if latest move was pawn's sliblings move.
  if (
    ![+currentSquare?.[1] - 1, +currentSquare?.[1] + 1].includes(
      +lastMove.from[1]
    )
  )
    return false;

  // 4. Check if latest move was pawn's two step move.
  const pawnMove = lastMove && Math.abs(+lastMove.from - +lastMove.to) === 20;

  return pawnMove;
};

export { checkEnPassant };
