export const isObject = (val: unknown): val is Record<string, any> => {
  return val !== null && typeof val === 'object';
};
