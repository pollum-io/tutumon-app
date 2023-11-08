export function isNotNullable<T>(
  value: T | undefined | null,
): value is NonNullable<T> {
  return value != null
}
