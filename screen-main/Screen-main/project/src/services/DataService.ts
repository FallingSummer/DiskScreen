import { RepositoryFactory } from './RepositoryFactory';
import type { OverviewData } from '@/types/DataTypes';

export class DataService {
  private readonly repository = RepositoryFactory.createRepository();

  async getOverviewData(): Promise<OverviewData> {
    return this.repository.getData();
  }
}
