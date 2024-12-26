import { useState } from "react";
import { Coordinate } from "./types";
import useChessi from "./react/chessi";
import { getPieceColor } from "./utils/helpers";
const ARRAY_OF_EIGHT = new Array(8).fill(0);

function App() {
  const [movePoint, setMovePoint] = useState<Coordinate | null>(null);
  const {
    boardState,
    gameState,
    possibleSquares,
    possibleCaptureSquares,
    handleMove,
    onPieceSelected,
  } = useChessi();

  return (
    <div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(8, 1fr)",
          marginInline: "auto",
        }}
      >
        {ARRAY_OF_EIGHT.map((_, i) =>
          ARRAY_OF_EIGHT.map((_, j) => {
            const coordinates: Coordinate = `${i}${j}`;
            const isPossible = possibleSquares.includes(coordinates);
            const isPossibleCapture =
              possibleCaptureSquares.includes(coordinates);
            return (
              <div
                key={coordinates}
                style={{
                  border: "1px solid #CCC",
                  paddingInline: "8px",
                  backgroundColor: isPossibleCapture
                    ? "green"
                    : isPossible
                    ? "pink"
                    : movePoint === coordinates
                    ? "#DDD"
                    : boardState[coordinates]
                    ? "#EEE"
                    : "transparent",
                }}
                onClick={() => {
                  if (movePoint) {
                    if (
                      getPieceColor(boardState[movePoint]) ===
                      getPieceColor(boardState[coordinates])
                    ) {
                      setMovePoint(coordinates);
                      onPieceSelected(coordinates);
                    } else {
                      handleMove(movePoint, coordinates);
                      setMovePoint(null);
                      onPieceSelected(null);
                    }
                  } else {
                    setMovePoint(coordinates);
                    onPieceSelected(coordinates);
                  }
                }}
              >
                <p>Square: {coordinates}</p>
                <p>Piece: {boardState[coordinates]}</p>
              </div>
            );
          })
        )}
      </div>
      <div>
        <p>{possibleSquares.join(", ")}</p>
        <p>{possibleCaptureSquares.join(", ")}</p>
        <p>Turn: {gameState.turn}</p>
        <p>Captured By White: {gameState.capturedByWhite.join(", ")}</p>
        <p>Captured By Black: {gameState.capturedByBlack.join(", ")}</p>
      </div>
    </div>
  );
}

export default App;
