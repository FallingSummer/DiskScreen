import { describe, expect, it } from 'vitest';
import { DataService } from '@/services/DataService';

describe('DataService', () => {
  it('returns overview data', async () => {
    const service = new DataService();
    const data = await service.getOverviewData();
    expect(data).toHaveProperty('title');
  });
});
