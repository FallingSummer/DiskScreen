import { httpClient } from '@/services/HttpClient';
import type { ApiResponse } from '@/types/DataTypes';
import type {
  ServerPerformanceHourly,
  DiskPerformanceHourly,
  NetworkTrafficHourly,
  ServerStatusSnapshot,
} from '@/types/DataTypes';

export class DataApi {
  async fetchPerformanceData(params?: { hostId?: string; startHour?: string; endHour?: string }): Promise<ApiResponse<ServerPerformanceHourly[]>> {
    return httpClient.get<ApiResponse<ServerPerformanceHourly[]>>('/performance-hourly', { params });
  }

  async fetchDiskData(params?: { hostId?: string; diskName?: string; startHour?: string; endHour?: string }): Promise<ApiResponse<DiskPerformanceHourly[]>> {
    return httpClient.get<ApiResponse<DiskPerformanceHourly[]>>('/disk-hourly', { params });
  }

  async fetchNetworkData(params?: { hostId?: string; startHour?: string; endHour?: string }): Promise<ApiResponse<NetworkTrafficHourly[]>> {
    return httpClient.get<ApiResponse<NetworkTrafficHourly[]>>('/network-hourly', { params });
  }

  async fetchStatusSnapshot(params?: { alertLevel?: string }): Promise<ApiResponse<ServerStatusSnapshot[]>> {
    return httpClient.get<ApiResponse<ServerStatusSnapshot[]>>('/status-snapshot', { params });
  }
}
