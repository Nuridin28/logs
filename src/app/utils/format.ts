export function formatTimestamp(
  timestamp: string,
  options?: { includeYear?: boolean; fractionalSeconds?: boolean }
) {
  const date = new Date(timestamp);
  if (options?.fractionalSeconds) {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      fractionalSecondDigits: 3,
      hour12: false,
    });
  }
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    ...(options?.includeYear && { year: 'numeric' }),
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });
}
