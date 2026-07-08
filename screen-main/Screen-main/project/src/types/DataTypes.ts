export interface OverviewData {
  title: string;
  value: number;
  trend: number;
  unit: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

export type DataSourceMode = 'mock' | 'api';
