export async function retry<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  delayMs: number = 1000
): Promise<T> {
  let attempt = 0;
  while (true) {
    try {
      return await operation();
    } catch (error) {
      if (++attempt > maxRetries) {
        throw error;
      }
      await new Promise((res) => setTimeout(res, delayMs));
    }
  }
}
