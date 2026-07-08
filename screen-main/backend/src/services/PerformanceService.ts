import { createConnection } from '@/config/DatabaseConfig';
import { MockDataService } from './MockDataService';
import { AppConfig } from '@/config/AppConfig';
import type { ServerPerformanceHourly } from '@/types/ApiTypes';

export class PerformanceService {
  async queryPerformanceData(
    hostId?: string,
    startHour?: string,
    endHour?: string,
  ): Promise<ServerPerformanceHourly[]> {
    if (AppConfig.MockMode) {
      return MockDataService.getPerformanceData(hostId, startHour, endHour);
    }

    const conn = await createConnection();
    try {
      let sql = 'SELECT * FROM `ServerPerformanceHourly` WHERE 1=1';
      const params: (string | number)[] = [];

      if (hostId) {
        sql += ' AND `HostId` = ?';
        params.push(hostId);
      }
      if (startHour) {
        sql += ' AND `StatHour` >= ?';
        params.push(startHour);
      }
      if (endHour) {
        sql += ' AND `StatHour` <= ?';
        params.push(endHour);
      }

      sql += ' ORDER BY `StatHour` ASC, `HostId` ASC';

      const [rows] = await conn.execute(sql, params);
      return rows as ServerPerformanceHourly[];
    } finally {
      await conn.end();
    }
  }
}
