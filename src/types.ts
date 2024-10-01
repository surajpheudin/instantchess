export type Coordinates = `${number}${number}`;
export type XYCoordinates = [number, number];
export type BoardState = Record<Coordinates, PieceName>;
export type PieceName =
  | "wr"
  | "wn"
  | "wb"
  | "wq"
  | "wk"
  | "wp"
  | "br"
  | "bn"
  | "bb"
  | "bq"
  | "bk"
  | "bp";
export type GameState = {
  turn: "black" | "white";
  capturedByWhite: PieceName[];
  capturedByBlack: PieceName[];
  blackCastlingRights: "both" | "long" | "short" | null;
  whiteCastlingRights: "both" | "long" | "short" | null;
};

export type Option = {
  boardState: BoardState;
  currentSquare: Coordinates;
  destinationSquare: Coordinates;
};

export type LastMove = {
  from: Coordinates;
  to: Coordinates;
};
