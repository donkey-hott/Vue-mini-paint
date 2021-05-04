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

export interface Strategy {
  execute(
    position: Coordinates | null,
    polygonOptions?: PolygonConfiguration
  ): void;
}
