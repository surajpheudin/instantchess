import { BoardState, Coordinates, GameState, Option } from "../types";
import { addZeroPrefix, getPieceColor } from "./helpers";

interface IIsCastlingPossible extends Omit<Option, "destinationSquare"> {
  gameState: GameState;
}

const validateCastling = ({
  boardState,
  currentSquare,
  gameState,
  variant,
}: IIsCastlingPossible & {
  variant: "short" | "long";
}) => {
  const cPiece = boardState[currentSquare];
  if (!cPiece.endsWith("k")) return false;

  const cColor = getPieceColor(cPiece);
  let modes: string[] = [];
  if (variant === "short") modes = ["both", "short"];
  if (variant === "long") modes = ["both", "long"];
  if (
    cColor === "white" &&
    !modes.includes(gameState.whiteCastlingRights ?? "")
  ) {
    return false;
  }
  if (
    cColor === "black" &&
    !modes.includes(gameState.blackCastlingRights ?? "")
  ) {
    return false;
  }
  return true;
};
const isShortCastlingPossible = ({
  boardState,
  currentSquare,
  gameState,
}: IIsCastlingPossible) => {
  const isValid = validateCastling({
    boardState,
    currentSquare,
    gameState,
    variant: "short",
  });

  if (!isValid) return false;

  const arr = Array.from({
    length: 2,
  }).fill(0);

  const hasBetweenPieces = arr.some((_, i) => {
    const dSquare = (+currentSquare + (i + 1)).toString() as Coordinates;
    return !!boardState[addZeroPrefix(dSquare)];
  });
  if (hasBetweenPieces) return false;
  return true;
};

const isLongCastlingPossible = ({
  boardState,
  currentSquare,
  gameState,
}: IIsCastlingPossible) => {
  const isValid = validateCastling({
    boardState,
    currentSquare,
    gameState,
    variant: "long",
  });

  if (!isValid) return false;

  const arr = Array.from({
    length: 3,
  }).fill(0);

  const hasBetweenPieces = arr.some((_, i) => {
    const dSquare = (+currentSquare - (i + 1)).toString() as Coordinates;
    return !!boardState[addZeroPrefix(dSquare)];
  });
  if (hasBetweenPieces) return false;
  return true;
};

const removeCastlingRights = ({
  currentSquare,
  boardState,
  setGameState,
}: {
  currentSquare: Coordinates;
  boardState: BoardState;
  setGameState: React.Dispatch<React.SetStateAction<GameState>>;
}) => {
  const cPiece = boardState[currentSquare];
  if (!cPiece.endsWith("r") && !cPiece.endsWith("k")) return;

  if (cPiece.endsWith("r")) {
    switch (currentSquare) {
      case "70":
        setGameState((prev) => ({
          ...prev,
          whiteCastlingRights:
            prev.whiteCastlingRights === "both" ? "short" : null,
        }));
        break;

      case "77":
        setGameState((prev) => ({
          ...prev,
          whiteCastlingRights:
            prev.whiteCastlingRights === "both" ? "long" : null,
        }));
        break;

      case "00":
        setGameState((prev) => ({
          ...prev,
          blackCastlingRights:
            prev.blackCastlingRights === "both" ? "short" : null,
        }));
        break;

      case "07":
        setGameState((prev) => ({
          ...prev,
          blackCastlingRights:
            prev.blackCastlingRights === "both" ? "long" : null,
        }));
        break;

      default:
        break;
    }
  } else if (cPiece.endsWith("k")) {
    if (currentSquare === "74") {
      setGameState((prev) => ({
        ...prev,
        whiteCastlingRights: null,
      }));
    } else if (currentSquare === "04") {
      setGameState((prev) => ({
        ...prev,
        blackCastlingRights: null,
      }));
    }
  }
};

const handleCastlingMove = ({
  currentSquare,
  destinationSquare,
  setBoardState,
  setGameState,
  variant,
}: {
  currentSquare: Coordinates;
  destinationSquare: Coordinates;
  setBoardState: React.Dispatch<React.SetStateAction<BoardState>>;
  setGameState: React.Dispatch<React.SetStateAction<GameState>>;
  variant: "long" | "short";
}) => {
  const rookSquare = addZeroPrefix(
    variant === "short"
      ? ((+currentSquare + 3)?.toString() as Coordinates)
      : ((+currentSquare - 4)?.toString() as Coordinates)
  );

  const rookDestinationSquare = addZeroPrefix(
    variant === "short"
      ? ((+currentSquare + 1)?.toString() as Coordinates)
      : ((+currentSquare - 1)?.toString() as Coordinates)
  );
  setBoardState((prev) => ({
    ...prev,
    [currentSquare]: null,
    [rookSquare]: null,
    [destinationSquare]: prev[currentSquare],
    [rookDestinationSquare]: prev[rookSquare],
  }));
  setGameState((prev) => ({
    ...prev,
    turn: prev.turn === "white" ? "black" : "white",
  }));
};

export {
  isShortCastlingPossible,
  isLongCastlingPossible,
  removeCastlingRights,
  handleCastlingMove,
};
