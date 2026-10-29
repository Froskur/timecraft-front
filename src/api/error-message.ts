/** Extract a human-readable message from API / Zod / unknown errors. */
export function getErrorMessage(error: unknown, fallback = 'Ошибка запроса'): string {
  if (!error) return fallback;
  if (typeof error === 'string') return error;
  if (error instanceof Error && error.message) return error.message;
  if (typeof error === 'object' && error !== null && 'message' in error) {
    const message = (error as { message?: unknown }).message;
    if (typeof message === 'string' && message) return message;
  }
  return fallback;
}
