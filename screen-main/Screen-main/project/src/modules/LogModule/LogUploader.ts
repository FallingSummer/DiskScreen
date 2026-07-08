export class LogUploader {
  async upload(payload: unknown): Promise<void> {
    if (typeof window === 'undefined') {
      return;
    }

    await Promise.resolve(payload);
  }
}
