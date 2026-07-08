export function mockRepository<T>(value: T): { getData: () => Promise<T> } {
  return {
    getData: async () => value,
  };
}
