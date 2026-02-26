const toPositiveInt = (value: unknown, fallback: number): number => {
  if (typeof value !== "string") {
    return fallback;
  }
  const parsed = Number.parseInt(value, 10);
  return Number.isNaN(parsed) || parsed <= 0 ? fallback : parsed;
};

export const getPagination = (query: Record<string, unknown>) => {
  const pageNumber = toPositiveInt(query.page, 1);
  const pageSize = Math.min(toPositiveInt(query.size, 10), 50);
  const skip = (pageNumber - 1) * pageSize;

  return { pageNumber, pageSize, skip };
};
