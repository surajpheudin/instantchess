import { GameState, Option, PieceName } from "../types";
import { getPieceColor } from "./helpers";

const isPromotionPossible = ({
  boardState,
  currentSquare,
  destinationSquare,
}: Option) => {
  const cPiece = boardState[currentSquare];
  if (!cPiece || !cPiece.endsWith("p")) return false;

  const cColor = getPieceColor(cPiece);

  if (cColor === "white" && destinationSquare.startsWith("0")) return true;
  if (cColor === "black" && destinationSquare.startsWith("7")) return true;

  return false;
};

const handlePromotion = ({
  boardState,
  currentSquare,
  destinationSquare,
  promotionPiece,
  gameState,
}: Option & {
  gameState: GameState;
  promotionPiece: Omit<PieceName, "wp" | "bp" | "wk" | "bk">;
}) => {
  if (["wp", "bp", "wk", "bk"].includes(promotionPiece as PieceName)) {
    throw Error("Invalid promotion piece.");
  }

  const cColor = getPieceColor(boardState[currentSquare]);
  const dColor = getPieceColor(promotionPiece as PieceName);

  if (cColor !== dColor) {
    throw Error("Invalid promotion piece color.");
  }
  const newBoardState = {
    [currentSquare]: null,
    [destinationSquare]: promotionPiece,
  };

  const newGameState: Pick<GameState, "turn"> = {
    turn: gameState.turn === "white" ? "black" : "white",
  };

  return { boardState: newBoardState, gameState: newGameState };
};

export { isPromotionPossible, handlePromotion };
