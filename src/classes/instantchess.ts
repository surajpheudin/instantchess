import { BoardState, Coordinate, GameState, LastMove } from "../types";
import {
  findPossibleSquares,
  willKingBeInCheck,
} from "../utils/possibleSquares";
import {
  getCastlingRights,
  handleCastlingMove,
  isLongCastlingPossible,
  isShortCastlingPossible,
} from "../utils/castling";
import { DEFAULT_BOARD_STATE, DEFAULT_GAME_STATE } from "../constant";
import { getPieceColor } from "../utils/helpers";
import { checkEnPassant } from "../utils/enpassant";
import { handlePromotion, isPromotionPossible } from "../utils/promotion";
import { findPossibleCaptureSquare } from "../utils/possibleCaptureSquare";

class InstantChess {
  private boardState: BoardState = DEFAULT_BOARD_STATE;
  private gameState: GameState = DEFAULT_GAME_STATE;
  private possibleSquares: Coordinate[] = [];
  private possibleCaptureSquares: Coordinate[] = [];
  private lastMove: LastMove | null = null;
  constructor() {}

  static defaultBoardState = DEFAULT_BOARD_STATE;
  static defaultGameState = DEFAULT_GAME_STATE;
  static defaultPossibleSquare = [] as Coordinate[];
  static defaultPossibleCaptureSquares = [] as Coordinate[];
  static defaultLastMove = null as LastMove | null;

  /** Getters */
  getBoardState() {
    return this.boardState;
  }

  getGameState() {
    return this.gameState;
  }

  getPossibleSquares() {
    return this.possibleSquares;
  }

  getPossibleCaptureSquares() {
    return this.possibleCaptureSquares;
  }

  getLastMove() {
    return this.lastMove;
  }

  /** Private Methods */

  private isUsersTurn({ currentSquare }: { currentSquare: Coordinate }) {
    return (
      this.gameState.turn === getPieceColor(this.boardState[currentSquare])
    );
  }

  private movePiece = (
    currentSquare: Coordinate,
    destinationSquare: Coordinate
  ) => {
    this.boardState = {
      ...this.boardState,
      [currentSquare]: null,
      [destinationSquare]: this.boardState[currentSquare],
    };
  };

  private capturePiece = (
    currentSquare: Coordinate,
    destinationSquare: Coordinate
  ) => {
    const cColor = getPieceColor(this.boardState[currentSquare]);
    const dColor = getPieceColor(this.boardState[destinationSquare]);
    /**
     * Validation 1
     * Can't capture same color piece
     */
    if (cColor === dColor) return;
    this.boardState = {
      ...this.boardState,
      [currentSquare]: null,
      [destinationSquare]: this.boardState[currentSquare],
    };
    const gameState = structuredClone(this.gameState);
    const destinationPiece = this.boardState[destinationSquare];
    if (cColor === "white" && destinationPiece) {
      gameState.capturedByWhite = [
        ...gameState.capturedByWhite,
        destinationPiece,
      ];
    } else if (cColor === "black" && destinationPiece) {
      gameState.capturedByBlack = [
        ...gameState.capturedByBlack,
        destinationPiece,
      ];
    }
    this.gameState = gameState;
  };

  private handleEnPassantCapture(
    currentSquare: Coordinate,
    destinationSquare: Coordinate
  ) {
    const cColor = getPieceColor(this.boardState[currentSquare]);
    const enPassantPieceSquare =
      cColor === "white"
        ? ((+destinationSquare + 10)?.toString() as Coordinate)
        : ((+destinationSquare - 10)?.toString() as Coordinate);
    this.boardState = {
      ...this.boardState,
      [currentSquare]: null,
      [enPassantPieceSquare]: null,
      [destinationSquare]: this.boardState[currentSquare],
    };

    const gameState = structuredClone(this.gameState);
    const enPassantPiece = this.boardState[enPassantPieceSquare];
    if (cColor === "white" && enPassantPiece) {
      gameState.capturedByWhite = [
        ...gameState.capturedByWhite,
        enPassantPiece,
      ];
    } else if (cColor === "black" && enPassantPiece) {
      gameState.capturedByBlack = [
        ...gameState.capturedByBlack,
        enPassantPiece,
      ];
    }
    this.gameState = gameState;
  }

