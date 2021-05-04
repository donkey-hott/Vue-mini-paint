import { Coordinates, RectSize } from "../components/paint-types";

export function calcRectangleSize(
  currentPosition: Coordinates,
  initialPosition: Coordinates
): RectSize {
  const width = currentPosition.x - initialPosition.x;
  const height = currentPosition.y - initialPosition.y;

  return { width, height };
}

export function getRadiusBySize(width: number, height: number): number {
  return Math.sqrt(Math.pow(width, 2) + Math.pow(height, 2));
}

export function isShape(funcName: string): boolean {
  return funcName !== "PencilStrategy" && funcName !== "EraseStrategy";
}

export function getRelativeCursorPosition(
  e: MouseEvent,
  offsetLeft: number,
  offsetTop: number
): Coordinates {
  const x = e.pageX - offsetLeft;
  const y = e.pageY - offsetTop;
  return { x, y };
}
