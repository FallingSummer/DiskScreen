export interface ChartPoint {
  name: string;
  value: number;
}

export interface TrendSeries {
  name: string;
  data: number[];
}

export interface OverviewCardData {
  title: string;
  value: number;
  unit: string;
  trend: number;
  color: string;
}

export interface TableRowData {
  name: string;
  value: number;
  rate: number;
  status: string;
}
