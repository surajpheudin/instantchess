import { BoardState, GameState } from "./types";

export const DEFAULT_BOARD_STATE: BoardState = {
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

export const DEFAULT_GAME_STATE: GameState = {
  turn: "white",
  capturedByWhite: [],
  capturedByBlack: [],
  blackCastlingRights: "both",
  whiteCastlingRights: "both",
};

const ARRAY_OF_EIGHT = new Array(8).fill(0);
export const COORDINATES = ARRAY_OF_EIGHT.map((_, i) =>
  ARRAY_OF_EIGHT.map((_, j) => `${i}${j}`)
).flat();
