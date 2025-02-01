export const isUndefined = (val: unknown): val is undefined => val === undefined;
export const isArray = (val: unknown): val is Array<unknown> => Array.isArray(val);
export const isPrimitive = (val: unknown): boolean => {
  const type = val === null ? 'null' : typeof val;
  return ['string', 'number', 'boolean', 'null', 'undefined'].includes(type);
};