import { BoardState, GameState, Option, PieceName } from "../types";
import { getPieceColor } from "./helpers";

const isPromotionPossible = ({
  boardState,
  currentSquare,
  destinationSquare,
}: Option) => {
  const cPiece = boardState[currentSquare];
  if (!cPiece.endsWith("p")) return false;

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
  setBoardState,
  setGameState,
}: Option & {
  promotionPiece: Omit<PieceName, "wp" | "bp" | "wk" | "bk">;
  setGameState: React.Dispatch<React.SetStateAction<GameState>>;
  setBoardState: React.Dispatch<React.SetStateAction<BoardState>>;
}) => {
  if (["wp", "bp", "wk", "bk"].includes(promotionPiece as PieceName)) {
    throw Error("Invalid promotion piece.");
  }

  const cColor = getPieceColor(boardState[currentSquare]);
  const dColor = getPieceColor(promotionPiece as PieceName);

  if (cColor !== dColor) {
    throw Error("Invalid promotion piece color.");
  }
  setBoardState((prev) => ({
    ...prev,
    [currentSquare]: null,
    [destinationSquare]: promotionPiece,
  }));

  setGameState((prev) => ({
    ...prev,
    turn: prev.turn === "white" ? "black" : "white",
  }));
};

export { isPromotionPossible, handlePromotion };
