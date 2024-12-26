import { BoardState, Coordinate, GameState, Option } from "../types";
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
  if (!cPiece || !cPiece.endsWith("k")) return false;

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
    const dSquare = (+currentSquare + (i + 1)).toString() as Coordinate;
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
    const dSquare = (+currentSquare - (i + 1)).toString() as Coordinate;
    return !!boardState[addZeroPrefix(dSquare)];
  });
  if (hasBetweenPieces) return false;
  return true;
};

const getCastlingRights = ({
  currentSquare,
  boardState,
  gameState,
}: {
  currentSquare: Coordinate;
  boardState: BoardState;
  gameState: GameState;
}) => {
  const cPiece = boardState[currentSquare];
  if (!cPiece) return;
  if (!cPiece.endsWith("r") && !cPiece.endsWith("k")) return;

  if (cPiece.endsWith("r")) {
    switch (currentSquare) {
      case "70":
        return {
          whiteCastlingRights:
            gameState.whiteCastlingRights === "both"
              ? ("short" as const)
              : null,
        };

      case "77":
        return {
          whiteCastlingRights:
            gameState.whiteCastlingRights === "both" ? ("long" as const) : null,
        };

      case "00":
        return {
          blackCastlingRights:
            gameState.blackCastlingRights === "both"
              ? ("short" as const)
              : null,
        };

      case "07":
        return {
          blackCastlingRights:
            gameState.blackCastlingRights === "both" ? ("long" as const) : null,
        };
    }
  } else if (cPiece.endsWith("k")) {
    if (currentSquare === "74") {
      return {
        whiteCastlingRights: null,
      };
    } else if (currentSquare === "04") {
      return {
        blackCastlingRights: null,
      };
    }
  }

  return;
};

const handleCastlingMove = ({
  boardState,
  currentSquare,
  destinationSquare,
  variant,
  gameState,
}: {
  boardState: BoardState;
  currentSquare: Coordinate;
  destinationSquare: Coordinate;
  variant: "long" | "short";
  gameState: GameState;
}) => {
  const rookSquare = addZeroPrefix(
    variant === "short"
      ? ((+currentSquare + 3)?.toString() as Coordinate)
      : ((+currentSquare - 4)?.toString() as Coordinate)
  );

  const rookDestinationSquare = addZeroPrefix(
    variant === "short"
      ? ((+currentSquare + 1)?.toString() as Coordinate)
      : ((+currentSquare - 1)?.toString() as Coordinate)
  );
  const newBoardState: BoardState = {
    [currentSquare]: null,
    [rookSquare]: null,
    [destinationSquare]: boardState[currentSquare],
    [rookDestinationSquare]: boardState[rookSquare],
  };
  const newGameState: Pick<GameState, "turn"> = {
    turn: gameState.turn === "white" ? "black" : "white",
  };

  return { boardState: newBoardState, gameState: newGameState };
};

export {
  isShortCastlingPossible,
  isLongCastlingPossible,
  getCastlingRights,
  handleCastlingMove,
};
