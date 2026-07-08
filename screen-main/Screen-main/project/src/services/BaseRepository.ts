export interface BaseRepository<T> {
  getData(): Promise<T>;
}