  /** Public Methods */
  handleMove({
    currentSquare,
    destinationSquare,
  }: {
    currentSquare: Coordinate;
    destinationSquare: Coordinate;
  }) {
    /**
     * Validation 1
     * Check turn
     */
    if (!this.isUsersTurn({ currentSquare })) return;

    if (
      ![...this.possibleSquares, ...this.possibleCaptureSquares].includes(
        destinationSquare
      )
    )
      return;

    const cPiece = this.boardState[currentSquare];
    const dPiece = this.boardState[destinationSquare];

    if (cPiece && !dPiece) {
      if (
        checkEnPassant({
          boardState: this.boardState,
          currentSquare,
          lastMove: this.lastMove,
        })
      ) {
        this.handleEnPassantCapture(currentSquare, destinationSquare);
      } else if (
        isShortCastlingPossible({
          boardState: this.boardState,
          currentSquare,
          gameState: this.gameState,
        })
      ) {
        const { boardState, gameState } = handleCastlingMove({
          boardState: this.boardState,
          currentSquare,
          destinationSquare: destinationSquare,
          variant: "short",
          gameState: this.gameState,
        });

        this.boardState = { ...this.boardState, ...boardState };
        this.gameState = { ...this.gameState, ...gameState };
      } else if (
        isLongCastlingPossible({
          boardState: this.boardState,
          currentSquare,
          gameState: this.gameState,
        })
      ) {
        const { boardState, gameState } = handleCastlingMove({
          boardState: this.boardState,
          currentSquare,
          destinationSquare,
          variant: "long",
          gameState: this.gameState,
        });

        this.boardState = { ...this.boardState, ...boardState };
        this.gameState = { ...this.gameState, ...gameState };
      } else if (
        isPromotionPossible({
          boardState: this.boardState,
          currentSquare,
          destinationSquare,
        })
      ) {
        const promotionPiece = "wb";
        const { boardState, gameState } = handlePromotion({
          currentSquare,
          destinationSquare,
          boardState: this.boardState,
          promotionPiece,
          gameState: this.gameState,
        });
        this.boardState = { ...this.boardState, ...boardState };
        this.gameState = { ...this.gameState, ...gameState };
      } else {
        this.movePiece(currentSquare, destinationSquare);
      }
    }

    if (cPiece && dPiece) {
      this.capturePiece(currentSquare, destinationSquare);
    }

    this.lastMove = {
      from: currentSquare,
      to: destinationSquare,
    };

    const cRights = getCastlingRights({
      boardState: this.boardState,
      currentSquare,
      gameState: this.gameState,
    });

    this.gameState = {
      ...this.gameState,
      turn: this.gameState.turn === "white" ? "black" : "white",
      ...cRights,
    };
  }

  handlePieceSelected({ currentSquare }: { currentSquare: Coordinate | null }) {
    if (currentSquare) {
      if (!this.isUsersTurn({ currentSquare })) return;

      let pSquares = findPossibleSquares(
        currentSquare,
        this.boardState,
        this.gameState
      );
      let pCaptureSquares = findPossibleCaptureSquare({
        boardState: this.boardState,
        currentSquare,
        lastMove: this.lastMove,
        gameState: this.gameState,
      });
      // if (this.boardState[currentSquare]?.endsWith("k")) {

      pSquares = pSquares.filter((destinationSquare) => {
        return !willKingBeInCheck({
          boardState: this.boardState,
          currentSquare,
          destinationSquare,
          gameState: this.gameState,
          lastMove: this.lastMove,
        });
      });

      pCaptureSquares = pCaptureSquares.filter(
        (destinationSquare) =>
          !willKingBeInCheck({
            boardState: this.boardState,
            currentSquare,
            destinationSquare,
            gameState: this.gameState,
            lastMove: this.lastMove,
          })
      );
      // }
      this.possibleSquares = pSquares;
      this.possibleCaptureSquares = pCaptureSquares;
    } else {
      this.possibleSquares = [];
      this.possibleCaptureSquares = [];
    }
  }
}

export { InstantChess };
