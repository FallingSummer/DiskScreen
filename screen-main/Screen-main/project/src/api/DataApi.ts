import { httpClient } from '@/services/HttpClient';
import type { ApiResponse, OverviewData } from '@/types/DataTypes';

export class DataApi {
  async fetchOverviewData(): Promise<ApiResponse<OverviewData>> {
    return httpClient.get<ApiResponse<OverviewData>>('/overview');
  }
}
