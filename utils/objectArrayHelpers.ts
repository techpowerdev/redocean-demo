export const isEmptyObject = (obj: Record<string, string>): boolean => {
  return Object.keys(obj).length === 0;
};
