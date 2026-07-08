import { createConnection } from '@/config/DatabaseConfig';
import { MockDataService } from './MockDataService';
import { AppConfig } from '@/config/AppConfig';
import type { NetworkTrafficHourly } from '@/types/ApiTypes';

export class NetworkService {
  async queryNetworkData(
    hostId?: string,
    startHour?: string,
    endHour?: string,
  ): Promise<NetworkTrafficHourly[]> {
    if (AppConfig.MockMode) {
      return MockDataService.getNetworkData(hostId, startHour, endHour);
    }

    const conn = await createConnection();
    try {
      let sql = 'SELECT * FROM `NetworkTrafficHourly` WHERE 1=1';
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
      return rows as NetworkTrafficHourly[];
    } finally {
      await conn.end();
    }
  }
}
