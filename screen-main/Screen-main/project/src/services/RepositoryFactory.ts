import { ApiRepository } from './ApiRepository';
import { MockRepository } from './MockRepository';
import type { BaseRepository } from './BaseRepository';
import type { OverviewData } from '@/types/DataTypes';

export class RepositoryFactory {
  static createRepository(): BaseRepository<OverviewData> {
    const dataSource = import.meta.env.VITE_DATA_SOURCE ?? 'mock';

    return dataSource === 'api' ? new ApiRepository() : new MockRepository();
  }
}
