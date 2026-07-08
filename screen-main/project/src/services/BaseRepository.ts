import type {
  ServerPerformanceHourly,
  DiskPerformanceHourly,
  NetworkTrafficHourly,
  ServerStatusSnapshot,
} from '@/types/DataTypes';

export interface BaseRepository {
  getPerformanceData(params?: { hostId?: string; startHour?: string; endHour?: string }): Promise<ServerPerformanceHourly[]>;
  getDiskData(params?: { hostId?: string; diskName?: string; startHour?: string; endHour?: string }): Promise<DiskPerformanceHourly[]>;
  getNetworkData(params?: { hostId?: string; startHour?: string; endHour?: string }): Promise<NetworkTrafficHourly[]>;
  getStatusSnapshot(params?: { alertLevel?: string }): Promise<ServerStatusSnapshot[]>;
}
