import { createConnection } from '@/config/DatabaseConfig';
import { MockDataService } from './MockDataService';
import { AppConfig } from '@/config/AppConfig';
import type { ServerStatusSnapshot } from '@/types/ApiTypes';

export class StatusService {
  async queryStatusSnapshot(alertLevel?: string): Promise<ServerStatusSnapshot[]> {
    if (AppConfig.MockMode) {
      const data = MockDataService.getStatusSnapshot();
      if (alertLevel) {
        return data.filter((d) => d.AlertLevel === alertLevel);
      }
      return data;
    }

    const conn = await createConnection();
    try {
      let sql = 'SELECT * FROM `ServerStatusSnapshot` WHERE 1=1';
      const params: (string | number)[] = [];

      if (alertLevel) {
        sql += ' AND `AlertLevel` = ?';
        params.push(alertLevel);
      }

      sql += ' ORDER BY `AlertLevel` DESC, `HostId` ASC';

      const [rows] = await conn.execute(sql, params);
      return rows as ServerStatusSnapshot[];
    } finally {
      await conn.end();
    }
  }
}
