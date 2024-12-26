import { useEffect, useState } from "react";
import { Coordinate } from "../types";
import { InstantChess } from "../classes/instantchess";

const useChessi = () => {
  const [chess, setChess] = useState<InstantChess>();
  const [boardState, setBoardState] = useState(InstantChess.defaultBoardState);
  const [gameState, setGameState] = useState(InstantChess.defaultGameState);
  const [possibleSquares, setPossibleSquares] = useState(
    InstantChess.defaultPossibleSquare
  );
  const [possibleCaptureSquares, setPossibleCaptureSquares] = useState(
    InstantChess.defaultPossibleCaptureSquares
  );
  const [, setLastMove] = useState(InstantChess.defaultLastMove);

  const handleMove = (
    currentSquare: Coordinate,
    destinationSquare: Coordinate
  ) => {
    if (!chess) return;
    chess.handleMove({ currentSquare, destinationSquare });
    setBoardState(chess.getBoardState());
    setGameState(chess.getGameState());
    setPossibleSquares(chess.getPossibleSquares());
    setPossibleCaptureSquares(chess.getPossibleCaptureSquares());
    setLastMove(chess.getLastMove());
  };

  const onPieceSelected = (currentSquare: Coordinate | null) => {
    if (!chess) return;
    chess.handlePieceSelected({ currentSquare });
    setPossibleSquares(chess.getPossibleSquares());
    setPossibleCaptureSquares(chess.getPossibleCaptureSquares());
  };

  useEffect(() => {
    const chess = new InstantChess();
    setChess(chess);
  }, []);

  return {
    boardState,
    gameState,
    possibleSquares,
    possibleCaptureSquares,
    handleMove,
    onPieceSelected,
  };
};

export default useChessi;
