const ARRAY_OF_EIGHT = new Array(8).fill(0);
export const COORDINATES = ARRAY_OF_EIGHT.map((_, i) =>
  ARRAY_OF_EIGHT.map((_, j) => `${i}${j}`)
).flat();
