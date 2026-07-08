import { RepositoryFactory } from './RepositoryFactory';
import type {
  ServerPerformanceHourly,
  DiskPerformanceHourly,
  NetworkTrafficHourly,
  ServerStatusSnapshot,
  DashboardOverview,
} from '@/types/DataTypes';

export class DataService {
  private readonly repository = RepositoryFactory.createRepository();

  async getPerformanceData(params?: { hostId?: string; startHour?: string; endHour?: string }): Promise<ServerPerformanceHourly[]> {
    return this.repository.getPerformanceData(params);
  }

  async getDiskData(params?: { hostId?: string; diskName?: string; startHour?: string; endHour?: string }): Promise<DiskPerformanceHourly[]> {
    return this.repository.getDiskData(params);
  }

  async getNetworkData(params?: { hostId?: string; startHour?: string; endHour?: string }): Promise<NetworkTrafficHourly[]> {
    return this.repository.getNetworkData(params);
  }

  async getStatusSnapshot(params?: { alertLevel?: string }): Promise<ServerStatusSnapshot[]> {
    return this.repository.getStatusSnapshot(params);
  }

  async getDashboardOverview(): Promise<DashboardOverview> {
    const status = await this.getStatusSnapshot();
    const total = status.length;
    const normal = status.filter((s) => s.AlertLevel === 'Normal').length;
    const warning = status.filter((s) => s.AlertLevel === 'Warning').length;
    const critical = status.filter((s) => s.AlertLevel === 'Critical').length;
    const avgCpu = total > 0 ? status.reduce((sum, s) => sum + s.CpuUsage, 0) / total : 0;
    const avgMem = total > 0 ? status.reduce((sum, s) => sum + (s.MemUsed / (s.MemTotal || 1)) * 100, 0) / total : 0;
    const totalNetIn = status.reduce((sum, s) => sum + s.NetIn, 0);
    const totalNetOut = status.reduce((sum, s) => sum + s.NetOut, 0);

    return {
      TotalHosts: total,
      NormalHosts: normal,
      WarningHosts: warning,
      CriticalHosts: critical,
      AvgCpuUsage: Number(avgCpu.toFixed(2)),
      AvgMemUsage: Number(avgMem.toFixed(2)),
      TotalNetIn: Number(totalNetIn.toFixed(2)),
      TotalNetOut: Number(totalNetOut.toFixed(2)),
    };
  }
}
