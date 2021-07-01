export interface BarChartConfig {
  width?: number;
  height?: number;
  title?: string;
  leftAxisLabel?: string;
  bottomAxisLabel?: string;
  labelFontSize?: string;
  titleFontSize?: string;
  bandColor?: string;
  labelColor?: string;
}

export interface PieChartConfig {
  title?: string;
  titleColor?: string;
  titleSize?: number;
  labelColor?: string;
  labelSize?: number;
  responsive?: boolean;
  backgroundColors?: Array<string>;
}
