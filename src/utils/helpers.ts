import { COORDINATES } from "../constant";
import { Coordinate, PieceName, XYCoordinates } from "../types";

const getPieceColor = (pieceName: PieceName | null) => {
  if (!pieceName) return "";
  if (pieceName.startsWith("w")) return "white";
  if (pieceName.startsWith("b")) return "black";
  return "";
};

const getXYCoordinates = (coordinates: Coordinate) =>
  coordinates.split("").map((item) => parseInt(item)) as XYCoordinates;

const pipe =
  <T>(...fns: ((arg: T) => T)[]) =>
  (input: T) =>
    fns.reduce((acc, fn) => fn(acc), input);

const removeDuplicate = <T>(arr: T[]): T[] => {
  return [...new Set(arr)];
};

const removeInvalidCoordinates = (arr: Coordinate[]): Coordinate[] => {
  return arr.filter((item) => COORDINATES.includes(item));
};

const getCleanCoordinates = pipe(removeDuplicate, removeInvalidCoordinates);

const addZeroPrefix = (square: Coordinate): Coordinate => {
  return square.length === 1 ? (`0${square}` as Coordinate) : square;
};

export { getPieceColor, getXYCoordinates, getCleanCoordinates, addZeroPrefix };
