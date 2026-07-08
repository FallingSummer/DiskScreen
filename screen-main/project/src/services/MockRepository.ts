import type { BaseRepository } from './BaseRepository';
import type {
  ServerPerformanceHourly,
  DiskPerformanceHourly,
  NetworkTrafficHourly,
  ServerStatusSnapshot,
} from '@/types/DataTypes';

function randomDecimal(min: number, max: number, fixed = 2): number {
  return Number((Math.random() * (max - min) + min).toFixed(fixed));
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateHours(days = 2): string[] {
  const hours: string[] = [];
  const now = new Date();
  now.setMinutes(0, 0, 0);
  for (let i = days * 24; i >= 0; i--) {
    const d = new Date(now.getTime() - i * 3600000);
    hours.push(d.toISOString().slice(0, 19).replace('T', ' '));
  }
  return hours;
}

export class MockRepository implements BaseRepository {
  async getPerformanceData(): Promise<ServerPerformanceHourly[]> {
    const hosts = ['host001', 'host002', 'host003', 'host004'];
    const hours = generateHours(2);
    let id = 1;
    const result: ServerPerformanceHourly[] = [];
    for (const h of hours) {
      for (const host of hosts) {
        result.push({
          Id: id++,
          HostId: host,
          StatHour: h,
          CpuUsageAvg: randomDecimal(20, 70),
          CpuUsageMax: randomDecimal(50, 95),
          CpuIdleAvg: randomDecimal(10, 60),
          MemUsedAvg: randomDecimal(40000, 100000),
          MemFreeAvg: randomDecimal(20000, 80000),
          MemCacheAvg: randomDecimal(10000, 60000),
          Load1Avg: randomDecimal(1, 15),
          Load5Avg: randomDecimal(1, 12),
          Load15Avg: randomDecimal(1, 10),
          ProcRunAvg: randomInt(10, 500),
          ProcBlockAvg: randomInt(0, 200),
          ProcTotalAvg: randomInt(100, 600),
        });
      }
    }
    return result;
  }

  async getDiskData(): Promise<DiskPerformanceHourly[]> {
    const hosts = ['host001', 'host002', 'host003'];
    const disks = ['sda', 'sdb'];
    const hours = generateHours(2);
    let id = 1;
    const result: DiskPerformanceHourly[] = [];
    for (const h of hours) {
      for (const host of hosts) {
        for (const disk of disks) {
          result.push({
            Id: id++,
            HostId: host,
            StatHour: h,
            DiskName: disk,
            ReadAvg: randomDecimal(10000, 300000),
            WriteAvg: randomDecimal(10000, 300000),
            RqmAvg: randomDecimal(0, 500),
            UtilAvg: randomDecimal(10, 99),
            AwaitAvg: randomDecimal(1, 50),
            SvctmAvg: randomDecimal(1, 30),
            AvgrqAvg: randomDecimal(100, 1000),
          });
        }
      }
    }
    return result;
  }

  async getNetworkData(): Promise<NetworkTrafficHourly[]> {
    const hosts = ['host001', 'host002', 'host003', 'host004'];
    const hours = generateHours(2);
    let id = 1;
    const result: NetworkTrafficHourly[] = [];
    for (const h of hours) {
      for (const host of hosts) {
        result.push({
          Id: id++,
          HostId: host,
          StatHour: h,
          NetInAvg: randomDecimal(100, 900),
          NetOutAvg: randomDecimal(100, 900),
          NetPktInAvg: randomDecimal(10000, 90000),
          NetPktOutAvg: randomDecimal(10000, 90000),
        });
      }
    }
    return result;
  }

  async getStatusSnapshot(): Promise<ServerStatusSnapshot[]> {
    const hosts = [
      { HostId: 'host001', HostName: 'server-001.hismartlab.cn', Model: 'Dell R750', Location1: 'A', Location2: 'rack-01' },
      { HostId: 'host002', HostName: 'server-002.hismartlab.cn', Model: 'HP DL388', Location1: 'B', Location2: 'rack-02' },
      { HostId: 'host003', HostName: 'server-003.hismartlab.cn', Model: 'Dell R750', Location1: 'E', Location2: 'rack-03' },
      { HostId: 'host004', HostName: 'server-004.hismartlab.cn', Model: 'Huawei 2288H', Location1: 'A', Location2: 'rack-04' },
    ];
    const now = new Date().toISOString().slice(0, 19).replace('T', ' ');
    return hosts.map((h, index) => ({
      Id: index + 1,
      HostId: h.HostId,
      HostName: h.HostName,
      Model: h.Model,
      Location1: h.Location1,
      Location2: h.Location2,
      CpuUsage: randomDecimal(10, 90),
      MemUsed: randomDecimal(30000, 100000),
      MemTotal: randomDecimal(80000, 200000),
      NetIn: randomDecimal(100, 900),
      NetOut: randomDecimal(100, 900),
      Load1: randomDecimal(1, 20),
      ProcRun: randomInt(10, 500),
      AlertLevel: Math.random() > 0.8 ? 'Critical' : Math.random() > 0.6 ? 'Warning' : 'Normal',
      UpdateTime: now,
    }));
  }
}
