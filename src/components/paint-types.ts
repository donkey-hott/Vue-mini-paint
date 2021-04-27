export type Coordinates = {
  x: number;
  y: number;
};

export type RectSize = {
  width: number;
  height: number;
};

export type StyleOptions = {
  lineWidth: number;
  strokeColor: string;
  fillColor: string;
  isShapeFilled: boolean;
};

export type PolygonConfiguration = {
  sides: number;
  angle: number;
};

export type DrawFunctionType = {
  funcName: string;
  polygonParameters?: PolygonConfiguration | undefined;
};

export interface DrawFunctionsInterface {
  brush(position: Coordinates | null): void;
  erase(position: Coordinates | null): void;
  drawLine(position: Coordinates | null): void;
  drawRect(position: Coordinates | null): void;
  drawCircle(position: Coordinates | null): void;
  drawRATriangle(position: Coordinates | null): void;
  drawPolygon(
    position: Coordinates | null,
    polygonConfiguration: PolygonConfiguration
  ): void;
}
