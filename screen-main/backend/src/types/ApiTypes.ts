export interface ApiResponse<T> {
  Code: number;
  Data: T;
  Message: string;
}

export interface ServerPerformanceHourly {
  Id: number;
  HostId: string;
  StatHour: string;
  CpuUsageAvg: number;
  CpuUsageMax: number;
  CpuIdleAvg: number;
  MemUsedAvg: number;
  MemFreeAvg: number;
  MemCacheAvg: number;
  Load1Avg: number;
  Load5Avg: number;
  Load15Avg: number;
  ProcRunAvg: number;
  ProcBlockAvg: number;
  ProcTotalAvg: number;
}

export interface DiskPerformanceHourly {
  Id: number;
  HostId: string;
  StatHour: string;
  DiskName: string;
  ReadAvg: number;
  WriteAvg: number;
  RqmAvg: number;
  UtilAvg: number;
  AwaitAvg: number;
  SvctmAvg: number;
  AvgrqAvg: number;
}

export interface NetworkTrafficHourly {
  Id: number;
  HostId: string;
  StatHour: string;
  NetInAvg: number;
  NetOutAvg: number;
  NetPktInAvg: number;
  NetPktOutAvg: number;
}

export interface ServerStatusSnapshot {
  Id: number;
  HostId: string;
  HostName: string;
  Model: string;
  Location1: string;
  Location2: string;
  CpuUsage: number;
  MemUsed: number;
  MemTotal: number;
  NetIn: number;
  NetOut: number;
  Load1: number;
  ProcRun: number;
  AlertLevel: string;
  UpdateTime: string;
}

export interface QueryParams {
  HostId?: string;
  StartHour?: string;
  EndHour?: string;
  DiskName?: string;
}
