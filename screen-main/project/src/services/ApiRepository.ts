import { DataApi } from '@/api/DataApi';
import type { BaseRepository } from './BaseRepository';
import type {
  ServerPerformanceHourly,
  DiskPerformanceHourly,
  NetworkTrafficHourly,
  ServerStatusSnapshot,
} from '@/types/DataTypes';

export class ApiRepository implements BaseRepository {
  constructor(private readonly dataApi: DataApi = new DataApi()) {}

  async getPerformanceData(params?: { hostId?: string; startHour?: string; endHour?: string }): Promise<ServerPerformanceHourly[]> {
    const res = await this.dataApi.fetchPerformanceData(params);
    return res.Data ?? [];
  }

  async getDiskData(params?: { hostId?: string; diskName?: string; startHour?: string; endHour?: string }): Promise<DiskPerformanceHourly[]> {
    const res = await this.dataApi.fetchDiskData(params);
    return res.Data ?? [];
  }

  async getNetworkData(params?: { hostId?: string; startHour?: string; endHour?: string }): Promise<NetworkTrafficHourly[]> {
    const res = await this.dataApi.fetchNetworkData(params);
    return res.Data ?? [];
  }

  async getStatusSnapshot(params?: { alertLevel?: string }): Promise<ServerStatusSnapshot[]> {
    const res = await this.dataApi.fetchStatusSnapshot(params);
    return res.Data ?? [];
  }
}
