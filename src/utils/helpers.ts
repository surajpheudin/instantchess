import { Coordinates, PieceName, XYCoordinates } from "../types";
import { COORDINATES } from "./constant";

const getPieceColor = (pieceName: PieceName) => {
  if (!pieceName) return "";
  if (pieceName.startsWith("w")) return "white";
  if (pieceName.startsWith("b")) return "black";
  return "";
};

const getXYCoordinates = (coordinates: Coordinates) =>
  coordinates.split("").map((item) => parseInt(item)) as XYCoordinates;

const pipe =
  <T>(...fns: ((arg: T) => T)[]) =>
  (input: T) =>
    fns.reduce((acc, fn) => fn(acc), input);

const removeDuplicate = <T>(arr: T[]): T[] => {
  return [...new Set(arr)];
};

const removeInvalidCoordinates = (arr: Coordinates[]): Coordinates[] => {
  return arr.filter((item) => COORDINATES.includes(item));
};

const getCleanCoordinates = pipe(removeDuplicate, removeInvalidCoordinates);

const addZeroPrefix = (square: Coordinates): Coordinates => {
  return square.length === 1 ? (`0${square}` as Coordinates) : square;
};

export { getPieceColor, getXYCoordinates, getCleanCoordinates, addZeroPrefix };
