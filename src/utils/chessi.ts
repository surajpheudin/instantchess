import { useState } from "react";
import {
  BoardState,
  Coordinates,
  GameState,
  LastMove,
  PieceName,
} from "../types";
import { getPieceColor } from "./helpers";
import { findPossibleSquares } from "./possibleSquares";
import { findPossibleCaptureSquare } from "./possibleCaptureSquare";
import { checkEnPassant } from "./enpassant";
import {
  handleCastlingMove,
  isLongCastlingPossible,
  isShortCastlingPossible,
  removeCastlingRights,
} from "./castling";
import { handlePromotion, isPromotionPossible } from "./promotion";

const useChessi = () => {
  const [boardState, setBoardState] = useState<BoardState>(DEFAULT_BOARD_STATE);
  const [gameState, setGameState] = useState<GameState>(DEFAULT_GAME_STATE);
  const [possibleSquares, setPossibleSquares] = useState<Coordinates[]>([]);
  const [possibleCaptureSquares, setPossibleCaptureSquares] = useState<
    Coordinates[]
  >([]);
  const [lastMove, setLastMove] = useState<LastMove | null>(null);

  const handleMovement = (
    currentSquare: Coordinates,
    destinationSquare: Coordinates
  ) => {
    setBoardState((prev) => ({
      ...prev,
      [currentSquare]: null,
      [destinationSquare]: prev[currentSquare],
    }));
  };

  const handleCapture = (
    currentSquare: Coordinates,
    destinationSquare: Coordinates
  ) => {
    const cColor = getPieceColor(boardState[currentSquare]);
    const dColor = getPieceColor(boardState[destinationSquare]);
    /**
     * Validation 1
     * Can't capture same color piece
     */
    if (cColor === dColor) return;

    setBoardState((prev) => ({
      ...prev,
      [currentSquare]: null,
      [destinationSquare]: prev[currentSquare],
    }));
    setGameState((prev) => ({
      ...prev,
      turn: prev.turn === "white" ? "black" : "white",
      ...(cColor === "white" && {
        capturedByWhite: [
          ...prev.capturedByWhite,
          boardState[destinationSquare],
        ],
      }),
      ...(cColor === "black" && {
        capturedByBlack: [
          ...prev.capturedByBlack,
          boardState[destinationSquare],
        ],
      }),
    }));
  };

  const handleEnPassantCapture = (
    currentSquare: Coordinates,
    destinationSquare: Coordinates
  ) => {
    const cColor = getPieceColor(boardState[currentSquare]);
    const enPassantPieceSquare =
      cColor === "white"
        ? ((+destinationSquare + 10)?.toString() as Coordinates)
        : ((+destinationSquare - 10)?.toString() as Coordinates);
    setBoardState((prev) => ({
      ...prev,
      [currentSquare]: null,
      [enPassantPieceSquare]: null,
      [destinationSquare]: prev[currentSquare],
    }));
    setGameState((prev) => ({
      ...prev,
      turn: prev.turn === "white" ? "black" : "white",
      ...(cColor === "white" && {
        capturedByWhite: [
          ...prev.capturedByWhite,
          boardState[enPassantPieceSquare],
        ],
      }),
      ...(cColor === "black" && {
        capturedByBlack: [
          ...prev.capturedByBlack,
          boardState[enPassantPieceSquare],
        ],
      }),
    }));
  };

  const onMove = (
    currentSquare: Coordinates,
    destinationSquare: Coordinates
  ) => {
    if (
      ![...possibleSquares, ...possibleCaptureSquares].includes(
        destinationSquare
      )
    )
      return false;

    const cPiece = boardState[currentSquare];
    const dPiece = boardState[destinationSquare];

    if (cPiece && !dPiece) {
      if (
        checkEnPassant({
          boardState,
          currentSquare,
          lastMove,
        })
      ) {
        handleEnPassantCapture(currentSquare, destinationSquare);
      } else if (
        isShortCastlingPossible({
          boardState,
          currentSquare,
          gameState,
        })
      ) {
        handleCastlingMove({
          currentSquare,
          destinationSquare,
          setBoardState,
          setGameState,
          variant: "short",
        });
      } else if (
        isLongCastlingPossible({
          boardState,
          currentSquare,
          gameState,
        })
      ) {
        handleCastlingMove({
          currentSquare,
          destinationSquare,
          setBoardState,
          setGameState,
          variant: "long",
        });
      } else if (
        isPromotionPossible({
          boardState,
          currentSquare,
          destinationSquare,
        })
      ) {
        const promotionPiece = "wb";
        handlePromotion({
          currentSquare,
          destinationSquare,
          boardState,
          setBoardState,
          setGameState,
          promotionPiece,
        });
      } else {
        handleMovement(currentSquare, destinationSquare);
      }
    }

    if (cPiece && dPiece) {
      handleCapture(currentSquare, destinationSquare);
    }

    setLastMove({
      from: currentSquare,
      to: destinationSquare,
    });
    removeCastlingRights({
      boardState,
      currentSquare,
      setGameState,
    });
  };

  const onPieceSelected = (currentSquare: Coordinates | null) => {
    if (currentSquare) {
      const pSquares = findPossibleSquares(
        currentSquare,
        boardState,
        gameState
      );
      setPossibleSquares(pSquares);

      setPossibleCaptureSquares(
        findPossibleCaptureSquare({
          boardState,
          currentSquare,
          lastMove,
          gameState,
        })
      );
    } else {
      setPossibleSquares([]);
      setPossibleCaptureSquares([]);
    }
  };

  return {
    boardState,
    gameState,
    possibleSquares,
    possibleCaptureSquares,
    onMove,
    onPieceSelected,
  };
};

export default useChessi;

const DEFAULT_BOARD_STATE: Record<Coordinates, PieceName> = {
  "00": "br",
  "01": "bn",
  "02": "bb",
  "03": "bq",
  "04": "bk",
  "05": "bb",
  "06": "bn",
  "07": "br",

  "10": "bp",
  "11": "bp",
  "12": "bp",
  "13": "bp",
  "14": "bp",
  "15": "bp",
  "16": "bp",
  "17": "bp",

  "60": "wp",
  "61": "wp",
  "62": "wp",
  "63": "wp",
  "64": "wp",
  "65": "wp",
  "66": "wp",
  "67": "wp",

  "70": "wr",
  "71": "wn",
  "72": "wb",
  "73": "wq",
  "74": "wk",
  "75": "wb",
  "76": "wn",
  "77": "wr",
};

const DEFAULT_GAME_STATE: GameState = {
  turn: "white",
  capturedByWhite: [],
  capturedByBlack: [],
  blackCastlingRights: "both",
  whiteCastlingRights: "both",
};
