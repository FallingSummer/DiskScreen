import type { BaseRepository } from './BaseRepository';
import { DataApi } from '@/api/DataApi';
import type { OverviewData } from '@/types/DataTypes';

export class ApiRepository implements BaseRepository<OverviewData> {
  constructor(private readonly dataApi: DataApi = new DataApi()) {}

  async getData(): Promise<OverviewData> {
    const response = await this.dataApi.fetchOverviewData();
    return response.data;
  }
}
