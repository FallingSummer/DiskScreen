import { createConnection } from '@/config/DatabaseConfig';
import { MockDataService } from './MockDataService';
import { AppConfig } from '@/config/AppConfig';
import type { DiskPerformanceHourly } from '@/types/ApiTypes';

export class DiskService {
  async queryDiskData(
    hostId?: string,
    diskName?: string,
    startHour?: string,
    endHour?: string,
  ): Promise<DiskPerformanceHourly[]> {
    if (AppConfig.MockMode) {
      return MockDataService.getDiskData(hostId, diskName, startHour, endHour);
    }

    const conn = await createConnection();
    try {
      let sql = 'SELECT * FROM `DiskPerformanceHourly` WHERE 1=1';
      const params: (string | number)[] = [];

      if (hostId) {
        sql += ' AND `HostId` = ?';
        params.push(hostId);
      }
      if (diskName) {
        sql += ' AND `DiskName` = ?';
        params.push(diskName);
      }
      if (startHour) {
        sql += ' AND `StatHour` >= ?';
        params.push(startHour);
      }
      if (endHour) {
        sql += ' AND `StatHour` <= ?';
        params.push(endHour);
      }

      sql += ' ORDER BY `StatHour` ASC, `HostId` ASC, `DiskName` ASC';

      const [rows] = await conn.execute(sql, params);
      return rows as DiskPerformanceHourly[];
    } finally {
      await conn.end();
    }
  }
}
