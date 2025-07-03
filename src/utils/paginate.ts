export function getPagination(query: any, defaultLimit = 10, maxLimit = 100) {
  let limit = parseInt(query.limit as string) || defaultLimit;
  let offset = parseInt(query.offset as string) || 0;
  if (limit > maxLimit) limit = maxLimit;
  if (offset < 0) offset = 0;
  return { limit, offset };
}
