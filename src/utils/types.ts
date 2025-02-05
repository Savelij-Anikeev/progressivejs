export const isUndefined = (val: unknown): val is undefined => val === undefined;
export const isArray = <T = unknown>(val: T | T[]): val is Array<T> =>
  hasProp(val, 'length') && Array.isArray(val);
export const isPrimitive = (val: unknown): boolean => {
  const type = val === null ? 'null' : typeof val;
  return ['string', 'number', 'boolean', 'null', 'undefined'].includes(type);
};
export const hasProp = (val: unknown, prop: string): boolean =>
  !!(val && typeof val === 'object' && prop in val);