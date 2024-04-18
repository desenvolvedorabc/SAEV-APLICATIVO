export function scaleBetween(
  unscaledNum: number,
  minAllowed: number,
  maxAllowed: number,
  min: number,
  max: number
) {
  return (
    ((maxAllowed - minAllowed) * (unscaledNum - min)) / (max - min) + minAllowed
  );
}
