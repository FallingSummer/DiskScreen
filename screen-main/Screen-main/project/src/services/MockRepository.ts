import type { BaseRepository } from './BaseRepository';
import { MockOverviewData } from '@/mock/MockData';
import type { OverviewData } from '@/types/DataTypes';

export class MockRepository implements BaseRepository<OverviewData> {
  async getData(): Promise<OverviewData> {
    return Promise.resolve(MockOverviewData);
  }
}
